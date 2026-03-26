"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "./providers/ThemeProvider";

interface FloatingActionBarProps {
  onHealthDashboard: () => void;
  onYamlEditor: () => void;
  onDiffViewer: () => void;
  onComments: () => void;
  onImport: () => void;
  onTemplates: () => void;
  onCommandPalette: () => void;
  shareMode?: boolean;
}

export function FloatingActionBar({
  onHealthDashboard,
  onYamlEditor,
  onDiffViewer,
  onComments,
  onImport,
  onTemplates,
  onCommandPalette,
  shareMode,
}: FloatingActionBarProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [expanded, setExpanded] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  if (shareMode) return null;

  const btnClass = `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95 ${
    isLight
      ? "text-slate-600 hover:bg-slate-100/80 hover:text-slate-800"
      : "text-slate-300 hover:bg-slate-700/40 hover:text-slate-100"
  }`;

  const actions = [
    {
      label: "Health Dashboard",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      onClick: onHealthDashboard,
      color: "text-emerald-500",
    },
    {
      label: "YAML / Code",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
      onClick: onYamlEditor,
      color: "text-violet-500",
    },
    {
      label: "Diff / Changes",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      onClick: onDiffViewer,
      color: "text-amber-500",
    },
    {
      label: "Comments",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
      onClick: onComments,
      color: "text-blue-500",
    },
    {
      label: "Import",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      onClick: onImport,
      color: "text-cyan-500",
    },
    {
      label: "Templates",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
      onClick: onTemplates,
      color: "text-pink-500",
    },
  ];

  return (
    <div ref={barRef} className="absolute bottom-6 left-6 z-[100]">
      {expanded && (
        <div
          className={`mb-2 rounded-xl border shadow-xl backdrop-blur-xl animate-scale-in overflow-hidden ${
            isLight
              ? "border-slate-200/70 bg-white/95 shadow-black/10"
              : "border-slate-700/40 bg-slate-900/95 shadow-black/30"
          }`}
        >
          <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${isLight ? "text-slate-400 border-b border-slate-200/50" : "text-slate-500 border-b border-slate-700/30"}`}>
            Tools
          </div>
          {actions.map((action) => (
            <button
              key={action.label}
              className={btnClass}
              onClick={() => {
                action.onClick();
                setExpanded(false);
              }}
            >
              <span className={action.color}>{action.icon}</span>
              {action.label}
            </button>
          ))}
          <div className={`border-t ${isLight ? "border-slate-200/50" : "border-slate-700/30"}`}>
            <button
              className={`${btnClass} w-full`}
              onClick={() => {
                onCommandPalette();
                setExpanded(false);
              }}
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Command Palette
              <kbd className={`ml-auto rounded border px-1 py-0.5 text-[9px] ${isLight ? "border-slate-200 bg-slate-100 text-slate-400" : "border-slate-700 bg-slate-800 text-slate-500"}`}>
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200 active:scale-90 ${
          expanded
            ? "bg-brand-500 text-white shadow-brand-500/30 rotate-45"
            : isLight
            ? "bg-white border border-slate-200/70 text-slate-500 hover:text-slate-700 hover:shadow-xl shadow-black/10"
            : "bg-slate-800/90 border border-slate-700/40 text-slate-400 hover:text-slate-200 hover:shadow-xl shadow-black/30"
        }`}
        title="Tools menu"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
