"use client";

import React from "react";
import { User, Workspace, WorkspaceRole } from "../types/map";

interface MembersModalProps {
  workspace: Workspace;
  users: User[];
  onChangeRole: (userId: string, role: WorkspaceRole) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onInvite?: () => void;
  onClose: () => void;
}

export function MembersModal({
  workspace,
  users,
  onChangeRole,
  onRemove,
  onInvite,
  onClose
}: MembersModalProps) {
  const members = workspace.members;

  const findUser = (id: string) => users.find((u) => u.id === id);

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const shell = isDark
    ? "border-[#0f172a] bg-[#050b15] text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const panel = isDark
    ? "border-[#0f172a] bg-[#0b1422]"
    : "border-slate-200 bg-white";
  const sub = isDark ? "text-slate-400" : "text-slate-600";
  const input = isDark
    ? "border-[#0f172a] bg-[#09101d] text-slate-100"
    : "border-slate-200 bg-white text-slate-700";
  const removeBtn = isDark
    ? "border-rose-500 text-rose-200 hover:bg-rose-500/10"
    : "border-rose-200 text-rose-700 hover:bg-rose-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${shell}`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${sub}`}>Workspace</div>
            <div className="text-lg font-semibold">Members</div>
            <p className={`text-sm ${sub}`}>{workspace.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {onInvite && (
              <button
                className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                  isDark
                    ? "border-[#0f172a] text-slate-100 hover:bg-slate-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
                onClick={onInvite}
              >
                Invite
              </button>
            )}
            <button
              className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                isDark
                  ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
              onClick={onClose}
              aria-label="Close members modal"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {members.map((m) => {
            const user = findUser(m.userId);
            return (
              <div
                key={m.userId}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 ${panel}`}
              >
                <div>
                  <div className="text-sm font-semibold">
                    {user?.name ?? m.userId}
                  </div>
                  <div className={`text-xs ${sub}`}>{user?.email ?? ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className={`rounded-md border px-2 py-1 text-xs font-semibold ${input}`}
                    value={m.role}
                    onChange={(e) => onChangeRole(m.userId, e.target.value as WorkspaceRole)}
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${removeBtn}`}
                    onClick={() => onRemove(m.userId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className={`rounded-lg border border-dashed px-3 py-4 text-sm ${isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
              No members yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
