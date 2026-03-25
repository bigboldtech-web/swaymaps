"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "./providers/ThemeProvider";
import type { MapNodeMeta, MapEdgeMeta } from "../types/map";

interface VersionEntry {
  id: string;
  version: number;
  createdAt: string;
  label?: string;
}

interface VersionSnapshot {
  nodes: MapNodeMeta[];
  edges: MapEdgeMeta[];
}

interface DiffViewerProps {
  open: boolean;
  onClose: () => void;
  mapId: string;
  currentNodes: MapNodeMeta[];
  currentEdges: MapEdgeMeta[];
}

interface PropertyChange {
  key: string;
  oldValue: unknown;
  newValue: unknown;
}

interface NodeDiff {
  type: "added" | "removed" | "modified";
  node: MapNodeMeta;
  previousNode?: MapNodeMeta;
  changes?: PropertyChange[];
}

interface EdgeDiff {
  type: "added" | "removed" | "modified";
  edge: MapEdgeMeta;
  previousEdge?: MapEdgeMeta;
  changes?: PropertyChange[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function shallowDiffKeys(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  ignoreKeys: Set<string> = new Set(["position"]),
): PropertyChange[] {
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const changes: PropertyChange[] = [];
  for (const key of allKeys) {
    if (ignoreKeys.has(key)) continue;
    const av = a[key];
    const bv = b[key];
    if (JSON.stringify(av) !== JSON.stringify(bv)) {
      changes.push({ key, oldValue: av, newValue: bv });
    }
  }
  return changes;
}

function computeNodeDiffs(
  currentNodes: MapNodeMeta[],
  previousNodes: MapNodeMeta[],
): NodeDiff[] {
  const prevMap = new Map(previousNodes.map((n) => [n.id, n]));
  const currMap = new Map(currentNodes.map((n) => [n.id, n]));
  const diffs: NodeDiff[] = [];

  // Added nodes
  for (const node of currentNodes) {
    if (!prevMap.has(node.id)) {
      diffs.push({ type: "added", node });
    }
  }

  // Removed nodes
  for (const node of previousNodes) {
    if (!currMap.has(node.id)) {
      diffs.push({ type: "removed", node });
    }
  }

  // Modified nodes
  for (const node of currentNodes) {
    const prev = prevMap.get(node.id);
    if (!prev) continue;
    const changes = shallowDiffKeys(
      prev as unknown as Record<string, unknown>,
      node as unknown as Record<string, unknown>,
    );
    if (changes.length > 0) {
      diffs.push({ type: "modified", node, previousNode: prev, changes });
    }
  }

  return diffs;
}

function computeEdgeDiffs(
  currentEdges: MapEdgeMeta[],
  previousEdges: MapEdgeMeta[],
): EdgeDiff[] {
  const prevMap = new Map(previousEdges.map((e) => [e.id, e]));
  const currMap = new Map(currentEdges.map((e) => [e.id, e]));
  const diffs: EdgeDiff[] = [];

  for (const edge of currentEdges) {
    if (!prevMap.has(edge.id)) {
      diffs.push({ type: "added", edge });
    }
  }

  for (const edge of previousEdges) {
    if (!currMap.has(edge.id)) {
      diffs.push({ type: "removed", edge });
    }
  }

  for (const edge of currentEdges) {
    const prev = prevMap.get(edge.id);
    if (!prev) continue;
    const changes = shallowDiffKeys(
      prev as unknown as Record<string, unknown>,
      edge as unknown as Record<string, unknown>,
    );
    if (changes.length > 0) {
      diffs.push({ type: "modified", edge, previousEdge: prev, changes });
    }
  }

  return diffs;
}

function formatValue(v: unknown): string {
  if (v === undefined) return "(empty)";
  if (v === null) return "(null)";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/* ------------------------------------------------------------------ */
/*  Badge                                                             */
/* ------------------------------------------------------------------ */

function DiffBadge({ type, isLight }: { type: "added" | "removed" | "modified"; isLight: boolean }) {
  const map = {
    added: {
      bg: isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-900/40 text-emerald-300",
      label: "Added",
    },
    removed: {
      bg: isLight ? "bg-red-100 text-red-700" : "bg-red-900/40 text-red-300",
      label: "Removed",
    },
    modified: {
      bg: isLight ? "bg-amber-100 text-amber-700" : "bg-amber-900/40 text-amber-300",
      label: "Modified",
    },
  } as const;
  const { bg, label } = map[type];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${bg}`}>
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function DiffViewer({
  open,
  onClose,
  mapId,
  currentNodes,
  currentEdges,
}: DiffViewerProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<VersionSnapshot | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [error, setError] = useState("");

  /* Fetch version list */
  const fetchVersions = useCallback(async () => {
    setLoadingVersions(true);
    setError("");
    try {
      const res = await fetch(`/api/maps/${mapId}/versions`);
      if (!res.ok) throw new Error("Failed to load versions");
      const data: VersionEntry[] = await res.json();
      setVersions(data);
      if (data.length > 0) {
        setSelectedVersionId(data[0].id);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to load versions");
    } finally {
      setLoadingVersions(false);
    }
  }, [mapId]);

  /* Fetch snapshot when version changes */
  const fetchSnapshot = useCallback(async (versionId: string) => {
    setLoadingSnapshot(true);
    setError("");
    try {
      const res = await fetch(`/api/maps/${mapId}/versions/${versionId}`);
      if (!res.ok) throw new Error("Failed to load version snapshot");
      const data: VersionSnapshot = await res.json();
      setSnapshot(data);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load snapshot");
    } finally {
      setLoadingSnapshot(false);
    }
  }, [mapId]);

  useEffect(() => {
    if (open) {
      fetchVersions();
      setSnapshot(null);
      setSelectedVersionId(null);
    }
  }, [open, fetchVersions]);

  useEffect(() => {
    if (selectedVersionId) {
      fetchSnapshot(selectedVersionId);
    }
  }, [selectedVersionId, fetchSnapshot]);

  /* Compute diffs */
  const nodeDiffs = useMemo(() => {
    if (!snapshot) return [];
    return computeNodeDiffs(currentNodes, snapshot.nodes);
  }, [currentNodes, snapshot]);

  const edgeDiffs = useMemo(() => {
    if (!snapshot) return [];
    return computeEdgeDiffs(currentEdges, snapshot.edges);
  }, [currentEdges, snapshot]);

  const totalChanges = nodeDiffs.length + edgeDiffs.length;

  if (!open) return null;

  /* ---- Styling tokens ---- */
  const textPrimary = isLight ? "text-slate-800" : "text-slate-100";
  const textSecondary = isLight ? "text-slate-500" : "text-slate-400";
  const borderColor = isLight ? "border-slate-200" : "border-slate-700/60";
  const rowHover = isLight ? "hover:bg-slate-50" : "hover:bg-white/[0.03]";
  const cardBg = isLight ? "bg-white/60" : "bg-white/[0.04]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl glass-panel-solid shadow-2xl animate-scale-in"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 pt-5 pb-3 border-b ${borderColor}`}>
          <div>
            <div className={`text-xs uppercase tracking-wide ${textSecondary}`}>Change Detection</div>
            <div className={`text-lg font-semibold ${textPrimary}`}>Diff Viewer</div>
          </div>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-full border ${isLight ? "border-slate-300/50 text-slate-400 hover:bg-slate-100/60 hover:text-slate-700" : "border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"} transition`}
            onClick={onClose}
            aria-label="Close diff viewer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Version selector */}
        <div className={`px-5 py-3 border-b ${borderColor} flex items-center gap-3`}>
          <label className={`text-sm font-medium ${textSecondary} whitespace-nowrap`}>Compare with:</label>
          {loadingVersions ? (
            <span className={`text-sm ${textSecondary}`}>Loading versions...</span>
          ) : versions.length === 0 ? null : (
            <select
              className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${isLight ? "border-slate-300 bg-white text-slate-800" : "border-slate-600 bg-slate-800 text-slate-100"} focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
              value={selectedVersionId ?? ""}
              onChange={(e) => setSelectedVersionId(e.target.value)}
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.version} — {new Date(v.createdAt).toLocaleString()}
                  {v.label ? ` (${v.label})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* No versions */}
          {!loadingVersions && versions.length === 0 && !error && (
            <div className={`flex flex-col items-center justify-center py-12 text-center ${textSecondary}`}>
              <svg className="h-12 w-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">No previous versions found.</p>
              <p className="text-xs mt-1 opacity-70">Versions are created automatically when you save.</p>
            </div>
          )}

          {/* Loading snapshot */}
          {loadingSnapshot && (
            <div className={`flex items-center justify-center py-8 ${textSecondary} text-sm`}>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading snapshot...
            </div>
          )}

          {/* Diff content */}
          {snapshot && !loadingSnapshot && (
            <>
              {/* Summary bar */}
              <div className={`rounded-xl ${cardBg} border ${borderColor} p-4`}>
                <div className={`text-xs uppercase tracking-wide mb-2 ${textSecondary}`}>Summary</div>
                {totalChanges === 0 ? (
                  <p className={`text-sm ${textSecondary}`}>No differences detected. The current map matches this version.</p>
                ) : (
                  <div className="flex flex-wrap gap-3 text-sm">
                    {nodeDiffs.filter((d) => d.type === "added").length > 0 && (
                      <span className={isLight ? "text-emerald-700" : "text-emerald-400"}>
                        +{nodeDiffs.filter((d) => d.type === "added").length} node{nodeDiffs.filter((d) => d.type === "added").length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {nodeDiffs.filter((d) => d.type === "removed").length > 0 && (
                      <span className={isLight ? "text-red-600" : "text-red-400"}>
                        -{nodeDiffs.filter((d) => d.type === "removed").length} node{nodeDiffs.filter((d) => d.type === "removed").length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {nodeDiffs.filter((d) => d.type === "modified").length > 0 && (
                      <span className={isLight ? "text-amber-600" : "text-amber-400"}>
                        ~{nodeDiffs.filter((d) => d.type === "modified").length} node{nodeDiffs.filter((d) => d.type === "modified").length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {edgeDiffs.filter((d) => d.type === "added").length > 0 && (
                      <span className={isLight ? "text-emerald-700" : "text-emerald-400"}>
                        +{edgeDiffs.filter((d) => d.type === "added").length} edge{edgeDiffs.filter((d) => d.type === "added").length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {edgeDiffs.filter((d) => d.type === "removed").length > 0 && (
                      <span className={isLight ? "text-red-600" : "text-red-400"}>
                        -{edgeDiffs.filter((d) => d.type === "removed").length} edge{edgeDiffs.filter((d) => d.type === "removed").length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {edgeDiffs.filter((d) => d.type === "modified").length > 0 && (
                      <span className={isLight ? "text-amber-600" : "text-amber-400"}>
                        ~{edgeDiffs.filter((d) => d.type === "modified").length} edge{edgeDiffs.filter((d) => d.type === "modified").length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Node diffs */}
              {nodeDiffs.length > 0 && (
                <div>
                  <h3 className={`text-xs uppercase tracking-wide mb-2 ${textSecondary}`}>Nodes</h3>
                  <div className={`rounded-xl border ${borderColor} divide-y ${borderColor} overflow-hidden`}>
                    {nodeDiffs.map((diff) => (
                      <div key={`${diff.type}-${diff.node.id}`} className={`px-4 py-3 ${rowHover} transition-colors`}>
                        <div className="flex items-center gap-2 mb-1">
                          <DiffBadge type={diff.type} isLight={isLight} />
                          <span className={`text-sm font-medium ${textPrimary}`}>{diff.node.title || diff.node.id}</span>
                          <span className={`text-xs ${textSecondary}`}>{diff.node.kind}</span>
                        </div>
                        {diff.type === "modified" && diff.changes && diff.changes.length > 0 && (
                          <div className="mt-2 space-y-1 pl-2">
                            {diff.changes.map((change) => (
                              <div key={change.key} className={`text-xs ${textSecondary} font-mono`}>
                                <span className="font-semibold">{change.key}:</span>{" "}
                                <span className={isLight ? "text-red-500" : "text-red-400"}>{formatValue(change.oldValue)}</span>
                                {" -> "}
                                <span className={isLight ? "text-emerald-600" : "text-emerald-400"}>{formatValue(change.newValue)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edge diffs */}
              {edgeDiffs.length > 0 && (
                <div>
                  <h3 className={`text-xs uppercase tracking-wide mb-2 ${textSecondary}`}>Edges</h3>
                  <div className={`rounded-xl border ${borderColor} divide-y ${borderColor} overflow-hidden`}>
                    {edgeDiffs.map((diff) => {
                      const edgeLabel = diff.edge.label || `${diff.edge.sourceId} -> ${diff.edge.targetId}`;
                      return (
                        <div key={`${diff.type}-${diff.edge.id}`} className={`px-4 py-3 ${rowHover} transition-colors`}>
                          <div className="flex items-center gap-2 mb-1">
                            <DiffBadge type={diff.type} isLight={isLight} />
                            <span className={`text-sm font-medium ${textPrimary}`}>{edgeLabel}</span>
                            {diff.edge.relationType && (
                              <span className={`text-xs ${textSecondary}`}>{diff.edge.relationType}</span>
                            )}
                          </div>
                          {diff.type === "modified" && diff.changes && diff.changes.length > 0 && (
                            <div className="mt-2 space-y-1 pl-2">
                              {diff.changes.map((change) => (
                                <div key={change.key} className={`text-xs ${textSecondary} font-mono`}>
                                  <span className="font-semibold">{change.key}:</span>{" "}
                                  <span className={isLight ? "text-red-500" : "text-red-400"}>{formatValue(change.oldValue)}</span>
                                  {" -> "}
                                  <span className={isLight ? "text-emerald-600" : "text-emerald-400"}>{formatValue(change.newValue)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`px-5 py-3 border-t ${borderColor} flex justify-end`}>
          <button
            onClick={onClose}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${isLight ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-slate-700 text-slate-200 hover:bg-slate-600"}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
