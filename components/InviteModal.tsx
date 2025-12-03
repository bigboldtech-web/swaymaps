"use client";

import React, { useState } from "react";
import { WorkspaceRole } from "../types/map";

interface InviteModalProps {
  onInvite: (email: string, role: WorkspaceRole) => Promise<void>;
  onClose: () => void;
}

export function InviteModal({ onInvite, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("editor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onInvite(email, role);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Invite</div>
            <div className="text-lg font-semibold text-slate-900">Add a teammate</div>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:border-slate-300"
            onClick={onClose}
            aria-label="Close invite modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Role</label>
            <select
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceRole)}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          {error && <div className="text-sm text-rose-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send invite"}
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500">
          (Demo: invite is stored server-side; new users will need to set a password via signup.)
        </p>
      </div>
    </div>
  );
}
