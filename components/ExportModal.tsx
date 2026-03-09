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
    { id: "png" as const, label: "PNG Image", desc: "High-res raster image. Best for presentations.", icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>, pro: true },
    { id: "svg" as const, label: "SVG Vector", desc: "Scalable vector. Best for print & embedding.", icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, pro: true },
    { id: "pdf" as const, label: "PDF Document", desc: "Portable document. Best for sharing & archiving.", icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z" /><path d="M14 4v5h5" /></svg>, pro: true },
    { id: "json" as const, label: "JSON Data", desc: "Raw map data. Import into another workspace.", icon: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, pro: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-md max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Export</div>
            <div className="text-lg font-semibold text-slate-100">Export &quot;{mapName}&quot;</div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={onClose}
            aria-label="Close export modal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              className={`w-full rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 text-left transition hover:border-sky-500/30 hover:bg-slate-800/50 ${
                !isPro && fmt.pro ? "opacity-50" : ""
              }`}
              onClick={() => handleExport(fmt.id)}
              disabled={loading !== null}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/40 text-sky-400">
                  {fmt.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">{fmt.label}</span>
                    {!isPro && fmt.pro && (
                      <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-300 border border-sky-500/30">
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{fmt.desc}</p>
                </div>
                {loading === fmt.id && (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
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
