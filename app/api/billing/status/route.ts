import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId as string },
    select: { plan: true },
  });

  const subscription = await prisma.subscription.findFirst({
    where: { userId: userId as string },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    plan: user?.plan ?? "free",
    status: subscription?.status ?? "none",
    currentPeriodEnd: subscription?.currentPeriodEnd,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
    trialEnd: subscription?.trialEnd,
    hasStripeCustomer: !!subscription?.stripeCustomerId,
  });
}
