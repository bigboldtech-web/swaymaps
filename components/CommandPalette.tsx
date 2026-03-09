"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "./providers/ThemeProvider";

interface CommandItem {
  id: string;
  label: string;
  category: "action" | "navigation" | "node";
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
}

export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items
      .filter((item) => item.label.toLowerCase().includes(q))
      .sort((a, b) => {
        const aIdx = a.label.toLowerCase().indexOf(q);
        const bIdx = b.label.toLowerCase().indexOf(q);
        return aIdx - bIdx;
      });
  }, [query, items]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      const cat = item.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return groups;
  }, [filtered]);

  const categoryLabels: Record<string, string> = {
    action: "Actions",
    navigation: "Navigation",
    node: "Nodes",
  };

  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIdx]) {
      e.preventDefault();
      filtered[selectedIdx].onSelect();
      onClose();
    }
  };

  if (!open) return null;

  let flatIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-sm:max-w-full rounded-2xl glass-panel-solid shadow-2xl animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className={`flex items-center gap-3 border-b ${isLight ? "border-slate-200/50" : "border-slate-700/30"} px-4 py-3`}>
          <svg className="h-5 w-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            className={`flex-1 bg-transparent text-sm ${isLight ? "text-slate-800" : "text-slate-100"} outline-none ${isLight ? "placeholder:text-slate-400" : "placeholder:text-slate-500"}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
          />
          <kbd className={`hidden sm:inline-flex items-center rounded-md border ${isLight ? "border-slate-300/40 bg-slate-200/60 text-slate-400" : "border-slate-700/40 bg-slate-800/60 text-slate-500"} px-1.5 py-0.5 text-[10px] font-semibold`}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-slate-500">
              No results found
            </div>
          )}
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat} className="mb-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {categoryLabels[cat] ?? cat}
              </div>
              {catItems.map((item) => {
                const idx = flatIdx++;
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={item.id}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "bg-sky-500/10 text-sky-300"
                        : isLight ? "text-slate-600 hover:bg-slate-100/60 hover:text-slate-800" : "text-slate-300 hover:bg-slate-800/40 hover:text-slate-100"
                    }`}
                    onClick={() => {
                      item.onSelect();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIdx(idx)}
                  >
                    {item.icon && (
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg border ${isLight ? "border-slate-200/50 bg-slate-100/60 text-slate-500" : "border-slate-700/40 bg-slate-800/30 text-slate-400"}`}>
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && (
                      <kbd className={`ml-auto rounded border ${isLight ? "border-slate-300/40 bg-slate-200/60 text-slate-400" : "border-slate-700/40 bg-slate-800/50 text-slate-500"} px-1.5 py-0.5 text-[10px] font-semibold`}>
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex items-center gap-4 border-t ${isLight ? "border-slate-200/50" : "border-slate-700/30"} px-4 py-2`}>
          <span className="flex items-center gap-1 text-[10px] text-slate-600">
            <kbd className={`rounded border ${isLight ? "border-slate-300/40 bg-slate-200/60 text-slate-400" : "border-slate-700/40 bg-slate-800/50 text-slate-500"} px-1 text-[9px]`}>&uarr;&darr;</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-600">
            <kbd className={`rounded border ${isLight ? "border-slate-300/40 bg-slate-200/60 text-slate-400" : "border-slate-700/40 bg-slate-800/50 text-slate-500"} px-1 text-[9px]`}>&crarr;</kbd>
            select
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-600">
            <kbd className={`rounded border ${isLight ? "border-slate-300/40 bg-slate-200/60 text-slate-400" : "border-slate-700/40 bg-slate-800/50 text-slate-500"} px-1 text-[9px]`}>esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
