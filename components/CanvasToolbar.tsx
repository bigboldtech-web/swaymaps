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
  onAutoLayout: (type: "hierarchical" | "radial" | "top-bottom" | "left-right") => void;
  onToggleSearch: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  hasSelection: boolean;
  shareMode?: boolean;
}

export function CanvasToolbar({
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

  const btnBase = "flex items-center justify-center rounded-lg p-1.5 transition text-slate-400 hover:bg-slate-700/40 hover:text-slate-200";
  const btnDisabled = "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-slate-400";
  const divider = "w-px h-5 bg-slate-700/40";

  const saveIndicator = {
    saved: { color: "text-emerald-400", label: "Saved" },
    saving: { color: "text-amber-400", label: "Saving..." },
    unsaved: { color: "text-slate-500", label: "Unsaved" },
  }[saveStatus];

  return (
    <div className="flex items-center gap-1 rounded-xl glass-panel-solid px-1.5 sm:px-2 py-1 shadow-glass overflow-x-auto scrollbar-hide">
      {!shareMode && (
        <>
          <button className={`${btnBase} ${!canUndo ? btnDisabled : ""}`} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
          </button>
          <button className={`${btnBase} ${!canRedo ? btnDisabled : ""}`} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
          </button>
          <div className={divider} />
        </>
      )}
      {!shareMode && (
        <>
          <button className={btnBase} onClick={onAddNode} title="Add Node (N)">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
          <div className={divider} />
        </>
      )}
      {!shareMode && hasSelection && (
        <>
          {onDuplicate && (
            <button className={btnBase} onClick={onDuplicate} title="Duplicate (Ctrl+D)">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
            </button>
          )}
          {onDelete && (
            <button className={`${btnBase} hover:text-rose-400`} onClick={onDelete} title="Delete (Del/Backspace)">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
          <div className={divider} />
        </>
      )}
      <div className="relative" ref={layoutRef}>
        <button className={btnBase} onClick={() => setLayoutOpen(!layoutOpen)} title="Auto Layout">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="8" y="14" width="7" height="7" rx="1" /><path d="M6.5 10v2.5a1 1 0 001 1H11m6.5-3.5v2.5a1 1 0 01-1 1H14" /></svg>
        </button>
        {layoutOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl glass-panel-solid shadow-glass overflow-hidden animate-scale-in">
            <button className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-700/30 hover:text-slate-100" onClick={() => { onAutoLayout("top-bottom"); setLayoutOpen(false); }}>
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-3 3m3-3l3 3" /><path strokeLinecap="round" d="M4 9h16M4 15h16" /></svg>
              Top to Bottom
            </button>
            <button className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-700/30 hover:text-slate-100" onClick={() => { onAutoLayout("left-right"); setLayoutOpen(false); }}>
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18m-18 0l3-3m-3 3l3 3" /><path strokeLinecap="round" d="M9 4v16M15 4v16" /></svg>
              Left to Right
            </button>
            <button className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-700/30 hover:text-slate-100" onClick={() => { onAutoLayout("radial"); setLayoutOpen(false); }}>
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="4" r="2" /><circle cx="20" cy="12" r="2" /><circle cx="12" cy="20" r="2" /><circle cx="4" cy="12" r="2" /></svg>
              Radial
            </button>
          </div>
        )}
      </div>
      <button className={btnBase} onClick={onFitView} title="Fit View">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
      </button>
      <button className={btnBase} onClick={onToggleSearch} title="Search Canvas (Ctrl+F)">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
      </button>
      <div className={`${divider} hidden sm:block`} />
      <div className="hidden sm:flex items-center gap-2 px-1.5 text-xs text-slate-500">
        <span>{nodeCount} nodes</span>
        <span>&middot;</span>
        <span>{edgeCount} edges</span>
      </div>
      <div className={`${divider} hidden sm:block`} />
      <div className={`flex items-center gap-1.5 px-1.5 text-xs ${saveIndicator.color}`}>
        {saveStatus === "saving" ? (
          <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        ) : saveStatus === "saved" ? (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /></svg>
        )}
        <span className="hidden sm:inline">{saveIndicator.label}</span>
      </div>
    </div>
  );
}
