"use client";

import React from "react";
import { User, Workspace, WorkspaceRole } from "../types/map";
import { useTheme } from "./providers/ThemeProvider";

interface SettingsModalProps {
  workspace: Workspace | null;
  users: User[];
  currentUser?: User | null;
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  onChangeRole: (userId: string, role: WorkspaceRole) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onCreateWorkspace: () => void;
  onRenameWorkspace: (id: string) => void;
  onDeleteWorkspace: (id: string) => void;
  onUpgrade: () => void;
  onCancelSubscription: () => Promise<void>;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  useGradientEdges: boolean;
  onToggleGradientEdges: () => void;
  workspaceCreateDisabled?: boolean;
  aiEnabled: boolean;
  aiKey: string;
  onToggleAiEnabled: (enabled: boolean) => void;
  onChangeAiKey: (key: string) => void;
  onClose: () => void;
  onOpenApiKeys?: () => void;
  onOpenIntegrations?: () => void;
  onExportAuditLog?: () => void;
}

export function SettingsModal({
  workspace,
  currentUser,
  workspaces,
  onSelectWorkspace,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
  onUpgrade,
  onCancelSubscription,
  theme,
  onToggleTheme,
  useGradientEdges,
  onToggleGradientEdges,
  workspaceCreateDisabled = false,
  aiEnabled,
  aiKey,
  onToggleAiEnabled,
  onChangeAiKey,
  onClose,
  onOpenApiKeys,
  onOpenIntegrations,
  onExportAuditLog,
}: SettingsModalProps) {
  const { theme: currentTheme } = useTheme();
  const isLight = currentTheme === "light";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4 animate-fade-in ${isLight ? "bg-black/30" : "bg-black/60"}`}>
      <div className={`w-full max-w-3xl max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto ${isLight ? "shadow-black/10" : ""}`}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Settings
            </div>
            <div className={`text-xl font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {workspace?.name ?? "Workspace"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${isLight ? "border-slate-200/70 text-slate-600 hover:bg-slate-200/40" : "border-slate-700/50 text-slate-300 hover:bg-slate-800/60"}`}
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg> Dark</>
              ) : (
                <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg> Light</>
              )}
            </button>
            <button
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${isLight ? "border-slate-200/70 text-slate-600 hover:bg-slate-200/40" : "border-slate-700/50 text-slate-300 hover:bg-slate-800/60"}`}
              onClick={onToggleGradientEdges}
              aria-label="Toggle edge style"
            >
              {useGradientEdges ? "Gradient Edges" : "Solid Edges"}
            </button>
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${isLight ? "border-slate-200/70 text-slate-400 hover:bg-slate-200/40 hover:text-slate-600" : "border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
              onClick={onClose}
              aria-label="Close settings"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Workspace */}
          <div className={`rounded-xl border p-4 space-y-3 ${isLight ? "border-slate-200/60 bg-white/50" : "border-slate-700/40 bg-slate-800/30"}`}>
            <div className={`flex flex-wrap items-center justify-between gap-2 text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
              <span>Workspace</span>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${isLight ? "border-slate-200/60 text-slate-500 hover:bg-slate-200/40" : "border-slate-700/50 text-slate-300 hover:bg-slate-700/40"} ${
                    workspaceCreateDisabled ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  disabled={workspaceCreateDisabled}
                  onClick={onCreateWorkspace}
                >
                  + New workspace
                </button>
                {workspace && (
                  <>
                    <button
                      className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${isLight ? "border-slate-200/60 text-slate-500 hover:bg-slate-200/40" : "border-slate-700/50 text-slate-300 hover:bg-slate-700/40"}`}
                      onClick={() => onRenameWorkspace(workspace.id)}
                    >
                      Rename
                    </button>
                    <button
                      className="rounded-md border border-rose-500/40 px-2 py-1 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                      onClick={() => {
                        if (confirm("Delete this workspace? This cannot be undone.")) {
                          onDeleteWorkspace(workspace.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <select
                className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 ${isLight ? "border-slate-200/70 bg-white/70 text-slate-700" : "border-slate-700/50 bg-slate-800/30 text-slate-100"}`}
                value={workspace?.id ?? ""}
                onChange={(e) => onSelectWorkspace(e.target.value)}
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-400">
                Switch, rename, or create workspaces.
              </p>
            </div>
          </div>

          {/* Billing */}
          <div className={`rounded-xl border p-4 space-y-3 ${isLight ? "border-slate-200/60 bg-white/50" : "border-slate-700/40 bg-slate-800/30"}`}>
            <div className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Billing & Plan</div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="font-semibold">
                Current plan: <span className="capitalize">{currentUser?.plan ?? "free"}</span>
              </div>
              <p className="text-slate-400">
                Upgrade for more maps, seats, and features. Cancel anytime.
              </p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <button
                className="w-full rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:shadow-brand-500/40"
                onClick={onUpgrade}
              >
                Upgrade plan
              </button>
              <button
                className="w-full rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20"
                onClick={onCancelSubscription}
              >
                Cancel subscription
              </button>
            </div>
          </div>

          {/* AI */}
          <div className={`rounded-xl border p-4 space-y-3 ${isLight ? "border-slate-200/60 bg-white/50" : "border-slate-700/40 bg-slate-800/30"} md:col-span-2`}>
            <div className={`flex items-center justify-between text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
              <span>AI Assistant</span>
              <label className="relative inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => onToggleAiEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-slate-700 peer-checked:bg-brand-500 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                <span className="text-xs font-semibold text-slate-400">
                  {aiEnabled ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>
            <div className="space-y-2 text-sm">
              <label className="text-xs uppercase tracking-wide text-slate-500">
                OpenAI API Key (kept in your browser)
              </label>
              <input
                type="password"
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 ${isLight ? "border-slate-200/70 bg-white/70 text-slate-700 placeholder:text-slate-400" : "border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"}`}
                placeholder="sk-..."
                value={aiKey}
                onChange={(e) => onChangeAiKey(e.target.value)}
                disabled={!aiEnabled}
              />
              <p className="text-xs text-slate-500">
                Paste your key to use AI. If left blank, the workspace uses the server key (if configured).
                Toggle off to avoid sending prompts to OpenAI.
              </p>
            </div>
          </div>

          {/* Developer & Enterprise */}
          <div className={`rounded-xl border p-4 space-y-3 ${isLight ? "border-slate-200/60 bg-white/50" : "border-slate-700/40 bg-slate-800/30"} md:col-span-2`}>
            <div className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Developer & Enterprise</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {onOpenApiKeys && (
                <button
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${isLight ? "border-slate-200/60 text-slate-600 hover:bg-slate-100/60 hover:text-slate-800" : "border-slate-700/50 text-slate-300 hover:bg-slate-700/40 hover:text-slate-100"}`}
                  onClick={() => { onClose(); onOpenApiKeys(); }}
                >
                  <svg className="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                  API Keys
                </button>
              )}
              {onOpenIntegrations && (
                <button
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${isLight ? "border-slate-200/60 text-slate-600 hover:bg-slate-100/60 hover:text-slate-800" : "border-slate-700/50 text-slate-300 hover:bg-slate-700/40 hover:text-slate-100"}`}
                  onClick={() => { onClose(); onOpenIntegrations(); }}
                >
                  <svg className="h-4 w-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.03a4.5 4.5 0 00-6.364-6.364L4.5 8.25l4.5 4.5" /></svg>
                  Slack / Teams
                </button>
              )}
              {onExportAuditLog && (
                <button
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${isLight ? "border-slate-200/60 text-slate-600 hover:bg-slate-100/60 hover:text-slate-800" : "border-slate-700/50 text-slate-300 hover:bg-slate-700/40 hover:text-slate-100"}`}
                  onClick={onExportAuditLog}
                >
                  <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Export Audit Log
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
