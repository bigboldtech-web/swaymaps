"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./providers/ThemeProvider";

type BaseProps = {
  open: boolean;
  title: string;
  message?: string;
  onCancel: () => void;
};

interface InputDialogProps extends BaseProps {
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
}

interface ConfirmDialogProps extends BaseProps {
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

export function InputDialog({
  open,
  title,
  message,
  placeholder,
  initialValue = "",
  confirmLabel = "Save",
  onCancel,
  onConfirm
}: InputDialogProps) {
  const [value, setValue] = useState(initialValue);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-md max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        <div className="mb-4">
          <div className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{title}</div>
          {message && <p className={`mt-1 text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{message}</p>}
        </div>
        <input
          className={`w-full rounded-lg border ${isLight ? "border-slate-300/50 bg-white/60 text-slate-700 placeholder:text-slate-400" : "border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"} px-3 py-2 text-sm outline-none transition focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) onConfirm(value.trim());
            if (e.key === "Escape") onCancel();
          }}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            className={`rounded-lg border ${isLight ? "border-slate-300/50 text-slate-600 hover:bg-slate-100/60" : "border-slate-700/50 text-slate-300 hover:bg-slate-800/60"} px-3 py-2 text-sm font-medium transition`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40 disabled:opacity-50"
            disabled={!value.trim()}
            onClick={() => onConfirm(value.trim())}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  destructive = false,
  onCancel,
  onConfirm
}: ConfirmDialogProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="w-full max-w-md max-sm:max-w-full rounded-2xl glass-panel-solid p-4 sm:p-6 shadow-2xl animate-scale-in">
        <div className="mb-4">
          <div className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{title}</div>
          {message && <p className={`mt-1 text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{message}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className={`rounded-lg border ${isLight ? "border-slate-300/50 text-slate-600 hover:bg-slate-100/60" : "border-slate-700/50 text-slate-300 hover:bg-slate-800/60"} px-3 py-2 text-sm font-medium transition`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
              destructive
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20"
                : "bg-gradient-to-r from-sky-500 to-indigo-500 shadow-sky-500/20 hover:shadow-sky-500/40"
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
