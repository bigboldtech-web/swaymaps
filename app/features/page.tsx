import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Workflow,
  Users,
  FolderTree,
  Zap,
  Lock,
  ShieldCheck,
  History,
  Webhook,
  FileCode2,
  Layers,
  GitBranch,
  Brain,
  Sparkles,
  Network,
  ListTree,
  Eye,
  Search,
  Keyboard,
  Download,
  Upload,
  Image as ImageIcon,
  Code2,
  Plug,
  Globe,
  MessageSquare,
  AtSign,
  Share2,
  Boxes,
  Clock,
  Database,
  Map as MapIcon,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Every capability SwayMaps delivers — canvas, AI Sidekick, real-time collaboration, enterprise security, integrations, and more.",
};

type Status = "live" | "beta" | "soon";

const StatusBadge = ({ s }: { s: Status }) => {
  const styles = {
    live: { bg: "var(--color-success-subtle)", fg: "var(--color-success)", label: "Live" },
    beta: { bg: "var(--color-warning-subtle)", fg: "var(--color-warning)", label: "Beta" },
    soon: { bg: "var(--color-bg-muted)", fg: "var(--color-fg-muted)", label: "Coming soon" },
  }[s];
  return (
    <span
      className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
      style={{ background: styles.bg, color: styles.fg, borderColor: styles.fg + "33" }}
    >
      {styles.label}
    </span>
  );
};

const SECTIONS: Array<{
  id: string;
  title: string;
  caption: string;
  description: string;
  gradient: string;
  items: Array<{ icon: any; title: string; body: string; status: Status }>;
}> = [
  {
    id: "canvas",
    title: "Canvas",
    caption: "Visual modeling",
    description: "A canvas built for systems, not pixels. 11 node kinds, 14 edge semantics, three views over the same graph.",
    gradient: "var(--gradient-cool)",
    items: [
      { icon: Network, title: "11 strongly-typed node kinds", body: "Person, System, Service, API, Database, Queue, Cache, Cloud, Team, Vendor, Generic. Each with distinct styling.", status: "live" },
      { icon: GitBranch, title: "14 typed edge semantics", body: "depends_on, calls, triggers, reads_from, writes_to, subscribes, publishes, authenticates, monitors, deploys_to, inherits, contains, proxies, custom.", status: "live" },
      { icon: Layers, title: "Three views of one graph", body: "Dependency map (directed), mind map (radial), flowchart (top-down). Same nodes, same edges, different lens.", status: "live" },
      { icon: Workflow, title: "Smart routing", body: "Bezier, smooth-step, and straight edge routing with automatic anchor selection.", status: "live" },
      { icon: Eye, title: "Mini-map + zoom controls", body: "Always know where you are in the graph. Zoom-to-fit, zoom-to-selection, fullscreen.", status: "live" },
      { icon: Search, title: "Canvas search & filter", body: "Cmd+F to search nodes by title, kind, owner, status, or tag with arrow navigation.", status: "live" },
      { icon: Keyboard, title: "Keyboard shortcuts", body: "Cmd+K palette, Cmd+Z undo, N to add, Del to remove, Cmd+D duplicate, Esc to clear.", status: "live" },
      { icon: History, title: "Undo/redo", body: "50-snapshot history, 300ms throttle. Never lose a thought.", status: "live" },
    ],
  },
  {
    id: "ai",
    title: "AI Sidekick",
    caption: "Graph-aware AI",
    description: "Claude-powered AI that reads the structure of your map, not the pixels. 8 graph-walk tools, propose-then-apply changes, vision input.",
    gradient: "var(--gradient-warm)",
    items: [
      { icon: GitBranch, title: "find_dependencies", body: "Walk upstream or downstream from any node up to 20 hops. Returns full graph with metadata.", status: "live" },
      { icon: Network, title: "find_path", body: "Shortest path between any two nodes — for impact analysis and change reviews.", status: "live" },
      { icon: Sparkles, title: "find_orphans", body: "Surface nodes with no owner, no edges, no status, no description. Cleanup in one query.", status: "live" },
      { icon: Eye, title: "find_critical_nodes", body: "Rank nodes by graph centrality. Identify single points of failure before incidents.", status: "live" },
      { icon: FileCode2, title: "generate_runbook", body: "Auto-generate markdown runbooks with dependencies, owners, incident response, links.", status: "live" },
      { icon: Search, title: "search_workspace_maps", body: "Cross-map workspace search — find anything across every map you can read.", status: "live" },
      { icon: ImageIcon, title: "Vision input", body: "Drop architecture diagrams, screenshots, PDFs; Sidekick extracts services and edges.", status: "live" },
      { icon: Sparkles, title: "Propose-then-apply", body: "Every change is a previewable proposal. Apply or discard. Never a surprise edit.", status: "live" },
      { icon: Plug, title: "MCP servers", body: "Connect any MCP-compatible tool. Pull live context from internal systems.", status: "beta" },
    ],
  },
  {
    id: "collab",
    title: "Real-time collaboration",
    caption: "Multiplayer that merges",
    description: "Built on Yjs CRDTs. Every keystroke, drag, and connection merges deterministically across every connected client.",
    gradient: "linear-gradient(135deg, #6647F0 0%, #16a34a 100%)",
    items: [
      { icon: Users, title: "Live cursors & presence", body: "See who's where, with name and color. Avatar pills with overflow count.", status: "live" },
      { icon: MessageSquare, title: "Inline comments", body: "Tag any node with a comment thread. Resolve in place. Reply with @mentions.", status: "live" },
      { icon: AtSign, title: "@mentions", body: "Tag teammates in comments to notify them in their feed and email.", status: "soon" },
      { icon: History, title: "Version history", body: "Snapshot on every meaningful edit. Diff viewer. One-click restore to any point.", status: "live" },
      { icon: Share2, title: "Public sharing", body: "Read-only links with optional password. Track view count and last viewed.", status: "live" },
      { icon: Globe, title: "Iframe embeds", body: "Embed read-only maps in Notion, Confluence, internal portals.", status: "live" },
    ],
  },
  {
    id: "rbac",
    title: "Workspaces & RBAC",
    caption: "Granular permissions",
    description: "Multi-workspace support with 5 roles, folder-level ACLs, group memberships, and SCIM-provisioned users.",
    gradient: "linear-gradient(135deg, #16a34a 0%, #0091FF 100%)",
    items: [
      { icon: Boxes, title: "Multiple workspaces", body: "Free: 1 workspace. Pro: 1. Team: unlimited. Enterprise: unlimited + SSO scoping.", status: "live" },
      { icon: ShieldCheck, title: "5 roles", body: "Owner, Admin, Editor, Viewer, Guest. Each with explicit capability matrix.", status: "live" },
      { icon: FolderTree, title: "Folders + ACL", body: "Unlimited-depth folder tree. Per-folder permissions (View, Edit, Admin) with inheritance.", status: "live" },
      { icon: Users, title: "Groups", body: "SCIM-provisioned or manually created. Use in folder ACLs for scalable permissioning.", status: "live" },
      { icon: AtSign, title: "Email invites", body: "Token-based invite links with expiry. Accept-then-create-account flow.", status: "live" },
    ],
  },
  {
    id: "sso",
    title: "Authentication & SSO",
    caption: "Enterprise auth",
    description: "Email + password, social providers, SAML SSO, SCIM 2.0. Enforced SSO with domain restrictions on Enterprise.",
    gradient: "linear-gradient(135deg, #FF02F0 0%, #6647F0 100%)",
    items: [
      { icon: Lock, title: "SAML 2.0 SSO", body: "Okta, Azure AD, OneLogin, JumpCloud, Google Workspace, any SAML IdP.", status: "live" },
      { icon: Users, title: "SCIM 2.0", body: "Auto-provision users and groups, deprovision on removal. Full CRUD + filters.", status: "live" },
      { icon: ShieldCheck, title: "Enforced SSO", body: "Per-workspace SSO enforcement with email-domain restriction.", status: "live" },
      { icon: Globe, title: "OAuth providers", body: "Google, GitHub built-in. Email + password as fallback.", status: "live" },
      { icon: ShieldCheck, title: "2FA / TOTP", body: "Time-based one-time passwords for all users.", status: "soon" },
    ],
  },
  {
    id: "scim",
    title: "Audit & compliance",
    caption: "Compliance-ready",
    description: "Every action logged, exportable, SIEM-streamable. Encryption everywhere. SOC 2 Type II in progress.",
    gradient: "linear-gradient(135deg, #0091FF 0%, #6647F0 100%)",
    items: [
      { icon: FileCode2, title: "Audit log", body: "Every workspace action recorded with actor, target, timestamp, IP.", status: "live" },
      { icon: Download, title: "Audit export", body: "CSV / JSON export. Filter by actor, action, time range, target.", status: "live" },
      { icon: Clock, title: "90-day to 7-year retention", body: "90 days standard, 7 years on Enterprise. SIEM streaming on request.", status: "live" },
      { icon: Lock, title: "Encryption at rest", body: "AES-256-GCM for all stored data including MCP auth tokens.", status: "live" },
      { icon: ShieldCheck, title: "TLS 1.3 in transit", body: "All API and WebSocket connections forced to TLS 1.3.", status: "live" },
      { icon: Boxes, title: "Data residency", body: "US default. EU on Enterprise. Single-tenant available.", status: "live" },
    ],
  },
  {
    id: "api",
    title: "API & integrations",
    caption: "Programmable workspace",
    description: "REST API, signed webhooks, MCP server connections, and a growing roster of native integrations.",
    gradient: "linear-gradient(135deg, #FC6D2D 0%, #16a34a 100%)",
    items: [
      { icon: Code2, title: "REST API", body: "/api/v1/maps with workspace-scoped API keys. Read/write permissions per key.", status: "live" },
      { icon: Webhook, title: "Signed webhooks", body: "Subscribe to map.created, node.updated, edge.deleted. HMAC-signed payloads.", status: "live" },
      { icon: Plug, title: "MCP server connections", body: "Workspace-scoped, encrypted. Bring your own context source.", status: "beta" },
      { icon: MessageSquare, title: "Slack notifications", body: "Map updates, comment mentions, new shares. Per-workspace channel routing.", status: "beta" },
      { icon: GitBranch, title: "GitHub", body: "Two-way sync of map nodes ↔ GitHub issues + PRs.", status: "soon" },
      { icon: ListTree, title: "Linear", body: "Map nodes ↔ Linear issues. Auto-create from blast radius.", status: "soon" },
    ],
  },
  {
    id: "import",
    title: "Import / Export",
    caption: "Move data freely",
    description: "Import from the tools you came from. Export anywhere. Your data, your control.",
    gradient: "linear-gradient(135deg, #6647F0 0%, #FC6D2D 100%)",
    items: [
      { icon: Upload, title: "Draw.io XML import", body: "Drop a .drawio or .xml file; we preserve node types and edge labels.", status: "live" },
      { icon: Upload, title: "Lucidchart CSV import", body: "Native parser for Lucidchart shape exports.", status: "live" },
      { icon: Upload, title: "Miro JSON import", body: "Bring sticky notes, shapes, and connectors over.", status: "live" },
      { icon: Upload, title: "CSV import", body: "Generic CSV → nodes/edges with header mapping.", status: "live" },
      { icon: Download, title: "PNG / SVG / PDF export", body: "Render any map at any resolution for docs and slides.", status: "live" },
      { icon: Download, title: "JSON export", body: "Full structural export — nodes, edges, metadata. Version-control friendly.", status: "live" },
    ],
  },
  {
    id: "templates",
    title: "Templates",
    caption: "Start with structure",
    description: "20+ production-ready templates across architecture, DevOps, compliance, org design, and more.",
    gradient: "linear-gradient(135deg, #0091FF 0%, #FC6D2D 100%)",
    items: [
      { icon: MapIcon, title: "Architecture (5)", body: "Microservice, AWS 3-tier, event-driven, serverless, Kubernetes.", status: "live" },
      { icon: Workflow, title: "DevOps (4)", body: "CI/CD, Git flow, monitoring, incident response.", status: "live" },
      { icon: Database, title: "Data & ML (3)", body: "ETL pipeline, ML pipeline, analytics stack.", status: "live" },
      { icon: ShieldCheck, title: "Compliance (3)", body: "Data flow (GDPR/SOC2), zero trust, disaster recovery.", status: "live" },
      { icon: Users, title: "Org design (3)", body: "Org chart, RACI matrix, service ownership.", status: "live" },
      { icon: Sparkles, title: "Custom templates", body: "Save any map as a workspace template. Track usage.", status: "live" },
    ],
  },
];

export default function FeaturesPage() {
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
          <div className="max-w-3xl">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              Features
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              Every capability,
              <br />
              all in one workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted leading-relaxed">
              SwayMaps ships with 100+ features across canvas, AI, collaboration, enterprise security, and integrations. Each feature below labeled <StatusBadge s="live" /> <StatusBadge s="beta" /> or <StatusBadge s="soon" /> so you know exactly what works today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                See the roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky section nav */}
      <nav className="sticky top-14 z-30 border-y border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 rounded-md px-3 py-1.5 text-[12px] font-medium text-fg-muted hover:text-fg hover:bg-bg-muted whitespace-nowrap"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Feature sections */}
      {SECTIONS.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          className={idx % 2 === 1 ? "border-y border-border bg-bg-subtle" : ""}
        >
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <div className="grid lg:grid-cols-[320px,1fr] gap-12">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                  style={{ background: section.gradient }}
                >
                  <span className="text-white font-display font-bold">{idx + 1}</span>
                </div>
                <p className="mt-4 font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                  {section.caption}
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold tracking-tight text-fg">
                  {section.title}
                </h2>
                <p className="mt-3 text-[14px] text-fg-muted leading-relaxed">
                  {section.description}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-xl border border-border bg-panel p-5 hover:border-border-strong hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-subtle">
                        <item.icon className="h-4 w-4 text-fg-muted" />
                      </div>
                      <StatusBadge s={item.status} />
                    </div>
                    <h3 className="mt-4 text-[14px] font-display font-semibold tracking-tight text-fg">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] text-fg-muted leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

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
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              See it in action.
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              The free workspace gives you the full Live feature set. No credit card.
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
