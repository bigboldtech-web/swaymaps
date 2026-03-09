import { ImportResult, ImportedNode, ImportedEdge } from "./index";

const DEFAULT_COLORS: Record<string, string> = {
  process: "#fbbf24",
  decision: "#f59e0b",
  document: "#38bdf8",
  data: "#6366f1",
  default: "#6366f1",
};

function guessKind(
  shape: string
): { kind: string; kindLabel: string; color: string } {
  const s = (shape || "").toLowerCase();
  if (s.includes("process") || s.includes("action"))
    return { kind: "process", kindLabel: "Process", color: DEFAULT_COLORS.process };
  if (s.includes("decision") || s.includes("diamond"))
    return { kind: "process", kindLabel: "Decision", color: DEFAULT_COLORS.decision };
  if (s.includes("document") || s.includes("page"))
    return { kind: "system", kindLabel: "Document", color: DEFAULT_COLORS.document };
  if (
    s.includes("data") ||
    s.includes("database") ||
    s.includes("cylinder")
  )
    return { kind: "database", kindLabel: "Database", color: DEFAULT_COLORS.data };
  if (s.includes("cloud"))
    return { kind: "cloud", kindLabel: "Cloud", color: "#8b5cf6" };
  if (s.includes("person") || s.includes("user") || s.includes("actor"))
    return { kind: "person", kindLabel: "Person", color: "#38bdf8" };
  return { kind: "generic", kindLabel: "Node", color: DEFAULT_COLORS.default };
}

export function parseLucidchartCsv(csvContent: string): ImportResult {
  const warnings: string[] = [];
  const lines = csvContent
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2)
    return { nodes: [], edges: [], warnings: ["CSV appears empty"] };

  // Parse header
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows = lines.slice(1).map((l) => parseCSVLine(l));

  const idCol = headers.findIndex(
    (h) => h === "id" || h === "shape id"
  );
  const nameCol = headers.findIndex(
    (h) => h === "name" || h === "text area 1" || h === "text"
  );
  const shapeCol = headers.findIndex(
    (h) => h.includes("shape") && !h.includes("id")
  );
  const srcCol = headers.findIndex(
    (h) => h === "line source" || h === "source"
  );
  const dstCol = headers.findIndex(
    (h) =>
      h === "line destination" || h === "destination" || h === "target"
  );
  const xCol = headers.findIndex((h) => h === "x" || h === "left");
  const yCol = headers.findIndex((h) => h === "y" || h === "top");

  const nodes: ImportedNode[] = [];
  const edges: ImportedEdge[] = [];
  const nodeIds = new Set<string>();

  let nodeIndex = 0;
  for (const row of rows) {
    const id = idCol >= 0 ? row[idCol] : `node-${nodeIndex}`;
    const name = nameCol >= 0 ? row[nameCol] : "";
    const shape = shapeCol >= 0 ? row[shapeCol] : "";
    const src = srcCol >= 0 ? row[srcCol] : "";
    const dst = dstCol >= 0 ? row[dstCol] : "";

    // It's an edge if it has source and destination
    if (src && dst) {
      edges.push({
        id: `edge-${edges.length}`,
        sourceId: src,
        targetId: dst,
        label: name || undefined,
      });
    } else if (name || shape) {
      // It's a node
      const { kind, kindLabel, color } = guessKind(shape);
      const posX =
        xCol >= 0
          ? parseFloat(row[xCol]) || (nodeIndex % 4) * 350
          : (nodeIndex % 4) * 350;
      const posY =
        yCol >= 0
          ? parseFloat(row[yCol]) || Math.floor(nodeIndex / 4) * 280
          : Math.floor(nodeIndex / 4) * 280;

      nodes.push({
        id,
        title: name || `Node ${nodeIndex + 1}`,
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
  }

  // Filter edges to only include valid source/target
  const validEdges = edges.filter((e) => {
    if (!nodeIds.has(e.sourceId) || !nodeIds.has(e.targetId)) {
      warnings.push(
        `Edge from ${e.sourceId} to ${e.targetId} references unknown node`
      );
      return false;
    }
    return true;
  });

  return { nodes, edges: validEdges, warnings };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}
