"use client";

import React, { useEffect, useState, useMemo } from "react";

type Plan = "free" | "pro" | "team";
type SubStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete" | "unknown";

type Subscription = {
  id: string; userId: string; userName?: string; email?: string;
  plan?: Plan; status?: SubStatus; currentPeriodEnd?: string | null; createdAt?: string;
};

type OverviewData = {
  subscriptionStats: {
    active: number; past_due: number; canceled: number; trialing: number;
    incomplete: number; unknown: number; mrr: number;
  };
  subscriptions: Subscription[];
  mrrBreakdown?: { proMonthly: number; proAnnual: number; teamMonthly: number; teamAnnual: number };
  churnedThisMonth?: number;
  trialCount?: number;
  activeTrials?: { userId: string; userName: string; email: string; trialEndDate: string | null }[];
};

const statusBadge = (status?: string) => {
  switch (status) {
    case "active": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    case "trialing": return "bg-violet-500/20 text-violet-300 border-violet-500/40";
    case "past_due": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    case "canceled": return "bg-red-500/20 text-red-300 border-red-500/40";
    default: return "bg-slate-700/50 text-slate-400 border-slate-600";
  }
};

export default function BillingPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.subscriptions.filter((s) =>
      statusFilter === "all" || s.status === statusFilter
    );
  }, [data, statusFilter]);

  const handleSubAction = async (subId: string, status: SubStatus, extendDays?: number) => {
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subId, status, extendDays }),
      });
      if (res.ok) {
        const result = await res.json();
        setData((prev) => prev ? {
          ...prev,
          subscriptions: prev.subscriptions.map((s) =>
            s.id === subId ? { ...s, ...result.subscription } : s
          ),
        } : prev);
        setActionMsg(`Subscription updated to ${status}`);
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (!data) return;
    const header = "User,Email,Plan,Status,Period End,Created\n";
    const rows = data.subscriptions.map((s) =>
      `"${s.userName}","${s.email ?? ""}","${s.plan ?? "free"}","${s.status ?? "unknown"}","${s.currentPeriodEnd ?? ""}","${s.createdAt ?? ""}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swaymaps-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data.subscriptionStats;
  const mrr = data.mrrBreakdown;
  const arr = stats.mrr * 12;

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Billing & Revenue</h2>
          <p className="text-sm text-slate-400">Subscription management and revenue analytics</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
          Export CSV
        </button>
      </div>

      {actionMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-2 rounded-lg">
          {actionMsg}
        </div>
      )}

      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">MRR</p>
          <p className="text-2xl font-bold text-emerald-400">${stats.mrr.toLocaleString()}</p>
          {mrr && <p className="text-xs text-slate-500 mt-1">Pro: ${mrr.proMonthly + mrr.proAnnual} | Team: ${mrr.teamMonthly + mrr.teamAnnual}</p>}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">ARR</p>
          <p className="text-2xl font-bold text-blue-400">${arr.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Annualized from MRR</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Active Trials</p>
          <p className="text-2xl font-bold text-violet-400">{data.trialCount ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.trialing} currently trialing</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm text-slate-400">Churned (This Month)</p>
          <p className="text-2xl font-bold text-red-400">{data.churnedThisMonth ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">{stats.past_due} past due</p>
        </div>
      </div>

      {/* Subscription Status Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Subscription Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {([
            { label: "Active", value: stats.active, color: "text-emerald-400" },
            { label: "Trialing", value: stats.trialing, color: "text-violet-400" },
            { label: "Past Due", value: stats.past_due, color: "text-amber-400" },
            { label: "Canceled", value: stats.canceled, color: "text-red-400" },
            { label: "Incomplete", value: stats.incomplete, color: "text-slate-400" },
            { label: "Unknown", value: stats.unknown, color: "text-slate-500" },
          ]).map(({ label, value, color }) => (
            <div key={label} className="text-center bg-slate-800/50 rounded-lg p-3">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Trials */}
      {data.activeTrials && data.activeTrials.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Active Trials</h3>
          <div className="space-y-2">
            {data.activeTrials.map((trial) => (
              <div key={trial.userId} className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{trial.userName}</p>
                  <p className="text-xs text-slate-500">{trial.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Ends: {trial.trialEndDate ? new Date(trial.trialEndDate).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Subscriptions Table */}
      <div className="flex gap-3 items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-brand-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="past_due">Past Due</option>
          <option value="canceled">Canceled</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <span className="text-sm text-slate-500">{filtered.length} subscriptions</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Period End</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium">{sub.userName}</p>
                    <p className="text-xs text-slate-500">{sub.email}</p>
                  </td>
                  <td className="px-5 py-3 capitalize">{sub.plan ?? "free"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusBadge(sub.status)}`}>
                      {sub.status ?? "unknown"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {sub.status !== "active" && (
                        <button onClick={() => handleSubAction(sub.id, "active")} className="text-xs text-emerald-400 hover:text-emerald-300">
                          Activate
                        </button>
                      )}
                      {sub.status !== "canceled" && (
                        <button onClick={() => handleSubAction(sub.id, "canceled")} className="text-xs text-red-400 hover:text-red-300">
                          Cancel
                        </button>
                      )}
                      {sub.status !== "trialing" && (
                        <button onClick={() => handleSubAction(sub.id, "trialing", 14)} className="text-xs text-violet-400 hover:text-violet-300">
                          Grant Trial
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">No subscriptions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
