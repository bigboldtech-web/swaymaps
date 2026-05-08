import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Beaker,
  Clock,
  Sparkles,
  GitBranch,
  Network,
  Users,
  ShieldCheck,
  Plug,
  Layers,
  Brain,
  Code2,
  Rocket,
  Workflow,
  Globe,
  Eye,
  Database,
  AtSign,
  Lock,
  Bell,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Roadmap — What's live, in beta, and coming soon",
  description:
    "Honest, public roadmap. See what SwayMaps ships today, what's in beta, and what's next.",
};

type Item = {
  icon: any;
  title: string;
  body: string;
};

const LIVE: Item[] = [
  { icon: Network, title: "Three views over one graph", body: "Dependency map, mind map, flowchart — same nodes and edges, different lens." },
  { icon: GitBranch, title: "11 typed node kinds + 14 edge semantics", body: "Strongly-typed primitives the AI can reason over." },
  { icon: Sparkles, title: "Sidekick AI — 8 graph tools", body: "find_dependencies, find_path, find_orphans, generate_runbook, more." },
  { icon: Eye, title: "Sidekick Vision input", body: "Drop architecture diagrams or PDFs; Sidekick extracts services + edges." },
  { icon: Users, title: "Real-time collaboration (Yjs CRDT)", body: "Live cursors, presence, full edit sync — not just last-write-wins." },
  { icon: Workflow, title: "Inline comments + version history", body: "Comment on any node, snapshot every edit, one-click restore." },
  { icon: Layers, title: "20+ production templates", body: "Microservice, ETL, RACI, incident response, data flow, and more." },
  { icon: ShieldCheck, title: "SAML SSO + SCIM 2.0", body: "Okta, Azure AD, Google Workspace, JumpCloud, OneLogin." },
  { icon: Lock, title: "5-role RBAC + folder ACL", body: "Owner, Admin, Editor, Viewer, Guest. Per-folder overrides + groups." },
  { icon: Database, title: "Audit log + 7-year retention", body: "Every action logged. CSV/JSON export. SIEM-ready." },
  { icon: Code2, title: "Public REST API + webhooks", body: "/api/v1/maps with workspace API keys. HMAC-signed webhook payloads." },
  { icon: Plug, title: "MCP server connections", body: "Bring any MCP-compatible context source. Encrypted tokens." },
  { icon: Globe, title: "Public sharing + iframe embeds", body: "Read-only links with optional password. Embed in Notion/Confluence." },
  { icon: GitBranch, title: "Import from Draw.io, Lucidchart, Miro, CSV", body: "Native parsers preserve types and labels." },
  { icon: Workflow, title: "Export PNG / SVG / PDF / JSON", body: "Render at any resolution. JSON for version control." },
];

const BETA: Item[] = [
  { icon: Plug, title: "MCP server marketplace", body: "Curated catalog of MCP servers — one-click install per workspace." },
  { icon: AtSign, title: "Slack notifications", body: "Map updates and mentions in your team channels." },
  { icon: GitBranch, title: "GitHub two-way sync", body: "Map nodes ↔ GitHub issues and PRs. Status + assignee mirrored." },
  { icon: Brain, title: "Sidekick agent loops", body: "Multi-step research with checkpoints — Sidekick plans, executes, reviews." },
];

const SOON: Item[] = [
  { icon: AtSign, title: "@mentions + notifications inbox", body: "Tag teammates in comments. Email + in-app notification feed." },
  { icon: ListIcon, title: "Linear + Jira sync", body: "Bi-directional issue sync. Auto-create from blast radius." },
  { icon: Database, title: "Datadog / PagerDuty cards", body: "Live metric and incident overlays on dependency nodes." },
  { icon: Layers, title: "WebGL whiteboard renderer", body: "10× more shapes per canvas with native pan/zoom GPU acceleration." },
  { icon: Bell, title: "Map-change notifications", body: "Slack/email alerts when watched maps or nodes change." },
  { icon: Brain, title: "Custom Sidekick tools", body: "Workspace-defined tools the agent can call (your APIs, your data)." },
  { icon: Lock, title: "TOTP / 2FA", body: "Time-based one-time passwords for all users." },
  { icon: Workflow, title: "Saved graph queries", body: "Pin recurring queries (\"all services owned by team-checkout\") for one-click recall." },
  { icon: Globe, title: "Multi-region data residency", body: "AP/SE Asia regions. Currently US + EU." },
  { icon: ShieldCheck, title: "SOC 2 Type II report", body: "Audit underway. Expected Q3 2026." },
];

function ListIcon(props: any) {
  return <Workflow {...props} />;
}

export default function RoadmapPage() {
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
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(252, 109, 45, 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-12">
          <div className="max-w-3xl">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--gradient-warm-stop-1)" }}>
              Public roadmap
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              What ships today,
              <br />
              what&apos;s next.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted leading-relaxed">
              No marketing fluff. Every item below is either Live in production, in Beta with real users, or actively scheduled. We update this page every release.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/changelog"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                Read the changelog
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact?topic=feedback"
                className="inline-flex items-center gap-1.5 text-fg h-11 px-3 text-sm font-semibold hover:text-accent transition-colors"
              >
                Request a feature →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three columns */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-6">
            <RoadmapColumn
              title="Live"
              count={LIVE.length}
              icon={CheckCircle2}
              accent="success"
              caption="Shipped, in production, paying customers using it."
              items={LIVE}
            />
            <RoadmapColumn
              title="Beta"
              count={BETA.length}
              icon={Beaker}
              accent="warning"
              caption="Working with early customers — feature-flagged, rough edges expected."
              items={BETA}
            />
            <RoadmapColumn
              title="Coming soon"
              count={SOON.length}
              icon={Clock}
              accent="muted"
              caption="On the build queue. Order subject to customer demand."
              items={SOON}
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid lg:grid-cols-[1fr,2fr] gap-12">
            <div>
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
                How we ship
              </p>
              <h2 className="mt-3 text-3xl font-display font-bold tracking-tight text-fg leading-tight">
                Honest cadence.
                <br />
                Public artifacts.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Rocket, title: "Weekly releases", body: "We ship every Thursday. Most weeks include 3-5 user-visible changes." },
                { icon: GitBranch, title: "Public changelog", body: "Every release notes what shipped, what's new, what's fixed." },
                { icon: Users, title: "Customer-driven priority", body: "Beta customers get early access and steer the build order." },
                { icon: Eye, title: "No vaporware", body: "If it's not shipped, it's labeled Coming Soon. Never claim what we haven't built." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-border bg-panel p-5">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-subtle">
                    <c.icon className="h-4 w-4 text-fg-muted" />
                  </div>
                  <h3 className="mt-4 text-[14px] font-display font-semibold text-fg">{c.title}</h3>
                  <p className="mt-1.5 text-[13px] text-fg-muted leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div
            className="rounded-3xl border border-border p-12 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 2, 240, 0.06) 0%, rgba(0, 145, 255, 0.06) 100%)",
            }}
          >
            <h2 className="text-3xl font-display font-bold tracking-tight text-fg">
              Want something prioritized?
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              Beta customers steer the queue. Talk to us about what would unlock value for your team.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact?topic=feature-request"
                className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Request a feature
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                Try the live build
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function RoadmapColumn({
  title,
  count,
  icon: Icon,
  accent,
  caption,
  items,
}: {
  title: string;
  count: number;
  icon: any;
  accent: "success" | "warning" | "muted";
  caption: string;
  items: Item[];
}) {
  const accentStyles = {
    success: { bg: "var(--color-success-subtle)", fg: "var(--color-success)" },
    warning: { bg: "var(--color-warning-subtle)", fg: "var(--color-warning)" },
    muted: { bg: "var(--color-bg-muted)", fg: "var(--color-fg-muted)" },
  }[accent];

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: accentStyles.bg, color: accentStyles.fg }}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <h2 className="font-display text-lg font-bold text-fg">{title}</h2>
          </div>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{ background: accentStyles.bg, color: accentStyles.fg }}
          >
            {count}
          </span>
        </div>
        <p className="mt-2 text-[12px] text-fg-muted leading-relaxed">{caption}</p>
      </div>
      <ul className="divide-y divide-border flex-1">
        {items.map((item) => (
          <li key={item.title} className="px-6 py-4">
            <div className="flex items-start gap-3">
              <span
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-bg-subtle text-fg-muted"
              >
                <item.icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-display font-semibold text-fg">{item.title}</p>
                <p className="mt-0.5 text-[12px] text-fg-muted leading-relaxed">{item.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
