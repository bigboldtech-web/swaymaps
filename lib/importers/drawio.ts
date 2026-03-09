import { ImportResult, ImportedNode, ImportedEdge } from "./index";

function guessKindFromStyle(
  style: string
): { kind: string; kindLabel: string; color: string } {
  const s = (style || "").toLowerCase();
  if (
    s.includes("shape=cylinder") ||
    s.includes("shape=mxgraph.aws3.dynamo_db") ||
    s.includes("database")
  )
    return { kind: "database", kindLabel: "Database", color: "#6366f1" };
  if (s.includes("shape=cloud") || s.includes("cloud"))
    return { kind: "cloud", kindLabel: "Cloud", color: "#8b5cf6" };
  if (
    s.includes("shape=mxgraph.basic.person") ||
    s.includes("shape=actor")
  )
    return { kind: "person", kindLabel: "Person", color: "#38bdf8" };
  if (s.includes("rhombus") || s.includes("diamond"))
    return { kind: "process", kindLabel: "Decision", color: "#f59e0b" };
  if (s.includes("rounded=1"))
    return { kind: "process", kindLabel: "Process", color: "#fbbf24" };
  if (s.includes("shape=hexagon"))
    return { kind: "api", kindLabel: "API", color: "#0ea5e9" };
  return { kind: "generic", kindLabel: "Node", color: "#6366f1" };
}

export function parseDrawioXml(xmlContent: string): ImportResult {
  const warnings: string[] = [];
  const nodes: ImportedNode[] = [];
  const edges: ImportedEdge[] = [];

  // Parse all cells with their geometries
  const cellBlocks = xmlContent.split(/<mxCell\s/).slice(1);
  const nodeIds = new Set<string>();
  let nodeIndex = 0;

  for (const block of cellBlocks) {
    const fullBlock = "<mxCell " + block;
    const attrs = parseXmlAttrs(fullBlock);
    const id = attrs.id || "";
    const value = attrs.value || "";
    const style = attrs.style || "";
    const source = attrs.source || "";
    const target = attrs.target || "";
    const vertex = attrs.vertex === "1";
    const isEdge = attrs.edge === "1";

    // Extract geometry
    const geoMatch = fullBlock.match(/<mxGeometry\s+([^/>]*)/);
    const geoAttrs = geoMatch
      ? parseXmlAttrs("<g " + geoMatch[1] + "/>")
      : {};

    if (isEdge && source && target) {
      edges.push({
        id: id || `edge-${edges.length}`,
        sourceId: source,
        targetId: target,
        label: cleanHtml(value) || undefined,
      });
    } else if (vertex && value) {
      const { kind, kindLabel, color } = guessKindFromStyle(style);
      const posX =
        parseFloat(geoAttrs.x || "0") || (nodeIndex % 4) * 350;
      const posY =
        parseFloat(geoAttrs.y || "0") ||
        Math.floor(nodeIndex / 4) * 280;

      nodes.push({
        id: id || `node-${nodeIndex}`,
        title: cleanHtml(value),
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

  const validEdges = edges.filter((e) => {
    if (!nodeIds.has(e.sourceId) || !nodeIds.has(e.targetId)) {
      warnings.push(`Edge references unknown node`);
      return false;
    }
    return true;
  });

  return { nodes, edges: validEdges, warnings };
}

function parseXmlAttrs(tag: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(tag)) !== null) {
    result[match[1]] = match[2];
  }
  return result;
}

function cleanHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}
