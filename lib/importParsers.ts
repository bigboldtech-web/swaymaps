/**
 * Parsers for importing maps from external tools:
 * - Draw.io (XML)
 * - Lucidchart (CSV export)
 * - Miro (JSON export / board backup)
 *
 * Each parser returns a normalized format compatible with our import API.
 */

interface ImportedNode {
  id: string;
  kind: string;
  kindLabel: string;
  title: string;
  tags: string[];
  color: string;
  position: { x: number; y: number };
}

interface ImportedEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
}

export interface ParsedMap {
  name: string;
  description: string;
  nodes: ImportedNode[];
  edges: ImportedEdge[];
  notes: any[];
}

/* ═══════════════════════════════════════
   DRAW.IO (XML) PARSER
   ═══════════════════════════════════════ */

export function parseDrawioXml(xmlString: string): ParsedMap {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");
  const cells = doc.querySelectorAll("mxCell");

  const nodes: ImportedNode[] = [];
  const edges: ImportedEdge[] = [];
  const nodeIdSet = new Set<string>();

  cells.forEach((cell) => {
    const id = cell.getAttribute("id") || "";
    const value = cell.getAttribute("value") || "";
    const source = cell.getAttribute("source");
    const target = cell.getAttribute("target");
    const style = cell.getAttribute("style") || "";
    const geometry = cell.querySelector("mxGeometry");

    // Skip root containers (id 0, 1)
    if (id === "0" || id === "1") return;

    if (source && target) {
      // This is an edge
      edges.push({
        id: `e-${id}`,
        sourceId: source,
        targetId: target,
        label: stripHtml(value),
      });
    } else if (geometry && cell.getAttribute("vertex") === "1") {
      // This is a node
      const x = parseFloat(geometry.getAttribute("x") || "0");
      const y = parseFloat(geometry.getAttribute("y") || "0");

      const kind = guessKindFromDrawioStyle(style);
      const color = extractColorFromStyle(style);

      nodes.push({
        id,
        kind,
        kindLabel: kind.charAt(0).toUpperCase() + kind.slice(1),
        title: stripHtml(value) || "Untitled",
        tags: [],
        color: color || "#6366f1",
        position: { x, y },
      });
      nodeIdSet.add(id);
    }
  });

  // Filter edges to only include those referencing valid nodes
  const validEdges = edges.filter(
    (e) => nodeIdSet.has(e.sourceId) && nodeIdSet.has(e.targetId)
  );

  return {
    name: "Imported from Draw.io",
    description: "Imported from Draw.io XML file",
    nodes,
    edges: validEdges,
    notes: [],
  };
}

function guessKindFromDrawioStyle(style: string): string {
  const s = style.toLowerCase();
  if (s.includes("shape=cylinder") || s.includes("shape=mxgraph.aws3.rds") || s.includes("database")) return "database";
  if (s.includes("shape=mxgraph.aws") || s.includes("cloud") || s.includes("shape=mxgraph.azure")) return "cloud";
  if (s.includes("shape=process") || s.includes("shape=mxgraph.flowchart")) return "process";
  if (s.includes("shape=actor") || s.includes("shape=mxgraph.basic.person") || s.includes("stickman")) return "person";
  if (s.includes("shape=hexagon") || s.includes("api") || s.includes("endpoint")) return "api";
  return "system";
}

function extractColorFromStyle(style: string): string | null {
  const fillMatch = style.match(/fillColor=(#[0-9a-fA-F]{6})/);
  if (fillMatch) return fillMatch[1];
  const bgMatch = style.match(/fillColor=(#[0-9a-fA-F]{3})/);
  if (bgMatch) return bgMatch[1];
  return null;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
}

/* ═══════════════════════════════════════
   LUCIDCHART (CSV) PARSER
   ═══════════════════════════════════════ */

export function parseLucidchartCsv(csvString: string): ParsedMap {
  const lines = csvString.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    return { name: "Imported from Lucidchart", description: "", nodes: [], edges: [], notes: [] };
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });

  const nodes: ImportedNode[] = [];
  const edges: ImportedEdge[] = [];
  const nodeIdMap = new Map<string, string>();

  // Find relevant columns
  const idCol = headers.find((h) => h === "id" || h === "shape id" || h === "shape_id") || "id";
  const nameCol = headers.find((h) => h === "name" || h === "text" || h === "label" || h === "shape name") || "name";
  const typeCol = headers.find((h) => h === "type" || h === "shape type" || h === "shape_type") || "type";
  const xCol = headers.find((h) => h === "x" || h === "x position" || h === "left") || "x";
  const yCol = headers.find((h) => h === "y" || h === "y position" || h === "top") || "y";
  const srcCol = headers.find((h) => h === "source" || h === "source id" || h === "from" || h.includes("source")) || "";
  const tgtCol = headers.find((h) => h === "target" || h === "target id" || h === "to" || h.includes("target")) || "";
  const lblCol = headers.find((h) => h === "label" || h === "edge label" || h === "text") || "";

  let nodeIdx = 0;
  let edgeIdx = 0;

  rows.forEach((row) => {
    const hasSrc = srcCol && row[srcCol];
    const hasTgt = tgtCol && row[tgtCol];

    if (hasSrc && hasTgt) {
      // Edge row
      edges.push({
        id: `le-${edgeIdx++}`,
        sourceId: row[srcCol],
        targetId: row[tgtCol],
        label: row[lblCol] || "",
      });
    } else {
      // Node row
      const id = row[idCol] || `ln-${nodeIdx}`;
      const title = row[nameCol] || "Untitled";
      const kind = guessKindFromText(row[typeCol] || title);

      nodes.push({
        id,
        kind,
        kindLabel: kind.charAt(0).toUpperCase() + kind.slice(1),
        title,
        tags: [],
        color: "#6366f1",
        position: {
          x: parseFloat(row[xCol]) || nodeIdx * 200,
          y: parseFloat(row[yCol]) || 200,
        },
      });
      nodeIdMap.set(id, id);
      nodeIdx++;
    }
  });

  return {
    name: "Imported from Lucidchart",
    description: "Imported from Lucidchart CSV export",
    nodes,
    edges,
    notes: [],
  };
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

/* ═══════════════════════════════════════
   MIRO (JSON) PARSER
   ═══════════════════════════════════════ */

export function parseMiroJson(jsonString: string): ParsedMap {
  const data = JSON.parse(jsonString);

  // Miro exports can come in different formats
  const widgets = data.widgets || data.items || data.data?.items || [];
  const nodes: ImportedNode[] = [];
  const edges: ImportedEdge[] = [];
  const stickyNoteIds = new Set<string>();

  let nodeIdx = 0;

  widgets.forEach((widget: any) => {
    const type = (widget.type || "").toLowerCase();
    const id = widget.id || `m-${nodeIdx}`;

    if (type === "connector" || type === "line" || type === "arrow") {
      // Edge
      const startId = widget.startWidget?.id || widget.start?.item || widget.startItem;
      const endId = widget.endWidget?.id || widget.end?.item || widget.endItem;
      if (startId && endId) {
        edges.push({
          id: `me-${edges.length}`,
          sourceId: startId,
          targetId: endId,
          label: widget.text || widget.plainText || widget.captions?.[0]?.text || "",
        });
      }
    } else if (
      type === "shape" || type === "sticky_note" || type === "card" ||
      type === "text" || type === "frame" || type === "app_card" || type === "image"
    ) {
      const title = stripHtml(widget.text || widget.plainText || widget.title || widget.content || "Untitled");
      const x = widget.x ?? widget.position?.x ?? nodeIdx * 200;
      const y = widget.y ?? widget.position?.y ?? 200;

      const kind = type === "sticky_note" ? "generic" : type === "card" || type === "app_card" ? "system" : guessKindFromText(title);
      const bgColor = widget.style?.backgroundColor || widget.style?.fillColor || null;

      nodes.push({
        id,
        kind,
        kindLabel: kind.charAt(0).toUpperCase() + kind.slice(1),
        title: title.substring(0, 200),
        tags: type === "sticky_note" ? ["sticky-note"] : [],
        color: normalizeColor(bgColor) || "#6366f1",
        position: { x: Math.round(x), y: Math.round(y) },
      });
      stickyNoteIds.add(id);
      nodeIdx++;
    }
  });

  // Filter edges
  const validEdges = edges.filter(
    (e) => stickyNoteIds.has(e.sourceId) && stickyNoteIds.has(e.targetId)
  );

  return {
    name: "Imported from Miro",
    description: "Imported from Miro board export",
    nodes,
    edges: validEdges,
    notes: [],
  };
}

/* ═══════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════ */

function guessKindFromText(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("database") || t.includes("db") || t.includes("postgres") || t.includes("mysql") || t.includes("mongo")) return "database";
  if (t.includes("api") || t.includes("endpoint") || t.includes("rest") || t.includes("graphql")) return "api";
  if (t.includes("queue") || t.includes("kafka") || t.includes("rabbitmq") || t.includes("sqs")) return "queue";
  if (t.includes("cache") || t.includes("redis") || t.includes("memcached")) return "cache";
  if (t.includes("cloud") || t.includes("aws") || t.includes("gcp") || t.includes("azure") || t.includes("lambda")) return "cloud";
  if (t.includes("team") || t.includes("squad") || t.includes("group")) return "team";
  if (t.includes("person") || t.includes("user") || t.includes("employee") || t.includes("engineer")) return "person";
  if (t.includes("vendor") || t.includes("third-party") || t.includes("external")) return "vendor";
  if (t.includes("process") || t.includes("flow") || t.includes("step") || t.includes("pipeline")) return "process";
  return "system";
}

function normalizeColor(color: string | null): string | null {
  if (!color) return null;
  if (color.startsWith("#")) return color;
  if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      const hex = match.slice(0, 3).map((n) => parseInt(n).toString(16).padStart(2, "0")).join("");
      return `#${hex}`;
    }
  }
  return null;
}

/* ═══════════════════════════════════════
   AUTO-DETECT FORMAT
   ═══════════════════════════════════════ */

export function detectAndParse(content: string, filename: string): ParsedMap {
  const ext = filename.toLowerCase().split(".").pop() || "";
  const trimmed = content.trim();

  // XML (Draw.io)
  if (ext === "xml" || ext === "drawio" || trimmed.startsWith("<?xml") || trimmed.startsWith("<mxfile") || trimmed.startsWith("<mxGraphModel")) {
    const parsed = parseDrawioXml(trimmed);
    parsed.name = filename.replace(/\.(xml|drawio)$/i, "") || "Imported from Draw.io";
    return parsed;
  }

  // JSON (Miro or SwayMaps native)
  if (ext === "json" || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const data = JSON.parse(trimmed);
      // Check if it's our native format (has nodes array with kind field)
      if (data.nodes && Array.isArray(data.nodes) && data.nodes[0]?.kind) {
        return {
          name: data.name || filename.replace(/\.json$/i, ""),
          description: data.description || "Imported from JSON",
          nodes: data.nodes,
          edges: data.edges || [],
          notes: data.notes || [],
        };
      }
      // Otherwise try Miro format
      const parsed = parseMiroJson(trimmed);
      parsed.name = filename.replace(/\.json$/i, "") || "Imported from Miro";
      return parsed;
    } catch {
      // Fall through to CSV
    }
  }

  // CSV (Lucidchart)
  if (ext === "csv" || trimmed.includes(",")) {
    const parsed = parseLucidchartCsv(trimmed);
    parsed.name = filename.replace(/\.csv$/i, "") || "Imported from Lucidchart";
    return parsed;
  }

  throw new Error("Unsupported file format. Please upload .drawio, .xml, .csv, or .json files.");
}
