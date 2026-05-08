"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Minus, ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { cn } from "@/lib/cn";

interface Tier {
  id: "free" | "pro" | "team" | "enterprise";
  name: string;
  monthly: number | null;
  annual: number | null;
  blurb: string;
  cta: string;
  ctaHref: string;
  highlight?: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    blurb: "For individuals exploring dependency mapping.",
    cta: "Get started",
    ctaHref: "/auth/signup",
    features: [
      "3 maps",
      "Up to 50 nodes per map",
      "Single workspace",
      "Real-time collaboration",
      "Public sharing links",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 29,
    annual: 19,
    blurb: "For small teams getting serious about systems.",
    cta: "Start 14-day trial",
    ctaHref: "/auth/signup?plan=pro",
    features: [
      "Unlimited maps",
      "Unlimited nodes",
      "Folders & nested organization",
      "Version history (90 days)",
      "Export to PNG, SVG, PDF, JSON",
      "Up to 5 collaborators",
    ],
  },
  {
    id: "team",
    name: "Team",
    monthly: 79,
    annual: 59,
    blurb: "For growing teams aligning across functions.",
    cta: "Start 14-day trial",
    ctaHref: "/auth/signup?plan=team",
    highlight: true,
    features: [
      "Everything in Pro",
      "Multiple workspaces",
      "Granular roles (Owner / Admin / Editor / Viewer)",
      "Audit log (90 days)",
      "API access & webhooks",
      "Slack & Teams integrations",
      "Up to 25 collaborators",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    annual: null,
    blurb: "For Fortune 500 with security, scale, and compliance needs.",
    cta: "Talk to sales",
    ctaHref: "/contact?topic=enterprise",
    features: [
      "Everything in Team",
      "SSO via SAML 2.0 (Okta, Azure AD, etc.)",
      "SCIM 2.0 user provisioning",
      "Per-folder ACL & group permissions",
      "Audit log (7 years) + SIEM export",
      "EU data residency",
      "Single-tenant deployment available",
      "99.9% SLA",
      "Dedicated CSM",
    ],
  },
];

const COMPARE: { feature: string; free: string | boolean; pro: string | boolean; team: string | boolean; enterprise: string | boolean }[] = [
  { feature: "Maps", free: "3", pro: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { feature: "Workspaces", free: "1", pro: "1", team: "Unlimited", enterprise: "Unlimited" },
  { feature: "Folders & nesting", free: false, pro: true, team: true, enterprise: true },
  { feature: "Real-time collaboration", free: true, pro: true, team: true, enterprise: true },
  { feature: "Version history", free: "—", pro: "90 days", team: "1 year", enterprise: "7 years" },
  { feature: "Granular RBAC", free: false, pro: false, team: true, enterprise: true },
  { feature: "Per-folder permissions", free: false, pro: false, team: false, enterprise: true },
  { feature: "API & webhooks", free: false, pro: false, team: true, enterprise: true },
  { feature: "Audit log", free: false, pro: false, team: "90 days", enterprise: "7 years + SIEM" },
  { feature: "SSO (SAML 2.0)", free: false, pro: false, team: false, enterprise: true },
  { feature: "SCIM provisioning", free: false, pro: false, team: false, enterprise: true },
  { feature: "Data residency (EU)", free: false, pro: false, team: false, enterprise: true },
  { feature: "Single-tenant deploy", free: false, pro: false, team: false, enterprise: true },
  { feature: "SLA", free: "—", pro: "—", team: "99.5%", enterprise: "99.9%" },
  { feature: "Support", free: "Community", pro: "Email", team: "Priority email", enterprise: "Dedicated CSM" },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      {/* ─── Hero ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-fg">
            Pricing built for every stage.
          </h1>
          <p className="mt-4 text-md text-fg-muted max-w-xl mx-auto">
            Start free. Add structure when your team grows. Upgrade to enterprise
            when security, compliance, and scale demand it.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-sm border border-border bg-bg-subtle p-0.5">
            <button
              className={cn(
                "px-3 h-7 text-xs font-medium rounded-xs transition-colors",
                !annual ? "bg-panel text-fg shadow-xs" : "text-fg-muted hover:text-fg"
              )}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={cn(
                "px-3 h-7 text-xs font-medium rounded-xs transition-colors inline-flex items-center gap-1.5",
                annual ? "bg-panel text-fg shadow-xs" : "text-fg-muted hover:text-fg"
              )}
              onClick={() => setAnnual(true)}
            >
              Annual
              <span className="rounded-xs bg-success-subtle text-success px-1 text-[10px] font-semibold">
                Save 33%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Tiers ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-md border border-border bg-panel p-6",
                  tier.highlight && "border-fg ring-1 ring-fg"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-semibold text-fg">{tier.name}</h3>
                  {tier.highlight && (
                    <span className="rounded-xs bg-fg text-fg-inverted px-1.5 h-[18px] text-[10px] font-semibold uppercase tracking-wide flex items-center">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-4 min-h-[64px]">
                  {tier.monthly === null ? (
                    <div className="text-2xl font-semibold tracking-tight text-fg">
                      Custom
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight text-fg">
                        ${annual ? tier.annual : tier.monthly}
                      </span>
                      <span className="text-sm text-fg-muted">/user/mo</span>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-fg-subtle">
                    {tier.monthly === null
                      ? "Tailored to your organization"
                      : annual
                      ? "Billed annually"
                      : "Billed monthly"}
                  </p>
                </div>
                <p className="mt-2 text-sm text-fg-muted">{tier.blurb}</p>
                <Link
                  href={tier.ctaHref}
                  className={cn(
                    "mt-5 inline-flex items-center justify-center gap-1.5 rounded-sm h-9 px-3 text-sm font-medium transition-colors",
                    tier.highlight || tier.id === "enterprise"
                      ? "bg-accent text-accent-fg hover:bg-accent-hover"
                      : "border border-border bg-panel text-fg hover:bg-bg-muted"
                  )}
                >
                  {tier.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <ul className="mt-6 space-y-2 border-t border-border pt-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-fg">
                      <Check className="h-3.5 w-3.5 text-fg-muted mt-1 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Comparison ─── */}
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-fg text-center">
            Compare plans
          </h2>
          <div className="mt-8 overflow-hidden rounded-md border border-border bg-panel">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-subtle">
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-fg-muted px-4 py-3">
                    Feature
                  </th>
                  <th className="text-center text-xs font-semibold text-fg px-3 py-3">Free</th>
                  <th className="text-center text-xs font-semibold text-fg px-3 py-3">Pro</th>
                  <th className="text-center text-xs font-semibold text-fg px-3 py-3">Team</th>
                  <th className="text-center text-xs font-semibold text-fg px-3 py-3">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      idx !== COMPARE.length - 1 && "border-b border-border"
                    )}
                  >
                    <td className="px-4 py-2.5 text-fg">{row.feature}</td>
                    <Cell value={row.free} />
                    <Cell value={row.pro} />
                    <Cell value={row.team} />
                    <Cell value={row.enterprise} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[800px] px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-fg text-center">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-border border border-border rounded-md bg-panel">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-fg">{faq.q}</span>
                  <span className="ml-2 text-fg-subtle group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-fg-muted leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <td className="px-3 py-2.5 text-center">
        <Check className="h-3.5 w-3.5 text-fg inline" />
      </td>
    );
  }
  if (value === false) {
    return (
      <td className="px-3 py-2.5 text-center">
        <Minus className="h-3.5 w-3.5 text-fg-disabled inline" />
      </td>
    );
  }
  return <td className="px-3 py-2.5 text-center text-sm text-fg-muted">{value}</td>;
}

const FAQS = [
  {
    q: "Can I try Pro or Team for free?",
    a: "Yes — both Pro and Team come with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What happens at the end of my trial?",
    a: "You'll be moved to the Free plan with 3 maps. No data is lost — upgrade anytime to regain access to all your maps and folders.",
  },
  {
    q: "Do I get a discount for annual billing?",
    a: "Yes. Annual billing saves you about 33% across Pro and Team.",
  },
  {
    q: "Is SSO available on Team?",
    a: "SSO via SAML 2.0 and SCIM provisioning are Enterprise-only. Contact sales for a guided setup with your IdP.",
  },
  {
    q: "How does Enterprise pricing work?",
    a: "Enterprise is custom-priced based on seat count, deployment model (multi-tenant or single-tenant), and required compliance posture. Most engagements include implementation support and a dedicated CSM.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. You can cancel from the billing portal. You'll retain access until the end of the billing period and can re-subscribe at any time.",
  },
];
