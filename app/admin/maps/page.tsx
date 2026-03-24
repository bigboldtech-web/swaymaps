"use client";

import React, { useEffect, useState, useMemo } from "react";

type MapItem = {
  id: string;
  name: string;
  workspaceId?: string | null;
  workspaceName?: string;
  ownerName?: string;
  ownerEmail?: string;
  nodeCount?: number;
  edgeCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function MapsPage() {
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "nodes" | "name" | "created">("updated");
  const [selectedMap, setSelectedMap] = useState<MapItem | null>(null);

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
      m.ownerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      m.workspaceName?.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "nodes") result.sort((a, b) => (b.nodeCount ?? 0) - (a.nodeCount ?? 0));
    else if (sortBy === "name") result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    else if (sortBy === "created") result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    else result.sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());
    return result;
  }, [maps, search, sortBy]);

  const totalNodes = maps.reduce((sum, m) => sum + (m.nodeCount ?? 0), 0);
  const totalEdges = maps.reduce((sum, m) => sum + (m.edgeCount ?? 0), 0);
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
        <h2 className="text-xl font-bold">All Maps</h2>
        <p className="text-sm text-slate-400">Every map created across all users and workspaces</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-blue-400">{maps.length}</p>
          <p className="text-xs text-slate-500">Total Maps</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-emerald-400">{totalNodes.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Total Nodes</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-violet-400">{totalEdges.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Total Edges</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-amber-400">{avgNodes}</p>
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
            placeholder="Search by map name, owner, or workspace..."
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
          <option value="created">Recently Created</option>
          <option value="nodes">Most Nodes</option>
          <option value="name">Name A-Z</option>
        </select>
        <span className="text-sm text-slate-500 self-center">{filtered.length} maps</span>
      </div>

      {/* Maps Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Map</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nodes</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Edges</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Updated</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((map) => (
                <tr key={map.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                      </div>
                      <p className="font-medium">{map.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-slate-300">{map.ownerName ?? "—"}</p>
                    <p className="text-xs text-slate-500">{map.ownerEmail ?? ""}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{map.workspaceName ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded-full">{map.nodeCount ?? 0}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded-full">{map.edgeCount ?? 0}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {map.updatedAt ? new Date(map.updatedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelectedMap(map)}
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">No maps found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Detail Modal */}
      {selectedMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMap(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Map Details</h3>
              <button onClick={() => setSelectedMap(null)} className="text-slate-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedMap.name}</p>
                  <p className="text-sm text-slate-400">{selectedMap.workspaceName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-800/50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-slate-500">Owner</p>
                  <p className="font-medium">{selectedMap.ownerName}</p>
                  <p className="text-xs text-slate-500">{selectedMap.ownerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Workspace</p>
                  <p className="font-medium">{selectedMap.workspaceName ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nodes</p>
                  <p className="font-medium text-blue-400">{selectedMap.nodeCount ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Edges</p>
                  <p className="font-medium text-violet-400">{selectedMap.edgeCount ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="font-medium">{selectedMap.createdAt ? new Date(selectedMap.createdAt).toLocaleDateString() : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="font-medium">{selectedMap.updatedAt ? new Date(selectedMap.updatedAt).toLocaleDateString() : "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Map ID</p>
                  <p className="font-mono text-xs text-slate-400 break-all">{selectedMap.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
