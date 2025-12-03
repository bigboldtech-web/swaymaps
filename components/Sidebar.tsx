import React from "react";
export interface MapListItem {
  id: string;
  name: string;
  nodeCount: number;
  ownerName?: string;
  ownerUserId?: string;
  workspaceId?: string;
}

interface SidebarProps {
  maps: MapListItem[];
  activeMapId: string | null;
  onSelectMap: (id: string) => void;
  onCreateMap: () => void;
  onDeleteMap: (id: string) => void;
  onClose: () => void;
  planLabel?: string;
  onInvite?: () => void;
  onAdmin?: () => void;
  onMembers?: () => void;
  onUpgrade?: () => void;
  authLabel?: string;
  onAuthClick?: () => void;
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
  onAdmin,
  onMembers,
  onUpgrade,
  authLabel,
  onAuthClick
}: SidebarProps) {
  return (
    <aside className="flex h-screen min-h-screen w-[260px] flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Decode Map</div>
          <div className="text-lg font-semibold text-slate-900">Boards</div>
        </div>
        <button
          className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 bg-white">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-700">Maps</div>
          <button
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            onClick={onCreateMap}
          >
            + New Map
          </button>
        </div>
        <div className="space-y-2">
          {maps.map((map) => {
            const isActive = map.id === activeMapId;
            return (
              <div
                key={map.id}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm shadow-sm transition ${isActive ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <button
                  onClick={() => onSelectMap(map.id)}
                  className="flex flex-1 flex-col text-left"
                >
                  <span className="font-semibold text-slate-900">{map.name}</span>
                  <span className="text-xs text-slate-500">
                    {map.nodeCount} nodes {map.ownerName ? `• ${map.ownerName}` : ""}
                  </span>
                </button>
                <button
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                  onClick={() => onDeleteMap(map.id)}
                  aria-label={`Delete ${map.name}`}
                >
                  ✕
                </button>
              </div>
            );
          })}
          {maps.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-sm text-slate-500">
              No maps yet. Create one to get started.
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 py-4 space-y-3">
        {planLabel && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700">Plan: {planLabel}</div>
            {onUpgrade && (
              <button
                className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
                onClick={onUpgrade}
              >
                Upgrade
              </button>
            )}
          </div>
        )}
        <div className="space-y-2">
          {onInvite && (
            <button
              className="w-full text-left text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              onClick={onInvite}
            >
              Invite
            </button>
          )}
          {onAdmin && (
            <button
              className="w-full text-left text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              onClick={onAdmin}
            >
              Admin Panel
            </button>
          )}
          {onMembers && (
            <button
              className="w-full text-left text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              onClick={onMembers}
            >
              Members
            </button>
          )}
          {onAuthClick && (
            <button
              className="w-full text-left text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              onClick={onAuthClick}
            >
              {authLabel ?? "Sign in/out"}
            </button>
          )}
          {onUpgrade && (
            <button
              className="w-full text-left text-sm font-semibold text-amber-700 transition hover:text-amber-800"
              onClick={onUpgrade}
            >
              Upgrade
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
