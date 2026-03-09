"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ImportResult,
  ImportFormat,
  detectFormat,
} from "../lib/importers/index";
import { parseLucidchartCsv } from "../lib/importers/lucidchart";
import { parseDrawioXml } from "../lib/importers/drawio";
import { parseMiroJson } from "../lib/importers/miro";

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (result: ImportResult) => void;
}

const FORMAT_INFO: {
  id: ImportFormat;
  label: string;
  ext: string;
  color: string;
}[] = [
  { id: "lucidchart", label: "Lucidchart", ext: "CSV", color: "#f59e0b" },
  { id: "drawio", label: "Draw.io", ext: "XML", color: "#2192dd" },
  { id: "miro", label: "Miro", ext: "JSON", color: "#fbbf24" },
];

export function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<ImportFormat | null>(
    null
  );
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setFileName(null);
    setDetectedFormat(null);
    setResult(null);
    setError("");
    setImporting(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const processFile = useCallback(async (file: File) => {
    reset();
    setFileName(file.name);

    try {
      const content = await file.text();
      const format = detectFormat(file.name, content);

      if (!format) {
        setError(
          "Unrecognized file format. Please upload a Lucidchart CSV, Draw.io XML, or Miro JSON file."
        );
        return;
      }

      setDetectedFormat(format);

      let parsed: ImportResult;
      switch (format) {
        case "lucidchart":
        case "csv":
          parsed = parseLucidchartCsv(content);
          break;
        case "drawio":
          parsed = parseDrawioXml(content);
          break;
        case "miro":
        case "json":
          parsed = parseMiroJson(content);
          break;
        default:
          setError("Unsupported format");
          return;
      }

      if (parsed.nodes.length === 0 && parsed.edges.length === 0) {
        setError(
          "No nodes or edges found in the file. Please check the file format."
        );
        return;
      }

      setResult(parsed);
    } catch (err: any) {
      setError(err?.message || "Failed to parse file");
    }
  }, [reset]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleImport = useCallback(() => {
    if (!result) return;
    setImporting(true);
    onImport(result);
    handleClose();
  }, [result, onImport, handleClose]);

  if (!open) return null;

  const formatLabel =
    FORMAT_INFO.find((f) => f.id === detectedFormat)?.label ||
    detectedFormat ||
    "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-lg max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Import
            </div>
            <div className="text-lg font-semibold text-slate-100">
              Import from External Tool
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={handleClose}
            aria-label="Close import modal"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Format badges */}
        <div className="mt-3 flex items-center gap-2">
          {FORMAT_INFO.map((fmt) => (
            <span
              key={fmt.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide border ${
                detectedFormat === fmt.id
                  ? "border-brand-500/40 bg-brand-500/20 text-brand-300"
                  : "border-slate-700/40 bg-slate-800/40 text-slate-400"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: fmt.color }}
              />
              {fmt.label}
              <span className="text-[9px] opacity-60">{fmt.ext}</span>
            </span>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
            dragOver
              ? "border-brand-400 bg-brand-500/10"
              : fileName && !error
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-slate-700/50 bg-slate-800/20 hover:border-slate-600/60 hover:bg-slate-800/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xml,.json,.drawio"
            className="hidden"
            onChange={handleFileSelect}
          />
          {fileName && !error ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-200">
                {fileName}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Detected as{" "}
                <span className="font-semibold text-brand-400">
                  {formatLabel}
                </span>
              </p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700/40 text-slate-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-300">
                Drop a file here or click to browse
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                CSV, XML, JSON, or .drawio files
              </p>
            </>
          )}
        </div>

        {/* Preview stats */}
        {result && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-3 text-center">
              <div className="text-2xl font-bold text-slate-100">
                {result.nodes.length}
              </div>
              <div className="text-xs text-slate-400">
                {result.nodes.length === 1 ? "Node" : "Nodes"}
              </div>
            </div>
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-3 text-center">
              <div className="text-2xl font-bold text-slate-100">
                {result.edges.length}
              </div>
              <div className="text-xs text-slate-400">
                {result.edges.length === 1 ? "Edge" : "Edges"}
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {result && result.warnings.length > 0 && (
          <div className="mt-3 max-h-24 overflow-y-auto rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              {result.warnings.length} warning
              {result.warnings.length !== 1 ? "s" : ""}
            </div>
            <ul className="mt-1.5 space-y-0.5">
              {result.warnings.slice(0, 5).map((w, i) => (
                <li key={i} className="text-[11px] text-amber-300/80">
                  {w}
                </li>
              ))}
              {result.warnings.length > 5 && (
                <li className="text-[11px] text-amber-300/60">
                  ...and {result.warnings.length - 5} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3">
          {fileName && (
            <button
              onClick={reset}
              className="rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-800/40 hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-700/50 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/40"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!result || importing}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              result && !importing
                ? "bg-brand-500 text-white hover:bg-brand-400 shadow-lg shadow-brand-500/20"
                : "bg-slate-700/40 text-slate-500 cursor-not-allowed"
            }`}
          >
            {importing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Importing...
              </span>
            ) : (
              `Import${result ? ` ${result.nodes.length} Nodes` : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
