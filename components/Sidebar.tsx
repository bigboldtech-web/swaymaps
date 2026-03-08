"use client";

import React, { useState } from "react";
import { Workspace } from "../types/map";

export interface MapListItem {
  id: string;
  name: string;
  nodeCount: number;
  ownerName?: string;
  ownerUserId?: string;
  publicShareId?: string | null;
  workspaceId?: string;
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
}

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
  theme = "light",
  disabledMapIds = [],
  workspaces = [],
  currentWorkspaceId,
  onSelectWorkspace
}: SidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const isDark = theme === "dark";
  const shellBg = isDark ? "bg-[#050b15]" : "bg-white";

  return (
    <aside
      className={`flex h-screen min-h-screen w-[260px] flex-col border-r ${
        isDark ? "border-slate-900 bg-[#050b15] text-slate-100" : "border-slate-200 bg-white"
      }`}
    >
      <div className={`flex items-center justify-between border-b px-4 py-4 ${isDark ? "border-slate-900" : "border-slate-200"}`}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center">
            <svg viewBox="0 0 48 48" className="h-7 w-7">
              <circle cx="36" cy="8" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
              <circle cx="12" cy="40" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
              <path
                d="M36 8 L22 18 L30 28 L12 40"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-lg font-semibold text-[#0ea5e9]">SwayMaps</div>
        </div>
        <button
          className={`rounded-full border px-2 py-1 text-xs font-semibold transition ${
            isDark ? "border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:border-slate-300"
          }`}
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto px-4 py-3 ${shellBg}`}>
        {workspaces.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              Workspace
            </div>
            <select
              className={`w-full rounded-md border px-3 py-2 text-sm font-semibold outline-none transition ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-100 focus:border-sky-400"
                  : "border-slate-200 bg-white text-slate-900 focus:border-sky-400"
              }`}
              value={currentWorkspaceId ?? ""}
              onChange={(e) => onSelectWorkspace?.(e.target.value)}
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Maps</div>
          <button
            disabled={createDisabled}
            className={`rounded-md border px-2 py-1 text-xs font-semibold shadow-sm transition ${
              isDark
                ? `border-slate-800 text-slate-100 hover:border-slate-700 hover:bg-slate-900 ${createDisabled ? "opacity-50 cursor-not-allowed" : ""}`
                : `border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 ${createDisabled ? "opacity-50 cursor-not-allowed" : ""}`
            }`}
            onClick={onCreateMap}
          >
            + New Map
          </button>
        </div>
        <div className="mb-3">
          <input
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none ${
              isDark
                ? "border-slate-800 bg-slate-900 text-slate-100 focus:border-sky-400"
                : "border-slate-200 bg-white text-slate-900 focus:border-sky-400"
            }`}
            placeholder="Search maps..."
            value={search ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {maps.map((map) => {
            const isActive = map.id === activeMapId;
            const isDisabled = disabledMapIds.includes(map.id);
            const base = isDark
              ? "border-slate-900 bg-slate-900 text-slate-100 hover:border-slate-800"
              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300";
            const active = isDark
              ? "border-sky-500/60 bg-sky-900/30"
              : "border-blue-300 bg-blue-50";
            return (
              <div
                key={map.id}
                className={`relative flex items-center justify-between rounded-lg border px-3 py-2 text-sm shadow-sm transition ${
                  isActive ? active : base
                } ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <button
                  onClick={() => {
                    if (isDisabled) return;
                    onSelectMap(map.id);
                    setOpenMenuId(null);
                  }}
                  className="flex flex-1 flex-col text-left"
                  disabled={isDisabled}
                >
                  <span className={`font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>{map.name}</span>
                  <span className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {map.nodeCount} nodes {map.ownerName ? `• ${map.ownerName}` : ""}
                  </span>
                </button>
                <div className="relative">
                  <button
                    disabled={isDisabled}
                    className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                      isDark
                        ? "border-slate-800 text-slate-100 hover:border-slate-700 hover:bg-slate-900"
                        : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    onClick={() => setOpenMenuId(openMenuId === map.id ? null : map.id)}
                    aria-label={`Menu for ${map.name}`}
                  >
                    ⋯
                  </button>
                  {openMenuId === map.id && !isDisabled && (
                    <div
                      className={`absolute right-0 z-20 mt-1 w-40 rounded-md border shadow-lg ${
                        isDark ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <button
                        className={`block w-full px-3 py-2 text-left text-sm ${
                          isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          onEmbedMap?.(map.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Embed board
                      </button>
                      <button
                        className={`block w-full px-3 py-2 text-left text-sm ${
                          isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          onRename?.(map.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Rename board
                      </button>
                      <button
                        className={`block w-full px-3 py-2 text-left text-sm ${
                          isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          onBoardInvite?.(map.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Invite user
                      </button>
                      <button
                        className={`block w-full px-3 py-2 text-left text-sm ${
                          isDark ? "text-rose-300 hover:bg-rose-500/10" : "text-rose-700 hover:bg-rose-50"
                        }`}
                        onClick={() => {
                          onDeleteMap(map.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete board
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {maps.length === 0 && (
            <div
              className={`rounded-lg border border-dashed px-3 py-4 text-sm ${
                isDark ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
              }`}
            >
              No maps yet. Create one to get started.
            </div>
          )}
        </div>
      </div>

      <div
        className={`border-t px-4 py-4 space-y-3 ${
          isDark ? "border-slate-900 bg-[#050b15] text-slate-100" : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        {planLabel && (
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold">Plan:</div>
            {planLabel === "pro" || planLabel === "team" ? (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                  planLabel === "pro"
                    ? "bg-indigo-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {planLabel}
              </span>
            ) : (
              <span className="text-sm font-semibold">free</span>
            )}
            {onUpgrade && planLabel === "free" && (
              <button
                className="ml-auto text-sm font-semibold text-amber-500 transition hover:text-amber-600"
                onClick={onUpgrade}
              >
                Upgrade
              </button>
            )}
          </div>
        )}
        {(onGlobalSearch || onExport || onImport) && (
          <div className="flex items-center gap-2">
            {onGlobalSearch && (
              <button
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition ${
                  isDark ? "border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={onGlobalSearch}
                title="Search all maps"
              >
                Search All
              </button>
            )}
            {onExport && (
              <button
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition ${
                  isDark ? "border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={onExport}
                title="Export current map"
              >
                Export
              </button>
            )}
            {onImport && (
              <button
                className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition ${
                  isDark ? "border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={onImport}
                title="Import map from JSON"
              >
                Import
              </button>
            )}
          </div>
        )}
        <div className="space-y-2">
          {onTraining && (
            <button
              className={`w-full text-left text-sm font-semibold transition ${
                isDark ? "text-slate-100 hover:text-sky-300" : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={onTraining}
            >
              Training
            </button>
          )}
          {onAdmin && (
            <button
              className={`w-full text-left text-sm font-semibold transition ${
                isDark ? "text-amber-300 hover:text-amber-200" : "text-amber-600 hover:text-amber-700"
              }`}
              onClick={onAdmin}
            >
              Admin panel
            </button>
          )}
          {onSettings && (
            <button
              className={`w-full text-left text-sm font-semibold transition ${
                isDark ? "text-slate-100 hover:text-sky-300" : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={onSettings}
            >
              Settings
            </button>
          )}
          {onMembers && (
            <button
              className={`w-full text-left text-sm font-semibold transition ${
                isDark ? "text-slate-100 hover:text-sky-300" : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={onMembers}
            >
              Members
            </button>
          )}
          {onAuthClick && (
            <button
              className={`w-full text-left text-sm font-semibold transition ${
                authLabel && authLabel.toLowerCase().includes("sign out")
                  ? "text-rose-500 hover:text-rose-600"
                  : isDark
                  ? "text-slate-100 hover:text-sky-300"
                  : "text-slate-700 hover:text-blue-600"
              }`}
              onClick={onAuthClick}
            >
              {authLabel ?? "Sign in/out"}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
