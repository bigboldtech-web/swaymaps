"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useTheme } from "./providers/ThemeProvider";
import { SwayMapsIcon } from "./SwayMapsLogo";
import { Workspace } from "../types/map";

export interface MapListItem {
  id: string;
  name: string;
  nodeCount: number;
  edgeCount?: number;
  ownerName?: string;
  ownerUserId?: string;
  publicShareId?: string | null;
  workspaceId?: string;
  updatedAt?: string;
  description?: string;
}

interface SidebarProps {
  maps: MapListItem[];
  activeMapId: string | null;
  onSelectMap: (id: string) => void;
  onCreateMap: () => void;
  onDeleteMap: (id: string) => void;
  onClose: () => void;
  createDisabled?: boolean;
  planLabel?: string;
  onInvite?: () => void;
  onSettings?: () => void;
  authLabel?: string;
  onAuthClick?: () => void;
  onEmbedMap?: (id: string) => void;
  onBoardInvite?: (id: string) => void;
  onUpgrade?: () => void;
  onRename?: (id: string) => void;
  onMembers?: () => void;
  onTraining?: () => void;
  onAdmin?: () => void;
  onGlobalSearch?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  search?: string;
  onSearchChange?: (val: string) => void;
  theme?: "light" | "dark";
  disabledMapIds?: string[];
  workspaces?: Workspace[];
  currentWorkspaceId?: string | null;
  onSelectWorkspace?: (id: string) => void;
  userName?: string;
  userEmail?: string;
}

/* ──────────────────── Helpers ──────────────────── */
function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function planBadge(plan: string) {
  if (plan === "team")
    return <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-emerald-500/20">Team</span>;
  if (plan === "pro")
    return <span className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-600 to-brand-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-brand-500/20">Pro</span>;
  return <span className="inline-flex items-center rounded-full border border-slate-300/50 bg-slate-200/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-400">Free</span>;
}

/* ──────────────────── Sidebar ──────────────────── */
export function Sidebar({
  maps,
  activeMapId,
  onSelectMap,
  onCreateMap,
  onDeleteMap,
  onClose,
  planLabel,
  onInvite,
  onSettings,
  authLabel,
  onAuthClick,
  onEmbedMap,
  onBoardInvite,
  onUpgrade,
  onRename,
  onMembers,
  onTraining,
  onAdmin,
  onGlobalSearch,
  onExport,
  onImport,
  search,
  onSearchChange,
  createDisabled = false,
  disabledMapIds = [],
  workspaces = [],
  currentWorkspaceId,
  onSelectWorkspace,
  userName,
  userEmail,
}: SidebarProps) {
  const { theme: sidebarTheme } = useTheme();
  const isLight = sidebarTheme === "light";
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<HTMLDivElement>(null);

  const currentWs = workspaces.find((w) => w.id === currentWorkspaceId);
  const plan = planLabel ?? "free";

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setWsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sorted maps: active first, then by updatedAt
  const sortedMaps = useMemo(() => {
    return [...maps].sort((a, b) => {
      if (a.id === activeMapId) return -1;
      if (b.id === activeMapId) return 1;
      if (a.updatedAt && b.updatedAt) return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return 0;
    });
  }, [maps, activeMapId]);

  const sharedMaps = useMemo(() => maps.filter((m) => m.publicShareId), [maps]);
  const mapStats = useMemo(() => {
    const totalNodes = maps.reduce((sum, m) => sum + m.nodeCount, 0);
    const totalEdges = maps.reduce((sum, m) => sum + (m.edgeCount ?? 0), 0);
    return { totalNodes, totalEdges, totalMaps: maps.length, shared: sharedMaps.length };
  }, [maps, sharedMaps]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`flex h-screen min-h-screen w-[280px] flex-col border-r select-none fixed inset-y-0 left-0 z-40 transform transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] md:relative md:translate-x-0 ${isLight ? "border-slate-200/70 bg-[#f5f7fb] text-slate-800" : "border-slate-700/20 bg-[#040810] text-slate-100"}`}>

      {/* ───── Brand Header ───── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <SwayMapsIcon size={30} />
        <div className="flex items-center gap-0.5">
          {onGlobalSearch && (
            <button
              className={`rounded-lg p-1.5 transition ${isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-slate-700/30 hover:text-slate-300"}`}
              onClick={onGlobalSearch}
              title="Search everywhere  ⌘K"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
            </button>
          )}
          <button
            className={`rounded-lg p-1.5 transition ${isLight ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600" : "text-slate-500 hover:bg-slate-700/30 hover:text-slate-300"}`}
            onClick={onClose}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ───── Workspace Switcher ───── */}
      {workspaces.length > 0 && (
        <div className="px-3 pb-1 pt-1 relative" ref={wsRef}>
          <button
            className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition ${isLight ? "border-slate-200/60 bg-white/60 hover:bg-white/90 hover:border-slate-300/50" : "border-slate-700/25 bg-slate-800/15 hover:bg-slate-800/30 hover:border-slate-600/30"}`}
            onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold ${isLight ? "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600" : "bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-300"}`}>
              {(currentWs?.name ?? "W").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] font-semibold truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{currentWs?.name ?? "Workspace"}</div>
              <div className={`text-[10px] ${isLight ? "text-slate-400" : "text-slate-500"}`}>{mapStats.totalMaps} maps · {mapStats.totalNodes} nodes</div>
            </div>
            <svg className={`h-3.5 w-3.5 transition-transform ${isLight ? "text-slate-400" : "text-slate-500"} ${wsDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {wsDropdownOpen && (
            <div className={`absolute left-3 right-3 mt-1 rounded-xl ${isLight ? "border border-slate-200 bg-white" : "border border-slate-700/30 bg-[#0a1220]"} shadow-xl shadow-black/40 overflow-hidden animate-scale-in will-change-[transform,opacity] z-30`}>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] transition ${isLight ? "hover:bg-slate-100/80" : "hover:bg-slate-800/40"} ${ws.id === currentWorkspaceId ? (isLight ? "bg-brand-500/[0.06] text-brand-600" : "bg-brand-500/[0.06] text-brand-300") : (isLight ? "text-slate-600" : "text-slate-300")}`}
                  onClick={() => { onSelectWorkspace?.(ws.id); setWsDropdownOpen(false); }}
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${ws.id === currentWorkspaceId ? "bg-brand-500/15 text-brand-400" : (isLight ? "bg-slate-200/60 text-slate-500" : "bg-slate-800/60 text-slate-400")}`}>
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate flex-1">{ws.name}</span>
                  {ws.id === currentWorkspaceId && (
                    <svg className="h-3.5 w-3.5 text-brand-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───── Quick Actions ───── */}
      <div className="px-3 py-2 flex items-center gap-1.5">
        <button
          disabled={createDisabled}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600/90 to-brand-400/90 px-3 py-[7px] text-[12px] font-semibold text-white shadow-lg shadow-brand-500/15 transition hover:shadow-brand-500/25 hover:brightness-110 active:scale-[0.96] transition-all duration-200 ${createDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
          onClick={onCreateMap}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" d="M12 5v14m-7-7h14" /></svg>
          New Map
        </button>
        {onImport && (
          <button
            className={`rounded-lg border p-[7px] transition ${isLight ? "border-slate-200/60 bg-white/60 text-slate-400 hover:bg-white/90 hover:text-slate-600 hover:border-slate-300/50" : "border-slate-700/25 bg-slate-800/15 text-slate-400 hover:bg-slate-800/30 hover:text-slate-300 hover:border-slate-600/30"}`}
            onClick={onImport}
            title="Import (JSON / CSV)"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </button>
        )}
        {onExport && (
          <button
            className={`rounded-lg border p-[7px] transition ${isLight ? "border-slate-200/60 bg-white/60 text-slate-400 hover:bg-white/90 hover:text-slate-600 hover:border-slate-300/50" : "border-slate-700/25 bg-slate-800/15 text-slate-400 hover:bg-slate-800/30 hover:text-slate-300 hover:border-slate-600/30"}`}
            onClick={onExport}
            title="Export map"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
        )}
      </div>

      {/* ───── Search ───── */}
      <div className="px-3 pb-2">
        <div className={`relative rounded-lg border transition-all ${searchFocused ? (isLight ? "border-brand-500/40 ring-1 ring-brand-500/20 bg-white/80" : "border-brand-500/40 ring-1 ring-brand-500/20 bg-slate-800/25") : (isLight ? "border-slate-200/60 bg-white/50" : "border-slate-700/20 bg-slate-800/10")}`}>
          <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className={`w-full bg-transparent pl-8 pr-3 py-[6px] text-[13px] outline-none ${isLight ? "text-slate-700 placeholder:text-slate-400" : "text-slate-200 placeholder:text-slate-600"}`}
            placeholder="Filter maps..."
            value={search ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search && search.length > 0 && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-500 hover:text-slate-300"
              onClick={() => onSearchChange?.("")}
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* ───── Map List ───── */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent" ref={menuRef}>
        <div className="px-1.5 pb-1.5 flex items-center justify-between">
          <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${isLight ? "text-slate-400" : "text-slate-500"}`}>
            Maps{maps.length > 0 ? ` (${maps.length})` : ""}
          </span>
          {sharedMaps.length > 0 && (
            <span className="text-[10px] text-slate-600">
              {sharedMaps.length} shared
            </span>
          )}
        </div>

        <div className="space-y-0.5">
          {sortedMaps.map((map) => {
            const isActive = map.id === activeMapId;
            const isDisabled = disabledMapIds.includes(map.id);
            const isShared = !!map.publicShareId;
            return (
              <div
                key={map.id}
                className={`group relative rounded-lg transition-all duration-200 ${
                  isActive
                    ? (isLight ? "bg-brand-500/[0.06] ring-1 ring-brand-500/10" : "bg-brand-500/[0.08] ring-1 ring-brand-500/15")
                    : (isLight ? "hover:bg-slate-200/40" : "hover:bg-slate-800/25")
                } ${isDisabled ? "opacity-35 cursor-not-allowed" : ""}`}
              >
                <button
                  onClick={() => { if (!isDisabled) { onSelectMap(map.id); setOpenMenuId(null); } }}
                  className="flex w-full items-start gap-2.5 px-2.5 py-2 text-left min-w-0"
                  disabled={isDisabled}
                >
                  {/* Map icon indicator */}
                  <div className={`mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md ${
                    isActive ? "bg-brand-500/15" : (isLight ? "bg-slate-200/60" : "bg-slate-800/40")
                  }`}>
                    <svg className={`h-3.5 w-3.5 ${isActive ? "text-brand-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[13px] font-medium truncate ${isActive ? (isLight ? "text-brand-600" : "text-brand-300") : (isLight ? "text-slate-700" : "text-slate-200")}`}>{map.name}</span>
                      {isShared && (
                        <svg className="h-3 w-3 shrink-0 text-emerald-500/60" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                          <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{map.nodeCount} node{map.nodeCount !== 1 ? "s" : ""}</span>
                      {(map.edgeCount ?? 0) > 0 && (
                        <>
                          <span className={isLight ? "text-slate-300" : "text-slate-700"}>·</span>
                          <span>{map.edgeCount} edge{map.edgeCount !== 1 ? "s" : ""}</span>
                        </>
                      )}
                      {map.updatedAt && (
                        <>
                          <span className={isLight ? "text-slate-300" : "text-slate-700"}>·</span>
                          <span>{timeAgo(map.updatedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>

                {/* Context menu trigger */}
                {!isDisabled && (
                  <div className="absolute right-1.5 top-1.5">
                    <button
                      className={`rounded-md p-1 opacity-0 transition group-hover:opacity-100 ${isLight ? "text-slate-400 hover:bg-slate-200/60 hover:text-slate-600" : "text-slate-600 hover:bg-slate-700/40 hover:text-slate-400"}`}
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === map.id ? null : map.id); }}
                      aria-label={`Menu for ${map.name}`}
                    >
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
                    </button>

                    {openMenuId === map.id && (
                      <div className={`absolute right-0 top-7 z-30 w-48 rounded-xl ${isLight ? "border border-slate-200 bg-white" : "border border-slate-700/30 bg-[#0a1220]"} shadow-2xl shadow-black/50 overflow-hidden animate-scale-in will-change-[transform,opacity]`}>
                        {onRename && (
                          <ContextMenuItem
                            icon={<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>}
                            label="Rename"
                            onClick={() => { onRename(map.id); setOpenMenuId(null); }}
                          />
                        )}
                        {onEmbedMap && (
                          <ContextMenuItem
                            icon={<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>}
                            label="Copy embed code"
                            onClick={() => { onEmbedMap(map.id); setOpenMenuId(null); }}
                          />
                        )}
                        {onBoardInvite && (
                          <ContextMenuItem
                            icon={<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>}
                            label="Invite to board"
                            onClick={() => { onBoardInvite(map.id); setOpenMenuId(null); }}
                          />
                        )}
                        <div className={`my-1 border-t ${isLight ? "border-slate-200/60" : "border-slate-700/20"}`} />
                        <button
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                          onClick={() => { onDeleteMap(map.id); setOpenMenuId(null); }}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {maps.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700/25 px-4 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/20">
                <svg className="h-6 w-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-[13px] font-medium text-slate-400">No maps yet</p>
              <p className="mt-1 text-[11px] text-slate-600">Create your first dependency map</p>
              <button
                onClick={onCreateMap}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 text-[12px] font-medium text-brand-400 transition hover:bg-brand-500/20"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" d="M12 5v14m-7-7h14" /></svg>
                Create map
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ───── Bottom Navigation ───── */}
      <div className={`border-t px-2 pt-2 pb-1 ${isLight ? "border-slate-200/60" : "border-slate-700/15"}`}>
        <div className="space-y-0.5">
          {onMembers && (
            <NavButton
              icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
              label="Members"
              onClick={onMembers}
            />
          )}
          {onTraining && (
            <NavButton
              icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>}
              label="Getting Started"
              onClick={onTraining}
            />
          )}
          {onSettings && (
            <NavButton
              icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              label="Settings"
              onClick={onSettings}
            />
          )}
          {onAdmin && (
            <NavButton
              icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>}
              label="Admin"
              onClick={onAdmin}
              accent
            />
          )}
        </div>
      </div>

      {/* ───── User Profile Footer ───── */}
      <div className={`border-t px-3 py-3 ${isLight ? "border-slate-200/60" : "border-slate-700/15"}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600/80 to-brand-400/80 text-[11px] font-bold text-white">
            {(userName ?? authLabel ?? "U").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-[13px] font-medium truncate ${isLight ? "text-slate-700" : "text-slate-200"}`}>{userName ?? "User"}</span>
              {planLabel && planBadge(plan)}
            </div>
            {userEmail && <div className="text-[11px] text-slate-500 truncate">{userEmail}</div>}
          </div>
          <div className="flex items-center gap-0.5">
            {onUpgrade && plan === "free" && (
              <button
                className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-400 transition hover:bg-amber-500/10 hover:text-amber-300"
                onClick={onUpgrade}
                title="Upgrade plan"
              >
                Upgrade
              </button>
            )}
            {onAuthClick && (
              <button
                className={`rounded-lg p-1.5 text-slate-500 transition ${isLight ? "hover:bg-slate-200/60 hover:text-slate-700" : "hover:bg-slate-800/40 hover:text-slate-300"}`}
                onClick={onAuthClick}
                title={authLabel ?? "Sign out"}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

/* ──────────────────── Sub-components ──────────────────── */

function NavButton({ icon, label, onClick, accent }: { icon: React.ReactNode; label: string; onClick: () => void; accent?: boolean }) {
  const { theme: navTheme } = useTheme();
  const isNavLight = navTheme === "light";
  return (
    <button
      className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13px] transition ${
        accent
          ? "text-amber-400/80 hover:bg-amber-500/[0.06] hover:text-amber-300"
          : isNavLight
            ? "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
            : "text-slate-400 hover:bg-slate-800/25 hover:text-slate-200"
      }`}
      onClick={onClick}
    >
      <span className={`shrink-0 ${isNavLight ? "text-slate-400" : "text-slate-500"}`}>{icon}</span>
      {label}
    </button>
  );
}

function ContextMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const { theme: ctxTheme } = useTheme();
  const isCtxLight = ctxTheme === "light";
  return (
    <button
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition ${isCtxLight ? "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900" : "text-slate-300 hover:bg-slate-800/40 hover:text-slate-100"}`}
      onClick={onClick}
    >
      <span className={isCtxLight ? "text-slate-400" : "text-slate-500"}>{icon}</span>
      {label}
    </button>
  );
}
