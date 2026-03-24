"use client";

import React, { useEffect, useState, useMemo } from "react";

type Plan = "free" | "pro" | "team";

type User = {
  id: string;
  name: string;
  email?: string;
  plan?: Plan;
  color?: string;
  createdAt?: string;
  isAdmin?: boolean;
};

const planBadge = (plan?: string) => {
  if (plan === "team") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  if (plan === "pro") return "bg-blue-500/20 text-blue-300 border-blue-500/40";
  return "bg-slate-700/50 text-slate-400 border-slate-600";
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [changingPlan, setChangingPlan] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchPlan = planFilter === "all" || (u.plan ?? "free") === planFilter;
      return matchSearch && matchPlan;
    });
  }, [users, search, planFilter]);

  const handlePlanChange = async (userId: string, newPlan: Plan) => {
    setChangingPlan(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
        if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, plan: newPlan });
        setActionMsg(`Plan updated to ${newPlan}`);
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setChangingPlan(false);
  };

  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin: makeAdmin }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAdmin: makeAdmin } : u)));
        if (selectedUser?.id === userId) setSelectedUser({ ...selectedUser, isAdmin: makeAdmin });
        setActionMsg(makeAdmin ? "Admin access granted" : "Admin access revoked");
        setTimeout(() => setActionMsg(""), 3000);
      } else {
        const err = await res.json();
        setActionMsg(err.error ?? "Failed to update admin status");
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const header = "Name,Email,Plan,Created\n";
    const rows = filtered.map((u) =>
      `"${u.name}","${u.email ?? ""}","${u.plan ?? "free"}","${u.createdAt ?? ""}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swaymaps-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Users</h2>
          <p className="text-sm text-slate-400">{users.length} total users</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
          Export CSV
        </button>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-2 rounded-lg">
          {actionMsg}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="team">Team</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-600/30 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0">
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.name}</p>
                          {user.isAdmin && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium">Admin</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${planBadge(user.plan)}`}>
                      {user.plan ?? "free"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-600/30 flex items-center justify-center text-xl font-bold text-brand-300">
                  {selectedUser.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedUser.name}</p>
                  <p className="text-sm text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-800/50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-slate-500">Current Plan</p>
                  <p className="font-medium capitalize">{selectedUser.plan ?? "free"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="font-medium">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">User ID</p>
                  <p className="font-mono text-xs text-slate-400 truncate">{selectedUser.id}</p>
                </div>
              </div>

              {/* Change Plan */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Change Plan</label>
                <div className="flex gap-2">
                  {(["free", "pro", "team"] as Plan[]).map((p) => (
                    <button
                      key={p}
                      disabled={changingPlan || selectedUser.plan === p}
                      onClick={() => handlePlanChange(selectedUser.id, p)}
                      className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                        (selectedUser.plan ?? "free") === p
                          ? "bg-brand-600/20 border-brand-500/50 text-brand-300"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white"
                      } disabled:opacity-50`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Access */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Admin Access</label>
                <button
                  onClick={() => handleToggleAdmin(selectedUser.id, !selectedUser.isAdmin)}
                  className={`w-full py-2.5 text-sm rounded-lg border font-medium transition-colors ${
                    selectedUser.isAdmin
                      ? "bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25"
                      : "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
                  }`}
                >
                  {selectedUser.isAdmin ? "Revoke Admin Access" : "Grant Admin Access"}
                </button>
                <p className="text-[11px] text-slate-600 mt-1.5">
                  {selectedUser.isAdmin
                    ? "This user can access the admin panel and manage all data."
                    : "Granting admin gives full access to the admin panel."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
