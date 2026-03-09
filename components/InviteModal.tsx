"use client";

import React, { useState } from "react";
import { WorkspaceRole } from "../types/map";
import { useTheme } from "./providers/ThemeProvider";

interface InviteModalProps {
  onInvite: (email: string, role: WorkspaceRole) => Promise<void>;
  onClose: () => void;
}

export function InviteModal({ onInvite, onClose }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceRole>("editor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-md max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Invite</div>
            <div className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Add a teammate</div>
          </div>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${isLight ? "border-slate-300/50 text-slate-400 hover:bg-slate-100/60 hover:text-slate-700" : "border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
            onClick={onClose}
            aria-label="Close invite modal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Email</label>
            <input
              type="email"
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 ${isLight ? "border-slate-300/50 bg-white/60 text-slate-700 placeholder:text-slate-400" : "border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500">Role</label>
            <select
              className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm font-semibold outline-none transition focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 ${isLight ? "border-slate-300/50 bg-white/60 text-slate-700" : "border-slate-700/50 bg-slate-800/30 text-slate-100"}`}
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceRole)}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          {error && <div className={`text-sm ${isLight ? "text-rose-600" : "text-rose-400"}`}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:shadow-brand-500/40 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send invite"}
          </button>
        </form>
        <p className={`mt-3 text-xs ${isLight ? "text-slate-400" : "text-slate-600"}`}>
          New users will receive an email to set up their account.
        </p>
      </div>
    </div>
  );
}
