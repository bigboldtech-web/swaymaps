import { defaultColorForKind } from "./mapHelpers";

/**
 * Parse a CSV file into the same JSON structure used by /api/maps/import.
 *
 * Supported CSV formats:
 *
 * 1. Edges-only (minimum 2 columns):
 *    source, target [, relationship] [, source_type] [, target_type]
 *
 * 2. Nodes-only (single column or with type):
 *    name [, type]
 *
 * Auto-detects whether the CSV has a header row by checking if the first row
 * contains common header keywords (source, target, name, from, to).
 */
export function parseCsvToMapData(csvText: string, mapName?: string) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) throw new Error("CSV file is empty");

  // Parse all rows
  const rows = lines.map((line) => parseCSVLine(line));
  const colCount = rows[0].length;

  // Detect header
  const headerKeywords = ["source", "target", "name", "from", "to", "node", "type", "relationship", "label", "kind"];
  const firstRow = rows[0].map((c) => c.toLowerCase().trim());
  const hasHeader = firstRow.some((cell) => headerKeywords.includes(cell));
  const dataRows = hasHeader ? rows.slice(1) : rows;

  if (dataRows.length === 0) throw new Error("CSV has no data rows");

  const nodeMap = new Map<string, { id: string; kind: string; title: string }>();
  const edges: Array<{ sourceId: string; targetId: string; label: string }> = [];

  let nodeCounter = 0;
  const getOrCreateNode = (name: string, kind = "generic") => {
    const key = name.toLowerCase().trim();
    if (!key) return null;
    if (nodeMap.has(key)) return nodeMap.get(key)!;
    nodeCounter++;
    const node = { id: `csv-node-${nodeCounter}`, kind, title: name.trim() };
    nodeMap.set(key, node);
    return node;
  };

  if (colCount >= 2) {
    // Edge format: source, target [, relationship] [, source_type] [, target_type]
    for (const row of dataRows) {
      const sourceName = row[0]?.trim();
      const targetName = row[1]?.trim();
      if (!sourceName || !targetName) continue;

      const relationship = row[2]?.trim() || "";
      const sourceType = row[3]?.trim()?.toLowerCase() || "system";
      const targetType = row[4]?.trim()?.toLowerCase() || "system";

      const sourceNode = getOrCreateNode(sourceName, sourceType);
      const targetNode = getOrCreateNode(targetName, targetType);
      if (!sourceNode || !targetNode) continue;

      edges.push({
        sourceId: sourceNode.id,
        targetId: targetNode.id,
        label: relationship,
      });
    }
  } else {
    // Single column: just node names
    for (const row of dataRows) {
      const name = row[0]?.trim();
      if (name) getOrCreateNode(name);
    }
  }

  // Layout nodes in a grid
  const nodeArray = Array.from(nodeMap.values());
  const cols = Math.ceil(Math.sqrt(nodeArray.length));
  const spacing = 250;

  const nodes = nodeArray.map((n, i) => ({
    id: n.id,
    kind: n.kind,
    kindLabel: n.kind.charAt(0).toUpperCase() + n.kind.slice(1),
    title: n.title,
    tags: "",
    color: defaultColorForKind(n.kind as any) || "#6366f1",
    posX: (i % cols) * spacing + 100,
    posY: Math.floor(i / cols) * spacing + 100,
  }));

  return {
    name: mapName || "Imported CSV Map",
    description: "Imported from CSV",
    nodes,
    edges,
    notes: [],
  };
}

/** Parse a single CSV line respecting quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
