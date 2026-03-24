"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Plan = "free" | "pro" | "team";
type SubStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete" | "unknown";

type AdminOverview = {
  counts: { users: number; paidUsers: number; workspaces: number; maps: number; invites: number };
  planBreakdown: Record<Plan, number>;
  subscriptionStats: {
    active: number; past_due: number; canceled: number; trialing: number;
    incomplete: number; unknown: number; mrr: number;
  };
  users: { id: string; name: string; email?: string; plan?: Plan; createdAt?: string }[];
  subscriptions: {
    id: string; userId: string; userName?: string; email?: string;
    plan?: Plan; status?: SubStatus; currentPeriodEnd?: string | null; createdAt?: string;
  }[];
  recentSignups?: number;
  trialCount?: number;
  churnedThisMonth?: number;
  mrrBreakdown?: { proMonthly: number; proAnnual: number; teamMonthly: number; teamAnnual: number };
  fallback?: boolean;
};

function KPICard({ label, value, subtext, color, icon }: {
  label: string; value: string | number; subtext?: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
}

function PlanBar({ breakdown }: { breakdown: Record<Plan, number> }) {
  const total = breakdown.free + breakdown.pro + breakdown.team;
  if (total === 0) return <div className="h-3 bg-slate-800 rounded-full" />;
  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-800">
        {breakdown.free > 0 && (
          <div className="bg-slate-500 transition-all" style={{ width: `${(breakdown.free / total) * 100}%` }} />
        )}
        {breakdown.pro > 0 && (
          <div className="bg-blue-500 transition-all" style={{ width: `${(breakdown.pro / total) * 100}%` }} />
        )}
        {breakdown.team > 0 && (
          <div className="bg-emerald-500 transition-all" style={{ width: `${(breakdown.team / total) * 100}%` }} />
        )}
      </div>
      <div className="flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500" />Free: {breakdown.free}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" />Pro: {breakdown.pro}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Team: {breakdown.team}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-slate-400">Failed to load admin data.</p>;
  }

  const conversionRate = data.counts.users > 0
    ? ((data.counts.paidUsers / data.counts.users) * 100).toFixed(1)
    : "0";

  const churnRate = data.subscriptionStats.active > 0
    ? (((data.churnedThisMonth ?? 0) / data.subscriptionStats.active) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6 max-w-7xl">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Monthly Recurring Revenue"
          value={`$${data.subscriptionStats.mrr.toLocaleString()}`}
          subtext={data.mrrBreakdown ? `Pro: $${data.mrrBreakdown.proMonthly + data.mrrBreakdown.proAnnual} | Team: $${data.mrrBreakdown.teamMonthly + data.mrrBreakdown.teamAnnual}` : undefined}
          color="bg-emerald-500/15 text-emerald-400"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <KPICard
          label="Total Users"
          value={data.counts.users}
          subtext={`${data.counts.paidUsers} paid (${conversionRate}% conversion)`}
          color="bg-blue-500/15 text-blue-400"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
        />
        <KPICard
          label="Active Subscriptions"
          value={data.subscriptionStats.active + data.subscriptionStats.trialing}
          subtext={`${data.subscriptionStats.trialing} trialing | ${data.subscriptionStats.past_due} past due`}
          color="bg-violet-500/15 text-violet-400"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>}
        />
        <KPICard
          label="Churn This Month"
          value={data.churnedThisMonth ?? 0}
          subtext={`${churnRate}% churn rate`}
          color="bg-red-500/15 text-red-400"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" /></svg>}
        />
      </div>

      {/* Plan Breakdown + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Plan Distribution</h3>
          <PlanBar breakdown={data.planBreakdown} />
          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="text-center">
              <p className="text-2xl font-bold">{data.counts.workspaces}</p>
              <p className="text-xs text-slate-500">Workspaces</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.counts.maps}</p>
              <p className="text-xs text-slate-500">Maps Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.recentSignups ?? 0}</p>
              <p className="text-xs text-slate-500">Signups (7d)</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/users" className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
              Manage Users
            </Link>
            <Link href="/admin/billing" className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              View Revenue
            </Link>
            <Link href="/admin/activity" className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Activity Log
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Users + Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Recent Users</h3>
            <Link href="/admin/users" className="text-xs text-brand-400 hover:text-brand-300">View all</Link>
          </div>
          <div className="space-y-2">
            {data.users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-xs font-bold text-brand-300">
                    {user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  user.plan === "team" ? "bg-emerald-500/20 text-emerald-300" :
                  user.plan === "pro" ? "bg-blue-500/20 text-blue-300" :
                  "bg-slate-700 text-slate-400"
                }`}>
                  {user.plan ?? "free"}
                </span>
              </div>
            ))}
            {data.users.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">Active Subscriptions</h3>
            <Link href="/admin/billing" className="text-xs text-brand-400 hover:text-brand-300">View all</Link>
          </div>
          <div className="space-y-2">
            {data.subscriptions.filter(s => s.status === "active" || s.status === "trialing").slice(0, 5).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{sub.userName}</p>
                  <p className="text-xs text-slate-500">{sub.email}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    sub.status === "active" ? "bg-emerald-500/20 text-emerald-300" :
                    sub.status === "trialing" ? "bg-violet-500/20 text-violet-300" :
                    "bg-slate-700 text-slate-400"
                  }`}>
                    {sub.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{sub.plan}</p>
                </div>
              </div>
            ))}
            {data.subscriptions.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No subscriptions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
