"use client";

import React, { useState, useEffect } from "react";

interface Version {
  id: string;
  version: number;
  createdBy: string | null;
  createdAt: string;
}

interface VersionHistoryPanelProps {
  open: boolean;
  onClose: () => void;
  mapId: string | null;
  onRestore: (versionId: string) => void;
}

export function VersionHistoryPanel({ open, onClose, mapId, onRestore }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !mapId) return;
    setLoading(true);
    fetch(`/api/maps/${mapId}/versions`)
      .then((res) => res.json())
      .then((data) => setVersions(Array.isArray(data) ? data : []))
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [open, mapId]);

  if (!open) return null;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
  };

  const handleRestore = async (versionId: string) => {
    setRestoring(versionId);
    try {
      onRestore(versionId);
    } finally {
      setTimeout(() => setRestoring(null), 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-sm border-l border-slate-700/30 bg-[#050b15]/95 backdrop-blur-xl shadow-2xl animate-slide-in-right overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">Version History</div>
              <div className="text-[11px] text-slate-500">{versions.length} snapshot{versions.length !== 1 ? "s" : ""}</div>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={onClose}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-brand-500" />
              <span className="text-xs text-slate-500">Loading versions...</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/30 bg-slate-800/40 text-slate-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-slate-400">No versions yet</div>
              <p className="mt-1 text-xs text-slate-600">Versions are saved automatically when you edit the map (Team plan).</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-800" />

              <div className="space-y-1">
                {versions.map((v, idx) => (
                  <div key={v.id} className="relative flex items-start gap-3 rounded-lg p-2 transition hover:bg-slate-800/30 group">
                    {/* Timeline dot */}
                    <div className={`relative z-10 mt-1.5 h-[10px] w-[10px] shrink-0 rounded-full border-2 ${
                      idx === 0
                        ? "border-brand-500 bg-brand-500/30"
                        : "border-slate-600 bg-slate-800"
                    }`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">
                          v{v.version}
                        </span>
                        {idx === 0 && (
                          <span className="rounded-full bg-brand-500/20 border border-brand-500/30 px-1.5 py-0.5 text-[9px] font-semibold text-brand-400 uppercase">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        {formatDate(v.createdAt)}
                        {v.createdBy && <span> by {v.createdBy}</span>}
                      </div>
                    </div>

                    {idx > 0 && (
                      <button
                        className={`shrink-0 rounded-lg border border-slate-700/50 px-2 py-1 text-[11px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition hover:border-brand-500/40 hover:text-brand-400 ${
                          restoring === v.id ? "opacity-100 text-brand-400" : ""
                        }`}
                        onClick={() => handleRestore(v.id)}
                        disabled={restoring === v.id}
                      >
                        {restoring === v.id ? "Restoring..." : "Restore"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/30 px-5 py-3">
          <p className="text-[11px] text-slate-600 text-center">
            Auto-saved snapshots for Team plan maps
          </p>
        </div>
      </div>
    </div>
  );
}
