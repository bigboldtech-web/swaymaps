"use client";

import React from "react";
import { User, Workspace, WorkspaceRole } from "../types/map";

interface MembersModalProps {
  workspace: Workspace;
  users: User[];
  onChangeRole: (userId: string, role: WorkspaceRole) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onClose: () => void;
}

export function MembersModal({
  workspace,
  users,
  onChangeRole,
  onRemove,
  onClose
}: MembersModalProps) {
  const members = workspace.members;

  const findUser = (id: string) => users.find((u) => u.id === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Workspace</div>
            <div className="text-lg font-semibold text-slate-900">Members</div>
            <p className="text-sm text-slate-600">{workspace.name}</p>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:border-slate-300"
            onClick={onClose}
            aria-label="Close members modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {members.map((m) => {
            const user = findUser(m.userId);
            return (
              <div
                key={m.userId}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {user?.name ?? m.userId}
                  </div>
                  <div className="text-xs text-slate-500">{user?.email ?? ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                    value={m.role}
                    onChange={(e) => onChangeRole(m.userId, e.target.value as WorkspaceRole)}
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    className="rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    onClick={() => onRemove(m.userId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
              No members yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
