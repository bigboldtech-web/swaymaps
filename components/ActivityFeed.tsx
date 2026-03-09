"use client";

import React, { useState, useEffect } from "react";

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

interface ActivityFeedProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string | null;
}

export function ActivityFeed({ open, onClose, workspaceId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !workspaceId) return;
    setLoading(true);
    fetch(`/api/activity?workspaceId=${workspaceId}`)
      .then((res) => res.json())
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [open, workspaceId]);

  if (!open) return null;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const actionLabel = (action: string, entityType: string) => {
    const labels: Record<string, string> = {
      "create:map": "created a map",
      "update:map": "updated a map",
      "delete:map": "deleted a map",
      "create:node": "added a node",
      "delete:node": "removed a node",
      "create:edge": "connected nodes",
      "invite:member": "invited a member",
      "remove:member": "removed a member",
      "comment:note": "commented on a note",
      "share:map": "shared a map",
    };
    return labels[`${action}:${entityType}`] ?? `${action} ${entityType}`;
  };

  const actionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <path strokeLinecap="round" d="M12 4v16m-8-8h16" />;
      case "update":
        return <path strokeLinecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />;
      case "delete":
        return <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />;
      case "invite":
        return <path strokeLinecap="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />;
      case "comment":
        return <path strokeLinecap="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />;
      default:
        return <circle cx="12" cy="12" r="3" />;
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-sm border-l border-slate-700/30 bg-[#050b15]/95 backdrop-blur-xl shadow-2xl animate-slide-in-right overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">Activity</div>
              <div className="text-[11px] text-slate-500">{activities.length} event{activities.length !== 1 ? "s" : ""}</div>
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/50 text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
            onClick={onClose}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-sky-500" />
              <span className="text-xs text-slate-500">Loading activity...</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/30 bg-slate-800/40 text-slate-500">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-slate-400">No activity yet</div>
              <p className="mt-1 text-xs text-slate-600">Workspace activity will appear here.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg p-2 transition hover:bg-slate-800/30">
                  {/* Avatar */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-[10px] font-bold text-white">
                    {getInitials(a.user.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-slate-100">{a.user.name}</span>{" "}
                      {actionLabel(a.action, a.entityType)}
                    </p>
                    <span className="text-[11px] text-slate-600">{formatTime(a.createdAt)}</span>
                  </div>

                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-700/30 bg-slate-800/30 text-slate-500">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      {actionIcon(a.action)}
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
