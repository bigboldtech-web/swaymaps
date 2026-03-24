"use client";

import React, { useEffect, useState, useMemo } from "react";

type Workspace = {
  id: string;
  name: string;
  ownerName?: string;
  ownerUserId?: string;
  memberCount: number;
  mapCount: number;
  createdAt?: string;
};

type Invite = {
  id: string;
  email: string;
  workspaceName?: string;
  role?: string;
  expiresAt?: string;
  acceptedAt?: string | null;
  status?: string;
};

const statusBadge = (status?: string) => {
  if (status === "accepted") return "bg-emerald-500/20 text-emerald-300";
  if (status === "pending") return "bg-amber-500/20 text-amber-300";
  return "bg-red-500/20 text-red-300";
};

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"workspaces" | "invites">("workspaces");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((d) => {
        setWorkspaces(d.workspaces ?? []);
        setInvites(d.invites ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredWs = useMemo(() => {
    return workspaces.filter((ws) =>
      !search ||
      ws.name?.toLowerCase().includes(search.toLowerCase()) ||
      ws.ownerName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [workspaces, search]);

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
        <h2 className="text-xl font-bold">Workspaces</h2>
        <p className="text-sm text-slate-400">{workspaces.length} workspaces | {invites.length} invites</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("workspaces")}
          className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
            tab === "workspaces" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          Workspaces ({workspaces.length})
        </button>
        <button
          onClick={() => setTab("invites")}
          className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
            tab === "invites" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          Invites ({invites.length})
        </button>
      </div>

      {tab === "workspaces" && (
        <>
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search workspaces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWs.map((ws) => (
              <div key={ws.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-600/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                    {ws.name?.[0]?.toUpperCase() ?? "W"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{ws.name}</p>
                    <p className="text-xs text-slate-500">by {ws.ownerName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center bg-slate-800/50 rounded-lg py-2">
                    <p className="text-lg font-bold">{ws.memberCount}</p>
                    <p className="text-xs text-slate-500">Members</p>
                  </div>
                  <div className="text-center bg-slate-800/50 rounded-lg py-2">
                    <p className="text-lg font-bold">{ws.mapCount}</p>
                    <p className="text-xs text-slate-500">Maps</p>
                  </div>
                  <div className="text-center bg-slate-800/50 rounded-lg py-2">
                    <p className="text-xs font-medium text-slate-400">{ws.createdAt ? new Date(ws.createdAt).toLocaleDateString() : "—"}</p>
                    <p className="text-xs text-slate-500">Created</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredWs.length === 0 && (
              <p className="text-sm text-slate-500 col-span-full text-center py-8">No workspaces found</p>
            )}
          </div>
        </>
      )}

      {tab === "invites" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {invites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{invite.email}</td>
                    <td className="px-5 py-3 text-slate-400">{invite.workspaceName}</td>
                    <td className="px-5 py-3 capitalize text-slate-400">{invite.role}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(invite.status)}`}>
                        {invite.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {invite.expiresAt ? new Date(invite.expiresAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
                {invites.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">No invites found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
