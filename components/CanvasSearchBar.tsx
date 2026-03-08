"use client";

import React, { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  kind: string;
  tags: string[];
}

interface CanvasSearchBarProps {
  nodes: SearchResult[];
  onFocusNode: (id: string) => void;
  onClose: () => void;
  theme: "light" | "dark";
}

export function CanvasSearchBar({ nodes, onFocusNode, onClose, theme }: CanvasSearchBarProps) {
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? nodes.filter((n) => {
        const q = query.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.kind.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      onFocusNode(filtered[selectedIndex].id);
      onClose();
    }
  };

  return (
    <div
      className={`absolute left-1/2 top-3 z-50 w-80 -translate-x-1/2 rounded-lg border shadow-lg ${
        isDark
          ? "border-slate-800 bg-slate-900/95 backdrop-blur"
          : "border-slate-200 bg-white/95 backdrop-blur"
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <svg
          className={`h-4 w-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          className={`flex-1 bg-transparent text-sm outline-none ${
            isDark
              ? "text-slate-100 placeholder:text-slate-600"
              : "text-slate-900 placeholder:text-slate-400"
          }`}
          placeholder="Search nodes by name, type, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`text-xs ${isDark ? "text-slate-600 hover:text-slate-400" : "text-slate-400 hover:text-slate-600"}`}
          onClick={onClose}
        >
          ESC
        </button>
      </div>
      {filtered.length > 0 && (
        <div className={`max-h-48 overflow-y-auto border-t ${isDark ? "border-slate-800" : "border-slate-100"}`}>
          {filtered.slice(0, 10).map((node, i) => (
            <button
              key={node.id}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                i === selectedIndex
                  ? isDark
                    ? "bg-sky-500/10 text-sky-300"
                    : "bg-sky-50 text-sky-700"
                  : isDark
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => {
                onFocusNode(node.id);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
              }`}>
                {node.kind}
              </span>
              <span className="flex-1 truncate font-medium">{node.title}</span>
              {node.tags.length > 0 && (
                <span className={`text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                  {node.tags.slice(0, 2).join(", ")}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {query.trim() && filtered.length === 0 && (
        <div className={`border-t px-3 py-3 text-center text-xs ${isDark ? "border-slate-800 text-slate-600" : "border-slate-100 text-slate-400"}`}>
          No nodes match &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
