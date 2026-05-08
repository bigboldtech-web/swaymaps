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
  onSidekick?: () => void;
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
  onSidekick,
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
    <header className="relative z-50 flex h-12 items-center justify-between border-b border-border bg-bg px-3 sm:px-4">
      <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
        {!sidebarOpen && (
          <button
            className="rounded-xs p-1 text-fg-subtle hover:bg-bg-muted hover:text-fg transition-colors"
            onClick={onOpenSidebar}
            title="Open sidebar"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <input
          className="w-28 sm:w-48 lg:w-64 border-0 bg-transparent text-sm font-medium text-fg outline-none focus:ring-0 placeholder:text-fg-subtle"
          value={mapName}
          disabled={shareMode}
          onChange={(e) => onMapNameChange(e.target.value)}
          onBlur={(e) => {
            const newName = e.target.value.trim();
            if (newName) onMapNameBlur(newName);
          }}
          placeholder="Untitled map"
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
            <div className="w-px h-4 bg-border" />
            <PresenceAvatars users={presenceUsers} currentUserId={currentUserId} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {pinOptions.length > 0 && (
          <div className="w-px h-4 hidden sm:block bg-border" />
        )}
        {pinOptions.length > 0 && (
          <div className="relative z-50 hidden sm:block" ref={focusMenuRef}>
            <button
              className="flex items-center gap-1.5 rounded-sm border border-border bg-panel px-2 py-1 text-xs font-medium text-fg hover:bg-bg-muted transition-colors"
              onClick={() => setFocusMenuOpen((prev) => !prev)}
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              Pins
              <span className={`text-[10px] text-fg-subtle transition ${focusMenuOpen ? "rotate-180" : ""}`}>&#9662;</span>
            </button>
            {focusMenuOpen && (
              <div className="absolute right-0 z-50 mt-1 w-48 rounded-md border border-border bg-panel shadow-overlay overflow-hidden">
                {pinOptions.map((p) => (
                  <button
                    key={p.id}
                    className="block w-full px-2.5 py-1.5 text-left text-sm text-fg hover:bg-bg-muted transition-colors"
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
          className={`flex items-center gap-1.5 rounded-sm px-2.5 h-7 text-xs font-medium transition-colors ${
            aiEnabled
              ? "bg-bg-muted text-fg hover:bg-border"
              : "bg-bg-muted text-fg-disabled cursor-not-allowed"
          }`}
          onClick={onAiAssist}
          disabled={!aiEnabled}
        >
          <svg className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="hidden sm:inline">Assist</span>
        </button>
        {onSidekick && (
          <button
            className={`flex items-center gap-1.5 rounded-sm px-2.5 h-7 text-xs font-medium transition-colors ${
              activeMapExists
                ? "bg-accent text-accent-fg hover:bg-accent-hover"
                : "bg-bg-muted text-fg-disabled cursor-not-allowed"
            }`}
            onClick={onSidekick}
            disabled={!activeMapExists}
            title="Sidekick · ⌘J"
          >
            <svg className="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>
            <span className="hidden sm:inline">Sidekick</span>
          </button>
        )}
        {!shareMode && <NotificationCenter />}
        <button
          className={`flex items-center gap-1.5 rounded-sm h-7 px-2.5 text-xs font-medium transition-colors ${
            !activeMapExists
              ? "bg-bg-muted text-fg-disabled cursor-not-allowed"
              : "bg-accent text-accent-fg hover:bg-accent-hover"
          }`}
          onClick={onShare}
          disabled={!activeMapExists}
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Share
        </button>
      </div>
    </header>
  );
}
