/**
 * Streaming Sidekick — yields structured events as they arrive so the UI
 * can render tokens live. Supports three scopes:
 *   - map        → reasons over a single dependency map (Phase 5 default)
 *   - node       → focused on one node, with its neighborhood pre-loaded
 *   - workspace  → reasons across every map the user can access
 *
 * Wire format (events emitted to the caller):
 *   { type: "start" }
 *   { type: "text_delta", text }
 *   { type: "tool_use_start", id, name }
 *   { type: "tool_use_input", id, input }
 *   { type: "tool_use_result", id, output, isError }
 *   { type: "iteration_end", iter }
 *   { type: "done", stopReason, usage, assistantContent }
 *   { type: "error", message }
 *
 * The caller (the SSE route) serializes each event as `data: <json>\n\n`.
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
  MessageParam,
  ContentBlockParam,
  TextBlockParam,
  ToolResultBlockParam,
  Message,
  ImageBlockParam,
  Base64ImageSource,
  Tool,
} from "@anthropic-ai/sdk/resources/messages";
import { SIDEKICK_TOOLS, runTool, loadGraph } from "./tools";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";

const MODEL = "claude-opus-4-7";
const MAX_TOKENS = 16000;
const MAX_TOOL_ITERATIONS = 8;

let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic();
  return _client;
}

export type SidekickEvent =
  | { type: "start" }
  | { type: "text_delta"; text: string }
  | { type: "tool_use_start"; id: string; name: string }
  | { type: "tool_use_input"; id: string; input: unknown }
  | { type: "tool_use_result"; id: string; output: unknown; isError: boolean }
  | { type: "iteration_end"; iter: number }
  | {
      type: "done";
      stopReason: string | null;
      usage: {
        input_tokens: number;
        output_tokens: number;
        cache_creation_input_tokens: number;
        cache_read_input_tokens: number;
      };
      assistantContent: ContentBlockParam[];
    }
  | { type: "error"; message: string };

export interface SidekickAttachment {
  kind: "image" | "pdf";
  data: string;
  mediaType: string;
  filename?: string;
}

export type SidekickScope =
  | { kind: "map"; mapId: string }
  | { kind: "node"; mapId: string; nodeId: string }
  | { kind: "workspace"; workspaceId: string };

export interface SidekickStreamInput {
  scope: SidekickScope;
  userId: string;
  workspaceId: string | null;
  history: MessageParam[];
  userMessage: string;
  attachments?: SidekickAttachment[];
  signal?: AbortSignal;
}

/* ──────────────────────────────────────────────────────────
   System prompt construction (per scope)
   ────────────────────────────────────────────────────────── */

const PERSONA_BASE =
  `You are SwayMaps Sidekick — an AI assistant that reasons over structured dependency maps.

Operating principles:
- Be concise. Lead with the answer, then back it up.
- Use tools to look things up. Do not guess node names or ids — use search_nodes (or search_nodes_across_workspace for cross-map) to resolve names.
- When the user asks for a change to a map (add/update/remove a node or edge), use propose_change. NEVER claim you've changed a map — propose_change returns a previewable patch the user accepts in the UI. In WORKSPACE scope you MUST include map_id on the propose_change input (use search_workspace_maps first to identify the right map). In MAP/NODE scope you may omit it.
- For runbooks or documentation, use generate_runbook. For everything else, answer in plain prose.
- If the user attaches an image or PDF (e.g. an architecture diagram, screenshot, or document), study it carefully and use it as context. Common follow-ups: extract the systems shown and propose them as new nodes via propose_change, or compare what's in the diagram against the existing graph.
- Permission tools enforce access in the implementation — they only return content the user can read. Never invent results.
- If the question is ambiguous or you can't find what was asked, say so. Don't fabricate.`;

async function buildSystem(scope: SidekickScope, userId: string): Promise<TextBlockParam[]> {
  if (scope.kind === "map") {
    const persona: TextBlockParam = {
      type: "text",
      text: `${PERSONA_BASE}

Your scope: a SINGLE dependency map. The map is rendered below — refer to it as "this map" when answering. Use search_workspace_maps / search_nodes_across_workspace if the user asks about other maps.`,
    };
    const { map, nodes, edges } = await loadGraph(scope.mapId);
    const graphBlock: TextBlockParam = {
      type: "text",
      text: renderGraph(map.id, map.name, nodes, edges),
      cache_control: { type: "ephemeral" },
    };
    return [persona, graphBlock];
  }

  if (scope.kind === "node") {
    const { map, nodes, edges } = await loadGraph(scope.mapId);
    const focusNode = nodes.find((n) => n.id === scope.nodeId);
    if (!focusNode) {
      // Fall back to map-scope rendering if the node was deleted between launch and send
      return buildSystem({ kind: "map", mapId: scope.mapId }, userId);
    }

    // Pre-compute the node's immediate neighborhood (1-hop) so the agent has
    // the data the user almost certainly wants, no tool call required.
    const upstream = edges
      .filter((e) => e.targetNodeId === focusNode.id)
      .map((e) => ({ edge: e, node: nodes.find((n) => n.id === e.sourceNodeId) }))
      .filter((x) => x.node);
    const downstream = edges
      .filter((e) => e.sourceNodeId === focusNode.id)
      .map((e) => ({ edge: e, node: nodes.find((n) => n.id === e.targetNodeId) }))
      .filter((x) => x.node);

    const neighborhood: string[] = [
      `# Focused node: "${focusNode.title}"`,
      `Node id: ${focusNode.id}`,
      `Kind: ${focusNode.kindLabel || focusNode.kind}`,
      ...(focusNode.owner ? [`Owner: ${focusNode.owner}`] : []),
      ...(focusNode.status ? [`Status: ${focusNode.status}`] : []),
      ...(focusNode.description ? [`Description: ${focusNode.description}`] : []),
      "",
      `On map: "${map.name}" (id: ${map.id})`,
      "",
      `## Direct upstream (${upstream.length})`,
      ...upstream.map(
        ({ edge, node }) =>
          `- ${node!.id} | ${node!.title}${edge.label ? ` (${edge.label})` : ""}`
      ),
      "",
      `## Direct downstream (${downstream.length})`,
      ...downstream.map(
        ({ edge, node }) =>
          `- ${node!.id} | ${node!.title}${edge.label ? ` (${edge.label})` : ""}`
      ),
      "",
      `## Full map context`,
    ];
    const fullGraph = renderGraph(map.id, map.name, nodes, edges);

    const persona: TextBlockParam = {
      type: "text",
      text: `${PERSONA_BASE}

Your scope: focused on a SINGLE NODE — the one rendered first below. Default to answering questions about THIS node specifically (its dependencies, owner, status, blast radius, runbooks). The full map context is provided after the focused node so you can reason about the surrounding graph when needed.`,
    };
    const graphBlock: TextBlockParam = {
      type: "text",
      text: neighborhood.join("\n") + "\n\n" + fullGraph,
      cache_control: { type: "ephemeral" },
    };
    return [persona, graphBlock];
  }

  // scope.kind === "workspace"
  const persona: TextBlockParam = {
    type: "text",
    text: `${PERSONA_BASE}

Your scope: an ENTIRE WORKSPACE — many maps, all of which you can search via tools. There is no single "current map". Use search_workspace_maps to find maps by name and search_nodes_across_workspace to find nodes anywhere. When the user wants to drill into a single map, use those tools to surface the right one and then answer.`,
  };
  const summary = await buildWorkspaceSummary(scope.workspaceId, userId);
  const summaryBlock: TextBlockParam = {
    type: "text",
    text: summary,
    cache_control: { type: "ephemeral" },
  };
  return [persona, summaryBlock];
}

async function buildWorkspaceSummary(workspaceId: string, _userId: string): Promise<string> {
  const ws = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      name: true,
      _count: { select: { maps: true, members: true } },
      maps: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          mapType: true,
          description: true,
          updatedAt: true,
          _count: { select: { nodes: true, edges: true } },
        },
        take: 100,
      },
      folders: {
        select: { id: true, name: true, parentId: true },
      },
    },
  });
  if (!ws) return `# Workspace not found.`;

  const lines: string[] = [
    `# Workspace: "${ws.name}"`,
    `Maps: ${ws._count.maps} · Members: ${ws._count.members}`,
    ``,
    `## Maps (most recently updated, up to 100)`,
  ];
  for (const m of ws.maps) {
    lines.push(
      `- ${m.id} | ${m.mapType} | ${m.name} (${m._count.nodes} nodes, ${m._count.edges} edges)${m.description ? ` — ${m.description.slice(0, 120)}` : ""}`
    );
  }
  if (ws.folders.length > 0) {
    lines.push("", `## Folders`);
    for (const f of ws.folders) lines.push(`- ${f.id} | ${f.name}`);
  }
  return lines.join("\n");
}

function renderGraph(
  mapId: string,
  mapName: string,
  nodes: Awaited<ReturnType<typeof loadGraph>>["nodes"],
  edges: Awaited<ReturnType<typeof loadGraph>>["edges"]
): string {
  const lines: string[] = [
    `## Map: "${mapName}"`,
    `Map id: ${mapId}`,
    `Nodes: ${nodes.length} · Edges: ${edges.length}`,
    "",
    "### Nodes",
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
  lines.push("", "### Edges");
  for (const e of edges) {
    lines.push(
      `- ${e.id} | ${e.sourceNodeId} → ${e.targetNodeId}${e.label ? ` (${e.label})` : ""}${e.edgeType ? ` [${e.edgeType}]` : ""}`
    );
  }
  return lines.join("\n");
}

function buildUserContent(
  text: string,
  attachments: SidekickAttachment[] | undefined,
  scope: SidekickScope
): string | ContentBlockParam[] {
  const blocks: ContentBlockParam[] = [];
  for (const att of attachments ?? []) {
    if (att.kind === "image") {
      const block: ImageBlockParam = {
        type: "image",
        source: {
          type: "base64",
          media_type: att.mediaType as Base64ImageSource["media_type"],
          data: att.data,
        },
      };
      blocks.push(block);
    } else if (att.kind === "pdf") {
      blocks.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: att.data,
        },
      } as ContentBlockParam);
    }
  }
  // For node scope, prepend a small reminder so the agent stays focused
  if (scope.kind === "node" && (!attachments || attachments.length === 0)) {
    blocks.push({
      type: "text",
      text: `(focused on node ${scope.nodeId})\n\n${text}`,
    });
    return blocks;
  }
  blocks.push({ type: "text", text });
  return attachments && attachments.length > 0 ? blocks : text;
}

/**
 * Pick a "primary mapId" for tools that still want a single-map context.
 * Workspace scope has no primary map — the cross-workspace tools handle that case.
 */
function primaryMapId(scope: SidekickScope): string | null {
  if (scope.kind === "map") return scope.mapId;
  if (scope.kind === "node") return scope.mapId;
  return null;
}

/* ──────────────────────────────────────────────────────────
   MCP servers — pulled live so admin changes take effect on next turn
   ────────────────────────────────────────────────────────── */

interface McpServerConfig {
  type: "url";
  name: string;
  url: string;
  authorization_token?: string;
}

async function loadMcpServers(workspaceId: string | null): Promise<McpServerConfig[]> {
  if (!workspaceId) return [];
  const rows = await prisma.mcpServer.findMany({
    where: { workspaceId, enabled: true },
  });
  const out: McpServerConfig[] = [];
  for (const r of rows) {
    let token: string | null = null;
    if (r.authToken) {
      try {
        token = decrypt(r.authToken);
      } catch (e) {
        // If decryption fails (key rotated, corrupt envelope), skip the server
        // rather than calling MCP with a bad token. Surface a console warning
        // for the operator; UI surfaces the missing-tools effect.
        console.error(
          `[sidekick] MCP server ${r.id} (${r.name}): failed to decrypt authToken (${(e as any)?.message ?? "unknown"}). Skipping.`
        );
        continue;
      }
    }
    out.push({
      type: "url",
      name: r.name,
      url: r.url,
      ...(token ? { authorization_token: token } : {}),
    });
  }
  return out;
}

/* ──────────────────────────────────────────────────────────
   Stream
   ────────────────────────────────────────────────────────── */

export async function* streamSidekick(
  input: SidekickStreamInput
): AsyncGenerator<SidekickEvent, void, unknown> {
  let client: Anthropic;
  try {
    client = getClient();
  } catch (e: any) {
    yield { type: "error", message: e?.message ?? "Anthropic client init failed" };
    return;
  }

  let system: TextBlockParam[];
  try {
    system = await buildSystem(input.scope, input.userId);
  } catch (e: any) {
    yield { type: "error", message: e?.message ?? "Could not build system context" };
    return;
  }

  const mcpServers = await loadMcpServers(input.workspaceId).catch(() => []);

  const messages: MessageParam[] = [
    ...input.history,
    {
      role: "user",
      content: buildUserContent(input.userMessage, input.attachments, input.scope),
    },
  ];

  const usage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  };
  const assistantBlocks: ContentBlockParam[] = [];
  let stopReason: string | null = null;

  yield { type: "start" };

  const tools: Tool[] = SIDEKICK_TOOLS;
  const mapIdForTools = primaryMapId(input.scope);

  for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
    if (input.signal?.aborted) {
      yield { type: "error", message: "aborted" };
      return;
    }

    let finalMessage: Message;
    try {
      const requestPayload: any = {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        thinking: { type: "adaptive" },
        output_config: { effort: "high" },
        system,
        tools,
        messages,
      };
      if (mcpServers.length > 0) {
        requestPayload.mcp_servers = mcpServers;
      }
      const stream = client.messages.stream(requestPayload, {
        ...(mcpServers.length > 0
          ? { headers: { "anthropic-beta": "mcp-client-2025-04-04" } }
          : {}),
      });

      for await (const ev of stream) {
        if (input.signal?.aborted) {
          stream.controller.abort();
          yield { type: "error", message: "aborted" };
          return;
        }
        if (ev.type === "content_block_start") {
          const block = ev.content_block as any;
          if (block.type === "tool_use" || block.type === "mcp_tool_use") {
            yield { type: "tool_use_start", id: block.id, name: block.name };
          }
        } else if (ev.type === "content_block_delta") {
          if (ev.delta.type === "text_delta") {
            yield { type: "text_delta", text: ev.delta.text };
          }
        }
      }

      finalMessage = await stream.finalMessage();
    } catch (e: any) {
      yield { type: "error", message: e?.message ?? "Streaming failed" };
      return;
    }

    usage.input_tokens += finalMessage.usage.input_tokens ?? 0;
    usage.output_tokens += finalMessage.usage.output_tokens ?? 0;
    usage.cache_creation_input_tokens += finalMessage.usage.cache_creation_input_tokens ?? 0;
    usage.cache_read_input_tokens += finalMessage.usage.cache_read_input_tokens ?? 0;
    stopReason = finalMessage.stop_reason ?? null;

    for (const block of finalMessage.content) {
      assistantBlocks.push(block as ContentBlockParam);
      if (block.type === "tool_use" || (block as any).type === "mcp_tool_use") {
        yield { type: "tool_use_input", id: (block as any).id, input: (block as any).input };
      }
      // MCP tool results come back from Anthropic already in the response;
      // we stream them as tool_use_result for UI consistency.
      if ((block as any).type === "mcp_tool_result") {
        yield {
          type: "tool_use_result",
          id: (block as any).tool_use_id,
          output: (block as any).content,
          isError: !!(block as any).is_error,
        };
      }
    }

    if (finalMessage.stop_reason !== "tool_use") {
      messages.push({ role: "assistant", content: finalMessage.content });
      yield { type: "iteration_end", iter };
      break;
    }

    messages.push({ role: "assistant", content: finalMessage.content });
    const toolUses = finalMessage.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );
    const toolResults: ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      let output: unknown;
      let isError = false;
      try {
        output = await runTool(tu.name, tu.input, {
          mapId: mapIdForTools ?? "",
          userId: input.userId,
          workspaceId: input.workspaceId,
        } as any);
      } catch (e: any) {
        isError = true;
        output = { error: e?.message ?? "Tool execution failed" };
      }
      yield { type: "tool_use_result", id: tu.id, output, isError };
      toolResults.push({
        type: "tool_result",
        tool_use_id: tu.id,
        content: JSON.stringify(output),
        is_error: isError,
      });
    }
    messages.push({ role: "user", content: toolResults });
    yield { type: "iteration_end", iter };
  }

  yield {
    type: "done",
    stopReason,
    usage,
    assistantContent: assistantBlocks,
  };
}
