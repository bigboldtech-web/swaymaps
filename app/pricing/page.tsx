"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Zap,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { cn } from "@/lib/cn";

type Plan = {
  name: string;
  blurb: string;
  monthly: number | null;
  annual: number | null;
  cta: { label: string; href: string };
  highlight?: boolean;
  gradient?: string;
  icon: any;
  bullets: string[];
};

const PLANS: Plan[] = [
  {
    name: "Free",
    blurb: "For individuals getting started with structured visual maps.",
    monthly: 0,
    annual: 0,
    cta: { label: "Start free", href: "/auth/signup" },
    icon: Zap,
    bullets: [
      "3 maps, 1 workspace",
      "Dependency, mind map, flowchart views",
      "Real-time collaboration (up to 3)",
      "5 Sidekick AI calls / month",
      "Public sharing",
      "Community support",
    ],
  },
  {
    name: "Pro",
    blurb: "For builders who need unlimited maps and unlimited AI.",
    monthly: 29,
    annual: 19,
    cta: { label: "Start 14-day trial", href: "/auth/signup?plan=pro" },
    highlight: true,
    gradient: "var(--gradient-cool)",
    icon: Sparkles,
    bullets: [
      "Unlimited maps, 1 workspace",
      "Unlimited Sidekick AI",
      "Vision input + MCP servers",
      "Version history (90 days)",
      "Public API + webhooks",
      "Email support",
    ],
  },
  {
    name: "Team",
    blurb: "For teams that need multiple workspaces and richer collaboration.",
    monthly: 79,
    annual: 59,
    cta: { label: "Start 14-day trial", href: "/auth/signup?plan=team" },
    icon: Users,
    bullets: [
      "Unlimited maps + workspaces",
      "Unlimited Sidekick AI",
      "Folders + RBAC",
      "Audit log (90 days)",
      "Slack & MS Teams notifications",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    blurb: "For organizations with security, compliance, and scale needs.",
    monthly: null,
    annual: null,
    cta: { label: "Talk to sales", href: "/contact?topic=enterprise" },
    icon: Building2,
    bullets: [
      "Everything in Team",
      "SAML SSO + SCIM 2.0",
      "Audit log (7 years)",
      "Data residency (US/EU)",
      "Single-tenant available",
      "Dedicated CSM + SLA",
    ],
  },
];

const COMPARISON: Array<{
  category: string;
  rows: Array<{ label: string; values: [string | boolean, string | boolean, string | boolean, string | boolean] }>;
}> = [
  {
    category: "Workspace",
    rows: [
      { label: "Maps", values: ["3", "Unlimited", "Unlimited", "Unlimited"] },
      { label: "Workspaces", values: ["1", "1", "Unlimited", "Unlimited"] },
      { label: "Editors per workspace", values: ["3", "10", "Unlimited", "Unlimited"] },
      { label: "Dependency, mind map, flowchart views", values: [true, true, true, true] },
      { label: "Templates", values: ["Built-in", "Built-in", "Built-in + custom", "Built-in + custom"] },
    ],
  },
  {
    category: "AI Sidekick",
    rows: [
      { label: "Sidekick chat", values: ["5/mo", "Unlimited", "Unlimited", "Unlimited"] },
      { label: "8 graph-aware tools", values: [true, true, true, true] },
      { label: "Vision input (diagrams, PDFs)", values: [false, true, true, true] },
      { label: "MCP server connections", values: [false, true, true, true] },
      { label: "Generate runbook", values: [false, true, true, true] },
    ],
  },
  {
    category: "Collaboration",
    rows: [
      { label: "Live cursors & presence", values: [true, true, true, true] },
      { label: "Inline comments", values: [true, true, true, true] },
      { label: "Version history", values: ["7 days", "90 days", "1 year", "Unlimited"] },
      { label: "Public sharing & embeds", values: [true, true, true, true] },
      { label: "Password-protected links", values: [false, true, true, true] },
    ],
  },
  {
    category: "Permissions",
    rows: [
      { label: "Roles", values: ["Owner only", "5 roles", "5 roles + groups", "5 roles + groups"] },
      { label: "Folders", values: [false, true, true, true] },
      { label: "Per-folder ACL", values: [false, false, true, true] },
      { label: "SCIM groups", values: [false, false, false, true] },
    ],
  },
  {
    category: "Security & Compliance",
    rows: [
      { label: "SAML SSO", values: [false, false, false, true] },
      { label: "SCIM 2.0", values: [false, false, false, true] },
      { label: "Audit log retention", values: ["—", "30 days", "90 days", "7 years"] },
      { label: "Audit log export (CSV/JSON)", values: [false, true, true, true] },
      { label: "Data residency (US/EU)", values: [false, false, false, true] },
      { label: "Single-tenant", values: [false, false, false, "Available"] },
    ],
  },
  {
    category: "Integrations",
    rows: [
      { label: "Public REST API", values: [false, true, true, true] },
      { label: "Signed webhooks", values: [false, true, true, true] },
      { label: "MCP servers", values: [false, true, true, true] },
      { label: "Slack notifications", values: [false, false, true, true] },
      { label: "GitHub / Linear sync", values: [false, false, "Beta", true] },
    ],
  },
  {
    category: "Support",
    rows: [
      { label: "Community", values: [true, true, true, true] },
      { label: "Email", values: [false, "Standard", "Priority", "24/7 priority"] },
      { label: "Dedicated CSM", values: [false, false, false, true] },
      { label: "Uptime SLA", values: [false, false, false, "99.9%"] },
      { label: "Onboarding & training", values: [false, false, false, true] },
    ],
  },
];

const FAQ = [
  {
    q: "Is the Free plan really free, with no credit card?",
    a: "Yes. The Free plan is genuinely free — no card required, no auto-upgrade. You can stay on it forever.",
  },
  {
    q: "What happens after my 14-day Pro/Team trial?",
    a: "Your workspace stays alive on the Free plan with your data intact. You can upgrade any time from the billing portal.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Up or down, monthly or annual. Prorated automatically through Stripe.",
  },
  {
    q: "Do you offer discounts?",
    a: "Annual billing saves 35% on Pro and 25% on Team. We also offer education and non-profit discounts — write to sales@swaymaps.com.",
  },
  {
    q: "How does Enterprise pricing work?",
    a: "Enterprise is custom-priced based on seat count, deployment model (multi-tenant or single-tenant), and SLA tier. Talk to sales for a quote.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Self-serve plans use Stripe (cards + ACH). Enterprise can pay via invoice / wire / PO.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(102, 71, 240, 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              Pricing
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              Simple, honest pricing.
              <br />
              Free forever to start.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-fg-muted leading-relaxed">
              Start free. Upgrade when you need unlimited AI, more workspaces, or enterprise security. Annual billing saves up to 35%.
            </p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-panel p-1">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors",
                  !annual ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors",
                  annual ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
                )}
              >
                Annual
                <span className="rounded-full bg-success-subtle text-success px-1.5 py-0.5 text-[9px] uppercase font-bold">
                  Save 35%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section>
        <div className="mx-auto max-w-[1280px] px-6 pb-20">
          <div className="grid lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => {
              const price = annual ? plan.annual : plan.monthly;
              return (
                <div
                  key={plan.name}
                  className={cn(
                    "relative rounded-2xl border bg-panel p-7 flex flex-col",
                    plan.highlight
                      ? "border-transparent shadow-lg ring-1"
                      : "border-border"
                  )}
                  style={
                    plan.highlight
                      ? { boxShadow: "0 0 0 1px var(--gradient-cool-stop-1), 0 10px 40px -10px rgba(102,71,240,0.25)" }
                      : undefined
                  }
                >
                  {plan.highlight && (
                    <span
                      className="absolute -top-3 left-7 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                      style={{ background: plan.gradient }}
                    >
                      Most popular
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <plan.icon className="h-4 w-4 text-fg-muted" />
                    <span className="font-display text-lg font-bold text-fg">{plan.name}</span>
                  </div>
                  <p className="mt-2 text-[12px] text-fg-muted leading-relaxed min-h-[36px]">
                    {plan.blurb}
                  </p>
                  <div className="mt-5">
                    {price === null ? (
                      <p className="font-display text-3xl font-extrabold tracking-tighter text-fg">
                        Custom
                      </p>
                    ) : (
                      <p className="font-display text-4xl font-extrabold tracking-tighter text-fg">
                        ${price}
                        <span className="text-sm font-medium text-fg-muted">/mo</span>
                      </p>
                    )}
                    {price !== null && price > 0 && annual && (
                      <p className="text-[11px] text-fg-subtle mt-0.5">
                        billed yearly · ${plan.annual! * 12}/yr
                      </p>
                    )}
                    {price !== null && price > 0 && !annual && (
                      <p className="text-[11px] text-fg-subtle mt-0.5">billed monthly</p>
                    )}
                  </div>
                  <Link
                    href={plan.cta.href}
                    className={cn(
                      "mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg h-10 px-4 text-[13px] font-semibold transition-all",
                      plan.highlight
                        ? "text-white shadow-md hover:shadow-lg"
                        : "border border-border bg-panel text-fg hover:bg-bg-muted"
                    )}
                    style={plan.highlight ? { background: plan.gradient } : undefined}
                  >
                    {plan.cta.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <ul className="mt-6 space-y-2.5 text-[13px]">
                    {plan.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 mt-0.5 text-success shrink-0" />
                        <span className="text-fg-muted">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
              Plan comparison
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              Compare every feature.
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-5 border-b border-border bg-bg-subtle sticky top-14 z-20">
              <div className="px-5 py-4">
                <span className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
                  Feature
                </span>
              </div>
              {PLANS.map((p) => (
                <div key={p.name} className="px-5 py-4 text-center border-l border-border">
                  <p className="text-sm font-display font-bold text-fg">{p.name}</p>
                  <p className="text-[11px] text-fg-muted mt-0.5">
                    {p.monthly === null
                      ? "Custom"
                      : p.monthly === 0
                      ? "Free"
                      : `$${annual ? p.annual : p.monthly}/mo`}
                  </p>
                </div>
              ))}
            </div>
            {COMPARISON.map((cat) => (
              <div key={cat.category}>
                <div className="grid grid-cols-5 bg-bg-subtle border-y border-border">
                  <div className="col-span-5 px-5 py-2">
                    <p className="font-eyebrow text-[10px] uppercase tracking-[0.14em] font-semibold text-fg">
                      {cat.category}
                    </p>
                  </div>
                </div>
                {cat.rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-5 border-b border-border last:border-b-0">
                    <div className="px-5 py-3 text-[13px] text-fg-muted">{row.label}</div>
                    {row.values.map((v, i) => (
                      <div key={i} className="px-5 py-3 text-center border-l border-border">
                        {typeof v === "boolean" ? (
                          v ? (
                            <Check className="h-4 w-4 text-success inline" />
                          ) : (
                            <Minus className="h-4 w-4 text-fg-disabled inline" />
                          )
                        ) : (
                          <span className="text-[13px] font-medium text-fg">{v}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise band */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div
            className="rounded-3xl border border-border p-10 grid lg:grid-cols-[1.2fr,1fr] gap-10 items-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 71, 240, 0.05) 0%, rgba(0, 145, 255, 0.05) 100%)",
            }}
          >
            <div>
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-sm"
                style={{ background: "var(--gradient-cool)" }}
              >
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="mt-4 text-3xl font-display font-bold tracking-tight text-fg leading-tight">
                Enterprise-ready, security-first.
              </h2>
              <p className="mt-3 text-md text-fg-muted leading-relaxed">
                SAML SSO, SCIM 2.0, audit logs, data residency, and single-tenant deployments — all available on the Enterprise plan. SOC 2 Type II in progress.
              </p>
              <Link
                href="/contact?topic=enterprise"
                className="mt-6 inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Talk to sales
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-4 text-[13px]">
              {[
                "SAML SSO via Jackson",
                "SCIM 2.0 user + group sync",
                "7-year audit retention",
                "Data residency (US, EU)",
                "Single-tenant available",
                "99.9% uptime SLA",
                "Dedicated CSM",
                "Custom DPA / BAA",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5 text-success shrink-0" />
                  <span className="text-fg-muted">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[860px] px-6 py-20">
          <div className="text-center mb-12">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
              Pricing FAQ
            </p>
            <h2 className="mt-3 text-3xl font-display font-bold tracking-tight text-fg">
              Questions, answered.
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-panel divide-y divide-border overflow-hidden">
            {FAQ.map((q) => (
              <details key={q.q} className="group p-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[15px] font-display font-semibold text-fg pr-4">
                    {q.q}
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-fg-muted shrink-0 group-open:rotate-45 transition-transform">
                    <span className="text-base leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] text-fg-muted leading-relaxed">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
