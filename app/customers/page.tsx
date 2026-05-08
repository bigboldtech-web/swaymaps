import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Quote,
  Star,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  Sparkles,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Customers — Engineering, security, ops teams using SwayMaps",
  description:
    "How platform engineering, security, and ops teams use SwayMaps to map systems, ship faster, and pass audits.",
};

const STORIES = [
  {
    company: "Atlas Bank",
    industry: "Financial services",
    color: "#6647F0",
    initials: "AB",
    headline: "Replaced 4 diagram tools with one source of truth.",
    quote:
      "We replaced four diagram tools with SwayMaps. The Sidekick is the reason we stayed — it actually understands our service graph. Architecture review prep dropped from a week to a day.",
    author: "Lena Chen, Staff Engineer",
    metric: { label: "Architecture review prep", from: "1 week", to: "1 day" },
    icon: TrendingUp,
  },
  {
    company: "Northwind Health",
    industry: "Healthcare",
    color: "#FC6D2D",
    initials: "NH",
    headline: "Passed SOC 2 data flow review on the first try.",
    quote:
      "Our security team finally agreed to one source of truth for data flow diagrams. Audit log + SSO sealed the deal. Auditors love that every change is provable.",
    author: "Marcus Rivera, Director of Platform",
    metric: { label: "SOC 2 data flow review", from: "3 cycles", to: "1 cycle" },
    icon: ShieldCheck,
  },
  {
    company: "Vela Telecom",
    industry: "Telecommunications",
    color: "#0091FF",
    initials: "VT",
    headline: "Run live incident reviews on a multiplayer canvas.",
    quote:
      "Real-time editing actually works — no last-write-wins disasters. We run incident reviews live in SwayMaps now, with the whole on-call rotation editing the same map.",
    author: "Priya Anand, Head of SRE",
    metric: { label: "Incident review setup", from: "45 min", to: "2 min" },
    icon: Clock,
  },
];

const SHORT_QUOTES = [
  { quote: "The only diagramming tool my engineers don't complain about.", author: "Engineering Manager", company: "Kepler Aerospace", color: "#16a34a" },
  { quote: "We mapped our entire microservice architecture in an afternoon.", author: "Platform Lead", company: "Pinetree Logistics", color: "#FF02F0" },
  { quote: "The Sidekick generates better runbooks than my senior engineers do.", author: "SRE Director", company: "Halcyon Insurance", color: "#FC6D2D" },
  { quote: "Public sharing + iframe embeds = our wiki finally has live diagrams.", author: "Tech Lead", company: "Atlas Bank", color: "#6647F0" },
  { quote: "SCIM provisioning was the unblocker for our Okta rollout.", author: "IT Director", company: "Vela Telecom", color: "#0091FF" },
  { quote: "Folder ACLs let us scope sensitive maps without making whole new workspaces.", author: "Security Lead", company: "Northwind Health", color: "#16a34a" },
];

export default function CustomersPage() {
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
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255, 2, 240, 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--gradient-warm-stop-1)" }}>
              Customers
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              Engineering teams ship faster
              <br />
              with SwayMaps.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-fg-muted leading-relaxed">
              Platform, security, and ops teams at Fortune 500 organizations use SwayMaps to replace static diagrams with a structured, AI-powered, multiplayer workspace.
            </p>
          </div>

          {/* Logos */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Atlas Bank", "Northwind Health", "Kepler Aerospace", "Pinetree Logistics", "Vela Telecom", "Halcyon Insurance"].map((n) => (
              <span key={n} className="text-sm font-semibold tracking-tight text-fg-muted">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "62%", label: "Faster architecture reviews" },
              { value: "3.4×", label: "More maps maintained per team" },
              { value: "98%", label: "Customer retention (annual)" },
              { value: "<150ms", label: "Real-time sync latency p95" },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-cool)" }}
                >
                  {s.value}
                </p>
                <p className="mt-1 text-[12px] text-fg-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured stories */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              Featured stories
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              How leading teams use SwayMaps.
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {STORIES.map((s) => (
              <article
                key={s.company}
                className="rounded-2xl border border-border bg-panel overflow-hidden flex flex-col"
              >
                <div className="px-7 py-6 border-b border-border flex items-center gap-3">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[12px] font-bold text-white"
                    style={{ background: s.color }}
                  >
                    {s.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-display font-semibold text-fg">{s.company}</p>
                    <p className="text-[11px] text-fg-muted">{s.industry}</p>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="text-lg font-display font-bold text-fg leading-tight">
                    {s.headline}
                  </h3>
                  <Quote className="mt-4 h-5 w-5 text-fg-disabled" />
                  <blockquote className="mt-2 text-[14px] text-fg-muted leading-relaxed flex-1">
                    &ldquo;{s.quote}&rdquo;
                  </blockquote>
                  <p className="mt-4 text-[12px] font-semibold text-fg">{s.author}</p>
                </div>
                <div
                  className="px-7 py-5 border-t border-border flex items-center gap-3"
                  style={{ background: `${s.color}08` }}
                >
                  <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-eyebrow uppercase tracking-wide text-fg-subtle">
                      {s.metric.label}
                    </p>
                    <p className="text-[13px] font-semibold text-fg">
                      <span className="line-through text-fg-muted mr-1.5">{s.metric.from}</span>
                      → {s.metric.to}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quote wall */}
      <section className="border-y border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1 text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              Loved by the people who use it daily.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHORT_QUOTES.map((q) => (
              <figure
                key={q.quote}
                className="rounded-xl border border-border bg-panel p-5"
              >
                <Quote className="h-4 w-4 text-fg-disabled" />
                <blockquote className="mt-2 text-[14px] text-fg leading-relaxed">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2.5 pt-4 border-t border-border">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: q.color }}
                  >
                    {q.author.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold text-fg">{q.author}</span>
                    <span className="block text-[11px] text-fg-muted">{q.company}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div
            className="rounded-3xl border border-border p-12 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 71, 240, 0.06) 0%, rgba(0, 145, 255, 0.06) 100%)",
            }}
          >
            <h2 className="text-3xl font-display font-bold tracking-tight text-fg">
              Join the teams shipping with SwayMaps.
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              Free workspace. No credit card. Pro trial unlocks unlimited Sidekick AI.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact?topic=demo"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
