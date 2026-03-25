"use client";

import React, { useMemo } from "react";
import { useTheme } from "./providers/ThemeProvider";
import { MapNodeMeta, MapEdgeMeta } from "../types/map";

interface HealthDashboardProps {
  nodes: MapNodeMeta[];
  edges: MapEdgeMeta[];
  isOpen: boolean;
  onClose: () => void;
  onNodeClick?: (nodeId: string) => void;
}

export function HealthDashboard({ nodes, edges, isOpen, onClose, onNodeClick }: HealthDashboardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const stats = useMemo(() => {
    const total = nodes.length;
    const withStatus = nodes.filter((n) => n.status);
    const active = withStatus.filter((n) => n.status === "active").length;
    const degraded = withStatus.filter((n) => n.status === "degraded").length;
    const down = withStatus.filter((n) => n.status === "down").length;
    const maintenance = withStatus.filter((n) => n.status === "maintenance").length;
    const deprecated = withStatus.filter((n) => n.status === "deprecated").length;
    const planned = withStatus.filter((n) => n.status === "planned").length;
    const noStatus = total - withStatus.length;

    const withOwner = nodes.filter((n) => n.owner).length;
    const noOwner = total - withOwner;
    const withSLA = nodes.filter((n) => n.sla).length;
    const noSLA = total - withSLA;
    const withDescription = nodes.filter((n) => n.description).length;
    const noDescription = total - withDescription;
    const withUrl = nodes.filter((n) => n.url).length;

    // Priority breakdown
    const critical = nodes.filter((n) => n.priority === "critical").length;
    const high = nodes.filter((n) => n.priority === "high").length;
    const medium = nodes.filter((n) => n.priority === "medium").length;
    const low = nodes.filter((n) => n.priority === "low").length;

    // Kind breakdown
    const kindCounts: Record<string, number> = {};
    nodes.forEach((n) => { kindCounts[n.kind] = (kindCounts[n.kind] || 0) + 1; });

    // Edge stats
    const edgesWithLabel = edges.filter((e) => e.label).length;
    const edgesWithRelation = edges.filter((e) => e.relationType).length;

    // Health score (0-100)
    let score = 100;
    if (total === 0) score = 0;
    else {
      const penalties = [
        down * 15,           // Down nodes are critical
        degraded * 8,        // Degraded is bad
        noOwner * 3,         // Missing owners
        noSLA * 2,           // Missing SLAs
        noDescription * 1,   // Missing descriptions
        noStatus * 2,        // No status set
      ];
      score = Math.max(0, Math.round(100 - penalties.reduce((a, b) => a + b, 0)));
    }

    // Issues list
    const issues: { severity: "critical" | "warning" | "info"; message: string; nodeIds: string[] }[] = [];
    const downNodes = nodes.filter((n) => n.status === "down");
    if (downNodes.length) issues.push({ severity: "critical", message: `${downNodes.length} system(s) DOWN`, nodeIds: downNodes.map((n) => n.id) });
    const degradedNodes = nodes.filter((n) => n.status === "degraded");
    if (degradedNodes.length) issues.push({ severity: "warning", message: `${degradedNodes.length} system(s) degraded`, nodeIds: degradedNodes.map((n) => n.id) });
    const orphanNodes = nodes.filter((n) => !n.owner);
    if (orphanNodes.length) issues.push({ severity: "info", message: `${orphanNodes.length} node(s) missing owner`, nodeIds: orphanNodes.map((n) => n.id) });
    const noSlaNodes = nodes.filter((n) => !n.sla && (n.kind === "system" || n.kind === "api" || n.kind === "database"));
    if (noSlaNodes.length) issues.push({ severity: "info", message: `${noSlaNodes.length} service(s) missing SLA`, nodeIds: noSlaNodes.map((n) => n.id) });
    const deprecatedNodes = nodes.filter((n) => n.status === "deprecated");
    if (deprecatedNodes.length) issues.push({ severity: "warning", message: `${deprecatedNodes.length} deprecated system(s) still connected`, nodeIds: deprecatedNodes.map((n) => n.id) });

    return {
      total, active, degraded, down, maintenance, deprecated, planned, noStatus,
      noOwner, noSLA, noDescription, withUrl, withOwner, withSLA, withDescription,
      critical, high, medium, low,
      kindCounts, edgesWithLabel, edgesWithRelation,
      score, issues,
    };
  }, [nodes, edges]);

  if (!isOpen) return null;

  const cardClass = isLight
    ? "bg-white border-slate-200 shadow-sm"
    : "bg-slate-900/80 border-slate-700/30";
  const labelClass = isLight ? "text-slate-500" : "text-slate-400";
  const valueClass = isLight ? "text-slate-800" : "text-slate-100";

  const scoreColor = stats.score >= 80 ? "#22c55e" : stats.score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel = stats.score >= 80 ? "Healthy" : stats.score >= 50 ? "Needs Attention" : "Critical";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-[700px] max-h-[85vh] overflow-y-auto rounded-2xl border ${cardClass} p-0`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isLight ? "bg-white border-slate-200" : "bg-slate-900 border-slate-700/30"}`}>
          <div>
            <h2 className={`text-lg font-bold ${valueClass}`}>Dependency Health Dashboard</h2>
            <p className={`text-xs ${labelClass}`}>{stats.total} nodes &middot; {edges.length} connections</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition ${isLight ? "hover:bg-slate-100" : "hover:bg-slate-800"}`}>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Health Score */}
          <div className="flex items-center gap-5">
            <div className="relative h-24 w-24 flex-shrink-0">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke={isLight ? "#e2e8f0" : "#1e293b"} strokeWidth="3" />
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke={scoreColor} strokeWidth="3"
                  strokeDasharray={`${stats.score}, 100`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: scoreColor }}>{stats.score}</span>
                <span className={`text-[9px] ${labelClass}`}>/ 100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold" style={{ color: scoreColor }}>{scoreLabel}</span>
              </div>
              <p className={`text-xs leading-relaxed ${labelClass}`}>
                {stats.score >= 80
                  ? "Your dependency map is well-documented with good coverage."
                  : stats.score >= 50
                  ? "Some nodes need attention — missing owners, SLAs, or status."
                  : "Multiple systems are down or degraded. Immediate attention needed."}
              </p>
            </div>
          </div>

          {/* Issues */}
          {stats.issues.length > 0 && (
            <div className="space-y-1.5">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${labelClass}`}>Issues</h3>
              {stats.issues.map((issue, i) => (
                <div key={i} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 ${
                  issue.severity === "critical" ? (isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20") :
                  issue.severity === "warning" ? (isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20") :
                  (isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20")
                }`}>
                  <span className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                    issue.severity === "critical" ? "bg-red-500" : issue.severity === "warning" ? "bg-yellow-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-medium ${valueClass}`}>{issue.message}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {issue.nodeIds.slice(0, 5).map((nid) => {
                        const node = nodes.find((nn) => nn.id === nid);
                        return (
                          <button key={nid} onClick={() => onNodeClick?.(nid)}
                            className={`text-[10px] px-1.5 py-0.5 rounded border cursor-pointer transition ${isLight ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-600" : "border-slate-700/30 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300"}`}>
                            {node?.title || nid}
                          </button>
                        );
                      })}
                      {issue.nodeIds.length > 5 && (
                        <span className={`text-[10px] px-1.5 py-0.5 ${labelClass}`}>+{issue.nodeIds.length - 5} more</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Status Breakdown */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Active", count: stats.active, color: "#22c55e", bg: isLight ? "bg-green-50" : "bg-green-500/10" },
              { label: "Degraded", count: stats.degraded, color: "#f59e0b", bg: isLight ? "bg-yellow-50" : "bg-yellow-500/10" },
              { label: "Down", count: stats.down, color: "#ef4444", bg: isLight ? "bg-red-50" : "bg-red-500/10" },
              { label: "No Status", count: stats.noStatus, color: "#94a3b8", bg: isLight ? "bg-slate-50" : "bg-slate-800/40" },
            ].map((s) => (
              <div key={s.label} className={`rounded-lg border p-3 text-center ${cardClass}`}>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.count}</div>
                <div className={`text-[10px] font-medium ${labelClass}`}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Coverage Metrics */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass}`}>Coverage</h3>
            <div className="space-y-2">
              {[
                { label: "Nodes with Owner", value: stats.withOwner, total: stats.total },
                { label: "Nodes with SLA", value: stats.withSLA, total: stats.total },
                { label: "Nodes with Description", value: stats.withDescription, total: stats.total },
                { label: "Edges with Labels", value: stats.edgesWithLabel, total: edges.length },
                { label: "Edges with Relation Type", value: stats.edgesWithRelation, total: edges.length },
              ].map((m) => {
                const pct = m.total > 0 ? Math.round((m.value / m.total) * 100) : 0;
                const barColor = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className={`text-[11px] w-44 flex-shrink-0 ${labelClass}`}>{m.label}</span>
                    <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                    </div>
                    <span className={`text-[11px] font-semibold tabular-nums w-16 text-right ${valueClass}`}>{m.value}/{m.total}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Type Breakdown */}
          <div>
            <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass}`}>Node Types</h3>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(stats.kindCounts).sort((a, b) => b[1] - a[1]).map(([kind, count]) => (
                <span key={kind} className={`rounded-md border px-2 py-1 text-[11px] ${isLight ? "border-slate-200 bg-slate-50 text-slate-600" : "border-slate-700/30 bg-slate-800/30 text-slate-300"}`}>
                  {kind} <strong>{count}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Priority Breakdown */}
          {(stats.critical + stats.high + stats.medium + stats.low > 0) && (
            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass}`}>Priority Distribution</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "P0 Critical", count: stats.critical, color: "#ef4444" },
                  { label: "P1 High", count: stats.high, color: "#f97316" },
                  { label: "P2 Medium", count: stats.medium, color: "#f59e0b" },
                  { label: "P3 Low", count: stats.low, color: "#6b7280" },
                ].map((p) => (
                  <div key={p.label} className={`rounded-lg border p-2 text-center ${cardClass}`}>
                    <div className="text-lg font-bold" style={{ color: p.color }}>{p.count}</div>
                    <div className={`text-[9px] font-medium ${labelClass}`}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
