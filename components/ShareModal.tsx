"use client";

import React, { useState } from "react";
import { useTheme } from "./providers/ThemeProvider";

interface ShareModalProps {
  open: boolean;
  mapName: string;
  ownerName?: string;
  access: "public" | "restricted";
  shareMode?: boolean;
  shareId?: string | null;
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
  shareId,
  onClose,
  onCopyLink,
  onMakePublic,
  onMakeRestricted
}: ShareModalProps) {
  const [embedCopied, setEmbedCopied] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!open) return null;

  const accessHelp = access === "public"
    ? "Anyone with the link can view"
    : "Only invited members can open";

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const embedUrl = shareId ? `${origin}/share/${shareId}` : null;
  const embedCode = embedUrl
    ? `<iframe src="${embedUrl}?embed=true" width="100%" height="600" style="border:none;border-radius:12px;" title="${mapName || "SwayMap"}" loading="lazy"></iframe>`
    : null;

  const handleCopyEmbed = () => {
    if (!embedCode) return;
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-lg max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className={`text-xl font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Share &ldquo;{mapName || "Untitled"}&rdquo;</div>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>Control who can view this board.</p>
          </div>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-full border ${isLight ? "border-slate-300/50 text-slate-400 hover:bg-slate-100/60 hover:text-slate-700" : "border-slate-700/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"} transition`}
            onClick={onClose}
            aria-label="Close share modal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className={`mb-4 rounded-xl border ${isLight ? "border-slate-200/60 bg-white/60" : "border-slate-700/40 bg-slate-800/30"} p-4`}>
          <div className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>People with access</div>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white">
              {(ownerName ?? "Owner").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>{ownerName ?? "Owner"}</div>
              <div className="text-xs text-slate-500">Owner</div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border ${isLight ? "border-slate-200/60 bg-white/60" : "border-slate-700/40 bg-slate-800/30"} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>General access</div>
              <div className="text-xs text-slate-500">{accessHelp}</div>
            </div>
            <select
              className={`rounded-lg border ${isLight ? "border-slate-300/50 bg-white/60 text-slate-700" : "border-slate-700/50 bg-slate-800/30 text-slate-100"} px-3 py-2 text-sm font-semibold outline-none transition focus:border-sky-500/50`}
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

        {/* Embed Code Section */}
        {access === "public" && embedCode && (
          <div className={`mt-4 rounded-xl border ${isLight ? "border-slate-200/60 bg-white/60" : "border-slate-700/40 bg-slate-800/30"} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Embed Code</div>
              <button
                className={`rounded-md border ${isLight ? "border-slate-300/50 text-slate-600 hover:bg-slate-100/60" : "border-slate-700/50 text-slate-300 hover:bg-slate-800/60"} px-3 py-1 text-xs font-medium transition`}
                onClick={handleCopyEmbed}
              >
                {embedCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-xs text-slate-500 mb-2">Paste this into any webpage to embed your map.</div>
            <pre className={`overflow-x-auto rounded-lg ${isLight ? "bg-slate-100/80 border-slate-200/60 text-slate-600" : "bg-slate-900/60 border-slate-700/30 text-slate-400"} border p-3 text-xs font-mono whitespace-pre-wrap break-all select-all`}>
              {embedCode}
            </pre>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            {access === "public" ? "Anyone with the link" : "Restricted"}. View-only; sign in to edit.
          </div>
          <div className="flex gap-2">
            <button
              className={`rounded-lg border ${isLight ? "border-slate-300/50 text-slate-600 hover:bg-slate-100/60" : "border-slate-700/50 text-slate-300 hover:bg-slate-800/60"} px-4 py-2 text-sm font-semibold transition`}
              onClick={onClose}
            >
              Done
            </button>
            <button
              className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40"
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
