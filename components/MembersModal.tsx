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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-lg max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Workspace</div>
            <div className="text-lg font-semibold text-slate-100">Members</div>
            <p className="text-sm text-slate-400">{workspace.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {onInvite && (
              <button
                className="rounded-lg border border-slate-700/50 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:bg-slate-800/60"
                onClick={onInvite}
              >
                Invite
              </button>
            )}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
              onClick={onClose}
              aria-label="Close members modal"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {members.map((m) => {
            const user = findUser(m.userId);
            return (
              <div
                key={m.userId}
                className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-800/30 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xs font-bold text-white">
                    {(user?.name ?? m.userId).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">
                      {user?.name ?? m.userId}
                    </div>
                    <div className="text-xs text-slate-500">{user?.email ?? ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-lg border border-slate-700/50 bg-slate-800/30 px-2 py-1 text-xs font-semibold text-slate-200 outline-none transition focus:border-sky-500/50"
                    value={m.role}
                    onChange={(e) => onChangeRole(m.userId, e.target.value as WorkspaceRole)}
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    className="rounded-lg border border-rose-500/40 px-2 py-1 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
                    onClick={() => onRemove(m.userId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700/40 px-3 py-6 text-center text-sm text-slate-500">
              No members yet. Invite your team to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
