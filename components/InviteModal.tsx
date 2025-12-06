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

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${shell}`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${muted}`}>Invite</div>
            <div className="text-lg font-semibold">Add a teammate</div>
          </div>
          <button
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
              isDark
                ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
            onClick={onClose}
            aria-label="Close invite modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`text-xs uppercase tracking-wide ${muted}`}>Email</label>
            <input
              type="email"
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={`text-xs uppercase tracking-wide ${muted}`}>Role</label>
            <select
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${input}`}
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceRole)}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          {error && <div className="text-sm text-rose-400">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
              isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"
            } disabled:opacity-60`}
          >
            {loading ? "Sending..." : "Send invite"}
          </button>
        </form>
        <p className={`mt-3 text-xs ${muted}`}>
          (Demo: invite is stored server-side; new users will need to set a password via signup.)
        </p>
      </div>
    </div>
  );
}
