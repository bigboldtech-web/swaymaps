"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "./providers/ThemeProvider";

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

export function CanvasContextMenu({ x, y, items, onClose }: CanvasContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme: ctxTheme } = useTheme();
  const isLight = ctxTheme === "light";

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

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.right > window.innerWidth) ref.current.style.left = `${x - rect.width}px`;
    if (rect.bottom > window.innerHeight) ref.current.style.top = `${y - rect.height}px`;
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="fixed z-[100] min-w-[180px] rounded-xl glass-panel-solid py-1 shadow-glass animate-scale-in will-change-[transform,opacity]"
      style={{ left: x, top: y }}
    >
      {items.map((item, i) => {
        if (item.divider) return <div key={i} className={`my-1 h-px ${isLight ? "bg-slate-200/60" : "bg-slate-700/30"}`} />;
        return (
          <button
            key={i}
            className={`flex w-full items-center justify-between px-3 py-1.5 text-sm transition-all duration-150 ${
              item.disabled
                ? "opacity-40 cursor-not-allowed"
                : item.danger
                  ? "text-rose-400 hover:bg-rose-500/10"
                  : isLight
                    ? "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                    : "text-slate-300 hover:bg-slate-700/30 hover:text-slate-100"
            }`}
            disabled={item.disabled}
            onClick={() => { if (!item.disabled) { item.onClick(); onClose(); } }}
          >
            <span className="flex items-center gap-2">
              {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
              {item.label}
            </span>
            {item.shortcut && <span className={`ml-4 text-xs ${isLight ? "text-slate-400" : "text-slate-600"}`}>{item.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );
}
