"use client";

import React, { useState } from "react";

interface ExportModalProps {
  mapName: string;
  onExport: (format: "png" | "svg" | "pdf" | "json") => Promise<void>;
  onClose: () => void;
  isPro: boolean;
}

export function ExportModal({ mapName, onExport, onClose, isPro }: ExportModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const handleExport = async (format: "png" | "svg" | "pdf" | "json") => {
    if (!isPro && format !== "json") {
      setError("Export to PNG/SVG/PDF requires a Pro or Team plan.");
      return;
    }
    setError("");
    setLoading(format);
    try {
      await onExport(format);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Export failed");
    } finally {
      setLoading(null);
    }
  };

  const formats = [
    { id: "png" as const, label: "PNG Image", desc: "High-res raster image. Best for presentations.", icon: "🖼️", pro: true },
    { id: "svg" as const, label: "SVG Vector", desc: "Scalable vector. Best for print & embedding.", icon: "✏️", pro: true },
    { id: "pdf" as const, label: "PDF Document", desc: "Portable document. Best for sharing & archiving.", icon: "📄", pro: true },
    { id: "json" as const, label: "JSON Data", desc: "Raw map data. Import into another workspace.", icon: "📋", pro: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
          isDark ? "border-[#0f172a] bg-[#050b15] text-slate-100" : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xs uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>Export</div>
            <div className="text-lg font-semibold">Export &quot;{mapName}&quot;</div>
          </div>
          <button
            className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
              isDark
                ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              className={`w-full rounded-xl border p-4 text-left transition ${
                isDark
                  ? "border-slate-800 bg-[#0b1422] hover:border-sky-500/30 hover:bg-[#0d1a2f]"
                  : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50"
              } ${!isPro && fmt.pro ? "opacity-60" : ""}`}
              onClick={() => handleExport(fmt.id)}
              disabled={loading !== null}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{fmt.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      {fmt.label}
                    </span>
                    {!isPro && fmt.pro && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        isDark ? "bg-sky-500/20 text-sky-300" : "bg-sky-100 text-sky-700"
                      }`}>
                        Pro
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{fmt.desc}</p>
                </div>
                {loading === fmt.id && (
                  <div className={`h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${
                    isDark ? "border-sky-400" : "border-sky-500"
                  }`} />
                )}
              </div>
            </button>
          ))}
        </div>

        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}
      </div>
    </div>
  );
}
