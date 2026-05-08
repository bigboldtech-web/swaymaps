import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  MessageSquare,
  GitBranch,
  KanbanSquare,
  ListTree,
  FileCode2,
  Database,
  Zap,
  Plug,
  Globe,
  Code2,
  Webhook,
  ShieldCheck,
  Cloud,
  Bell,
  Box,
  GitPullRequest,
  Network,
  BookOpen,
  Bot,
  Mail,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Integrations — Slack, GitHub, Linear, MCP, REST API",
  description:
    "Connect SwayMaps to the tools you already use. Slack, GitHub, Linear, Jira, Notion, Datadog, MCP servers, and a public REST API.",
};

type Integration = {
  name: string;
  blurb: string;
  icon: any;
  color: string;
  category: "communication" | "code" | "monitoring" | "docs" | "platform";
  status: "live" | "beta" | "soon";
};

const ALL: Integration[] = [
  // Communication
  { name: "Slack", blurb: "Map updates and mentions in your team channels.", icon: MessageSquare, color: "#4A154B", category: "communication", status: "beta" },
  { name: "Microsoft Teams", blurb: "Same as Slack, native to Teams channels.", icon: MessageSquare, color: "#5059C9", category: "communication", status: "soon" },
  { name: "Email digests", blurb: "Daily/weekly summaries of map changes you watch.", icon: Mail, color: "#0091FF", category: "communication", status: "soon" },
  { name: "PagerDuty", blurb: "Incident overlays on dependency nodes; sync escalation policies.", icon: Bell, color: "#06AC38", category: "communication", status: "soon" },
  // Code
  { name: "GitHub", blurb: "Two-way sync between map nodes and GitHub issues, PRs.", icon: GitBranch, color: "#181717", category: "code", status: "beta" },
  { name: "GitLab", blurb: "Same as GitHub, for GitLab projects.", icon: GitPullRequest, color: "#FC6D26", category: "code", status: "soon" },
  { name: "Bitbucket", blurb: "Repo-to-node sync for Bitbucket teams.", icon: GitBranch, color: "#0052CC", category: "code", status: "soon" },
  { name: "Linear", blurb: "Map nodes ↔ Linear issues. Auto-create from blast radius.", icon: ListTree, color: "#5E6AD2", category: "code", status: "soon" },
  { name: "Jira", blurb: "Bi-directional issue sync with Jira projects.", icon: KanbanSquare, color: "#0052CC", category: "code", status: "soon" },
  // Monitoring
  { name: "Datadog", blurb: "Live metric overlays on service dependency nodes.", icon: Database, color: "#632CA6", category: "monitoring", status: "soon" },
  { name: "New Relic", blurb: "APM trace context surfaced in node side panel.", icon: Network, color: "#00AC69", category: "monitoring", status: "soon" },
  { name: "Sentry", blurb: "Error rate badges on services in dependency view.", icon: Zap, color: "#362D59", category: "monitoring", status: "soon" },
  { name: "Grafana", blurb: "Embed dashboards as panels in dependency maps.", icon: Database, color: "#F46800", category: "monitoring", status: "soon" },
  // Docs
  { name: "Notion", blurb: "Embed Notion pages in nodes; map nodes from Notion DBs.", icon: FileCode2, color: "#000000", category: "docs", status: "soon" },
  { name: "Confluence", blurb: "Embed Confluence pages; sync runbooks from spaces.", icon: BookOpen, color: "#172B4D", category: "docs", status: "soon" },
  { name: "Google Drive", blurb: "Attach Drive files to nodes with permission preserved.", icon: Cloud, color: "#0F9D58", category: "docs", status: "soon" },
  // Platform
  { name: "MCP servers", blurb: "Bring any MCP-compatible context source. Encrypted tokens.", icon: Plug, color: "#FF02F0", category: "platform", status: "live" },
  { name: "REST API", blurb: "/api/v1/maps with workspace API keys. Read/write per key.", icon: Code2, color: "#52525b", category: "platform", status: "live" },
  { name: "Signed webhooks", blurb: "Subscribe to map.created, node.updated, edge.deleted.", icon: Webhook, color: "#0091FF", category: "platform", status: "live" },
  { name: "Zapier", blurb: "1,000+ apps via Zapier triggers and actions.", icon: Bot, color: "#FF4F00", category: "platform", status: "soon" },
  { name: "AWS S3", blurb: "Backup and snapshot exports to S3 buckets.", icon: Box, color: "#FF9900", category: "platform", status: "soon" },
  { name: "Okta / Azure AD", blurb: "SAML SSO + SCIM 2.0. Enforced per workspace.", icon: ShieldCheck, color: "#007DC1", category: "platform", status: "live" },
];

const CATEGORIES = [
  { id: "communication", label: "Communication" },
  { id: "code", label: "Code & PM" },
  { id: "monitoring", label: "Monitoring" },
  { id: "docs", label: "Docs & Wikis" },
  { id: "platform", label: "Platform & Auth" },
] as const;

const STATUS_LABEL = {
  live: { label: "Live", style: "text-success bg-success-subtle border-success/20" },
  beta: { label: "Beta", style: "text-warning bg-warning-subtle border-warning/20" },
  soon: { label: "Coming soon", style: "text-fg-muted bg-bg-muted border-border" },
};

export default function IntegrationsPage() {
  const live = ALL.filter((i) => i.status === "live").length;
  const beta = ALL.filter((i) => i.status === "beta").length;
  const soon = ALL.filter((i) => i.status === "soon").length;

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
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0, 145, 255, 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-12">
          <div className="max-w-3xl">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              Integrations
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              Connect SwayMaps
              <br />
              to your stack.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted leading-relaxed">
              Native integrations with Slack, GitHub, Linear, Jira, Notion, Datadog, and more — plus a REST API, webhooks, and MCP server connections to wire up anything.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                <span className="inline-block h-2 w-2 rounded-full bg-success" />
                {live} Live
              </span>
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                <span className="inline-block h-2 w-2 rounded-full bg-warning" />
                {beta} Beta
              </span>
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                <span className="inline-block h-2 w-2 rounded-full bg-fg-disabled" />
                {soon} Coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {CATEGORIES.map((cat, idx) => {
        const items = ALL.filter((i) => i.category === cat.id);
        return (
          <section
            key={cat.id}
            id={cat.id}
            className={idx % 2 === 0 ? "border-t border-border bg-bg-subtle" : "border-t border-border"}
          >
            <div className="mx-auto max-w-[1200px] px-6 py-16">
              <div className="flex items-end justify-between gap-6 mb-8">
                <h2 className="text-2xl font-display font-bold tracking-tight text-fg">
                  {cat.label}
                </h2>
                <span className="text-[12px] text-fg-muted">{items.length} integration{items.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((i) => (
                  <div
                    key={i.name}
                    className="group rounded-xl border border-border bg-panel p-5 hover:border-border-strong hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ background: `${i.color}14` }}
                      >
                        <i.icon className="h-5 w-5" style={{ color: i.color }} />
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${STATUS_LABEL[i.status].style}`}
                      >
                        {STATUS_LABEL[i.status].label}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[14px] font-display font-semibold text-fg">{i.name}</h3>
                    <p className="mt-1.5 text-[13px] text-fg-muted leading-relaxed">{i.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Build your own */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--gradient-warm-stop-1)" }}>
                Build your own
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
                If we don&apos;t integrate with it,
                <br />
                build the integration in an afternoon.
              </h2>
              <p className="mt-4 text-md text-fg-muted leading-relaxed">
                Three primitives let you wire up anything: a REST API for read/write, signed webhooks for push, and MCP servers for AI context.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/docs/api-reference"
                  className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md transition-all"
                  style={{ background: "var(--gradient-cool)" }}
                >
                  Read the API docs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact?topic=integration"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
                >
                  Request an integration
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-panel p-6 font-mono text-[12px] overflow-hidden">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                <span className="inline-block h-2 w-2 rounded-full bg-danger" />
                <span className="inline-block h-2 w-2 rounded-full bg-warning" />
                <span className="inline-block h-2 w-2 rounded-full bg-success" />
                <span className="ml-2 text-fg-subtle text-[11px]">curl · POST node</span>
              </div>
              <pre className="text-fg-muted leading-relaxed overflow-x-auto"><code>{`curl -X POST https://api.swaymaps.com/v1/maps/$MAP_ID/nodes \\
  -H "Authorization: Bearer $SWM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "kind": "service",
    "title": "Order Service",
    "owner": "team-checkout",
    "metadata": {
      "sla": "99.9",
      "runbook": "https://wiki/order-svc"
    }
  }'`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div
            className="rounded-3xl border border-border p-12 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 71, 240, 0.06) 0%, rgba(255, 2, 240, 0.06) 100%)",
            }}
          >
            <h2 className="text-3xl font-display font-bold tracking-tight text-fg">
              Get started in 60 seconds.
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              Free workspace, no credit card. The REST API and MCP connections are available on every paid plan.
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
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
