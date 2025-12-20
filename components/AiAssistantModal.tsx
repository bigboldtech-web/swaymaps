"use client";

import React, { useEffect, useState } from "react";
import { AiMode } from "../types/ai";

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

const starterPrompts = [
  "Map our Q1 growth strategy with systems, people, and workflows",
  "Brainstorm an onboarding journey from signup to activation",
  "Plan a post-incident review board with roles, actions, and tools"
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

  useEffect(() => {
    if (!open) return;
    setPrompt(defaultPrompt);
    setMapName(defaultMapName);
    setMode(canExpand ? defaultMode : "new-board");
  }, [open, defaultPrompt, defaultMapName, defaultMode, canExpand]);

  if (!open) return null;

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const shell = isDark
    ? "border-[#0f172a] bg-[#050b15] text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const input = isDark
    ? "border-[#0f172a] bg-[#0b1422] text-slate-100 placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-600";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenMode = mode === "expand-board" && canExpand ? mode : "new-board";
    await onRun({ prompt: prompt.trim(), mode: chosenMode, mapName: mapName.trim() });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4">
      <div className={`w-full max-w-3xl rounded-3xl border p-7 shadow-2xl ${shell}`}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className={`text-xs uppercase tracking-wide ${muted}`}>AI Assistant</div>
            <div className="text-2xl font-semibold leading-snug">Brainstorm a board</div>
            <p className={`text-sm ${muted}`}>
              Describe what you want. AI will create a fresh board or add structured ideas to the open board.
            </p>
          </div>
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-semibold transition ${
              isDark
                ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
            onClick={onClose}
            aria-label="Close AI assistant"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:col-span-2">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    isDark ? "bg-sky-900 text-sky-200" : "bg-sky-100 text-sky-700"
                  }`}
                >
                  ⚡
                </div>
                <div className="space-y-1">
                  <div className="text-base font-semibold">Generate a structured map</div>
                  <p className={`text-sm ${muted}`}>4–9 nodes, relationship labels, and concise notes.</p>
                  <p className={`text-xs ${muted}`}>People, systems, processes, and actions.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                    isDark ? "bg-emerald-900 text-emerald-200" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  🎯
                </div>
                <div className="space-y-1">
                  <div className="text-base font-semibold">Add edges and notes</div>
                  <p className={`text-sm ${muted}`}>Labels stay concise and action-oriented.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPrompt(example)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  isDark
                    ? "border border-slate-800 bg-[#0b1422] text-slate-200 hover:border-slate-700"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {example}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`text-xs uppercase tracking-wide ${muted}`}>Prompt</label>
              <span className={`text-[11px] ${muted}`}>Be specific about outcomes and roles</span>
            </div>
            <textarea
              className={`min-h-[140px] w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-sky-500 ${input}`}
              placeholder="e.g. Map out how we launch a new product with marketing, engineering, and support."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Action</div>
                {!canExpand && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    Open a board to expand
                  </span>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-3 rounded-xl border px-3 py-2">
                  <input
                    type="radio"
                    name="ai-mode"
                    value="new-board"
                    checked={mode === "new-board" || !canExpand}
                    onChange={() => setMode("new-board")}
                    className="h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">Create a new board</span>
                    <span className={`text-xs ${muted}`}>Starts fresh using your prompt</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-xl border px-3 py-2">
                  <input
                    type="radio"
                    name="ai-mode"
                    value="expand-board"
                    checked={mode === "expand-board" && canExpand}
                    onChange={() => setMode("expand-board")}
                    disabled={!canExpand}
                    className="h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">Add ideas to the open board</span>
                    <span className={`text-xs ${muted}`}>Keeps layout and adds connected nodes</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Board name</div>
                <span className={`text-xs ${muted}`}>For new boards</span>
              </div>
              <input
                type="text"
                className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
                placeholder="Launch readiness map"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                disabled={mode === "expand-board" && canExpand}
              />
              <p className={`text-xs ${muted}`}>Leave empty to let AI suggest a name from the prompt.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={`text-xs ${muted}`}>
              Uses the server OpenAI key or the one you saved in Settings. Toggle AI off in Settings to avoid sending prompts.
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  isDark
                    ? "border-slate-800 text-slate-200 hover:bg-slate-900"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                  isDark ? "bg-sky-700 hover:bg-sky-600" : "bg-sky-600 hover:bg-sky-500"
                } disabled:opacity-60`}
              >
                {loading ? "Thinking..." : "Generate with AI"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
