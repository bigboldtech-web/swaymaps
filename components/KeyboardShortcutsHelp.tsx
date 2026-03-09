"use client";

import React from "react";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: "General",
    items: [
      { keys: ["Cmd", "K"], label: "Open command palette" },
      { keys: ["Cmd", "F"], label: "Search nodes" },
      { keys: ["Cmd", "Z"], label: "Undo" },
      { keys: ["Cmd", "Shift", "Z"], label: "Redo" },
      { keys: ["?"], label: "Show keyboard shortcuts" },
    ],
  },
  {
    category: "Canvas",
    items: [
      { keys: ["N"], label: "Add new node" },
      { keys: ["Del"], label: "Delete selected" },
      { keys: ["Cmd", "D"], label: "Duplicate node" },
      { keys: ["Esc"], label: "Clear selection" },
    ],
  },
  {
    category: "Navigation",
    items: [
      { keys: ["Scroll"], label: "Zoom in/out" },
      { keys: ["Drag"], label: "Pan canvas" },
      { keys: ["Click"], label: "Select node/edge" },
    ],
  },
];

export function KeyboardShortcutsHelp({ open, onClose }: KeyboardShortcutsHelpProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-sm:max-w-full rounded-2xl glass-panel-solid shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/30 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="text-lg font-bold text-slate-100">Keyboard Shortcuts</div>
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

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-5">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-400">
                {group.category}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-800/30 transition">
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-[10px] text-slate-600">+</span>}
                          <kbd className="inline-flex min-w-[24px] items-center justify-center rounded-md border border-slate-700/40 bg-slate-800/60 px-1.5 py-0.5 text-[11px] font-semibold text-slate-400">
                            {key === "Cmd" ? (typeof navigator !== "undefined" && navigator.platform?.includes("Mac") ? "\u2318" : "Ctrl") : key}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/30 px-5 py-3">
          <p className="text-center text-xs text-slate-600">
            Press <kbd className="rounded border border-slate-700/40 bg-slate-800/50 px-1 text-[10px] font-semibold text-slate-500">?</kbd> to toggle this panel
          </p>
        </div>
      </div>
    </div>
  );
}
