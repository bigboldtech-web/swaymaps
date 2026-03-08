"use client";

import React, { useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

interface CanvasContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
  theme: "light" | "dark";
}

export function CanvasContextMenu({ x, y, items, onClose, theme }: CanvasContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [onClose]);

  // Adjust position if menu would overflow viewport
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      ref.current.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      ref.current.style.top = `${y - rect.height}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={ref}
      className={`fixed z-[100] min-w-[180px] rounded-lg border py-1 shadow-xl ${
        isDark
          ? "border-slate-800 bg-slate-900/95 backdrop-blur text-slate-200"
          : "border-slate-200 bg-white/95 backdrop-blur text-slate-700"
      }`}
      style={{ left: x, top: y }}
    >
      {items.map((item, i) => {
        if (item.divider) {
          return <div key={i} className={`my-1 h-px ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />;
        }
        return (
          <button
            key={i}
            className={`flex w-full items-center justify-between px-3 py-1.5 text-sm transition ${
              item.disabled
                ? "opacity-40 cursor-not-allowed"
                : item.danger
                  ? isDark
                    ? "hover:bg-rose-500/10 text-rose-400"
                    : "hover:bg-rose-50 text-rose-600"
                  : isDark
                    ? "hover:bg-slate-800"
                    : "hover:bg-slate-50"
            }`}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
          >
            <span className="flex items-center gap-2">
              {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
              {item.label}
            </span>
            {item.shortcut && (
              <span className={`ml-4 text-xs ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
