"use client";

import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  if (!open) return null;

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const shell = isDark
    ? "border-[#0f172a] bg-[#050b15] text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const input = isDark
    ? "border-[#0f172a] bg-[#0b1422] text-slate-100 placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-600";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${shell}`}>
        <div className="mb-3">
          <div className="text-lg font-semibold">{title}</div>
          {message && <p className={`text-sm ${subtext}`}>{message}</p>}
        </div>
        <input
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
              isDark
                ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
              isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"
            } disabled:opacity-60`}
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
  if (!open) return null;
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const shell = isDark
    ? "border-[#0f172a] bg-[#050b15] text-slate-100"
    : "border-slate-200 bg-white text-slate-900";
  const subtext = isDark ? "text-slate-400" : "text-slate-600";
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${shell}`}>
        <div className="mb-3">
          <div className="text-lg font-semibold">{title}</div>
          {message && <p className={`text-sm ${subtext}`}>{message}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
              isDark
                ? "border-[#0f172a] text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
              destructive
                ? isDark
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-rose-600 hover:bg-rose-700"
                : isDark
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-slate-900 hover:bg-slate-800"
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
