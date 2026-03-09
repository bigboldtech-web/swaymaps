"use client";

import React, { useRef, useState, useEffect } from "react";
import { CanvasToolbar } from "../CanvasToolbar";
import { NotificationCenter } from "../NotificationCenter";
import { PresenceAvatars } from "../PresenceAvatars";
import { useTheme } from "../providers/ThemeProvider";

interface PresenceUser {
  id: string;
  name: string;
  avatarUrl?: string;
  color?: string;
}

interface PinOption {
  id: string;
  label: string;
}

interface DashboardHeaderProps {
  mapName: string;
  onMapNameChange: (name: string) => void;
  onMapNameBlur: (name: string) => void;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  shareMode: boolean;
  // Toolbar
  nodeCount: number;
  edgeCount: number;
  saveStatus: "saved" | "saving" | "unsaved";
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddNode: () => void;
  onFitView: () => void;
  onAutoLayout: (type: "hierarchical" | "radial" | "top-bottom" | "left-right") => void;
  onToggleSearch: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  hasSelection: boolean;
  // Pins
  pinOptions: PinOption[];
  onFocusNode: (id: string) => void;
  // Actions
  aiEnabled: boolean;
  onAiAssist: () => void;
  onShare: () => void;
  activeMapExists: boolean;
  // Presence
  presenceUsers?: PresenceUser[];
  currentUserId?: string;
}

export function DashboardHeader({
  mapName,
  onMapNameChange,
  onMapNameBlur,
  sidebarOpen,
  onOpenSidebar,
  shareMode,
  nodeCount,
  edgeCount,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddNode,
  onFitView,
  onAutoLayout,
  onToggleSearch,
  onDuplicate,
  onDelete,
  hasSelection,
  pinOptions,
  onFocusNode,
  aiEnabled,
  onAiAssist,
  onShare,
  activeMapExists,
  presenceUsers = [],
  currentUserId,
}: DashboardHeaderProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [focusMenuOpen, setFocusMenuOpen] = useState(false);
  const focusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusMenuOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (focusMenuRef.current && target && !focusMenuRef.current.contains(target)) {
        setFocusMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside, true);
    document.addEventListener("touchstart", handleOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleOutside, true);
      document.removeEventListener("touchstart", handleOutside, true);
    };
  }, [focusMenuOpen]);

  return (
    <header className={`relative z-50 flex items-center justify-between border-b px-2 sm:px-4 py-2 backdrop-blur-xl ${isLight ? "border-slate-200/80 bg-[#f1f3f8]/90" : "border-slate-700/30 bg-[#040810]/90"}`}>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {!sidebarOpen && (
          <button
            className={`rounded-lg p-1.5 transition-all duration-200 active:scale-90 ${isLight ? "text-slate-400 hover:bg-slate-200/60 hover:text-slate-700" : "text-slate-500 hover:bg-slate-700/30 hover:text-slate-200"}`}
            onClick={onOpenSidebar}
            title="Open sidebar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <input
          className={`w-28 sm:w-48 border-0 bg-transparent text-base font-semibold outline-none focus:ring-0 lg:w-64 transition-colors duration-200 ${isLight ? "text-slate-800 placeholder:text-slate-400" : "text-slate-100 placeholder:text-slate-600"}`}
          value={mapName}
          disabled={shareMode}
          onChange={(e) => onMapNameChange(e.target.value)}
          onBlur={(e) => {
            const newName = e.target.value.trim();
            if (newName) onMapNameBlur(newName);
          }}
          placeholder="Board name"
        />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
        <CanvasToolbar
          theme={theme}
          nodeCount={nodeCount}
          edgeCount={edgeCount}
          saveStatus={saveStatus}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onAddNode={onAddNode}
          onFitView={onFitView}
          onAutoLayout={onAutoLayout}
          onToggleSearch={onToggleSearch}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          hasSelection={hasSelection}
          shareMode={shareMode}
        />
        {presenceUsers.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            <div className={`w-px h-5 ${isLight ? "bg-slate-300/50" : "bg-slate-700/30"}`} />
            <PresenceAvatars users={presenceUsers} currentUserId={currentUserId} />
          </div>
        )}
        <div className={`w-px h-5 hidden sm:block ${isLight ? "bg-slate-300/50" : "bg-slate-700/30"}`} />
        {pinOptions.length > 0 && (
          <div className="relative z-50 hidden sm:block" ref={focusMenuRef}>
            <button
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${isLight ? "border-slate-300/50 bg-white/60 text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 hover:border-slate-300/70" : "border-slate-700/30 bg-slate-800/20 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 hover:border-slate-600/40"}`}
              onClick={() => setFocusMenuOpen((prev) => !prev)}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              Pins
              <span className={`text-[10px] text-slate-500 transition ${focusMenuOpen ? "rotate-180" : ""}`}>&#9662;</span>
            </button>
            {focusMenuOpen && (
              <div className={`absolute right-0 z-50 mt-2 w-48 rounded-xl border shadow-xl backdrop-blur-xl animate-scale-in will-change-[transform,opacity] overflow-hidden ${isLight ? "border-slate-200/70 bg-white/95 shadow-black/10" : "border-slate-700/40 bg-slate-900/95 shadow-black/30"}`}>
                {pinOptions.map((p) => (
                  <button
                    key={p.id}
                    className={`block w-full px-3 py-2 text-left text-sm transition ${isLight ? "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900" : "text-slate-300 hover:bg-slate-700/30 hover:text-slate-100"}`}
                    onClick={() => { onFocusNode(p.id); setFocusMenuOpen(false); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 ${
            aiEnabled
              ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sky-500/20 hover:shadow-sky-500/40 hover:brightness-110"
              : "bg-slate-700/30 text-slate-500 cursor-not-allowed opacity-60"
          }`}
          onClick={onAiAssist}
          disabled={!aiEnabled}
        >
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="hidden sm:inline">AI Assist</span>
        </button>
        {!shareMode && <NotificationCenter />}
        <button
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-all duration-200 active:scale-95 ${
            !activeMapExists
              ? `cursor-not-allowed opacity-60 ${isLight ? "border-slate-200/50 text-slate-400" : "border-slate-800/30 text-slate-600"}`
              : isLight
              ? "border-slate-300/50 text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 hover:border-slate-300/70"
              : "border-slate-700/30 text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 hover:border-slate-600/40"
          }`}
          onClick={onShare}
          disabled={!activeMapExists}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Share
        </button>
      </div>
    </header>
  );
}
