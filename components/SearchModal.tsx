"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTheme } from "./providers/ThemeProvider";

interface SearchResult {
  id: string;
  title?: string;
  name?: string;
  kind?: string;
  kindLabel?: string;
  tags?: string;
  color?: string;
  mapId?: string;
  mapName?: string;
  description?: string;
  nodeCount?: number;
  type: "map" | "node";
}

interface SearchModalProps {
  onSelectMap: (mapId: string) => void;
  onClose: () => void;
}

export function SearchModal({ onSelectMap, onClose }: SearchModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ maps: SearchResult[]; nodes: SearchResult[] }>({ maps: [], nodes: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults({ maps: [], nodes: [] });
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=all`);
      const data = await res.json();
      setResults({ maps: data.maps ?? [], nodes: data.nodes ?? [] });
      setSearched(true);
    } catch {
      setResults({ maps: [], nodes: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(val), 300);
  };

  const totalResults = results.maps.length + results.nodes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[15vh] animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-lg max-sm:max-w-full rounded-2xl glass-panel-solid shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center gap-3 border-b ${isLight ? "border-slate-200/50" : "border-slate-700/30"} px-4 py-3`}>
          <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            className={`flex-1 bg-transparent text-sm ${isLight ? "text-slate-800" : "text-slate-100"} outline-none ${isLight ? "placeholder:text-slate-400" : "placeholder:text-slate-600"}`}
            placeholder="Search maps, nodes, tags across all your maps..."
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
          />
          {loading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
          )}
          <kbd className={`rounded ${isLight ? "bg-slate-200/60" : "bg-slate-800/60"} px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 border ${isLight ? "border-slate-300/40" : "border-slate-700/40"}`}>
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {searched && totalResults === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {results.maps.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Maps ({results.maps.length})
              </div>
              {results.maps.map((m) => (
                <button
                  key={m.id}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition ${isLight ? "text-slate-600 hover:bg-slate-100/60" : "text-slate-300 hover:bg-slate-700/30"}`}
                  onClick={() => { onSelectMap(m.id); onClose(); }}
                >
                  <div className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{m.name}</div>
                  <div className="text-xs text-slate-500">
                    {m.nodeCount ?? 0} nodes {m.description ? `· ${m.description}` : ""}
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.nodes.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Nodes ({results.nodes.length})
              </div>
              {results.nodes.map((n) => (
                <button
                  key={`${n.mapId}-${n.id}`}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition ${isLight ? "text-slate-600 hover:bg-slate-100/60" : "text-slate-300 hover:bg-slate-700/30"}`}
                  onClick={() => { onSelectMap(n.mapId!); onClose(); }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: n.color || "#29a5e5" }}
                    />
                    <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{n.title}</span>
                    <span className={`rounded-full ${isLight ? "bg-slate-200/60" : "bg-slate-800/60"} border ${isLight ? "border-slate-300/40" : "border-slate-700/40"} px-1.5 py-0.5 text-[10px] font-semibold capitalize text-slate-400`}>
                      {n.kindLabel || n.kind}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    in {n.mapName} {n.tags ? `· ${n.tags}` : ""}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searched && !loading && (
            <div className="px-4 py-8 text-center text-sm text-slate-600">
              Type to search across all your maps, nodes, and tags
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
