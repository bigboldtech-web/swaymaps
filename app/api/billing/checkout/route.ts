import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { stripe, PLANS, PlanKey } from "../../../../lib/stripe";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  const userEmail = (session as any)?.user?.email;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { plan, interval } = body as { plan?: string; interval?: string };

  if (!plan || !["pro", "team"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const billingInterval = interval === "year" ? "year" : "month";
  const planConfig = PLANS[plan as PlanKey];
  const priceId = planConfig.prices[billingInterval];

  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price not configured for this plan" },
      { status: 500 }
    );
  }

  // Check if user already has a Stripe customer ID
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: userId as string, stripeCustomerId: { not: null } },
  });

  let customerId = existingSub?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userEmail as string,
      metadata: { userId: userId as string },
    });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId: userId as string, plan },
    },
    success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/?upgraded=${plan}`,
    cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/?canceled=true`,
    metadata: { userId: userId as string, plan },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
