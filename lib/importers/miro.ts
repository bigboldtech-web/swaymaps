import { ImportResult, ImportedNode, ImportedEdge } from "./index";

function guessKindFromMiro(
  type: string
): { kind: string; kindLabel: string; color: string } {
  const t = (type || "").toLowerCase();
  if (t.includes("shape") || t.includes("rectangle"))
    return { kind: "generic", kindLabel: "Node", color: "#6366f1" };
  if (t.includes("card"))
    return { kind: "system", kindLabel: "Card", color: "#22c55e" };
  if (t.includes("sticky") || t.includes("note"))
    return { kind: "generic", kindLabel: "Note", color: "#fbbf24" };
  if (t.includes("text"))
    return { kind: "generic", kindLabel: "Text", color: "#94a3b8" };
  return { kind: "generic", kindLabel: "Node", color: "#6366f1" };
}

export function parseMiroJson(jsonContent: string): ImportResult {
  const warnings: string[] = [];
  const nodes: ImportedNode[] = [];
  const edges: ImportedEdge[] = [];

  let data: any;
  try {
    data = JSON.parse(jsonContent);
  } catch {
    return { nodes: [], edges: [], warnings: ["Invalid JSON"] };
  }

  const widgets = data.widgets || data.data || data.items || [];
  if (!Array.isArray(widgets)) {
    return {
      nodes: [],
      edges: [],
      warnings: ["No widgets found in Miro export"],
    };
  }

  const nodeIds = new Set<string>();
  let nodeIndex = 0;

  for (const widget of widgets) {
    const id = String(widget.id || `node-${nodeIndex}`);
    const type = widget.type || "";

    // Connectors/lines are edges
    if (type === "connector" || type === "line") {
      const startId =
        widget.startWidget?.id || widget.start?.item || "";
      const endId = widget.endWidget?.id || widget.end?.item || "";
      if (startId && endId) {
        edges.push({
          id: `edge-${edges.length}`,
          sourceId: String(startId),
          targetId: String(endId),
          label: widget.plainText || widget.text || undefined,
        });
      }
      continue;
    }

    const title =
      widget.plainText ||
      widget.text ||
      widget.title ||
      widget.content ||
      "";
    if (!title && !widget.x && !widget.y) continue;

    const { kind, kindLabel, color } = guessKindFromMiro(type);
    const posX = widget.x || (nodeIndex % 4) * 350;
    const posY = widget.y || Math.floor(nodeIndex / 4) * 280;

    nodes.push({
      id,
      title: title || `Node ${nodeIndex + 1}`,
      kind,
      kindLabel,
      tags: [],
      color,
      posX,
      posY,
    });
    nodeIds.add(id);
    nodeIndex++;
  }

  const validEdges = edges.filter((e) => {
    if (!nodeIds.has(e.sourceId) || !nodeIds.has(e.targetId)) {
      warnings.push(`Connector references unknown widget`);
      return false;
    }
    return true;
  });

  return { nodes, edges: validEdges, warnings };
}
