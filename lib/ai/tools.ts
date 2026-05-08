/**
 * Sidekick tools — what Claude can do against a dependency map.
 *
 * Each tool has a JSON Schema (sent to Claude) and a server-side
 * implementation (`runTool`). All read tools are pure; the only
 * mutating action — `propose_change` — does NOT execute. It returns
 * a previewable patch the user accepts via /api/ai/sidekick/apply.
 */

import { prisma } from "@/lib/prisma";
import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import { resolveMapPermission } from "@/lib/folderPermissions";

export const SIDEKICK_TOOLS: Tool[] = [
  {
    name: "find_dependencies",
    description:
      "Walk the dependency graph from a node and return upstream and/or downstream nodes. Use this when the user asks 'what depends on X?', 'what does X depend on?', or 'what's the blast radius of changing X?'.",
    input_schema: {
      type: "object",
      properties: {
        node_id: {
          type: "string",
          description: "The id of the node to walk from. Get this from read_graph first if you don't know it.",
        },
        direction: {
          type: "string",
          enum: ["upstream", "downstream", "both"],
          description: "upstream = nodes this node depends on. downstream = nodes that depend on this node. both = both directions.",
        },
        max_depth: {
          type: "integer",
          description: "Maximum hops to walk. Default 5. Use 1 for immediate neighbors only.",
          minimum: 1,
          maximum: 20,
        },
      },
      required: ["node_id", "direction"],
    },
  },
  {
    name: "find_path",
    description:
      "Find the shortest dependency path between two nodes. Returns the sequence of nodes and edges connecting them, or null if no path exists.",
    input_schema: {
      type: "object",
      properties: {
        from_node_id: { type: "string", description: "Starting node id." },
        to_node_id: { type: "string", description: "Destination node id." },
        directed: {
          type: "boolean",
          description: "If true, follow edge direction. If false, treat edges as bidirectional. Default true.",
        },
      },
      required: ["from_node_id", "to_node_id"],
    },
  },
  {
    name: "find_orphans",
    description:
      "Find nodes that are isolated, have no owner, or are otherwise loose. Useful for hygiene questions like 'which services have no owner?' or 'show me untouched nodes'.",
    input_schema: {
      type: "object",
      properties: {
        criterion: {
          type: "string",
          enum: ["no_owner", "no_edges", "no_status", "no_description"],
          description: "Which kind of orphan to find.",
        },
      },
      required: ["criterion"],
    },
  },
  {
    name: "find_critical_nodes",
    description:
      "Surface the most-connected nodes in the graph by total degree. Useful for 'what are the most-depended-on services?' or 'where is the riskiest blast radius?'.",
    input_schema: {
      type: "object",
      properties: {
        limit: {
          type: "integer",
          description: "How many top nodes to return. Default 10, max 50.",
          minimum: 1,
          maximum: 50,
        },
        kind: {
          type: "string",
          description: "Optional filter: only consider nodes of this kind (e.g. 'system', 'api', 'database').",
        },
      },
    },
  },
  {
    name: "search_nodes",
    description:
      "Find nodes by free-text match on title, kind, owner, status, tags, or description. Use this to look up node ids when the user references nodes by name.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search query." },
        limit: {
          type: "integer",
          description: "Max results. Default 10.",
          minimum: 1,
          maximum: 50,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "generate_runbook",
    description:
      "Generate a markdown runbook for one or more nodes. Returns a structured document the user can copy or save as a Note. Do NOT use this for general explanations — only when the user explicitly asks for a runbook, doc, or write-up.",
    input_schema: {
      type: "object",
      properties: {
        node_ids: {
          type: "array",
          items: { type: "string" },
          description: "Node ids to document. Usually one — but if the user asks for a runbook covering multiple, include them all.",
          minItems: 1,
        },
        include: {
          type: "array",
          description: "Sections to include. Pick what's relevant.",
          items: {
            type: "string",
            enum: ["overview", "dependencies", "owners", "incident_response", "links", "metadata"],
          },
        },
      },
      required: ["node_ids"],
    },
  },
  {
    name: "search_workspace_maps",
    description:
      "Search for OTHER maps in the same workspace by name or description. Use this when the user asks 'find maps about X' or 'is there a map for Y?'. Only returns maps the user can access. Returns up to 25 results.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search query." },
        limit: {
          type: "integer",
          description: "Max results. Default 10, max 25.",
          minimum: 1,
          maximum: 25,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_nodes_across_workspace",
    description:
      "Search for nodes ACROSS ALL maps in the workspace by free-text match on title, kind, owner, status, tags, or description. Use this for cross-map questions like 'find auth-related nodes everywhere' or 'which maps mention Stripe?'. Only returns nodes from maps the user can access.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search query." },
        limit: {
          type: "integer",
          description: "Max results. Default 20, max 50.",
          minimum: 1,
          maximum: 50,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "propose_change",
    description:
      "Propose a previewable patch to the map. Use this when the user asks you to add, modify, or remove nodes/edges. The patch is returned as a tool result — it is NOT applied automatically. The user reviews it and accepts/rejects in the UI.",
    input_schema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "One-line human-readable summary of the change. Shown to the user.",
        },
        rationale: {
          type: "string",
          description: "Why you're proposing this change, given the user's request. 1-3 sentences.",
        },
        operations: {
          type: "array",
          description: "Ordered list of operations. Operations apply atomically — either all succeed or none.",
          items: {
            type: "object",
            oneOf: [
              {
                properties: {
                  op: { const: "add_node" },
                  kind: { type: "string", description: "person | system | service | api | database | queue | cache | process | external | generic" },
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string" },
                  owner: { type: "string" },
                  tempId: {
                    type: "string",
                    description: "A temporary id you assign — used to reference this new node in subsequent add_edge ops in the same patch.",
                  },
                  posX: { type: "number" },
                  posY: { type: "number" },
                },
                required: ["op", "kind", "title", "tempId"],
              },
              {
                properties: {
                  op: { const: "update_node" },
                  node_id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string" },
                  owner: { type: "string" },
                },
                required: ["op", "node_id"],
              },
              {
                properties: {
                  op: { const: "remove_node" },
                  node_id: { type: "string" },
                },
                required: ["op", "node_id"],
              },
              {
                properties: {
                  op: { const: "add_edge" },
                  source: { type: "string", description: "Node id or tempId from a prior add_node op." },
                  target: { type: "string", description: "Node id or tempId from a prior add_node op." },
                  label: { type: "string" },
                  edgeType: { type: "string" },
                },
                required: ["op", "source", "target"],
              },
              {
                properties: {
                  op: { const: "remove_edge" },
                  edge_id: { type: "string" },
                },
                required: ["op", "edge_id"],
              },
            ],
          },
        },
      },
      required: ["summary", "operations"],
    },
  },
];

/* ──────────────────────────────────────────────────────────
   Tool execution
   ────────────────────────────────────────────────────────── */

interface ToolContext {
  mapId: string;
  userId: string;
  workspaceId?: string | null;
}

interface NodeRow {
  id: string;
  kind: string;
  kindLabel: string;
  title: string;
  tags: string;
  color: string;
  posX: number;
  posY: number;
  status: string | null;
  priority: string | null;
  owner: string | null;
  description: string | null;
}

interface EdgeRow {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label: string | null;
  edgeType: string | null;
}

/**
 * Read the full graph from the database. Used to seed the agent
 * context AND as a fallback for any tool that needs the data.
 */
export async function loadGraph(mapId: string): Promise<{ nodes: NodeRow[]; edges: EdgeRow[]; map: { id: string; name: string } }> {
  const map = await prisma.decodeMap.findUnique({
    where: { id: mapId },
    select: {
      id: true,
      name: true,
      nodes: {
        select: {
          id: true,
          kind: true,
          kindLabel: true,
          title: true,
          tags: true,
          color: true,
          posX: true,
          posY: true,
          status: true,
          priority: true,
          owner: true,
          description: true,
        },
      },
      edges: {
        select: {
          id: true,
          sourceNodeId: true,
          targetNodeId: true,
          label: true,
          edgeType: true,
        },
      },
    },
  });
  if (!map) throw new Error("Map not found");
  return {
    map: { id: map.id, name: map.name },
    nodes: map.nodes,
    edges: map.edges,
  };
}

/**
 * Execute a single tool call. Throws on schema violations — Claude
 * will see the error in the tool_result and self-correct.
 */
export async function runTool(
  name: string,
  input: any,
  ctx: ToolContext
): Promise<unknown> {
  const { nodes, edges } = await loadGraph(ctx.mapId);
  const nodesById = new Map(nodes.map((n) => [n.id, n]));

  switch (name) {
    case "find_dependencies":
      return runFindDependencies(nodes, edges, input);
    case "find_path":
      return runFindPath(nodes, edges, input);
    case "find_orphans":
      return runFindOrphans(nodes, edges, input);
    case "find_critical_nodes":
      return runFindCriticalNodes(nodes, edges, input);
    case "search_nodes":
      return runSearchNodes(nodes, input);
    case "generate_runbook":
      return runGenerateRunbook(nodes, edges, nodesById, input);
    case "search_workspace_maps":
      return runSearchWorkspaceMaps(ctx, input);
    case "search_nodes_across_workspace":
      return runSearchNodesAcrossWorkspace(ctx, input);
    case "propose_change":
      // Validation only — don't apply. The patch is preserved verbatim
      // in the tool_result so the UI can render and apply it on accept.
      return validateProposal(nodesById, input);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function runSearchWorkspaceMaps(ctx: ToolContext, input: any) {
  if (!ctx.workspaceId) {
    return { count: 0, maps: [], note: "This map is not in a workspace; cross-map search is unavailable." };
  }
  const q = (input.query as string).trim();
  const limit = Math.min((input.limit as number | undefined) ?? 10, 25);

  const candidates = await prisma.decodeMap.findMany({
    where: {
      workspaceId: ctx.workspaceId,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      mapType: true,
      updatedAt: true,
      _count: { select: { nodes: true, edges: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: limit * 3,
  });

  const accessible: typeof candidates = [];
  for (const m of candidates) {
    if (accessible.length >= limit) break;
    if (m.id === ctx.mapId) continue;
    const perm = await resolveMapPermission(ctx.userId, m.id);
    if (perm) accessible.push(m);
  }

  return {
    count: accessible.length,
    maps: accessible.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description ?? null,
      mapType: m.mapType,
      nodeCount: m._count.nodes,
      edgeCount: m._count.edges,
      updatedAt: m.updatedAt,
    })),
  };
}

async function runSearchNodesAcrossWorkspace(ctx: ToolContext, input: any) {
  if (!ctx.workspaceId) {
    return { count: 0, results: [], note: "This map is not in a workspace; cross-map search is unavailable." };
  }
  const q = (input.query as string).trim();
  const limit = Math.min((input.limit as number | undefined) ?? 20, 50);

  const rows = await prisma.mapNode.findMany({
    where: {
      map: { workspaceId: ctx.workspaceId },
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { owner: { contains: q, mode: "insensitive" } },
        { status: { contains: q, mode: "insensitive" } },
        { tags: { contains: q, mode: "insensitive" } },
        { kindLabel: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      title: true,
      kind: true,
      kindLabel: true,
      owner: true,
      status: true,
      mapId: true,
      map: { select: { id: true, name: true } },
    },
    take: limit * 4,
    orderBy: { id: "desc" },
  });

  const allowed = new Map<string, boolean>();
  const results: any[] = [];
  for (const r of rows) {
    if (results.length >= limit) break;
    let canRead = allowed.get(r.mapId);
    if (canRead === undefined) {
      canRead = !!(await resolveMapPermission(ctx.userId, r.mapId));
      allowed.set(r.mapId, canRead);
    }
    if (!canRead) continue;
    results.push({
      node_id: r.id,
      title: r.title,
      kind: r.kindLabel || r.kind,
      owner: r.owner,
      status: r.status,
      map_id: r.map.id,
      map_name: r.map.name,
    });
  }

  return { count: results.length, results };
}

/* ───── Implementations ───── */

function runFindDependencies(nodes: NodeRow[], edges: EdgeRow[], input: any) {
  const start = input.node_id as string;
  const direction = (input.direction ?? "both") as "upstream" | "downstream" | "both";
  const maxDepth = (input.max_depth as number | undefined) ?? 5;

  const adjOut = new Map<string, string[]>();
  const adjIn = new Map<string, string[]>();
  for (const e of edges) {
    if (!adjOut.has(e.sourceNodeId)) adjOut.set(e.sourceNodeId, []);
    if (!adjIn.has(e.targetNodeId)) adjIn.set(e.targetNodeId, []);
    adjOut.get(e.sourceNodeId)!.push(e.targetNodeId);
    adjIn.get(e.targetNodeId)!.push(e.sourceNodeId);
  }

  const walk = (origin: string, adj: Map<string, string[]>) => {
    const visited = new Map<string, number>(); // id → depth
    const queue: Array<[string, number]> = [[origin, 0]];
    while (queue.length) {
      const [id, depth] = queue.shift()!;
      if (depth >= maxDepth) continue;
      for (const next of adj.get(id) ?? []) {
        if (visited.has(next) && visited.get(next)! <= depth + 1) continue;
        visited.set(next, depth + 1);
        queue.push([next, depth + 1]);
      }
    }
    return Array.from(visited.entries()).map(([id, depth]) => {
      const n = nodes.find((x) => x.id === id);
      return n ? { id: n.id, title: n.title, kind: n.kind, depth } : null;
    }).filter(Boolean);
  };

  const result: any = {};
  if (direction === "upstream" || direction === "both") {
    result.upstream = walk(start, adjIn);
  }
  if (direction === "downstream" || direction === "both") {
    result.downstream = walk(start, adjOut);
  }
  return result;
}

function runFindPath(nodes: NodeRow[], edges: EdgeRow[], input: any) {
  const from = input.from_node_id as string;
  const to = input.to_node_id as string;
  const directed = input.directed ?? true;

  const adj = new Map<string, Array<{ node: string; edgeId: string }>>();
  for (const e of edges) {
    if (!adj.has(e.sourceNodeId)) adj.set(e.sourceNodeId, []);
    adj.get(e.sourceNodeId)!.push({ node: e.targetNodeId, edgeId: e.id });
    if (!directed) {
      if (!adj.has(e.targetNodeId)) adj.set(e.targetNodeId, []);
      adj.get(e.targetNodeId)!.push({ node: e.sourceNodeId, edgeId: e.id });
    }
  }

  // BFS for shortest path
  const prev = new Map<string, { node: string; edgeId: string }>();
  const visited = new Set<string>([from]);
  const queue: string[] = [from];
  let found = false;
  while (queue.length) {
    const current = queue.shift()!;
    if (current === to) { found = true; break; }
    for (const next of adj.get(current) ?? []) {
      if (visited.has(next.node)) continue;
      visited.add(next.node);
      prev.set(next.node, { node: current, edgeId: next.edgeId });
      queue.push(next.node);
    }
  }
  if (!found) return { path: null, message: "No path found" };

  const path: Array<{ id: string; title: string; via_edge?: string }> = [];
  let cursor = to;
  while (cursor) {
    const n = nodes.find((x) => x.id === cursor);
    const back = prev.get(cursor);
    path.unshift({ id: cursor, title: n?.title ?? cursor, via_edge: back?.edgeId });
    if (!back) break;
    cursor = back.node;
  }
  return { path, length: path.length - 1 };
}

function runFindOrphans(nodes: NodeRow[], edges: EdgeRow[], input: any) {
  const criterion = input.criterion as string;
  const connected = new Set<string>();
  for (const e of edges) {
    connected.add(e.sourceNodeId);
    connected.add(e.targetNodeId);
  }
  let matches: NodeRow[] = [];
  switch (criterion) {
    case "no_owner":
      matches = nodes.filter((n) => !n.owner || n.owner.trim() === "");
      break;
    case "no_edges":
      matches = nodes.filter((n) => !connected.has(n.id));
      break;
    case "no_status":
      matches = nodes.filter((n) => !n.status || n.status.trim() === "");
      break;
    case "no_description":
      matches = nodes.filter((n) => !n.description || n.description.trim() === "");
      break;
  }
  return {
    criterion,
    count: matches.length,
    nodes: matches.slice(0, 50).map((n) => ({
      id: n.id,
      title: n.title,
      kind: n.kind,
      owner: n.owner,
      status: n.status,
    })),
  };
}

function runFindCriticalNodes(nodes: NodeRow[], edges: EdgeRow[], input: any) {
  const limit = Math.min((input.limit as number | undefined) ?? 10, 50);
  const kindFilter = input.kind as string | undefined;
  const degree = new Map<string, { in: number; out: number }>();
  for (const n of nodes) degree.set(n.id, { in: 0, out: 0 });
  for (const e of edges) {
    const s = degree.get(e.sourceNodeId);
    const t = degree.get(e.targetNodeId);
    if (s) s.out++;
    if (t) t.in++;
  }
  const ranked = nodes
    .filter((n) => !kindFilter || n.kind === kindFilter)
    .map((n) => {
      const d = degree.get(n.id) ?? { in: 0, out: 0 };
      return {
        id: n.id,
        title: n.title,
        kind: n.kind,
        owner: n.owner,
        in_degree: d.in,
        out_degree: d.out,
        total_degree: d.in + d.out,
      };
    })
    .sort((a, b) => b.total_degree - a.total_degree)
    .slice(0, limit);
  return { nodes: ranked };
}

function runSearchNodes(nodes: NodeRow[], input: any) {
  const q = (input.query as string).toLowerCase().trim();
  const limit = Math.min((input.limit as number | undefined) ?? 10, 50);
  const matches = nodes
    .map((n) => {
      const haystack = [
        n.title,
        n.kind,
        n.kindLabel,
        n.owner ?? "",
        n.status ?? "",
        n.description ?? "",
        n.tags ?? "",
      ]
        .join(" ")
        .toLowerCase();
      const score = haystack.includes(q) ? 1 : 0;
      return { node: n, score };
    })
    .filter((x) => x.score > 0)
    .slice(0, limit);
  return {
    count: matches.length,
    nodes: matches.map((m) => ({
      id: m.node.id,
      title: m.node.title,
      kind: m.node.kind,
      owner: m.node.owner,
    })),
  };
}

function runGenerateRunbook(
  nodes: NodeRow[],
  edges: EdgeRow[],
  nodesById: Map<string, NodeRow>,
  input: any
) {
  const ids = input.node_ids as string[];
  const include = (input.include as string[] | undefined) ?? [
    "overview",
    "dependencies",
    "owners",
    "metadata",
  ];
  const sections: string[] = [];
  for (const id of ids) {
    const n = nodesById.get(id);
    if (!n) continue;
    sections.push(`# ${n.title}\n\n*${n.kindLabel || n.kind}*`);
    if (include.includes("overview") && n.description) {
      sections.push(`## Overview\n\n${n.description}`);
    }
    if (include.includes("dependencies")) {
      const upstream = edges.filter((e) => e.targetNodeId === id);
      const downstream = edges.filter((e) => e.sourceNodeId === id);
      if (upstream.length || downstream.length) {
        sections.push("## Dependencies");
        if (upstream.length) {
          sections.push(
            `**Depends on:**\n${upstream.map((e) => `- ${nodesById.get(e.sourceNodeId)?.title ?? e.sourceNodeId}${e.label ? ` (${e.label})` : ""}`).join("\n")}`
          );
        }
        if (downstream.length) {
          sections.push(
            `**Depended on by:**\n${downstream.map((e) => `- ${nodesById.get(e.targetNodeId)?.title ?? e.targetNodeId}${e.label ? ` (${e.label})` : ""}`).join("\n")}`
          );
        }
      }
    }
    if (include.includes("owners") && n.owner) {
      sections.push(`## Owner\n\n${n.owner}`);
    }
    if (include.includes("metadata")) {
      const meta: string[] = [];
      if (n.status) meta.push(`- **Status**: ${n.status}`);
      if (n.priority) meta.push(`- **Priority**: ${n.priority}`);
      if (n.tags) meta.push(`- **Tags**: ${n.tags}`);
      if (meta.length) sections.push(`## Metadata\n\n${meta.join("\n")}`);
    }
    sections.push("---");
  }
  return { markdown: sections.join("\n\n") };
}

function validateProposal(nodesById: Map<string, NodeRow>, input: any) {
  const ops = (input.operations ?? []) as any[];
  const tempIds = new Set<string>();
  const issues: string[] = [];

  for (const op of ops) {
    switch (op.op) {
      case "add_node":
        if (!op.kind || !op.title || !op.tempId) issues.push("add_node missing fields");
        else tempIds.add(op.tempId);
        break;
      case "update_node":
      case "remove_node":
        if (!op.node_id) issues.push(`${op.op} missing node_id`);
        else if (!nodesById.has(op.node_id)) issues.push(`${op.op}: node ${op.node_id} not found`);
        break;
      case "add_edge":
        if (!op.source || !op.target) issues.push("add_edge missing source/target");
        else {
          const sourceOk = nodesById.has(op.source) || tempIds.has(op.source);
          const targetOk = nodesById.has(op.target) || tempIds.has(op.target);
          if (!sourceOk) issues.push(`add_edge: source ${op.source} not found`);
          if (!targetOk) issues.push(`add_edge: target ${op.target} not found`);
        }
        break;
      case "remove_edge":
        if (!op.edge_id) issues.push("remove_edge missing edge_id");
        break;
      default:
        issues.push(`Unknown op: ${op.op}`);
    }
  }

  return {
    summary: input.summary,
    rationale: input.rationale,
    operations: ops,
    valid: issues.length === 0,
    issues,
  };
}
