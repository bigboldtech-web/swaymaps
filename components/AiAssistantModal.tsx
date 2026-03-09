"use client";

import React, { useEffect, useState } from "react";
import { AiMode } from "../types/ai";
import { useTheme } from "./providers/ThemeProvider";

interface AiAssistantModalProps {
  open: boolean;
  canExpand: boolean;
  loading?: boolean;
  error?: string | null;
  defaultPrompt?: string;
  defaultMapName?: string;
  defaultMode?: AiMode;
  onClose: () => void;
  onRun: (params: { prompt: string; mode: AiMode; mapName?: string }) => Promise<void>;
}

const promptCategories = [
  {
    label: "Strategy",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    prompts: [
      "Map our Q1 growth strategy showing teams, systems, and key milestones",
      "Create a competitive landscape map with our position vs 4 competitors",
      "Map the decision-making flow for a new product launch from idea to GA",
    ],
  },
  {
    label: "Engineering",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    prompts: [
      "Map the microservices architecture: API gateway, auth, payments, notifications",
      "Design a CI/CD pipeline from code commit to production deployment",
      "Map our data flow: ingestion, processing, storage, and analytics layers",
    ],
  },
  {
    label: "Operations",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    prompts: [
      "Map our incident response process: detection, triage, resolution, post-mortem",
      "Design the customer onboarding journey from signup to first value moment",
      "Map vendor dependencies: which teams rely on which external services",
    ],
  },
];

const nodeKindExamples = [
  { kind: "person", color: "#38bdf8", label: "People" },
  { kind: "team", color: "#14b8a6", label: "Teams" },
  { kind: "system", color: "#22c55e", label: "Systems" },
  { kind: "process", color: "#fbbf24", label: "Processes" },
  { kind: "database", color: "#29a5e5", label: "Databases" },
  { kind: "api", color: "#2192dd", label: "APIs" },
  { kind: "vendor", color: "#f97316", label: "Vendors" },
  { kind: "cloud", color: "#8b5cf6", label: "Cloud" },
];

export function AiAssistantModal({
  open,
  canExpand,
  loading = false,
  error,
  defaultPrompt = "",
  defaultMapName = "",
  defaultMode = "new-board",
  onClose,
  onRun
}: AiAssistantModalProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [mode, setMode] = useState<AiMode>(defaultMode);
  const [mapName, setMapName] = useState(defaultMapName);
  const [activeCategory, setActiveCategory] = useState(0);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    if (!open) return;
    setPrompt(defaultPrompt);
    setMapName(defaultMapName);
    setMode(canExpand ? defaultMode : "new-board");
  }, [open, defaultPrompt, defaultMapName, defaultMode, canExpand]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenMode = mode === "expand-board" && canExpand ? mode : "new-board";
    await onRun({ prompt: prompt.trim(), mode: chosenMode, mapName: mapName.trim() });
  };

  const loadingMessages = [
    "Analyzing your prompt...",
    "Identifying key entities...",
    "Mapping dependencies...",
    "Building relationships...",
    "Structuring your board...",
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  useEffect(() => {
    if (!loading) { setLoadingMsgIdx(0); return; }
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % loadingMessages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-3xl max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-7 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-500/20">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className={`text-lg font-bold leading-snug ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                  AI Map Generator
                </div>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  Describe anything — AI builds a structured dependency map with nodes, edges, and notes.
                </p>
              </div>
            </div>
          </div>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${isLight ? "border-slate-300/50 text-slate-400 hover:bg-slate-100/60 hover:text-slate-700" : "border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
            onClick={onClose}
            aria-label="Close AI assistant"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Node Types Preview */}
          <div className={`rounded-xl border p-3 ${isLight ? "border-slate-200/60 bg-white/40" : "border-slate-700/30 bg-slate-800/20"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                AI generates these node types automatically
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {nodeKindExamples.map((nk) => (
                <span
                  key={nk.kind}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${isLight ? "border-slate-200/60 bg-white/60" : "border-slate-700/40 bg-slate-800/30"}`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: nk.color }}
                  />
                  <span className={isLight ? "text-slate-600" : "text-slate-300"}>{nk.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Starter Prompts */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {promptCategories.map((cat, i) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveCategory(i)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    activeCategory === i
                      ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
                      : isLight
                        ? "text-slate-500 hover:bg-slate-100/60 border border-transparent"
                        : "text-slate-400 hover:bg-slate-800/40 border border-transparent"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              {promptCategories[activeCategory].prompts.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                    prompt === example
                      ? "border-brand-500/40 bg-brand-500/10 text-brand-300"
                      : isLight
                        ? "border-slate-200/50 bg-white/50 text-slate-600 hover:border-slate-300 hover:bg-white/70"
                        : "border-slate-700/40 bg-slate-800/20 text-slate-400 hover:border-slate-600 hover:bg-slate-700/30"
                  }`}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-semibold ${isLight ? "text-slate-600" : "text-slate-400"}`}>Your prompt</label>
              <span className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-600"}`}>
                Be specific about roles, systems, and outcomes
              </span>
            </div>
            <textarea
              className={`min-h-[120px] w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 ${isLight ? "border-slate-300/50 bg-white/60 text-slate-700 placeholder:text-slate-400" : "border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-600"}`}
              placeholder="e.g. Map how our payment system works: Stripe handles billing, webhooks notify our API, which updates the database, triggers email via SendGrid, and syncs to our analytics warehouse."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          {/* Mode + Name Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`space-y-2.5 rounded-xl border p-3.5 ${isLight ? "border-slate-200/60 bg-white/60" : "border-slate-700/40 bg-slate-800/30"}`}>
              <div className="flex items-center justify-between">
                <div className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Action</div>
                {!canExpand && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${isLight ? "bg-amber-100/80 border-amber-300/50 text-amber-700" : "bg-amber-500/20 border-amber-500/30 text-amber-300"}`}>
                    Open a board to expand
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <label className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 cursor-pointer transition ${
                  mode === "new-board" || !canExpand
                    ? "border-brand-500/40 bg-brand-500/5"
                    : isLight ? "border-slate-200/60 hover:bg-slate-100/40" : "border-slate-700/40 hover:bg-slate-700/20"
                }`}>
                  <input
                    type="radio"
                    name="ai-mode"
                    value="new-board"
                    checked={mode === "new-board" || !canExpand}
                    onChange={() => setMode("new-board")}
                    className="h-3.5 w-3.5 accent-brand-500"
                  />
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Create new board</span>
                    <span className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>Fresh map from your prompt</span>
                  </div>
                </label>
                <label className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 cursor-pointer transition ${
                  mode === "expand-board" && canExpand
                    ? "border-brand-500/40 bg-brand-500/5"
                    : isLight ? "border-slate-200/60 hover:bg-slate-100/40" : "border-slate-700/40 hover:bg-slate-700/20"
                }`}>
                  <input
                    type="radio"
                    name="ai-mode"
                    value="expand-board"
                    checked={mode === "expand-board" && canExpand}
                    onChange={() => setMode("expand-board")}
                    disabled={!canExpand}
                    className="h-3.5 w-3.5 accent-brand-500"
                  />
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Expand current board</span>
                    <span className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>Add connected nodes to the open map</span>
                  </div>
                </label>
              </div>
            </div>
            <div className={`space-y-2.5 rounded-xl border p-3.5 ${isLight ? "border-slate-200/60 bg-white/60" : "border-slate-700/40 bg-slate-800/30"}`}>
              <div className="flex items-center justify-between">
                <div className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Board name</div>
                <span className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>Optional</span>
              </div>
              <input
                type="text"
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 ${isLight ? "border-slate-300/50 bg-white/60 text-slate-700 placeholder:text-slate-400" : "border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-600"}`}
                placeholder="AI will suggest a name if left empty"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                disabled={mode === "expand-board" && canExpand}
              />
              <div className={`flex items-start gap-2 rounded-lg p-2.5 text-[11px] leading-relaxed ${isLight ? "bg-slate-100/60 text-slate-500" : "bg-slate-800/40 text-slate-500"}`}>
                <svg className="h-3.5 w-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>AI creates 5-9 nodes with rich notes, labeled edges, and automatic color-coding by type.</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${isLight ? "border-rose-300/40 bg-rose-50/80 text-rose-700" : "border-rose-500/30 bg-rose-500/10 text-rose-300"}`}>
              <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={`text-[11px] ${isLight ? "text-slate-400" : "text-slate-600"}`}>
              Powered by OpenAI. Uses your saved key or the server key.
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${isLight ? "border-slate-300/50 text-slate-600 hover:bg-slate-100/60" : "border-slate-700/50 text-slate-300 hover:bg-slate-800/60"}`}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:shadow-brand-500/40 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {loadingMessages[loadingMsgIdx]}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Map
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
