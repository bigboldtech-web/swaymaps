import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover" as any,
      typescript: true,
    });
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead for lazy initialization */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export const PLANS = {
  pro: {
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 228,
    limits: { maps: Infinity, workspaces: 5, aiPerMonth: Infinity },
    get prices() {
      return {
        month: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
        year: process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? "",
      };
    },
  },
  team: {
    name: "Team",
    monthlyPrice: 79,
    annualPrice: 708,
    limits: { maps: Infinity, workspaces: Infinity, aiPerMonth: Infinity },
    get prices() {
      return {
        month: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID ?? "",
        year: process.env.STRIPE_TEAM_ANNUAL_PRICE_ID ?? "",
      };
    },
  },
  free: {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    limits: { maps: 3, workspaces: 1, aiPerMonth: 5 },
    prices: { month: "", year: "" },
  },
} as const;

export type PlanKey = "pro" | "team" | "free";
