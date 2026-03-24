"use client";

import React, { useEffect, useState } from "react";

type ActivityItem = {
  id: string;
  action: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  userName?: string;
  metadata?: string;
  createdAt: string;
};

const actionIcon = (action: string) => {
  if (action.includes("create") || action.includes("signup"))
    return <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center"><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></div>;
  if (action.includes("delete") || action.includes("remove"))
    return <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center"><svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></div>;
  if (action.includes("update") || action.includes("edit") || action.includes("change"))
    return <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center"><svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></div>;
  if (action.includes("login") || action.includes("auth"))
    return <div className="w-8 h-8 rounded-full bg-violet-500/15 flex items-center justify-center"><svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg></div>;
  return <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>;
};

function timeAgo(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetch("/api/admin/activity")
      .then((r) => r.json())
      .then((d) => setActivities(d.activities ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterType === "all"
    ? activities
    : activities.filter((a) => a.action.includes(filterType));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Activity Log</h2>
        <p className="text-sm text-slate-400">All user and system activity</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "create", "update", "delete", "login"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              filterType === f
                ? "bg-brand-600/20 text-brand-400 border border-brand-500/30"
                : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-1">
        {filtered.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-slate-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-500">No activity recorded yet</p>
            <p className="text-xs text-slate-600 mt-1">Activity will appear here as users interact with SwayMaps</p>
          </div>
        )}
        {filtered.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
            {actionIcon(activity.action)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{activity.userName ?? "System"}</p>
                <span className="text-xs text-slate-500">{timeAgo(activity.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {activity.action}
                {activity.entityType && <span className="text-slate-500"> on {activity.entityType}</span>}
              </p>
              {activity.metadata && (
                <p className="text-xs text-slate-600 mt-1 font-mono truncate">{activity.metadata}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
