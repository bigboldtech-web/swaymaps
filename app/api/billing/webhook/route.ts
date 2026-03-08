import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function getSubFields(stripeSub: any) {
  return {
    currentPeriodEnd: stripeSub.current_period_end
      ? new Date(stripeSub.current_period_end * 1000)
      : null,
    trialEnd: stripeSub.trial_end
      ? new Date(stripeSub.trial_end * 1000)
      : null,
    cancelAtPeriodEnd: stripeSub.cancel_at_period_end ?? false,
    status: stripeSub.status === "trialing" ? "trialing" : stripeSub.status,
    priceId: stripeSub.items?.data?.[0]?.price?.id ?? null,
  };
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;
  if (!userId || !plan) return;

  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId) as any;
  const fields = getSubFields(stripeSub);

  await prisma.subscription.upsert({
    where: { id: subscriptionId },
    create: {
      id: subscriptionId,
      userId,
      plan,
      status: fields.status,
      stripeCustomerId: customerId,
      stripeSubId: subscriptionId,
      stripePriceId: fields.priceId,
      currentPeriodEnd: fields.currentPeriodEnd,
      trialEnd: fields.trialEnd,
      cancelAtPeriodEnd: fields.cancelAtPeriodEnd,
    },
    update: {
      plan,
      status: fields.status,
      stripeCustomerId: customerId,
      stripeSubId: subscriptionId,
      stripePriceId: fields.priceId,
      currentPeriodEnd: fields.currentPeriodEnd,
      trialEnd: fields.trialEnd,
      cancelAtPeriodEnd: fields.cancelAtPeriodEnd,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const sub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscriptionId },
  });
  if (!sub) return;

  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId) as any;
  const fields = getSubFields(stripeSub);

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status: "active",
      currentPeriodEnd: fields.currentPeriodEnd,
      trialEnd: null,
    },
  });

  await prisma.user.update({
    where: { id: sub.userId },
    data: { plan: sub.plan },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const sub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscriptionId },
  });
  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "past_due" },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id },
  });
  if (!sub) return;

  const stripeSub = subscription as any;
  const newPriceId = stripeSub.items?.data?.[0]?.price?.id;

  let plan = sub.plan;
  if (newPriceId) {
    if (
      newPriceId === process.env.STRIPE_TEAM_MONTHLY_PRICE_ID ||
      newPriceId === process.env.STRIPE_TEAM_ANNUAL_PRICE_ID
    ) {
      plan = "team";
    } else if (
      newPriceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID ||
      newPriceId === process.env.STRIPE_PRO_ANNUAL_PRICE_ID
    ) {
      plan = "pro";
    }
  }

  const fields = getSubFields(stripeSub);

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      plan,
      status: fields.status,
      stripePriceId: newPriceId ?? sub.stripePriceId,
      currentPeriodEnd: fields.currentPeriodEnd,
      cancelAtPeriodEnd: fields.cancelAtPeriodEnd,
      trialEnd: fields.trialEnd,
    },
  });

  await prisma.user.update({
    where: { id: sub.userId },
    data: { plan },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id },
  });
  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: "canceled", cancelAtPeriodEnd: false },
  });

  await prisma.user.update({
    where: { id: sub.userId },
    data: { plan: "free" },
  });
}
