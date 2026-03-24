import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { isAdmin } from "../../../../lib/adminCheck";
import { initialMaps, initialUsers, initialWorkspaces } from "../../../../data/initialData";

type Plan = "free" | "pro" | "team";
type SubStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete" | "unknown";

const PLAN_PRICE: Record<Plan, number> = { free: 0, pro: 29, team: 79 };

const now = () => new Date().toISOString();

const fallbackUsers = initialUsers.map((user, idx) => ({
  ...user,
  createdAt: new Date(Date.now() - idx * 60 * 60 * 1000).toISOString()
}));

const fallbackWorkspaces = initialWorkspaces.map((ws, idx) => ({
  id: ws.id,
  name: ws.name,
  ownerUserId: ws.ownerUserId,
  ownerName: fallbackUsers.find((u) => u.id === ws.ownerUserId)?.name ?? "Owner",
  memberCount: ws.members.length,
  mapCount: initialMaps.filter((m) => m.workspaceId === ws.id).length,
  createdAt: new Date(Date.now() - (idx + 1) * 2 * 60 * 60 * 1000).toISOString()
}));

const fallbackMaps = initialMaps.map((map, idx) => ({
  id: map.id,
  name: map.name,
  workspaceId: map.workspaceId ?? null,
  workspaceName: fallbackWorkspaces.find((ws) => ws.id === map.workspaceId)?.name ?? "Workspace",
  ownerName: fallbackUsers.find((u) => u.id === map.ownerUserId)?.name ?? "Owner",
  nodeCount: map.nodes.length,
  updatedAt: map.updatedAt || new Date(Date.now() - idx * 30 * 60 * 1000).toISOString()
}));

const summarizePlans = (users: { plan?: Plan }[]) =>
  users.reduce(
    (acc, user) => {
      const plan = (user.plan as Plan) ?? "free";
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    },
    { free: 0, pro: 0, team: 0 } as Record<Plan, number>
  );

const fallbackPlanBreakdown = summarizePlans(fallbackUsers);

const fallbackSubscriptions = [
  {
    id: "sub-demo-1",
    userId: fallbackUsers[0]?.id ?? "user-1",
    userName: fallbackUsers[0]?.name ?? "Demo Owner",
    email: fallbackUsers[0]?.email ?? "owner@demo.com",
    plan: "team" as Plan,
    status: "active" as SubStatus,
    currentPeriodEnd: now()
  },
  {
    id: "sub-demo-2",
    userId: fallbackUsers[1]?.id ?? "user-2",
    userName: fallbackUsers[1]?.name ?? "Demo Editor",
    email: fallbackUsers[1]?.email ?? "editor@demo.com",
    plan: "pro" as Plan,
    status: "trialing" as SubStatus,
    currentPeriodEnd: now()
  }
];

const fallbackCounts = {
  users: fallbackUsers.length,
  paidUsers: fallbackUsers.filter((u) => (u.plan as Plan) !== "free").length,
  workspaces: fallbackWorkspaces.length,
  maps: fallbackMaps.length,
  invites: 0
};

const inviteStatus = (expiresAt: Date, acceptedAt?: Date | null) => {
  if (acceptedAt) return "accepted";
  if (expiresAt.getTime() < Date.now()) return "expired";
  return "pending";
};

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
      stats.mrr += PLAN_PRICE[plan] ?? 0;
    }
  });
  return stats;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUser = await isAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }
  // Admin access is based on isAdmin flag only — no plan requirement

  try {
    const [userCount, workspaceCount, mapCount, inviteCount, users, workspaces, maps, invites, subscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.workspace.count(),
      prisma.decodeMap.count(),
      prisma.workspaceInvite.count(),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 24 }),
      prisma.workspace.findMany({
        include: {
          owner: true,
          members: true,
          _count: { select: { maps: true } }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.decodeMap.findMany({
        include: {
          owner: true,
          workspace: true,
          _count: { select: { nodes: true } }
        },
        orderBy: { updatedAt: "desc" },
        take: 16
      }),
      prisma.workspaceInvite.findMany({
        include: { workspace: true },
        orderBy: { createdAt: "desc" },
        take: 12
      }),
      prisma.subscription.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 32
      })
    ]);

    const planBreakdown = summarizePlans(users as any);
    const paidUsers = users.filter((u) => ((u as any).plan as Plan) !== "free").length;
    const subscriptionStats = summarizeSubscriptions(subscriptions as any);

    // Additional analytics
    const trialCount = subscriptions.filter((s) => ((s as any).status ?? "").toLowerCase() === "trialing").length;
    const activeTrials = subscriptions
      .filter((s) => ((s as any).status ?? "").toLowerCase() === "trialing")
      .map((s) => ({
        userId: s.userId,
        userName: (s as any).user?.name ?? "User",
        email: (s as any).user?.email ?? "",
        trialEndDate: (s as any).currentPeriodEnd ? (s as any).currentPeriodEnd.toISOString() : null
      }));

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = users.filter((u) => u.createdAt >= sevenDaysAgo).length;

    const mrrBreakdown = { proMonthly: 0, proAnnual: 0, teamMonthly: 0, teamAnnual: 0 };
    subscriptions.forEach((sub) => {
      const status = ((sub as any).status ?? "unknown").toLowerCase();
      if (status !== "active" && status !== "trialing" && status !== "past_due") return;
      const plan = ((sub as any).plan ?? "free") as Plan;
      const interval = ((sub as any).interval ?? "month") as string;
      if (plan === "pro" && interval === "year") {
        mrrBreakdown.proAnnual += Math.round(PLAN_PRICE.pro * 12 / 12);
      } else if (plan === "pro") {
        mrrBreakdown.proMonthly += PLAN_PRICE.pro;
      } else if (plan === "team" && interval === "year") {
        mrrBreakdown.teamAnnual += Math.round(PLAN_PRICE.team * 12 / 12);
      } else if (plan === "team") {
        mrrBreakdown.teamMonthly += PLAN_PRICE.team;
      }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const churnedThisMonth = subscriptions.filter((sub) => {
      const status = ((sub as any).status ?? "").toLowerCase();
      if (status !== "canceled") return false;
      const updatedAt = (sub as any).updatedAt ?? (sub as any).createdAt;
      return updatedAt && new Date(updatedAt) >= startOfMonth;
    }).length;

    return NextResponse.json({
      counts: {
        users: userCount,
        paidUsers,
        workspaces: workspaceCount,
        maps: mapCount,
        invites: inviteCount
      },
      planBreakdown,
      subscriptionStats,
      trialCount,
      activeTrials,
      recentSignups,
      mrrBreakdown,
      churnedThisMonth,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        plan: (u as any).plan ?? "free",
        isAdmin: (u as any).isAdmin ?? false,
        color: u.color ?? undefined,
        createdAt: u.createdAt.toISOString()
      })),
      workspaces: workspaces.map((ws) => ({
        id: ws.id,
        name: ws.name,
        ownerName: ws.owner?.name ?? "Owner",
        ownerUserId: ws.ownerId,
        memberCount: ws.members.length,
        mapCount: (ws as any)._count?.maps ?? 0,
        createdAt: ws.createdAt.toISOString()
      })),
      maps: maps.map((map) => ({
        id: map.id,
        name: map.name,
        workspaceId: map.workspaceId ?? null,
        workspaceName: map.workspace?.name ?? "Workspace",
        ownerName: map.owner?.name ?? "Owner",
        nodeCount: (map as any)._count?.nodes ?? 0,
        updatedAt: map.updatedAt.toISOString()
      })),
      subscriptions: subscriptions.map((sub) => ({
        id: sub.id,
        userId: sub.userId,
        userName: (sub as any).user?.name ?? "User",
        email: (sub as any).user?.email ?? "",
        plan: (sub as any).plan ?? "free",
        status: ((sub as any).status ?? "unknown").toLowerCase() as SubStatus,
        currentPeriodEnd: (sub as any).currentPeriodEnd ? (sub as any).currentPeriodEnd.toISOString() : null,
        createdAt: (sub as any).createdAt?.toISOString?.() ?? new Date().toISOString()
      })),
      invites: invites.map((invite) => ({
        id: invite.id,
        email: invite.email,
        workspaceName: invite.workspace?.name ?? "Workspace",
        role: invite.role,
        expiresAt: invite.expiresAt.toISOString(),
        acceptedAt: invite.acceptedAt ? invite.acceptedAt.toISOString() : null,
        status: inviteStatus(invite.expiresAt, invite.acceptedAt)
      }))
    });
  } catch (err) {
    console.error("Admin overview failed, falling back to demo data", err);
    const subscriptionStats = summarizeSubscriptions(fallbackSubscriptions);
    return NextResponse.json({
      counts: fallbackCounts,
      planBreakdown: fallbackPlanBreakdown,
      subscriptionStats,
      trialCount: fallbackSubscriptions.filter((s) => s.status === "trialing").length,
      activeTrials: fallbackSubscriptions
        .filter((s) => s.status === "trialing")
        .map((s) => ({
          userId: s.userId,
          userName: s.userName,
          email: s.email,
          trialEndDate: s.currentPeriodEnd
        })),
      recentSignups: fallbackUsers.length,
      mrrBreakdown: { proMonthly: 29, proAnnual: 0, teamMonthly: 79, teamAnnual: 0 },
      churnedThisMonth: 0,
      users: fallbackUsers,
      workspaces: fallbackWorkspaces,
      maps: fallbackMaps,
      subscriptions: fallbackSubscriptions,
      invites: [],
      fallback: true,
      generatedAt: now()
    });
  }
}
