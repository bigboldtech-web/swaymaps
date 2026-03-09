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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenMode = mode === "expand-board" && canExpand ? mode : "new-board";
    await onRun({ prompt: prompt.trim(), mode: chosenMode, mapName: mapName.trim() });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-3xl max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-7 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-slate-500">AI Assistant</div>
            <div className="text-2xl font-semibold leading-snug text-slate-100">Brainstorm a board</div>
            <p className="text-sm text-slate-400">
              Describe what you want. AI will create a fresh board or add structured ideas to the open board.
            </p>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={onClose}
            aria-label="Close AI assistant"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 shadow-sm sm:col-span-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="space-y-1">
                  <div className="text-base font-semibold text-slate-100">Generate a structured map</div>
                  <p className="text-sm text-slate-400">4-9 nodes, relationship labels, and concise notes.</p>
                  <p className="text-xs text-slate-500">People, systems, processes, and actions.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 8v8m-4-4h8" /></svg>
                </div>
                <div className="space-y-1">
                  <div className="text-base font-semibold text-slate-100">Add edges and notes</div>
                  <p className="text-sm text-slate-400">Labels stay concise and action-oriented.</p>
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
                className="rounded-full border border-slate-700/50 bg-slate-800/30 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-700/40"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wide text-slate-500">Prompt</label>
              <span className="text-[11px] text-slate-600">Be specific about outcomes and roles</span>
            </div>
            <textarea
              className="min-h-[140px] w-full rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
              placeholder="e.g. Map out how we launch a new product with marketing, engineering, and support."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-200">Action</div>
                {!canExpand && (
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                    Open a board to expand
                  </span>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-3 rounded-lg border border-slate-700/40 px-3 py-2 cursor-pointer transition hover:bg-slate-700/20">
                  <input
                    type="radio"
                    name="ai-mode"
                    value="new-board"
                    checked={mode === "new-board" || !canExpand}
                    onChange={() => setMode("new-board")}
                    className="h-4 w-4 accent-sky-500"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">Create a new board</span>
                    <span className="text-xs text-slate-500">Starts fresh using your prompt</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-slate-700/40 px-3 py-2 cursor-pointer transition hover:bg-slate-700/20">
                  <input
                    type="radio"
                    name="ai-mode"
                    value="expand-board"
                    checked={mode === "expand-board" && canExpand}
                    onChange={() => setMode("expand-board")}
                    disabled={!canExpand}
                    className="h-4 w-4 accent-sky-500"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">Add ideas to the open board</span>
                    <span className="text-xs text-slate-500">Keeps layout and adds connected nodes</span>
                  </div>
                </label>
              </div>
            </div>
            <div className="space-y-3 rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-200">Board name</div>
                <span className="text-xs text-slate-500">For new boards</span>
              </div>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                placeholder="Launch readiness map"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                disabled={mode === "expand-board" && canExpand}
              />
              <p className="text-xs text-slate-500">Leave empty to let AI suggest a name from the prompt.</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              <svg className="h-4 w-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-600">
              Uses the server OpenAI key or the one you saved in Settings.
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-700/50 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/60"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Thinking...
                  </span>
                ) : "Generate with AI"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
