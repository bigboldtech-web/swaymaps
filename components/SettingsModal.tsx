"use client";

import React from "react";
import { User, Workspace, WorkspaceRole } from "../types/map";

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
}

export function SettingsModal({
  workspace,
  users,
  currentUser,
  workspaces,
  onSelectWorkspace,
  onChangeRole: _onChangeRole,
  onRemove: _onRemove,
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
  onClose
}: SettingsModalProps) {
  const members = workspace?.members ?? [];
  const findUser = (id: string) => users.find((u) => u.id === id);

  const dark = theme === "dark";
  const shell = dark
    ? "bg-[#050b15] text-slate-100 border-[#0f172a]"
    : "bg-white text-slate-900 border-slate-200";
  const panel = dark
    ? "border-[#0f172a] bg-[#0b1422] text-slate-100"
    : "border-slate-200 bg-white text-slate-700";
  const input = dark
    ? "border-[#0f172a] bg-[#09101d] text-slate-100"
    : "border-slate-200 bg-white text-slate-700";
  const chip = dark
    ? "border-[#0f172a] text-slate-100 hover:border-slate-600 hover:bg-slate-800"
    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className={`w-full max-w-3xl rounded-3xl border ${shell} p-6 shadow-2xl`}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Settings
            </div>
            <div className="text-xl font-semibold">
              {workspace?.name ?? "Workspace"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                dark ? "border-[#0f172a] text-slate-100 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <button
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                dark ? "border-[#0f172a] text-slate-100 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              onClick={onToggleGradientEdges}
              aria-label="Toggle edge style"
            >
              {useGradientEdges ? "🌈 Gradient" : "⬜ Solid"}
            </button>
            <button
              className={`h-9 w-9 rounded-full border ${dark ? "border-[#0f172a] text-slate-200 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              onClick={onClose}
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-2xl border ${panel} p-4 space-y-3`}>
            <div className={`flex flex-wrap items-center justify-between gap-2 text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-700"}`}>
              <span>Workspace</span>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${chip} ${
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
                      className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${chip}`}
                      onClick={() => onRenameWorkspace(workspace.id)}
                    >
                      Rename
                    </button>
                    <button
                      className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                        dark
                          ? "border-rose-500 text-rose-200 hover:bg-rose-500/10"
                          : "border-rose-200 text-rose-700 hover:bg-rose-50"
                      }`}
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
                className={`w-full rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${input}`}
                value={workspace?.id ?? ""}
                onChange={(e) => onSelectWorkspace(e.target.value)}
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
              <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                Switch, rename, or create workspaces.
              </p>
            </div>
          </div>

          <div className={`rounded-2xl border ${panel} p-4 space-y-3`}>
            <div className={`text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-700"}`}>Billing & Plan</div>
            <div className={`space-y-2 text-sm ${dark ? "text-slate-200" : "text-slate-700"}`}>
              <div className="font-semibold">
                Current plan: {currentUser?.plan ?? "free"}
              </div>
              <p className={dark ? "text-slate-300" : "text-slate-600"}>
                Upgrade for more maps, seats, and features. Cancel anytime.
              </p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2">
              <button
                className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                onClick={onUpgrade}
              >
                Upgrade plan
              </button>
              <button
                className={`w-full rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  dark
                    ? "border-rose-500 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                    : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
                onClick={onCancelSubscription}
              >
                Cancel subscription
              </button>
            </div>
          </div>

          <div className={`rounded-2xl border ${panel} p-4 space-y-3`}>
            <div className={`flex items-center justify-between text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-700"}`}>
              <span>AI Assistant</span>
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => onToggleAiEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
                {aiEnabled ? "Enabled" : "Disabled"}
              </label>
            </div>
            <div className="space-y-2 text-sm">
              <label className={`text-xs uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>
                OpenAI API Key (kept in your browser)
              </label>
              <input
                type="password"
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
                placeholder="sk-..."
                value={aiKey}
                onChange={(e) => onChangeAiKey(e.target.value)}
                disabled={!aiEnabled}
              />
              <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-600"}`}>
                Paste your key to use AI. If left blank, the workspace uses the server key (if configured).
                Toggle off to avoid sending prompts to OpenAI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
