"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Plan = "free" | "pro" | "team";
type SubStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete" | "unknown";

type AdminOverview = {
  counts: { users: number; paidUsers: number; workspaces: number; maps: number; invites: number };
  planBreakdown: Record<Plan, number>;
  subscriptionStats: {
    active: number;
    past_due: number;
    canceled: number;
    trialing: number;
    incomplete: number;
    unknown: number;
    mrr: number;
  };
  users: {
    id: string;
    name: string;
    email?: string;
    plan?: Plan;
    color?: string;
    createdAt?: string;
  }[];
  workspaces: {
    id: string;
    name: string;
    ownerName?: string;
    ownerUserId?: string;
    memberCount: number;
    mapCount: number;
    createdAt?: string;
  }[];
  maps: {
    id: string;
    name: string;
    workspaceId?: string | null;
    workspaceName?: string;
    ownerName?: string;
    nodeCount?: number;
    updatedAt?: string;
  }[];
  invites: {
    id: string;
    email: string;
    workspaceName?: string;
    role?: string;
    expiresAt?: string;
    acceptedAt?: string | null;
    status?: string;
  }[];
  subscriptions: {
    id: string;
    userId: string;
    userName?: string;
    email?: string;
    plan?: Plan;
    status?: SubStatus;
    currentPeriodEnd?: string | null;
    createdAt?: string;
  }[];
  trialCount?: number;
  activeTrials?: {
    userId: string;
    userName: string;
    email: string;
    trialEndDate: string | null;
  }[];
  recentSignups?: number;
  mrrBreakdown?: {
    proMonthly: number;
    proAnnual: number;
    teamMonthly: number;
    teamAnnual: number;
  };
  churnedThisMonth?: number;
  fallback?: boolean;
  generatedAt?: string;
};

const swatches = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#6b7280"];

const planClassName = (plan?: Plan | string) => {
  if (plan === "team") return "bg-emerald-500/20 text-emerald-100 border border-emerald-500/60";
  if (plan === "pro") return "bg-indigo-500/20 text-indigo-100 border border-indigo-500/60";
  return "bg-slate-800 text-slate-100 border border-slate-700";
};

const statusClassName = (status?: SubStatus) => {
  switch (status) {
    case "active":
      return "bg-emerald-500/15 text-emerald-100 border border-emerald-500/50";
    case "trialing":
      return "bg-sky-500/15 text-sky-100 border border-sky-500/50";
    case "past_due":
      return "bg-amber-500/15 text-amber-100 border border-amber-500/50";
    case "canceled":
      return "bg-rose-500/15 text-rose-100 border border-rose-500/50";
    case "incomplete":
      return "bg-indigo-500/10 text-indigo-100 border border-indigo-500/40";
    default:
      return "bg-slate-800 text-slate-200 border border-slate-700";
  }
};

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
};

const currency = new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const summarizePlans = (users: { plan?: Plan }[]) =>
  users.reduce(
    (acc, user) => {
      const plan = (user.plan as Plan) ?? "free";
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    },
    { free: 0, pro: 0, team: 0 } as Record<Plan, number>
  );

const summarizeSubscriptions = (subs: { plan?: Plan; status?: SubStatus }[]) => {
  const stats = {
    active: 0,
    past_due: 0,
    canceled: 0,
    trialing: 0,
    incomplete: 0,
    unknown: 0,
    mrr: 0
  };
  subs.forEach((sub) => {
    const status = (sub.status as SubStatus) ?? "unknown";
    const plan = (sub.plan as Plan) ?? "free";
    if (status in stats) {
      (stats as any)[status] += 1;
    } else {
      stats.unknown += 1;
    }
    if (status === "active" || status === "trialing" || status === "past_due") {
      stats.mrr += plan === "team" ? 79 : plan === "pro" ? 29 : 0;
    }
  });
  return stats;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserColor, setNewUserColor] = useState(swatches[0]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string>("");
  const [subActionLoading, setSubActionLoading] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>("");

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/overview");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Unable to load admin overview.");
      }
      setOverview(data);
    } catch (err: any) {
      setError(err?.message ?? "Unable to load admin overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=/admin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      loadOverview();
    }
  }, [status, loadOverview]);

  useEffect(() => {
    if (overview?.subscriptions?.length && !selectedSubId) {
      setSelectedSubId(overview.subscriptions[0].id);
    }
    if (overview?.workspaces?.length && !selectedWorkspaceId) {
      setSelectedWorkspaceId(overview.workspaces[0].id);
    }
  }, [overview, selectedSubId]);

  const paidSeatShare = useMemo(() => {
    if (!overview) return 0;
    if (!overview.counts.users) return 0;
    return Math.round((overview.counts.paidUsers / overview.counts.users) * 100);
  }, [overview]);

  const atRiskSubs = useMemo(() => {
    if (!overview) return [];
    return overview.subscriptions.filter(
      (sub) => sub.status === "past_due" || sub.status === "canceled" || sub.status === "incomplete"
    );
  }, [overview]);

  const handlePlanChange = async (userId: string, plan: Plan) => {
    try {
      setNotice(null);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Unable to update plan.");
      setOverview((prev) => {
        if (!prev) return prev;
        const nextUsers = prev.users.map((u) => (u.id === userId ? { ...u, plan } : u));
        const breakdown = summarizePlans(nextUsers);
        const nextSubs = prev.subscriptions;
        const nextSubStats = summarizeSubscriptions(nextSubs);
        return {
          ...prev,
          users: nextUsers,
          planBreakdown: breakdown,
          counts: {
            ...prev.counts,
            paidUsers: nextUsers.filter((u) => (u.plan ?? "free") !== "free").length
          },
          subscriptionStats: nextSubStats
        };
      });
      setNotice("Plan updated");
    } catch (err: any) {
      setError(err?.message ?? "Unable to update plan.");
    }
  };

  const handleSubscriptionAction = async (action: "pause" | "resume" | "trial") => {
    if (!selectedSubId) {
      setError("Select a subscription first.");
      return;
    }
    setSubActionLoading(true);
    setError(null);
    setNotice(null);
    try {
      const payload: any = { subscriptionId: selectedSubId };
      if (action === "pause") {
        payload.status = "canceled";
      } else if (action === "resume") {
        payload.status = "active";
        payload.extendDays = 30;
      } else if (action === "trial") {
        payload.status = "trialing";
        payload.extendDays = 14;
      }

      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Unable to update subscription.");
      }
      setOverview((prev) => {
        if (!prev) return prev;
        const updated = data.subscription;
        const nextSubs = prev.subscriptions.map((s) => (s.id === updated.id ? { ...s, ...updated } : s));
        const nextStats = summarizeSubscriptions(nextSubs);
        return { ...prev, subscriptions: nextSubs, subscriptionStats: nextStats };
      });
      if (action === "pause") setNotice("Subscription paused");
      if (action === "resume") setNotice("Subscription resumed with 30-day extension");
      if (action === "trial") setNotice("14-day trial granted");
    } catch (err: any) {
      setError(err?.message ?? "Unable to update subscription.");
    } finally {
      setSubActionLoading(false);
    }
  };

  const handleSeatAction = async (action: "enforce" | "comp") => {
    if (!selectedWorkspaceId) {
      setError("Select a workspace first.");
      return;
    }
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/seat-reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: selectedWorkspaceId, action })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Seat action failed.");
      setNotice(data.message ?? "Seat action completed.");
    } catch (err: any) {
      setError(err?.message ?? "Unable to perform seat action.");
    }
  };

  const exportCsv = (type: "subscriptions" | "users") => {
    if (!overview) {
      setError("No data to export.");
      return;
    }
    setError(null);
    setNotice(null);
    const rows =
      type === "subscriptions"
        ? overview.subscriptions.map((s) => ({
            id: s.id,
            user: s.userName ?? "User",
            email: s.email ?? "",
            plan: s.plan ?? "free",
            status: s.status ?? "unknown",
            periodEnd: s.currentPeriodEnd ?? "",
            createdAt: s.createdAt ?? ""
          }))
        : overview.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email ?? "",
            plan: u.plan ?? "free",
            createdAt: u.createdAt ?? ""
          }));
    const header = Object.keys(rows[0] ?? {});
    const lines = [
      header.join(","),
      ...rows.map((r) => header.map((h) => `"${String((r as any)[h] ?? "").replace(/"/g, '""')}"`).join(","))
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = type === "subscriptions" ? "subscriptions.csv" : "users.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice(`${type === "subscriptions" ? "Subscriptions" : "Users"} CSV downloaded`);
  };

  const handleCopySnapshot = () => {
    if (!overview) {
      setError("Load data before copying a snapshot.");
      return;
    }
    setError(null);
    setNotice(null);
    const snapshot = {
      generatedAt: new Date().toISOString(),
      counts: overview.counts,
      subscriptionStats: overview.subscriptionStats,
      planBreakdown: overview.planBreakdown
    };
    try {
      const text = JSON.stringify(snapshot, null, 2);
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        setNotice("KPI snapshot copied to clipboard");
      } else {
        alert(text);
        setNotice("Snapshot shown in alert (clipboard unavailable)");
      }
    } catch (err: any) {
      setError(err?.message ?? "Unable to copy snapshot.");
    }
  };

  if (status === "loading" || (loading && !overview)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-500/20 blur-[120px]" />
        <div className="absolute right-10 top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-emerald-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Control</p>
            <h1 className="text-3xl font-semibold text-white">Business operations cockpit</h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Monitor users, workspaces, boards, and invites in one place. Paid seats unlock admin access;
              changes apply instantly across the product.
            </p>
            {overview?.fallback && (
              <div className="flex items-center gap-2 text-xs text-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Running on demo data because the database was unreachable.
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              onClick={handleCopySnapshot}
            >
              Copy KPI snapshot
            </button>
            <button
              className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-indigo-400"
              onClick={loadOverview}
            >
              Refresh data
            </button>
            <button
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              onClick={() => exportCsv("subscriptions")}
            >
              Export subscriptions CSV
            </button>
            <button
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              onClick={() => exportCsv("users")}
            >
              Export users CSV
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-rose-500/60 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}
        {notice && (
          <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {notice}
          </div>
        )}

        {overview && (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">MRR (est.)</div>
                <div className="mt-2 text-3xl font-semibold">{currency.format(overview.subscriptionStats.mrr || 0)}</div>
                <div className="mt-1 text-xs text-slate-400">Includes active, trialing, and past-due seats.</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">Active subscriptions</div>
                <div className="mt-2 text-3xl font-semibold">{overview.subscriptionStats.active}</div>
                <div className="mt-1 text-xs text-slate-400">
                  Trialing: {overview.subscriptionStats.trialing} • Incomplete: {overview.subscriptionStats.incomplete}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">At risk</div>
                <div className="mt-2 text-3xl font-semibold">
                  {overview.subscriptionStats.past_due + overview.subscriptionStats.canceled}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Past due: {overview.subscriptionStats.past_due} • Canceled: {overview.subscriptionStats.canceled}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">Total users</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">{overview.counts.users}</span>
                  <span className="text-xs text-slate-400">{paidSeatShare}% paid</span>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">Workspaces</div>
                <div className="mt-2 text-3xl font-semibold">{overview.counts.workspaces}</div>
                <div className="mt-1 text-xs text-slate-400">Maps: {overview.counts.maps}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">Pending invites</div>
                <div className="mt-2 text-3xl font-semibold">{overview.counts.invites}</div>
                <div className="mt-1 text-xs text-slate-400">Keep teams moving by closing the loop.</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">Plan mix</div>
                <div className="mt-3 space-y-2">
                  {(["team", "pro", "free"] as Plan[]).map((plan) => {
                    const total = overview.planBreakdown[plan] ?? 0;
                    const percent = overview.counts.users ? Math.round((total / overview.counts.users) * 100) : 0;
                    return (
                      <div key={plan} className="flex items-center gap-2 text-sm">
                        <div className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${planClassName(plan)}`}>
                          {plan}
                        </div>
                        <div className="flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-2 ${
                              plan === "team" ? "bg-emerald-400" : plan === "pro" ? "bg-indigo-400" : "bg-slate-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-300">{total}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">Billing posture</div>
                <div className="mt-2 text-2xl font-semibold">
                  {overview.subscriptionStats.active + overview.subscriptionStats.trialing} active/trial
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Unknown: {overview.subscriptionStats.unknown} • Incomplete: {overview.subscriptionStats.incomplete}
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">Trial Funnel</div>
                <div className="mt-2 text-3xl font-semibold">{overview.trialCount ?? overview.subscriptionStats.trialing}</div>
                <div className="mt-1 text-sm text-slate-300">
                  {overview.trialCount ?? overview.subscriptionStats.trialing} active trials | {overview.churnedThisMonth ?? 0} churned this month
                </div>
                {(overview.activeTrials ?? []).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {(overview.activeTrials ?? []).slice(0, 5).map((t) => (
                      <div key={t.userId} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs">
                        <div>
                          <span className="font-semibold text-white">{t.userName}</span>
                          <span className="ml-2 text-slate-400">{t.email}</span>
                        </div>
                        <span className="text-slate-400">Ends {formatDate(t.trialEndDate ?? undefined)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-inner shadow-slate-900/30">
                <div className="text-xs uppercase tracking-wide text-slate-400">MRR Breakdown</div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Pro Monthly</span>
                    <span className="font-semibold text-white">{currency.format(overview.mrrBreakdown?.proMonthly ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Pro Annual</span>
                    <span className="font-semibold text-white">{currency.format(overview.mrrBreakdown?.proAnnual ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Team Monthly</span>
                    <span className="font-semibold text-white">{currency.format(overview.mrrBreakdown?.teamMonthly ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Team Annual</span>
                    <span className="font-semibold text-white">{currency.format(overview.mrrBreakdown?.teamAnnual ?? 0)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Total MRR</span>
                    <span className="text-lg font-semibold text-white">
                      {currency.format(
                        (overview.mrrBreakdown?.proMonthly ?? 0) +
                        (overview.mrrBreakdown?.proAnnual ?? 0) +
                        (overview.mrrBreakdown?.teamMonthly ?? 0) +
                        (overview.mrrBreakdown?.teamAnnual ?? 0)
                      )}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Recent signups (7d): {overview.recentSignups ?? 0}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">People & access</div>
                    <h2 className="text-lg font-semibold text-white">User directory</h2>
                  </div>
                  <div className="text-xs text-slate-400">Click a plan to adjust access</div>
                </div>
                <div className="mt-4 overflow-auto rounded-xl border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Plan</th>
                        <th className="px-4 py-3 text-left">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                      {overview.users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/60">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span
                                className="h-8 w-8 rounded-full border border-slate-800"
                                style={{ backgroundColor: user.color ?? "#1e293b" }}
                              />
                              <div className="font-semibold text-white">{user.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{user.email ?? "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap items-center gap-2">
                              {(["free", "pro", "team"] as Plan[]).map((plan) => (
                                <button
                                  key={plan}
                                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                                    user.plan === plan
                                      ? planClassName(plan)
                                      : "border border-slate-800 text-slate-300 hover:border-slate-700"
                                  }`}
                                  onClick={() => handlePlanChange(user.id, plan)}
                                >
                                  {plan}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{formatDate(user.createdAt)}</td>
                        </tr>
                      ))}
                      {overview.users.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-slate-300">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/30 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Quick actions</div>
                  <h3 className="text-lg font-semibold text-white">Billing & retention levers</h3>
                  <p className="text-xs text-slate-400">Direct interventions to save or pause accounts.</p>
                </div>
                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-sm font-semibold text-white">Select subscription</div>
                  <select
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                  >
                    <option value="">Choose a customer</option>
                    {overview.subscriptions.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.userName ?? "User"} • {sub.email ?? "no-email"} • {sub.plan ?? "free"} ({sub.status ?? "unknown"})
                      </option>
                    ))}
                  </select>
                  <div className="grid gap-2">
                    <button
                      type="button"
                      disabled={subActionLoading || !selectedSubId}
                      className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-400 disabled:opacity-60"
                      onClick={() => handleSubscriptionAction("trial")}
                    >
                      Grant 14-day trial extension
                    </button>
                    <button
                      type="button"
                      disabled={subActionLoading || !selectedSubId}
                      className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400 disabled:opacity-60"
                      onClick={() => handleSubscriptionAction("resume")}
                    >
                      Resume & extend 30 days
                    </button>
                    <button
                      type="button"
                      disabled={subActionLoading || !selectedSubId}
                      className="w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-400 disabled:opacity-60"
                      onClick={() => handleSubscriptionAction("pause")}
                    >
                      Pause / cancel billing
                    </button>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
                    Actions update subscription status and period end for the selected customer so you can handle retention, pauses, or trial extensions without leaving this panel.
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-sm font-semibold text-white">Recovery playbook</div>
                  <div className="space-y-2 text-sm text-slate-300">
                    <button
                      type="button"
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-left font-semibold text-slate-100 hover:border-slate-700"
                      onClick={() => {
                        const template = `Subject: Action required - payment past due\n\nHi there,\nWe couldn’t process your payment for SwayMaps. I’ve extended access for 7 days—can you update billing to keep your workspace active?`;
                        navigator.clipboard?.writeText(template);
                        setNotice("Dunning email template copied");
                      }}
                    >
                      Copy dunning email
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-left font-semibold text-slate-100 hover:border-slate-700"
                      onClick={() => {
                        const template = `Subject: Trial expiring - need more time?\n\nHi there,\nYour SwayMaps trial is ending soon. I can extend 14 days if you need more time—reply yes and I’ll enable it.`;
                        navigator.clipboard?.writeText(template);
                        setNotice("Trial extension email copied");
                      }}
                    >
                      Copy trial save email
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-left font-semibold text-slate-100 hover:border-slate-700"
                      onClick={() => {
                        const template = `Action log: called customer, offered 1-month credit for downtime. Awaiting confirmation.`;
                        navigator.clipboard?.writeText(template);
                        setNotice("Playbook log line copied");
                      }}
                    >
                      Copy playbook log line
                    </button>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
                      Use these templates in your CRM/email. Log interventions so the team has context on the next touch.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">Billing</div>
                    <h3 className="text-lg font-semibold text-white">Subscriptions</h3>
                  </div>
                  <div className="text-xs text-slate-400">Sorted by recency</div>
                </div>
                <div className="mt-4 overflow-auto rounded-xl border border-slate-800">
                  <table className="min-w-full divide-y divide-slate-800">
                    <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Plan</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Renews</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm">
                      {overview.subscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-900/60">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white">{sub.userName ?? "User"}</div>
                            <div className="text-xs text-slate-400">{sub.email ?? "—"}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${planClassName(sub.plan)}`}>
                              {sub.plan ?? "free"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassName(sub.status)}`}>
                              {sub.status ?? "unknown"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{formatDate(sub.currentPeriodEnd ?? sub.createdAt)}</td>
                        </tr>
                      ))}
                      {overview.subscriptions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-slate-300">
                            No subscriptions yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/30 space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Attention</div>
                  <h3 className="text-lg font-semibold text-white">At-risk accounts</h3>
                </div>
                <div className="space-y-3">
                  {atRiskSubs.slice(0, 6).map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">{sub.userName ?? "User"}</div>
                          <div className="text-xs text-slate-400">{sub.email ?? "—"}</div>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase ${statusClassName(sub.status)}`}>
                          {sub.status ?? "unknown"}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        Plan {sub.plan ?? "free"} • Renews {formatDate(sub.currentPeriodEnd ?? sub.createdAt)}
                      </div>
                    </div>
                  ))}
                  {atRiskSubs.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-slate-300">
                      No at-risk subscriptions right now.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">Footprint</div>
                    <h3 className="text-lg font-semibold text-white">Workspaces</h3>
                  </div>
                  <div className="text-xs text-slate-400">Seat reconciliation</div>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                    <div className="text-sm font-semibold text-white">Seat actions</div>
                    <select
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                      value={selectedWorkspaceId}
                      onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                    >
                      <option value="">Choose workspace</option>
                      {overview.workspaces.map((ws) => (
                        <option key={ws.id} value={ws.id}>
                          {ws.name} • members {ws.memberCount}
                        </option>
                      ))}
                    </select>
                    <div className="grid gap-2 md:grid-cols-2">
                      <button
                        type="button"
                        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 disabled:opacity-60"
                        disabled={!selectedWorkspaceId}
                        onClick={() => handleSeatAction("enforce")}
                      >
                        Enforce current seat count
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400 disabled:opacity-60"
                        disabled={!selectedWorkspaceId}
                        onClick={() => handleSeatAction("comp")}
                      >
                        Comp one seat this cycle
                      </button>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
                      Use enforce when the seat count in billing should match members. Comp grants a cycle credit for one seat.
                    </div>
                  </div>

                  {overview.workspaces.map((ws) => (
                    <div
                      key={ws.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                    >
                        <div>
                          <div className="text-sm font-semibold text-white">{ws.name}</div>
                          <div className="text-xs text-slate-400">
                            Owner: {ws.ownerName ?? "Owner"} • Members {ws.memberCount} • Boards {ws.mapCount}
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">{formatDate(ws.createdAt)}</div>
                      </div>
                    ))}
                  {overview.workspaces.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-slate-300">
                      No workspaces yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Boards</div>
                      <h3 className="text-lg font-semibold text-white">Recent maps</h3>
                    </div>
                    <div className="text-xs text-slate-400">Sorted by activity</div>
                  </div>
                  <div className="mt-3 space-y-3">
                    {overview.maps.map((map) => (
                      <div
                        key={map.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">{map.name}</div>
                          <div className="text-xs text-slate-400">
                            {map.workspaceName ?? "Workspace"} • {map.ownerName ?? "Owner"} • {map.nodeCount ?? 0} nodes
                          </div>
                        </div>
                        <div className="text-xs text-slate-400">Updated {formatDate(map.updatedAt)}</div>
                      </div>
                    ))}
                    {overview.maps.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-slate-300">
                        No maps yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Invites</div>
                      <h3 className="text-lg font-semibold text-white">Access pipeline</h3>
                    </div>
                    <div className="text-xs text-slate-400">Newest first</div>
                  </div>
                  <div className="mt-3 space-y-3">
                    {overview.invites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">{invite.email}</div>
                          <div className="text-xs text-slate-400">
                            {invite.workspaceName ?? "Workspace"} • Role {invite.role ?? "viewer"}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span
                            className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase ${
                              invite.status === "accepted"
                                ? "bg-emerald-500/20 text-emerald-100"
                                : invite.status === "expired"
                                  ? "bg-rose-500/20 text-rose-100"
                                  : "bg-amber-500/20 text-amber-100"
                            }`}
                          >
                            {invite.status ?? "pending"}
                          </span>
                          <span>Exp {formatDate(invite.expiresAt)}</span>
                        </div>
                      </div>
                    ))}
                    {overview.invites.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-800 px-4 py-6 text-center text-slate-300">
                        No invitations on record.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
