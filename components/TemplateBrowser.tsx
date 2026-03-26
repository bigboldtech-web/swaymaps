"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "./providers/ThemeProvider";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  nodeCount?: number;
  edgeCount?: number;
  mapData: any;
}

interface TemplateBrowserProps {
  open: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  architecture: "#6366f1",
  devops: "#10b981",
  data: "#3b82f6",
  compliance: "#ef4444",
  organization: "#f59e0b",
  risk: "#f97316",
  product: "#ec4899",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  architecture: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  devops: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
    </svg>
  ),
  data: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  compliance: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  organization: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  risk: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  product: (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
};

export function TemplateBrowser({ open, onClose, onUseTemplate }: TemplateBrowserProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    templates.forEach((t) => cats.add(t.category));
    return Array.from(cats).sort();
  }, [templates]);

  const filtered = useMemo(() => {
    let list = templates;
    if (selectedCategory) list = list.filter((t) => t.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [templates, selectedCategory, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className={`w-[800px] max-h-[85vh] overflow-hidden rounded-2xl border shadow-2xl ${
          isLight ? "bg-white border-slate-200" : "bg-slate-900 border-slate-700/30"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-slate-200" : "border-slate-700/30"}`}>
          <div>
            <h2 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Template Gallery</h2>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{templates.length} templates across {categories.length} categories</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition ${isLight ? "hover:bg-slate-100" : "hover:bg-slate-800"}`}>
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search + Filters */}
        <div className={`px-6 py-3 border-b ${isLight ? "border-slate-200" : "border-slate-700/30"}`}>
          <div className={`relative rounded-lg border ${isLight ? "border-slate-200 bg-white" : "border-slate-700/30 bg-slate-800/30"}`}>
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className={`w-full bg-transparent pl-10 pr-3 py-2 text-sm outline-none ${isLight ? "text-slate-700 placeholder:text-slate-400" : "text-slate-200 placeholder:text-slate-500"}`}
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <button
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition border ${
                !selectedCategory
                  ? "bg-brand-500/10 border-brand-500/30 text-brand-400"
                  : isLight
                  ? "border-slate-200 text-slate-500 hover:bg-slate-100"
                  : "border-slate-700/30 text-slate-400 hover:bg-slate-800"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition border capitalize flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? "bg-brand-500/10 border-brand-500/30 text-brand-400"
                    : isLight
                    ? "border-slate-200 text-slate-500 hover:bg-slate-100"
                    : "border-slate-700/30 text-slate-400 hover:bg-slate-800"
                }`}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] || "#6b7280" }} />
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="overflow-y-auto max-h-[calc(85vh-200px)] p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-brand-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className={`text-center py-12 text-sm ${isLight ? "text-slate-400" : "text-slate-500"}`}>
              No templates found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((template) => {
                const mapData = typeof template.mapData === "string" ? JSON.parse(template.mapData) : template.mapData;
                const nCount = mapData?.nodes?.length ?? template.nodeCount ?? 0;
                const eCount = mapData?.edges?.length ?? template.edgeCount ?? 0;
                return (
                  <div
                    key={template.id}
                    className={`group rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isLight
                        ? "border-slate-200 bg-white hover:border-brand-300/50 hover:shadow-brand-500/5"
                        : "border-slate-700/30 bg-slate-800/30 hover:border-brand-500/30 hover:shadow-brand-500/5"
                    }`}
                    onClick={() => onUseTemplate(template)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ color: CATEGORY_COLORS[template.category] || "#6b7280" }}>
                          {CATEGORY_ICONS[template.category] || CATEGORY_ICONS.architecture}
                        </span>
                        <h3 className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                          {template.name}
                        </h3>
                      </div>
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide capitalize"
                        style={{
                          backgroundColor: (CATEGORY_COLORS[template.category] || "#6b7280") + "20",
                          color: CATEGORY_COLORS[template.category] || "#6b7280",
                        }}
                      >
                        {template.category}
                      </span>
                    </div>
                    <p className={`mt-1.5 text-xs leading-relaxed line-clamp-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      {template.description}
                    </p>
                    <div className={`mt-3 flex items-center gap-3 text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      <span>{nCount} nodes</span>
                      <span>&middot;</span>
                      <span>{eCount} edges</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition text-brand-400 font-semibold text-[11px]">
                        Use Template &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
