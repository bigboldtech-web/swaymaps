"use client";

import React, { useEffect, useState, useMemo } from "react";

type MapItem = {
  id: string;
  name: string;
  workspaceId?: string | null;
  workspaceName?: string;
  ownerName?: string;
  nodeCount?: number;
  updatedAt?: string;
};

export default function MapsPage() {
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "nodes" | "name">("updated");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((d) => setMaps(d.maps ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = maps.filter((m) =>
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      m.workspaceName?.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "nodes") result.sort((a, b) => (b.nodeCount ?? 0) - (a.nodeCount ?? 0));
    else if (sortBy === "name") result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    else result.sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());
    return result;
  }, [maps, search, sortBy]);

  const totalNodes = maps.reduce((sum, m) => sum + (m.nodeCount ?? 0), 0);
  const avgNodes = maps.length > 0 ? Math.round(totalNodes / maps.length) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h2 className="text-xl font-bold">Maps</h2>
        <p className="text-sm text-slate-400">{maps.length} maps created</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold">{maps.length}</p>
          <p className="text-xs text-slate-500">Total Maps</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold">{totalNodes.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Total Nodes</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold">{avgNodes}</p>
          <p className="text-xs text-slate-500">Avg Nodes/Map</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search maps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500"
        >
          <option value="updated">Recently Updated</option>
          <option value="nodes">Most Nodes</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Maps Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Map Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nodes</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((map) => (
                <tr key={map.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                      </div>
                      <p className="font-medium">{map.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{map.workspaceName ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-400">{map.ownerName ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{map.nodeCount ?? 0}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {map.updatedAt ? new Date(map.updatedAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">No maps found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
