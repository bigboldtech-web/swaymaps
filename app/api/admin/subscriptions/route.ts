import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

type Plan = "free" | "pro" | "team";
type SubStatus = "active" | "past_due" | "canceled" | "trialing" | "incomplete";

const allowedStatuses: SubStatus[] = ["active", "past_due", "canceled", "trialing", "incomplete"];

const memorySubs: any[] = [];

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sessionPlan = (session.user as any)?.plan ?? "free";
  if (sessionPlan === "free") {
    return NextResponse.json({ error: "Admin access requires a paid plan." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { subscriptionId, status, extendDays } = body ?? {};
  if (!subscriptionId || !status || !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "subscriptionId and valid status are required" }, { status: 400 });
  }

  const periodEnd = typeof extendDays === "number" && extendDays > 0
    ? new Date(Date.now() + extendDays * 24 * 60 * 60 * 1000)
    : undefined;

  try {
    const updated = await prisma.subscription.update({
      where: { id: subscriptionId as string },
      data: {
        status,
        ...(periodEnd ? { currentPeriodEnd: periodEnd } : {})
      },
      include: { user: true }
    });
    return NextResponse.json({
      subscription: {
        id: updated.id,
        userId: updated.userId,
        userName: (updated as any).user?.name ?? "User",
        email: (updated as any).user?.email ?? "",
        plan: ((updated as any).plan as Plan) ?? "free",
        status: ((updated as any).status as SubStatus) ?? status,
        currentPeriodEnd: updated.currentPeriodEnd?.toISOString?.() ?? null,
        createdAt: (updated as any).createdAt?.toISOString?.() ?? new Date().toISOString()
      }
    });
  } catch (err) {
    const idx = memorySubs.findIndex((s) => s.id === subscriptionId);
    if (idx === -1) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }
    const next = {
      ...memorySubs[idx],
      status,
      currentPeriodEnd: periodEnd?.toISOString?.() ?? memorySubs[idx].currentPeriodEnd ?? null
    };
    memorySubs[idx] = next;
    return NextResponse.json({ subscription: next, fallback: true });
  }
}
