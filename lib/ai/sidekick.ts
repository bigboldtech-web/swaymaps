/**
 * Sidekick agent loop — runs Claude with structured tools against a map.
 *
 * The graph is rendered into the system prompt with `cache_control: ephemeral`
 * so multi-turn conversations re-use the cached prefix (the graph doesn't
 * change between turns unless the user accepts a propose_change patch).
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  ContentBlockParam,
  TextBlockParam,
  ToolUseBlockParam,
  ToolResultBlockParam,
  Message,
} from "@anthropic-ai/sdk/resources/messages";
import { SIDEKICK_TOOLS, runTool, loadGraph } from "./tools";

const MODEL = "claude-opus-4-7";
const MAX_TOKENS = 16000;
const MAX_TOOL_ITERATIONS = 8;

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic();
  return _client;
}

export interface SidekickRunInput {
  mapId: string;
  userId: string;
  /** Prior conversation messages (already in Anthropic format). */
  history: MessageParam[];
  /** New user message text. */
  userMessage: string;
}

export interface SidekickRunResult {
  /** All assistant content blocks produced this turn (text + tool_use). */
  assistantContent: ContentBlockParam[];
  /** Tool inputs and outputs that ran during this turn, in order. */
  toolTrace: Array<{
    name: string;
    input: unknown;
    output: unknown;
    toolUseId: string;
  }>;
  /** Aggregate token usage across the agent loop. */
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
  };
  /** stop_reason from the final API response. */
  stopReason: string | null;
}

/**
 * Build the system prompt: persona + map context + the rendered graph.
 * Cache breakpoint sits on the graph block so follow-ups read from cache.
 */
async function buildSystem(mapId: string): Promise<TextBlockParam[]> {
  const { map, nodes, edges } = await loadGraph(mapId);

  const personaBlock: TextBlockParam = {
    type: "text",
    text: `You are SwayMaps Sidekick — an AI assistant that reasons over a structured dependency map.

Your job is to answer questions about this map, find dependencies, surface risks, and propose changes when the user asks.

Operating principles:
- Be concise. Lead with the answer, then back it up.
- Use tools to look things up. Do not guess node names or ids — use search_nodes when the user references a node by name.
- When the user asks for a change to the map (add/update/remove a node or edge), use propose_change. NEVER claim you've changed the map — propose_change returns a previewable patch the user accepts in the UI.
- For runbooks or documentation, use generate_runbook. For everything else, answer in plain prose.
- If the question is ambiguous or you can't find what was asked, say so. Don't fabricate.`,
  };

  const graphBlock: TextBlockParam = {
    type: "text",
    text: renderGraph(map.id, map.name, nodes, edges),
    cache_control: { type: "ephemeral" },
  };

  return [personaBlock, graphBlock];
}

function renderGraph(
  mapId: string,
  mapName: string,
  nodes: Awaited<ReturnType<typeof loadGraph>>["nodes"],
  edges: Awaited<ReturnType<typeof loadGraph>>["edges"]
): string {
  const lines: string[] = [
    `# Current map: "${mapName}"`,
    `Map id: ${mapId}`,
    `Nodes: ${nodes.length} · Edges: ${edges.length}`,
    "",
    "## Nodes",
  ];
  for (const n of nodes) {
    const meta: string[] = [];
    if (n.owner) meta.push(`owner=${n.owner}`);
    if (n.status) meta.push(`status=${n.status}`);
    if (n.tags) meta.push(`tags=${n.tags}`);
    lines.push(
      `- ${n.id} | ${n.kindLabel || n.kind} | ${n.title}${meta.length ? ` [${meta.join(", ")}]` : ""}${n.description ? ` — ${n.description.slice(0, 200)}` : ""}`
    );
  }
  lines.push("", "## Edges");
  for (const e of edges) {
    lines.push(
      `- ${e.id} | ${e.sourceNodeId} → ${e.targetNodeId}${e.label ? ` (${e.label})` : ""}${e.edgeType ? ` [${e.edgeType}]` : ""}`
    );
  }
  return lines.join("\n");
}

/**
 * Run the agent loop for one user turn. Returns everything produced
 * (assistant content + tool trace + usage) so the caller can persist
 * and stream to the UI.
 */
export async function runSidekick(
  input: SidekickRunInput
): Promise<SidekickRunResult> {
  const client = getClient();
  const system = await buildSystem(input.mapId);

  const messages: MessageParam[] = [
    ...input.history,
    { role: "user", content: input.userMessage },
  ];

  const trace: SidekickRunResult["toolTrace"] = [];
  const usage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  };
  const assistantBlocks: ContentBlockParam[] = [];
  let stopReason: string | null = null;

  for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
    const response: Message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      system,
      tools: SIDEKICK_TOOLS,
      messages,
    });

    usage.input_tokens += response.usage.input_tokens ?? 0;
    usage.output_tokens += response.usage.output_tokens ?? 0;
    usage.cache_creation_input_tokens += response.usage.cache_creation_input_tokens ?? 0;
    usage.cache_read_input_tokens += response.usage.cache_read_input_tokens ?? 0;
    stopReason = response.stop_reason ?? null;

    // Capture all assistant blocks so the UI can render text + tool use.
    for (const block of response.content) {
      assistantBlocks.push(block as ContentBlockParam);
    }

    if (response.stop_reason !== "tool_use") {
      // No tools requested — agent is done with this turn.
      messages.push({ role: "assistant", content: response.content });
      break;
    }

    // Append the assistant turn (with tool_use blocks) so the next
    // request includes the matching context.
    messages.push({ role: "assistant", content: response.content });

    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    const toolResults: ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      let output: unknown;
      let isError = false;
      try {
        output = await runTool(tu.name, tu.input, {
          mapId: input.mapId,
          userId: input.userId,
        });
      } catch (e: any) {
        isError = true;
        output = { error: e?.message ?? "Tool execution failed" };
      }
      trace.push({
        name: tu.name,
        input: tu.input,
        output,
        toolUseId: tu.id,
      });
      toolResults.push({
        type: "tool_result",
        tool_use_id: tu.id,
        content: JSON.stringify(output),
        is_error: isError,
      });
    }

    messages.push({ role: "user", content: toolResults });
  }

  return {
    assistantContent: assistantBlocks,
    toolTrace: trace,
    usage,
    stopReason,
  };
}

/**
 * Apply a previously-proposed change to the map. Mirrors the schema in
 * tools.ts → propose_change. Returns a summary of what was applied so the
 * UI can show "added 2 nodes, 1 edge".
 */
export async function applyProposal(
  mapId: string,
  proposal: { operations: any[] }
): Promise<{ added_nodes: number; updated_nodes: number; removed_nodes: number; added_edges: number; removed_edges: number }> {
  const { prisma } = await import("@/lib/prisma");
  const tempIdToReal = new Map<string, string>();
  let added_nodes = 0;
  let updated_nodes = 0;
  let removed_nodes = 0;
  let added_edges = 0;
  let removed_edges = 0;

  // Apply in order so edges referencing tempIds resolve correctly.
  for (const op of proposal.operations) {
    switch (op.op) {
      case "add_node": {
        const created = await prisma.mapNode.create({
          data: {
            mapId,
            kind: op.kind,
            kindLabel: op.kind,
            title: op.title,
            tags: "",
            color: "#3b82f6",
            posX: typeof op.posX === "number" ? op.posX : 200 + Math.random() * 400,
            posY: typeof op.posY === "number" ? op.posY : 200 + Math.random() * 400,
            description: op.description ?? null,
            status: op.status ?? null,
            owner: op.owner ?? null,
          },
        });
        if (op.tempId) tempIdToReal.set(op.tempId, created.id);
        added_nodes++;
        break;
      }
      case "update_node": {
        const data: any = {};
        if (op.title !== undefined) data.title = op.title;
        if (op.description !== undefined) data.description = op.description;
        if (op.status !== undefined) data.status = op.status;
        if (op.owner !== undefined) data.owner = op.owner;
        await prisma.mapNode.update({ where: { id: op.node_id }, data });
        updated_nodes++;
        break;
      }
      case "remove_node": {
        await prisma.mapEdge.deleteMany({
          where: {
            mapId,
            OR: [{ sourceNodeId: op.node_id }, { targetNodeId: op.node_id }],
          },
        });
        await prisma.mapNode.delete({ where: { id: op.node_id } });
        removed_nodes++;
        break;
      }
      case "add_edge": {
        const source = tempIdToReal.get(op.source) ?? op.source;
        const target = tempIdToReal.get(op.target) ?? op.target;
        await prisma.mapEdge.create({
          data: {
            mapId,
            sourceNodeId: source,
            targetNodeId: target,
            label: op.label ?? null,
            edgeType: op.edgeType ?? null,
          },
        });
        added_edges++;
        break;
      }
      case "remove_edge": {
        await prisma.mapEdge.delete({ where: { id: op.edge_id } });
        removed_edges++;
        break;
      }
    }
  }

  return { added_nodes, updated_nodes, removed_nodes, added_edges, removed_edges };
}
