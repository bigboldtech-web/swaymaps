export interface ImportedNode {
  id: string;
  title: string;
  kind: string;
  kindLabel: string;
  tags: string[];
  color: string;
  posX: number;
  posY: number;
  description?: string;
}

export interface ImportedEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface ImportResult {
  nodes: ImportedNode[];
  edges: ImportedEdge[];
  warnings: string[];
}

export type ImportFormat = "lucidchart" | "drawio" | "miro" | "csv" | "json";

export function detectFormat(
  fileName: string,
  content: string
): ImportFormat | null {
  const ext = fileName.toLowerCase().split(".").pop();

  if (ext === "csv") return "lucidchart"; // Lucidchart exports as CSV

  if (
    ext === "xml" ||
    content.trimStart().startsWith("<mxfile") ||
    content.trimStart().startsWith("<mxGraphModel")
  )
    return "drawio";

  if (ext === "json") {
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === "board" || parsed.widgets) return "miro";
      return "json"; // generic JSON
    } catch {
      return null;
    }
  }

  return null;
}
