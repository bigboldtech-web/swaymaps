"use client";

import React, { useState } from "react";
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

type SettingsTab = "general" | "workspace" | "billing" | "ai" | "developer";

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "general",
    label: "General",
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
  },
  {
    id: "billing",
    label: "Billing & Plan",
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
  },
  {
    id: "ai",
    label: "AI Assistant",
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
  },
  {
    id: "developer",
    label: "Developer",
    icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
  },
];

const planBadge = (plan?: string) => {
  if (plan === "team") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (plan === "pro") return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-slate-700/40 text-slate-400 border-slate-600/30";
};

export function SettingsModal({
  workspace,
  users,
  currentUser,
  workspaces,
  onSelectWorkspace,
  onChangeRole,
  onRemove,
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
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const card = `rounded-xl border p-5 ${isLight ? "border-slate-200/60 bg-white/60" : "border-slate-700/30 bg-slate-800/20"}`;
  const label = `text-xs font-medium uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-500"}`;
  const heading = `text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`;
  const desc = `text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`;
  const inputClass = `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 ${isLight ? "border-slate-200/70 bg-white text-slate-800 placeholder:text-slate-400" : "border-slate-700/40 bg-slate-800/40 text-slate-100 placeholder:text-slate-500"}`;
  const btnSecondary = `rounded-lg border px-3 py-2 text-sm font-medium transition ${isLight ? "border-slate-200/60 text-slate-600 hover:bg-slate-100/60 hover:text-slate-800" : "border-slate-700/40 text-slate-300 hover:bg-slate-700/30 hover:text-slate-100"}`;
  const btnDanger = "rounded-lg border border-rose-500/30 px-3 py-2 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10";

  const members = workspace?.members ?? [];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4 animate-fade-in ${isLight ? "bg-black/30" : "bg-black/60"}`}>
      <div className={`w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in ${isLight ? "bg-[#f5f7fb] shadow-black/10" : "bg-[#0a0f1a] shadow-black/40"}`} style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-slate-200/60 bg-white/80" : "border-slate-700/30 bg-slate-900/50"}`}>
          <div className="flex items-center gap-3">
            <svg className={`h-5 w-5 ${isLight ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <h2 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Settings</h2>
          </div>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${isLight ? "text-slate-400 hover:bg-slate-200/60 hover:text-slate-600" : "text-slate-500 hover:bg-slate-700/40 hover:text-slate-200"}`}
            onClick={onClose}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex" style={{ height: "calc(90vh - 65px)" }}>
          {/* Sidebar Tabs */}
          <nav className={`w-52 flex-shrink-0 border-r overflow-y-auto py-3 px-2 ${isLight ? "border-slate-200/60 bg-white/50" : "border-slate-700/30 bg-slate-900/30"}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition mb-0.5 ${
                  activeTab === tab.id
                    ? isLight
                      ? "bg-slate-200/60 text-slate-900"
                      : "bg-slate-700/40 text-white"
                    : isLight
                    ? "text-slate-500 hover:bg-slate-100/60 hover:text-slate-700"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* ── General ── */}
            {activeTab === "general" && (
              <>
                <div>
                  <h3 className={`text-base font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>General</h3>
                  <p className={desc}>Appearance and editor preferences</p>
                </div>

                <div className={card}>
                  <div className={`${label} mb-3`}>Appearance</div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={heading}>Theme</p>
                        <p className={desc}>Switch between light and dark mode</p>
                      </div>
                      <button onClick={onToggleTheme} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${isLight ? "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50" : "border-slate-700/40 bg-slate-800/40 text-slate-300 hover:bg-slate-700/40"}`}>
                        {theme === "dark" ? (
                          <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg> Dark</>
                        ) : (
                          <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg> Light</>
                        )}
                      </button>
                    </div>
                    <div className={`h-px ${isLight ? "bg-slate-200/60" : "bg-slate-700/30"}`} />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={heading}>Edge Style</p>
                        <p className={desc}>Use gradient or solid colors for connections</p>
                      </div>
                      <button onClick={onToggleGradientEdges} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${isLight ? "border-slate-200/60 bg-white text-slate-600 hover:bg-slate-50" : "border-slate-700/40 bg-slate-800/40 text-slate-300 hover:bg-slate-700/40"}`}>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                        {useGradientEdges ? "Gradient" : "Solid"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={card}>
                  <div className={`${label} mb-3`}>Account</div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${isLight ? "bg-brand-100 text-brand-600" : "bg-brand-600/20 text-brand-300"}`}>
                      {currentUser?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className={heading}>{currentUser?.name ?? "User"}</p>
                      <p className={desc}>{currentUser?.email ?? ""}</p>
                    </div>
                    <div className="ml-auto">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${planBadge(currentUser?.plan)}`}>
                        {currentUser?.plan ?? "free"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Workspace ── */}
            {activeTab === "workspace" && (
              <>
                <div>
                  <h3 className={`text-base font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Workspace</h3>
                  <p className={desc}>Manage workspaces and team members</p>
                </div>

                <div className={card}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${label}`}>Current Workspace</div>
                    <div className="flex gap-2">
                      <button className={btnSecondary} onClick={onCreateWorkspace} disabled={workspaceCreateDisabled}>
                        + New
                      </button>
                      {workspace && (
                        <>
                          <button className={btnSecondary} onClick={() => onRenameWorkspace(workspace.id)}>Rename</button>
                          <button className={btnDanger} onClick={() => { if (confirm("Delete this workspace? This cannot be undone.")) onDeleteWorkspace(workspace.id); }}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                  <select
                    className={inputClass}
                    value={workspace?.id ?? ""}
                    onChange={(e) => onSelectWorkspace(e.target.value)}
                  >
                    {workspaces.map((ws) => (
                      <option key={ws.id} value={ws.id}>{ws.name}</option>
                    ))}
                  </select>
                  <p className={`mt-2 ${desc}`}>
                    {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""} total
                    {workspaceCreateDisabled && " — upgrade to create more"}
                  </p>
                </div>

                <div className={card}>
                  <div className={`${label} mb-3`}>Members ({members.length})</div>
                  {members.length === 0 ? (
                    <p className={desc}>No members in this workspace</p>
                  ) : (
                    <div className="space-y-2">
                      {members.map((member) => {
                        const user = users.find((u) => u.id === member.userId);
                        const isCurrentUser = member.userId === currentUser?.id;
                        return (
                          <div key={member.userId} className={`flex items-center gap-3 rounded-lg p-3 ${isLight ? "bg-slate-100/50" : "bg-slate-800/30"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isLight ? "bg-brand-100 text-brand-600" : "bg-brand-600/20 text-brand-300"}`}>
                              {user?.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                                {user?.name ?? "Unknown"} {isCurrentUser && <span className={`text-xs ${isLight ? "text-slate-400" : "text-slate-500"}`}>(you)</span>}
                              </p>
                              <p className={`text-xs truncate ${isLight ? "text-slate-400" : "text-slate-500"}`}>{user?.email}</p>
                            </div>
                            <select
                              className={`rounded-md border px-2 py-1 text-xs font-medium ${isLight ? "border-slate-200/60 bg-white text-slate-600" : "border-slate-700/40 bg-slate-800/40 text-slate-300"}`}
                              value={member.role}
                              onChange={(e) => onChangeRole(member.userId, e.target.value as WorkspaceRole)}
                              disabled={isCurrentUser}
                            >
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                              <option value="viewer">Viewer</option>
                            </select>
                            {!isCurrentUser && (
                              <button
                                className={`rounded-md p-1.5 text-slate-500 transition hover:text-rose-400 ${isLight ? "hover:bg-rose-50" : "hover:bg-rose-500/10"}`}
                                onClick={() => onRemove(member.userId)}
                                title="Remove member"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── Billing & Plan ── */}
            {activeTab === "billing" && (
              <>
                <div>
                  <h3 className={`text-base font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Billing & Plan</h3>
                  <p className={desc}>Manage your subscription and billing</p>
                </div>

                <div className={card}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className={`${label} mb-1`}>Current Plan</div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold capitalize ${planBadge(currentUser?.plan)}`}>
                          {currentUser?.plan ?? "free"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 mb-4 ${isLight ? "bg-slate-100/50" : "bg-slate-800/30"}`}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {currentUser?.plan === "free" ? "3" : "Unlimited"}
                        </p>
                        <p className={desc}>Maps</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {currentUser?.plan === "free" ? "1" : currentUser?.plan === "pro" ? "5" : "Unlimited"}
                        </p>
                        <p className={desc}>Workspaces</p>
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                          {currentUser?.plan === "free" ? "5/mo" : "Unlimited"}
                        </p>
                        <p className={desc}>AI Brainstorms</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:shadow-brand-500/40"
                      onClick={onUpgrade}
                    >
                      Upgrade Plan
                    </button>
                    {currentUser?.plan !== "free" && (
                      <button className={btnDanger} onClick={onCancelSubscription}>
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>

                <div className={card}>
                  <div className={`${label} mb-3`}>Plan Comparison</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${isLight ? "border-slate-200/60" : "border-slate-700/30"}`}>
                          <th className={`text-left py-2 pr-4 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>Feature</th>
                          <th className={`text-center py-2 px-2 font-medium ${isLight ? "text-slate-500" : "text-slate-400"}`}>Free</th>
                          <th className="text-center py-2 px-2 font-medium text-blue-400">Pro</th>
                          <th className="text-center py-2 px-2 font-medium text-emerald-400">Team</th>
                        </tr>
                      </thead>
                      <tbody className={isLight ? "text-slate-600" : "text-slate-300"}>
                        {[
                          ["Maps", "3", "Unlimited", "Unlimited"],
                          ["Workspaces", "1", "5", "Unlimited"],
                          ["AI Brainstorms", "5/mo", "Unlimited", "Unlimited"],
                          ["Team Members", "—", "—", "Unlimited"],
                          ["Version History", "—", "—", "Yes"],
                          ["API Access", "—", "Yes", "Yes"],
                          ["Priority Support", "—", "—", "Yes"],
                        ].map(([feature, free, pro, team]) => (
                          <tr key={feature} className={`border-b ${isLight ? "border-slate-100" : "border-slate-800/30"}`}>
                            <td className="py-2.5 pr-4 text-sm">{feature}</td>
                            <td className="py-2.5 px-2 text-center text-xs">{free}</td>
                            <td className="py-2.5 px-2 text-center text-xs">{pro}</td>
                            <td className="py-2.5 px-2 text-center text-xs">{team}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── AI Assistant ── */}
            {activeTab === "ai" && (
              <>
                <div>
                  <h3 className={`text-base font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>AI Assistant</h3>
                  <p className={desc}>Configure AI-powered features</p>
                </div>

                <div className={card}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={heading}>AI Assistant</p>
                      <p className={desc}>Enable AI brainstorming and map generation</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={aiEnabled}
                        onChange={(e) => onToggleAiEnabled(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className={`h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full ${isLight ? "bg-slate-300 peer-checked:bg-brand-500" : "bg-slate-700 peer-checked:bg-brand-500"}`} />
                      <span className={`text-sm font-medium ${aiEnabled ? "text-brand-400" : isLight ? "text-slate-400" : "text-slate-500"}`}>
                        {aiEnabled ? "On" : "Off"}
                      </span>
                    </label>
                  </div>

                  <div className={`h-px mb-4 ${isLight ? "bg-slate-200/60" : "bg-slate-700/30"}`} />

                  <div className="space-y-2">
                    <div className={label}>OpenAI API Key</div>
                    <input
                      type="password"
                      className={inputClass}
                      placeholder="sk-..."
                      value={aiKey}
                      onChange={(e) => onChangeAiKey(e.target.value)}
                      disabled={!aiEnabled}
                    />
                    <p className={desc}>
                      Your API key is stored locally in your browser and never sent to our servers.
                      If left blank, the workspace uses the server-configured key.
                    </p>
                  </div>
                </div>

                <div className={card}>
                  <div className={`${label} mb-3`}>How AI Works</div>
                  <div className="space-y-3">
                    {[
                      { title: "Brainstorm", desc: "Describe your system and AI generates a full dependency map with nodes and edges." },
                      { title: "Expand", desc: "Select nodes and ask AI to expand them with related components and connections." },
                      { title: "Privacy", desc: "Your map data is only sent to OpenAI when you explicitly trigger an AI action. Toggle off above to fully disable." },
                    ].map((item) => (
                      <div key={item.title} className={`rounded-lg p-3 ${isLight ? "bg-slate-100/50" : "bg-slate-800/30"}`}>
                        <p className={heading}>{item.title}</p>
                        <p className={`mt-0.5 ${desc}`}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── Developer ── */}
            {activeTab === "developer" && (
              <>
                <div>
                  <h3 className={`text-base font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>Developer & Integrations</h3>
                  <p className={desc}>API access, webhooks, and data export</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {onOpenApiKeys && (
                    <button
                      className={`${card} text-left transition hover:border-brand-500/30 group`}
                      onClick={() => { onClose(); onOpenApiKeys(); }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isLight ? "bg-brand-100" : "bg-brand-500/10"}`}>
                        <svg className="h-5 w-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                      </div>
                      <p className={heading}>API Keys</p>
                      <p className={`mt-1 ${desc}`}>Create and manage API keys for programmatic access to your maps.</p>
                    </button>
                  )}

                  {onOpenIntegrations && (
                    <button
                      className={`${card} text-left transition hover:border-brand-500/30 group`}
                      onClick={() => { onClose(); onOpenIntegrations(); }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isLight ? "bg-violet-100" : "bg-violet-500/10"}`}>
                        <svg className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.03a4.5 4.5 0 00-6.364-6.364L4.5 8.25l4.5 4.5" /></svg>
                      </div>
                      <p className={heading}>Slack / Teams</p>
                      <p className={`mt-1 ${desc}`}>Connect webhooks to receive notifications in Slack or Microsoft Teams.</p>
                    </button>
                  )}

                  {onExportAuditLog && (
                    <button
                      className={`${card} text-left transition hover:border-brand-500/30 group`}
                      onClick={onExportAuditLog}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isLight ? "bg-emerald-100" : "bg-emerald-500/10"}`}>
                        <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                      </div>
                      <p className={heading}>Export Audit Log</p>
                      <p className={`mt-1 ${desc}`}>Download a CSV of all workspace activity for compliance and review.</p>
                    </button>
                  )}
                </div>

                <div className={card}>
                  <div className={`${label} mb-3`}>API Documentation</div>
                  <div className={`rounded-lg p-4 font-mono text-xs space-y-1 ${isLight ? "bg-slate-100 text-slate-600" : "bg-slate-800/50 text-slate-400"}`}>
                    <p><span className="text-emerald-400">GET</span> /api/v1/maps</p>
                    <p><span className="text-blue-400">POST</span> /api/v1/maps</p>
                    <p><span className="text-emerald-400">GET</span> /api/v1/maps/:id/nodes</p>
                    <p><span className="text-blue-400">POST</span> /api/v1/maps/:id/nodes</p>
                    <p><span className="text-emerald-400">GET</span> /api/v1/maps/:id/edges</p>
                    <p><span className="text-blue-400">POST</span> /api/v1/maps/:id/edges</p>
                  </div>
                  <p className={`mt-2 ${desc}`}>
                    Authenticate with <code className={`text-xs px-1 py-0.5 rounded ${isLight ? "bg-slate-200 text-slate-600" : "bg-slate-700 text-slate-300"}`}>Authorization: Bearer YOUR_API_KEY</code>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
