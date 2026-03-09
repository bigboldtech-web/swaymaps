import { Edge, Node } from "reactflow";
import { MapEdgeMeta, MapNodeMeta, Note, NodeKind } from "../types/map";
import { AiBrainstormPlan } from "../types/ai";
import { FlowEdgeData, FlowNodeData } from "../components/DecodeMapCanvas";

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge<FlowEdgeData>;

export const baseX = 240;
export const baseY = 180;

export const sanitizeHandle = (
  handle: string | null | undefined,
  role: "source" | "target"
) => {
  if (!handle) return null;
  const other = role === "source" ? "target" : "source";
  return handle.includes(other) ? handle.replace(other, role) : handle;
};

export const now = () => new Date().toISOString();

export function toFlowNodes(
  metas: MapNodeMeta[],
  onUpdateMeta: (meta: MapNodeMeta) => void
): FlowNode[] {
  return metas.map((meta, idx) => ({
    id: meta.id,
    type: "decodeNode",
    connectable: true,
    draggable: true,
    selectable: true,
    position: meta.position ?? {
      x: (idx % 3) * baseX + (idx % 2 === 0 ? 20 : 60),
      y: Math.floor(idx / 3) * baseY + 40
    },
    data: { meta, onUpdateMeta }
  }));
}

export function toFlowEdges(edges: MapEdgeMeta[]): FlowEdge[] {
  return edges.map((edge) => {
    const fixedMeta: MapEdgeMeta = {
      ...edge,
      sourceHandle: sanitizeHandle(edge.sourceHandle, "source"),
      targetHandle: sanitizeHandle(edge.targetHandle, "target"),
      edgeType: edge.edgeType ?? "smoothstep"
    };
    const flowType = fixedMeta.edgeType ?? "smoothstep";

    return {
      id: fixedMeta.id,
      source: fixedMeta.sourceId,
      target: fixedMeta.targetId,
      sourceHandle: fixedMeta.sourceHandle ?? undefined,
      targetHandle: fixedMeta.targetHandle ?? undefined,
      label: fixedMeta.label ?? "",
      type: flowType,
      className: "edge-glow",
      style: { strokeWidth: 1.6 },
      data: { meta: fixedMeta }
    };
  });
}

export function nextKind(idx: number): NodeKind {
  const kinds: NodeKind[] = ["person", "system", "process", "database", "api", "queue", "cache", "cloud", "team", "vendor", "generic"];
  return kinds[idx % kinds.length];
}

export const defaultColorForKind = (kind: NodeKind) => {
  switch (kind) {
    case "person": return "#38bdf8";
    case "system": return "#22c55e";
    case "process": return "#fbbf24";
    case "database": return "#6366f1";
    case "api": return "#0ea5e9";
    case "queue": return "#f59e0b";
    case "cache": return "#ef4444";
    case "cloud": return "#8b5cf6";
    case "team": return "#14b8a6";
    case "vendor": return "#f97316";
    default: return "#6366f1";
  }
};

export const withCommentArray = (note: Note): Note => ({
  ...note,
  comments: note.comments ?? []
});

export const normalizeTitle = (title: string) => title.trim().toLowerCase();

export const ideaKindToNodeKind = (kind?: string): NodeKind => {
  if (!kind) return "generic";
  const normalized = kind.toLowerCase();
  if (normalized.includes("person") || normalized.includes("stakeholder") || normalized.includes("user")) return "person";
  if (normalized.includes("database") || normalized.includes("db") || normalized.includes("storage")) return "database";
  if (normalized.includes("api") || normalized.includes("endpoint") || normalized.includes("gateway")) return "api";
  if (normalized.includes("queue") || normalized.includes("message") || normalized.includes("event")) return "queue";
  if (normalized.includes("cache") || normalized.includes("redis") || normalized.includes("memcache")) return "cache";
  if (normalized.includes("cloud") || normalized.includes("aws") || normalized.includes("gcp") || normalized.includes("azure")) return "cloud";
  if (normalized.includes("team") || normalized.includes("group") || normalized.includes("department")) return "team";
  if (normalized.includes("vendor") || normalized.includes("third-party") || normalized.includes("external") || normalized.includes("saas")) return "vendor";
  if (normalized.includes("system") || normalized.includes("platform") || normalized.includes("tool") || normalized.includes("service")) return "system";
  if (normalized.includes("process") || normalized.includes("workflow") || normalized.includes("pipeline")) return "process";
  return "generic";
};

export const positionForIndex = (idx: number, origin: { x: number; y: number }) => {
  const spacingX = baseX + 80;
  const spacingY = baseY + 40;
  return {
    x: origin.x + (idx % 3) * spacingX,
    y: origin.y + Math.floor(idx / 3) * spacingY
  };
};

export const planToGraph = (
  plan: AiBrainstormPlan,
  opts?: {
    existingTitles?: Map<string, string>;
    origin?: { x: number; y: number };
    existingEdges?: Set<string>;
  }
) => {
  const nodes: MapNodeMeta[] = [];
  const notes: Note[] = [];
  const edges: MapEdgeMeta[] = [];
  const titleToId = new Map<string, string>(opts?.existingTitles ?? []);
  const origin = opts?.origin ?? { x: 120, y: 120 };
  const ideas = (plan.nodes ?? []).filter((n) => n?.title).slice(0, 14);

  ideas.forEach((idea, idx) => {
    const normalized = normalizeTitle(idea.title);
    if (titleToId.has(normalized)) return;
    const id = crypto.randomUUID ? crypto.randomUUID() : `node-${Date.now()}-${idx}`;
    const noteId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}-${idx}`;
    const kind = ideaKindToNodeKind(idea.kind);
    const tags = (idea.tags ?? []).slice(0, 6);
    const content =
      idea.note?.trim() ||
      idea.summary?.trim() ||
      `AI generated idea for ${plan.title ?? "this board"}.`;
    const position = positionForIndex(idx, origin);

    nodes.push({
      id,
      kind,
      kindLabel: kind.charAt(0).toUpperCase() + kind.slice(1),
      title: idea.title.trim(),
      tags,
      noteId,
      color: defaultColorForKind(kind),
      position
    });
    notes.push({
      id: noteId,
      title: idea.title.trim(),
      tags,
      content,
      comments: [],
      createdAt: now(),
      updatedAt: now()
    });
    titleToId.set(normalized, id);
  });

  (plan.edges ?? []).forEach((edgeIdea, idx) => {
    if (!edgeIdea?.source || !edgeIdea?.target) return;
    const sourceId = titleToId.get(normalizeTitle(edgeIdea.source));
    const targetId = titleToId.get(normalizeTitle(edgeIdea.target));
    if (!sourceId || !targetId || sourceId === targetId) return;
    const key = `${sourceId}>${targetId}>${edgeIdea.label ?? ""}`;
    if (opts?.existingEdges?.has(key)) return;
    if (opts?.existingEdges) opts.existingEdges.add(key);
    edges.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `edge-${Date.now()}-${idx}`,
      sourceId,
      targetId,
      sourceHandle: null,
      targetHandle: null,
      label: edgeIdea.label ?? "",
      noteId: null,
      edgeType: "smoothstep"
    });
  });

  return { nodes, edges, notes };
};
