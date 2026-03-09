"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "../providers/ThemeProvider";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hideClose?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  hideClose = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in will-change-[opacity]"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`w-full ${sizeClasses[size]} max-sm:max-w-full glass-panel-solid rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto will-change-[transform,opacity]`}
      >
        {(title || !hideClose) && (
          <div className={`flex items-center justify-between border-b px-6 py-4 ${isLight ? "border-slate-200/60" : "border-slate-700/40"}`}>
            <div>
              {title && (
                <h2 className={`text-lg font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{title}</h2>
              )}
              {description && (
                <p className={`mt-0.5 text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{description}</p>
              )}
            </div>
            {!hideClose && (
              <button
                onClick={onClose}
                className={`rounded-lg p-1.5 transition-all duration-200 active:scale-90 ${isLight ? "text-slate-400 hover:bg-slate-200/60 hover:text-slate-700" : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
