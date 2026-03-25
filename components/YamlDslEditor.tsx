"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "./providers/ThemeProvider";
import type {
  MapNodeMeta,
  MapEdgeMeta,
  NodeKind,
  NodeStatus,
  EdgeRelationType,
  EdgeDirection,
  EdgeLineStyle,
} from "../types/map";

// ─── Props ───────────────────────────────────────────────────────────────────

interface YamlDslEditorProps {
  open: boolean;
  onClose: () => void;
  nodes: MapNodeMeta[];
  edges: MapEdgeMeta[];
  onApply: (nodes: MapNodeMeta[], edges: MapEdgeMeta[]) => void;
}

// ─── Minimal YAML parser (no external deps) ─────────────────────────────────

const VALID_KINDS: NodeKind[] = [
  "person", "system", "process", "generic", "database",
  "api", "queue", "cache", "cloud", "team", "vendor",
];
const VALID_STATUSES: NodeStatus[] = [
  "active", "degraded", "down", "deprecated", "planned", "maintenance",
];
const VALID_RELATION_TYPES: EdgeRelationType[] = [
  "depends_on", "calls", "triggers", "reads_from", "writes_to",
  "subscribes", "publishes", "authenticates", "monitors",
  "deploys_to", "inherits", "contains", "proxies", "custom",
];
const VALID_DIRECTIONS: EdgeDirection[] = ["one-way", "bidirectional"];
const VALID_LINE_STYLES: EdgeLineStyle[] = ["solid", "dashed", "dotted"];

interface ParseResult {
  nodes: MapNodeMeta[];
  edges: MapEdgeMeta[];
  errors: string[];
  warnings: string[];
}

/** Strip inline comments and trim */
function stripComment(line: string): string {
  // Respect strings: naive approach — strip # only if not inside quotes
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "#" && !inSingle && !inDouble) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line;
}

/** Get indentation level (number of spaces) */
function indent(line: string): number {
  const m = line.match(/^(\s*)/);
  return m ? m[1].replace(/\t/g, "  ").length : 0;
}

/** Parse a scalar value — handles booleans, numbers, quoted strings, inline arrays */
function parseScalar(raw: string): string | number | boolean | string[] {
  const v = raw.trim();
  if (v === "") return "";

  // Inline array: [a, b, c]
  if (v.startsWith("[") && v.endsWith("]")) {
    const inner = v.slice(1, -1);
    return inner
      .split(",")
      .map((s) => {
        const t = s.trim();
        // strip quotes
        if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
          return t.slice(1, -1);
        }
        return t;
      })
      .filter(Boolean);
  }

  // Quoted string
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }

  // Booleans
  if (v === "true" || v === "True" || v === "TRUE") return true;
  if (v === "false" || v === "False" || v === "FALSE") return false;

  // Null
  if (v === "null" || v === "~") return "";

  // Number
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);

  return v;
}

/**
 * Minimal YAML parser supporting:
 * - Top-level keys (nodes, edges)
 * - List items (- key: value)
 * - Nested key: value pairs within list items
 * - Inline arrays [a, b, c]
 * - Block sequence arrays (- item under a key)
 */
function parseYaml(text: string): { data: Record<string, any[]>; errors: string[] } {
  const errors: string[] = [];
  const lines = text.split("\n");
  const result: Record<string, any[]> = {};

  let currentTopKey: string | null = null;
  let currentItem: Record<string, any> | null = null;
  let currentSubKey: string | null = null; // for block sequence arrays under a key
  let listIndent = -1;
  let itemIndent = -1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const lineNum = i + 1;
    const stripped = stripComment(rawLine);

    // Skip blank lines
    if (stripped.trim() === "") continue;

    const lvl = indent(stripped);
    const trimmed = stripped.trim();

    // Top-level key (e.g. "nodes:" or "edges:")
    if (lvl === 0 && trimmed.endsWith(":") && !trimmed.startsWith("-")) {
      // Save previous item
      if (currentItem && currentTopKey) {
        result[currentTopKey] = result[currentTopKey] || [];
        result[currentTopKey].push(currentItem);
      }
      currentTopKey = trimmed.slice(0, -1).trim();
      currentItem = null;
      currentSubKey = null;
      listIndent = -1;
      itemIndent = -1;
      continue;
    }

    if (!currentTopKey) {
      errors.push(`Line ${lineNum}: unexpected content before top-level key`);
      continue;
    }

    // List item start: "- key: value" or just "-"
    if (trimmed.startsWith("- ") || trimmed === "-") {
      // Save previous item
      if (currentItem) {
        result[currentTopKey] = result[currentTopKey] || [];
        result[currentTopKey].push(currentItem);
      }

      currentSubKey = null;

      if (listIndent === -1) listIndent = lvl;

      // Check if this is a sub-list item (block sequence under a key)
      if (currentSubKey === null && currentItem === null && lvl === listIndent) {
        // Normal top-level list item
      }

      // If the dash line has content: "- key: value"
      if (trimmed.length > 2) {
        const afterDash = trimmed.slice(2);
        const colonIdx = afterDash.indexOf(":");
        if (colonIdx > 0) {
          currentItem = {};
          itemIndent = lvl + 2;
          const key = afterDash.slice(0, colonIdx).trim();
          const val = afterDash.slice(colonIdx + 1).trim();
          if (val) {
            currentItem[key] = parseScalar(val);
          }
        } else {
          // Simple list value under a subkey — handle below
          // If we're inside a block-sequence for a subkey on the previous item
          // This case: the dash is a sub-list item
          if (currentSubKey && currentItem) {
            if (!Array.isArray(currentItem[currentSubKey])) {
              currentItem[currentSubKey] = [];
            }
            (currentItem[currentSubKey] as string[]).push(afterDash.trim());
            currentItem = currentItem; // keep same item
            // Undo the save-previous since we don't want a new item
            // Actually we already pushed — we need to remove and restore
            // Let's restructure: don't push above if this is a sublist
          }
          // Fallback: start a new item anyway
          if (!currentSubKey) {
            currentItem = {};
            itemIndent = lvl + 2;
          }
        }
      } else {
        currentItem = {};
        itemIndent = lvl + 2;
      }
      continue;
    }

    // Block-sequence sub-item: "  - value" under a key like tags
    if (trimmed.startsWith("- ") === false && rawLine.trimStart().startsWith("- ") && currentItem && currentSubKey) {
      const val = rawLine.trimStart().slice(2).trim();
      if (!Array.isArray(currentItem[currentSubKey])) {
        currentItem[currentSubKey] = [];
      }
      (currentItem[currentSubKey] as string[]).push(String(parseScalar(val)));
      continue;
    }

    // Property of current item: "key: value"
    if (currentItem) {
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx > 0) {
        const key = trimmed.slice(0, colonIdx).trim();
        const val = trimmed.slice(colonIdx + 1).trim();
        if (val) {
          currentItem[key] = parseScalar(val);
          currentSubKey = null;
        } else {
          // Value on next lines (block sequence) — mark subkey
          currentSubKey = key;
          currentItem[key] = [];
        }
        continue;
      }

      // Could be a block-sequence sub-item
      if (trimmed.startsWith("- ") && currentSubKey) {
        const val = trimmed.slice(2).trim();
        if (!Array.isArray(currentItem[currentSubKey])) {
          currentItem[currentSubKey] = [];
        }
        (currentItem[currentSubKey] as string[]).push(String(parseScalar(val)));
        continue;
      }
    }

    errors.push(`Line ${lineNum}: could not parse "${trimmed}"`);
  }

  // Save last item
  if (currentItem && currentTopKey) {
    result[currentTopKey] = result[currentTopKey] || [];
    result[currentTopKey].push(currentItem);
  }

  return { data: result, errors };
}

/** Convert parsed YAML data into typed nodes/edges with validation */
function convertToMapData(data: Record<string, any[]>): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const nodes: MapNodeMeta[] = [];
  const edges: MapEdgeMeta[] = [];

  const rawNodes = data["nodes"] || [];
  const rawEdges = data["edges"] || [];

  const nodeIds = new Set<string>();

  // Parse nodes
  for (let i = 0; i < rawNodes.length; i++) {
    const raw = rawNodes[i];
    const idx = i + 1;

    if (!raw.id) {
      errors.push(`Node #${idx}: missing required field "id"`);
      continue;
    }
    if (!raw.title && !raw.name) {
      errors.push(`Node #${idx} (${raw.id}): missing required field "title"`);
      continue;
    }

    const id = String(raw.id);
    if (nodeIds.has(id)) {
      errors.push(`Node #${idx}: duplicate id "${id}"`);
      continue;
    }
    nodeIds.add(id);

    const kind = String(raw.kind || "generic") as NodeKind;
    if (!VALID_KINDS.includes(kind)) {
      warnings.push(`Node "${id}": unknown kind "${kind}", using "generic"`);
    }

    const status = raw.status ? String(raw.status) as NodeStatus : undefined;
    if (status && !VALID_STATUSES.includes(status)) {
      warnings.push(`Node "${id}": unknown status "${status}"`);
    }

    const tags = Array.isArray(raw.tags)
      ? raw.tags.map(String)
      : typeof raw.tags === "string"
        ? raw.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];

    const node: MapNodeMeta = {
      id,
      kind: VALID_KINDS.includes(kind) ? kind : "generic",
      kindLabel: raw.kindLabel || kind,
      title: String(raw.title || raw.name),
      tags,
      noteId: raw.noteId || "",
      color: raw.color ? String(raw.color) : undefined,
      status: status && VALID_STATUSES.includes(status) ? status : undefined,
      owner: raw.owner ? String(raw.owner) : undefined,
      url: raw.url ? String(raw.url) : undefined,
      description: raw.description ? String(raw.description) : undefined,
      version: raw.version ? String(raw.version) : undefined,
      sla: raw.sla ? String(raw.sla) : undefined,
    };

    if (raw.position || (raw.x !== undefined && raw.y !== undefined)) {
      node.position = {
        x: Number(raw.position?.x ?? raw.x ?? 0),
        y: Number(raw.position?.y ?? raw.y ?? 0),
      };
    }

    nodes.push(node);
  }

  // Parse edges
  for (let i = 0; i < rawEdges.length; i++) {
    const raw = rawEdges[i];
    const idx = i + 1;

    const sourceId = String(raw.from || raw.source || raw.sourceId || "");
    const targetId = String(raw.to || raw.target || raw.targetId || "");

    if (!sourceId) {
      errors.push(`Edge #${idx}: missing source ("from" field)`);
      continue;
    }
    if (!targetId) {
      errors.push(`Edge #${idx}: missing target ("to" field)`);
      continue;
    }

    if (!nodeIds.has(sourceId)) {
      warnings.push(`Edge #${idx}: source "${sourceId}" not found in nodes`);
    }
    if (!nodeIds.has(targetId)) {
      warnings.push(`Edge #${idx}: target "${targetId}" not found in nodes`);
    }

    const relationType = raw.relationType ? String(raw.relationType) as EdgeRelationType : undefined;
    if (relationType && !VALID_RELATION_TYPES.includes(relationType)) {
      warnings.push(`Edge #${idx}: unknown relationType "${relationType}"`);
    }

    const direction = raw.direction ? String(raw.direction) as EdgeDirection : undefined;
    if (direction && !VALID_DIRECTIONS.includes(direction)) {
      warnings.push(`Edge #${idx}: unknown direction "${direction}"`);
    }

    const lineStyle = raw.lineStyle ? String(raw.lineStyle) as EdgeLineStyle : undefined;
    if (lineStyle && !VALID_LINE_STYLES.includes(lineStyle)) {
      warnings.push(`Edge #${idx}: unknown lineStyle "${lineStyle}"`);
    }

    const edge: MapEdgeMeta = {
      id: raw.id ? String(raw.id) : `e-${sourceId}-${targetId}`,
      sourceId,
      sourceHandle: raw.sourceHandle ? String(raw.sourceHandle) : null,
      targetId,
      targetHandle: raw.targetHandle ? String(raw.targetHandle) : null,
      label: raw.label ? String(raw.label) : undefined,
      edgeType: raw.edgeType || "default",
      lineStyle: lineStyle && VALID_LINE_STYLES.includes(lineStyle) ? lineStyle : undefined,
      color: raw.color ? String(raw.color) : undefined,
      animated: raw.animated === true || raw.animated === "true" ? true : undefined,
      relationType: relationType && VALID_RELATION_TYPES.includes(relationType) ? relationType : undefined,
      direction: direction && VALID_DIRECTIONS.includes(direction) ? direction : undefined,
      weight: raw.weight ? Number(raw.weight) : undefined,
      protocol: raw.protocol ? String(raw.protocol) : undefined,
      latency: raw.latency ? String(raw.latency) : undefined,
      dataFlow: raw.dataFlow ? String(raw.dataFlow) : undefined,
    };

    edges.push(edge);
  }

  return { nodes, edges, errors, warnings };
}

// ─── Serialize to YAML ───────────────────────────────────────────────────────

function toYaml(nodes: MapNodeMeta[], edges: MapEdgeMeta[]): string {
  const lines: string[] = [];

  lines.push("nodes:");
  for (const node of nodes) {
    lines.push(`  - id: ${node.id}`);
    lines.push(`    kind: ${node.kind}`);
    lines.push(`    title: ${node.title}`);
    if (node.status) lines.push(`    status: ${node.status}`);
    if (node.owner) lines.push(`    owner: ${node.owner}`);
    if (node.description) lines.push(`    description: ${node.description}`);
    if (node.url) lines.push(`    url: ${node.url}`);
    if (node.version) lines.push(`    version: ${node.version}`);
    if (node.sla) lines.push(`    sla: ${node.sla}`);
    if (node.color) lines.push(`    color: "${node.color}"`);
    if (node.tags && node.tags.length > 0) {
      lines.push(`    tags: [${node.tags.join(", ")}]`);
    }
    if (node.position) {
      lines.push(`    x: ${node.position.x}`);
      lines.push(`    y: ${node.position.y}`);
    }
    lines.push("");
  }

  if (edges.length > 0) {
    lines.push("edges:");
    for (const edge of edges) {
      lines.push(`  - from: ${edge.sourceId}`);
      lines.push(`    to: ${edge.targetId}`);
      if (edge.label) lines.push(`    label: ${edge.label}`);
      if (edge.relationType) lines.push(`    relationType: ${edge.relationType}`);
      if (edge.direction) lines.push(`    direction: ${edge.direction}`);
      if (edge.lineStyle) lines.push(`    lineStyle: ${edge.lineStyle}`);
      if (edge.animated) lines.push(`    animated: true`);
      if (edge.weight) lines.push(`    weight: ${edge.weight}`);
      if (edge.protocol) lines.push(`    protocol: ${edge.protocol}`);
      if (edge.latency) lines.push(`    latency: ${edge.latency}`);
      if (edge.dataFlow) lines.push(`    dataFlow: ${edge.dataFlow}`);
      if (edge.color) lines.push(`    color: "${edge.color}"`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ─── Component ───────────────────────────────────────────────────────────────

export function YamlDslEditor({ open, onClose, nodes, edges, onApply }: YamlDslEditorProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [yaml, setYaml] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  // Initialize YAML from current map state when opened
  useEffect(() => {
    if (open) {
      setYaml(toYaml(nodes, edges));
      setParseResult(null);
      setParseErrors([]);
    }
  }, [open, nodes, edges]);

  // Parse YAML on changes (debounced)
  useEffect(() => {
    if (!yaml.trim()) {
      setParseResult(null);
      setParseErrors([]);
      return;
    }

    const timer = setTimeout(() => {
      const { data, errors: yamlErrors } = parseYaml(yaml);
      if (yamlErrors.length > 0) {
        setParseErrors(yamlErrors);
        setParseResult(null);
        return;
      }
      setParseErrors([]);
      const result = convertToMapData(data);
      setParseResult(result);
    }, 300);

    return () => clearTimeout(timer);
  }, [yaml]);

  const handleApply = useCallback(() => {
    if (!parseResult || parseResult.errors.length > 0) return;
    onApply(parseResult.nodes, parseResult.edges);
    onClose();
  }, [parseResult, onApply, onClose]);

  const handleExportToClipboard = useCallback(() => {
    const text = toYaml(nodes, edges);
    navigator.clipboard.writeText(text).catch(() => {});
  }, [nodes, edges]);

  const hasErrors = parseErrors.length > 0 || (parseResult?.errors?.length ?? 0) > 0;
  const allErrors = [...parseErrors, ...(parseResult?.errors || [])];
  const warnings = parseResult?.warnings || [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl glass-panel-solid shadow-2xl animate-scale-in flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
          <div>
            <div className={`text-xs uppercase tracking-wide ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              YAML Editor
            </div>
            <div className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Define Map as Code
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportToClipboard}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isLight
                  ? "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700/70"
              }`}
            >
              Copy YAML
            </button>
            <button
              onClick={handleApply}
              disabled={hasErrors || !parseResult}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                hasErrors || !parseResult
                  ? "bg-brand-500/30 text-brand-300/50 cursor-not-allowed"
                  : "bg-brand-500 text-white hover:bg-brand-600"
              }`}
            >
              Apply
            </button>
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                isLight
                  ? "border-slate-300/50 text-slate-400 hover:bg-slate-100/60 hover:text-slate-700"
                  : "border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              } transition`}
              onClick={onClose}
              aria-label="Close YAML editor"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body: editor + preview */}
        <div className="flex flex-1 min-h-0">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-slate-700/40 min-w-0">
            <div className={`px-4 py-2 text-xs font-medium uppercase tracking-wide ${isLight ? "text-slate-500 bg-slate-50/50" : "text-slate-400 bg-slate-800/30"} border-b border-slate-700/30`}>
              YAML Source
            </div>
            <div className="flex-1 relative min-h-0">
              <textarea
                value={yaml}
                onChange={(e) => setYaml(e.target.value)}
                spellCheck={false}
                className={`absolute inset-0 w-full h-full resize-none p-4 font-mono text-sm leading-relaxed outline-none ${
                  isLight
                    ? "bg-white/50 text-slate-800 placeholder-slate-400"
                    : "bg-slate-900/50 text-slate-200 placeholder-slate-500"
                }`}
                placeholder={`nodes:\n  - id: my-service\n    kind: system\n    title: My Service\n    status: active\n\nedges:\n  - from: my-service\n    to: database\n    label: reads/writes`}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-72 sm:w-80 flex flex-col min-h-0">
            <div className={`px-4 py-2 text-xs font-medium uppercase tracking-wide ${isLight ? "text-slate-500 bg-slate-50/50" : "text-slate-400 bg-slate-800/30"} border-b border-slate-700/30`}>
              Preview
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Summary stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-xl p-3 text-center ${isLight ? "bg-slate-100/70" : "bg-slate-800/40"}`}>
                  <div className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {parseResult?.nodes.length ?? 0}
                  </div>
                  <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Nodes</div>
                </div>
                <div className={`rounded-xl p-3 text-center ${isLight ? "bg-slate-100/70" : "bg-slate-800/40"}`}>
                  <div className={`text-2xl font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                    {parseResult?.edges.length ?? 0}
                  </div>
                  <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Edges</div>
                </div>
              </div>

              {/* Node list */}
              {parseResult && parseResult.nodes.length > 0 && (
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Nodes
                  </div>
                  <div className="space-y-1.5">
                    {parseResult.nodes.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isLight ? "bg-slate-100/60" : "bg-slate-800/30"
                        }`}
                      >
                        <div className={`font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {n.title}
                        </div>
                        <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                          {n.kind}{n.status ? ` / ${n.status}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edge list */}
              {parseResult && parseResult.edges.length > 0 && (
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                    Edges
                  </div>
                  <div className="space-y-1.5">
                    {parseResult.edges.map((e) => (
                      <div
                        key={e.id}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          isLight ? "bg-slate-100/60" : "bg-slate-800/30"
                        }`}
                      >
                        <div className={`font-medium ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {e.sourceId} → {e.targetId}
                        </div>
                        {e.label && (
                          <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                            {e.label}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Errors */}
              {allErrors.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2 text-red-400">
                    Errors ({allErrors.length})
                  </div>
                  <div className="space-y-1">
                    {allErrors.map((err, i) => (
                      <div
                        key={i}
                        className="rounded-lg px-3 py-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20"
                      >
                        {err}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {warnings.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-2 text-amber-400">
                    Warnings ({warnings.length})
                  </div>
                  <div className="space-y-1">
                    {warnings.map((w, i) => (
                      <div
                        key={i}
                        className="rounded-lg px-3 py-2 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!parseResult && allErrors.length === 0 && (
                <div className={`text-center py-8 text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                  Start typing YAML to see a preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
