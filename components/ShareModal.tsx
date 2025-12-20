"use client";

import React from "react";

interface ShareModalProps {
  open: boolean;
  mapName: string;
  ownerName?: string;
  access: "public" | "restricted";
  shareMode?: boolean;
  onClose: () => void;
  onCopyLink: () => void;
  onMakePublic: () => void;
  onMakeRestricted: () => void;
}

export function ShareModal({
  open,
  mapName,
  ownerName,
  access,
  shareMode = false,
  onClose,
  onCopyLink,
  onMakePublic,
  onMakeRestricted
}: ShareModalProps) {
  if (!open) return null;

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const shell = isDark
    ? "border-[#0f172a] bg-[#050b15] text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const panel = isDark ? "bg-[#0b1422] border-[#0f172a]" : "bg-slate-50 border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-600";

  const accessLabel = access === "public" ? "Anyone with the link" : "Restricted";
  const accessHelp = access === "public"
    ? "Anyone with the link can view"
    : "Only invited members can open";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4">
      <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${shell}`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Share “{mapName || "Untitled"}”</div>
            <p className={`text-sm ${muted}`}>Control who can view this board.</p>
          </div>
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-semibold transition ${
              isDark
                ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
            onClick={onClose}
            aria-label="Close share modal"
          >
            ✕
          </button>
        </div>

        <div className={`mb-4 rounded-2xl border ${panel} p-4`}>
          <div className="text-sm font-semibold">People with access</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
              {(ownerName ?? "Owner").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold">{ownerName ?? "Owner"}</div>
              <div className={`text-xs ${muted}`}>Owner</div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border ${panel} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">General access</div>
              <div className={`text-xs ${muted}`}>{accessHelp}</div>
            </div>
            <div className="relative">
              <select
                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                  isDark
                    ? "border-slate-800 bg-[#0b1422] text-slate-100"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
                value={access}
                onChange={(e) => {
                  if (shareMode) return;
                  const val = e.target.value;
                  if (val === "public") onMakePublic();
                  else onMakeRestricted();
                }}
                disabled={shareMode}
              >
                <option value="restricted">Restricted</option>
                <option value="public">Anyone with the link (view)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className={`text-xs ${muted}`}>
            {accessLabel}. View-only; sign in to edit.
          </div>
          <div className="flex gap-2">
            <button
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                isDark
                  ? "border-slate-800 text-slate-200 hover:bg-slate-900"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              onClick={onClose}
            >
              Done
            </button>
            <button
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                isDark ? "bg-sky-700 hover:bg-sky-600" : "bg-sky-600 hover:bg-sky-500"
              }`}
              onClick={onCopyLink}
            >
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
