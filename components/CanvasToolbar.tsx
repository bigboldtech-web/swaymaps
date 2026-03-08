"use client";

import React, { useState, useRef, useEffect } from "react";

interface CanvasToolbarProps {
  theme: "light" | "dark";
  nodeCount: number;
  edgeCount: number;
  saveStatus: "saved" | "saving" | "unsaved";
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddNode: () => void;
  onFitView: () => void;
  onAutoLayout: (type: "hierarchical" | "radial") => void;
  onToggleSearch: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  hasSelection: boolean;
  shareMode?: boolean;
}

export function CanvasToolbar({
  theme,
  nodeCount,
  edgeCount,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddNode,
  onFitView,
  onAutoLayout,
  onToggleSearch,
  onDuplicate,
  onDelete,
  hasSelection,
  shareMode,
}: CanvasToolbarProps) {
  const isDark = theme === "dark";
  const [layoutOpen, setLayoutOpen] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layoutOpen) return;
    const handler = (e: MouseEvent) => {
      if (layoutRef.current && !layoutRef.current.contains(e.target as Node))
        setLayoutOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [layoutOpen]);

  const btnBase = `flex items-center justify-center rounded-md p-1.5 transition ${
    isDark
      ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
  }`;
  const btnDisabled = "opacity-30 cursor-not-allowed hover:bg-transparent";
  const divider = `w-px h-5 ${isDark ? "bg-slate-800" : "bg-slate-200"}`;

  const saveIndicator = {
    saved: { color: isDark ? "text-emerald-400" : "text-emerald-600", label: "Saved" },
    saving: { color: isDark ? "text-amber-400" : "text-amber-600", label: "Saving..." },
    unsaved: { color: isDark ? "text-slate-500" : "text-slate-400", label: "Unsaved" },
  }[saveStatus];

  return (
    <div
      className={`flex items-center gap-1 rounded-lg border px-2 py-1 shadow-sm ${
        isDark
          ? "border-slate-800 bg-[#0b1422]/90 backdrop-blur"
          : "border-slate-200 bg-white/90 backdrop-blur"
      }`}
    >
      {/* Undo/Redo */}
      {!shareMode && (
        <>
          <button
            className={`${btnBase} ${!canUndo ? btnDisabled : ""}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
          <button
            className={`${btnBase} ${!canRedo ? btnDisabled : ""}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
          </button>
          <div className={divider} />
        </>
      )}

      {/* Add Node */}
      {!shareMode && (
        <>
          <button className={btnBase} onClick={onAddNode} title="Add Node (N)">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <div className={divider} />
        </>
      )}

      {/* Selection actions */}
      {!shareMode && hasSelection && (
        <>
          {onDuplicate && (
            <button className={btnBase} onClick={onDuplicate} title="Duplicate (Ctrl+D)">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              className={`${btnBase} ${isDark ? "hover:text-rose-400" : "hover:text-rose-600"}`}
              onClick={onDelete}
              title="Delete (Del/Backspace)"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <div className={divider} />
        </>
      )}

      {/* Layout */}
      <div className="relative" ref={layoutRef}>
        <button className={btnBase} onClick={() => setLayoutOpen(!layoutOpen)} title="Auto Layout">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="8" y="14" width="7" height="7" rx="1" />
            <path d="M6.5 10v2.5a1 1 0 001 1H11m6.5-3.5v2.5a1 1 0 01-1 1H14" />
          </svg>
        </button>
        {layoutOpen && (
          <div
            className={`absolute left-0 top-full z-50 mt-2 w-44 rounded-lg border shadow-lg ${
              isDark
                ? "border-slate-800 bg-slate-900 text-slate-200"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <button
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
              }`}
              onClick={() => { onAutoLayout("hierarchical"); setLayoutOpen(false); }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path d="M12 3v6m0 0l-4 4m4-4l4 4M4 17h16" />
              </svg>
              Hierarchical
            </button>
            <button
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
              }`}
              onClick={() => { onAutoLayout("radial"); setLayoutOpen(false); }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="20" cy="12" r="2" />
                <circle cx="12" cy="20" r="2" />
                <circle cx="4" cy="12" r="2" />
              </svg>
              Radial
            </button>
          </div>
        )}
      </div>

      {/* Fit View */}
      <button className={btnBase} onClick={onFitView} title="Fit View">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      </button>

      {/* Search */}
      <button className={btnBase} onClick={onToggleSearch} title="Search Canvas (Ctrl+F)">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
      </button>

      <div className={divider} />

      {/* Stats */}
      <div className={`flex items-center gap-2 px-1.5 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
        <span>{nodeCount} nodes</span>
        <span>&middot;</span>
        <span>{edgeCount} edges</span>
      </div>

      <div className={divider} />

      {/* Save status */}
      <div className={`flex items-center gap-1.5 px-1.5 text-xs ${saveIndicator.color}`}>
        {saveStatus === "saving" ? (
          <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : saveStatus === "saved" ? (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
          </svg>
        )}
        <span>{saveIndicator.label}</span>
      </div>
    </div>
  );
}
