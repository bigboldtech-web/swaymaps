"use client";

import Link from "next/link";
import * as React from "react";
import {
  Menu,
  X,
  ChevronDown,
  Network,
  Users,
  Sparkles,
  ShieldCheck,
  Workflow,
  Layers,
  Boxes,
  GitBranch,
  Brain,
  Gauge,
  FileText,
  BookOpen,
  GraduationCap,
  Rocket,
  Wrench,
  Map as MapIcon,
  ShieldAlert,
  Building2,
  Code2,
  HeartHandshake,
} from "lucide-react";
import { SwayMapsIcon } from "@/components/SwayMapsLogo";
import { ThemeToggle } from "./ThemeToggle";

type MenuLink = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: "Live" | "Beta" | "Coming soon";
};

type MenuColumn = { title: string; links: MenuLink[] };

const PRODUCT_MENU: MenuColumn[] = [
  {
    title: "Capabilities",
    links: [
      { label: "Visual canvas", href: "/features#canvas", icon: Network, description: "11 node types, typed edges, smart routing" },
      { label: "Real-time collaboration", href: "/features#collab", icon: Users, description: "Yjs CRDT — full edit sync, not just cursors", badge: "Live" },
      { label: "AI Sidekick", href: "/features#ai", icon: Sparkles, description: "Claude-powered agent with 8 tools", badge: "Live" },
      { label: "Version history", href: "/features#history", icon: GitBranch, description: "Snapshot every edit, one-click restore" },
      { label: "Public sharing & embeds", href: "/features#share", icon: Layers, description: "Read-only links, iframe embeds, password" },
      { label: "Audit log", href: "/features#audit", icon: Gauge, description: "Every action logged, CSV/JSON export" },
    ],
  },
  {
    title: "Views",
    links: [
      { label: "Dependency map", href: "/features#canvas", icon: Network, description: "Typed edges, blast radius, ownership" },
      { label: "Mind map", href: "/features#canvas", icon: Brain, description: "Same graph, radial layout" },
      { label: "Flowchart", href: "/features#canvas", icon: Workflow, description: "Same graph, top-down path view" },
      { label: "Templates gallery", href: "/templates-gallery", icon: Layers, description: "20+ ready-to-use maps" },
      { label: "Import (Lucid, Miro, Drawio)", href: "/features#import", icon: Layers, description: "Bring your existing diagrams over" },
    ],
  },
  {
    title: "Enterprise",
    links: [
      { label: "SSO (SAML)", href: "/features#sso", icon: ShieldCheck, description: "Okta, Azure AD, Google Workspace" },
      { label: "SCIM provisioning", href: "/features#scim", icon: Users, description: "Auto-provision and deprovision users" },
      { label: "RBAC & folders", href: "/features#rbac", icon: Boxes, description: "5 roles, folder ACLs, group permissions" },
      { label: "MCP servers", href: "/features#mcp", icon: Code2, description: "Connect any MCP-compatible tool", badge: "Beta" },
      { label: "API & webhooks", href: "/features#api", icon: GitBranch, description: "REST API, signed webhooks" },
      { label: "Trust & security", href: "/trust", icon: ShieldAlert, description: "SOC 2, GDPR, encryption at rest" },
    ],
  },
];

const SOLUTIONS_MENU: MenuColumn[] = [
  {
    title: "By role",
    links: [
      { label: "Engineering", href: "/use-cases#engineering", icon: Code2, description: "Service maps, blast radius, on-call" },
      { label: "Product", href: "/use-cases#product", icon: Rocket, description: "Roadmaps, user flows, dependencies" },
      { label: "Operations", href: "/use-cases#operations", icon: Workflow, description: "Runbooks, SOPs, incident playbooks" },
      { label: "Security", href: "/use-cases#security", icon: ShieldCheck, description: "Data flow, zero-trust, vendor risk" },
      { label: "Leadership", href: "/use-cases#leadership", icon: Building2, description: "Org charts, RACI, strategy maps" },
    ],
  },
  {
    title: "By team",
    links: [
      { label: "Platform engineering", href: "/use-cases#platform", icon: Network, description: "Internal developer platform maps" },
      { label: "DevOps & SRE", href: "/use-cases#devops", icon: Wrench, description: "CI/CD, monitoring, incident response" },
      { label: "Data & ML", href: "/use-cases#data", icon: Boxes, description: "ETL, ML pipelines, lineage" },
      { label: "GRC & compliance", href: "/use-cases#grc", icon: ShieldAlert, description: "SOC 2, GDPR, audit-ready maps" },
      { label: "Customer success", href: "/use-cases#cs", icon: HeartHandshake, description: "Onboarding flows, account maps" },
    ],
  },
  {
    title: "By workflow",
    links: [
      { label: "Architecture review", href: "/use-cases/architecture", icon: Layers },
      { label: "Incident playbooks", href: "/use-cases/incidents", icon: ShieldAlert },
      { label: "Migration planning", href: "/use-cases/migration", icon: GitBranch },
      { label: "Vendor assessments", href: "/use-cases/vendors", icon: Building2 },
      { label: "Onboarding maps", href: "/use-cases/onboarding", icon: GraduationCap },
    ],
  },
];

const RESOURCES_MENU: MenuColumn[] = [
  {
    title: "Learn",
    links: [
      { label: "Docs", href: "/docs", icon: BookOpen, description: "Setup, API reference, guides" },
      { label: "Blog", href: "/blog", icon: FileText, description: "Engineering essays + customer stories" },
      { label: "Templates", href: "/templates-gallery", icon: MapIcon, description: "20+ ready-to-use maps" },
      { label: "Changelog", href: "/changelog", icon: Sparkles, description: "What shipped this week" },
      { label: "Roadmap", href: "/roadmap", icon: Rocket, description: "What's Live, Beta, Coming soon" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "vs Miro", href: "/compare/miro", description: "When typed edges matter more than freeform" },
      { label: "vs ClickUp", href: "/compare/clickup", description: "Maps + AI for engineering, not project mgmt" },
      { label: "vs Lucidchart", href: "/compare/lucidchart", description: "Live data, AI, and CRDT collab" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Trust Center", href: "/trust", icon: ShieldCheck },
      { label: "Security", href: "/security", icon: ShieldAlert },
      { label: "Status", href: "https://status.swaymaps.com", icon: Gauge },
      { label: "Customers", href: "/customers", icon: Users },
    ],
  },
];

type TopLink =
  | { label: string; menu: MenuColumn[] }
  | { label: string; href: string };

const TOP_LINKS: TopLink[] = [
  { label: "Product", menu: PRODUCT_MENU },
  { label: "Solutions", menu: SOLUTIONS_MENU },
  { label: "Resources", menu: RESOURCES_MENU },
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/customers" },
];

export function MarketingNav() {
  const [open, setOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = React.useState<NodeJS.Timeout | null>(null);

  const handleEnter = (label: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveMenu(label);
  };
  const handleLeave = () => {
    const t = setTimeout(() => setActiveMenu(null), 120);
    setHoverTimeout(t);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <SwayMapsIcon size={22} />
            <span className="font-display text-[15px] font-bold tracking-tight text-fg">SwayMaps</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={handleLeave}>
            {TOP_LINKS.map((item) => {
              if ("menu" in item) {
                const isOpen = activeMenu === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleEnter(item.label)}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                        isOpen ? "text-fg bg-bg-muted" : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-[13px] font-medium text-fg-muted hover:text-fg hover:bg-bg-muted transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/auth/signin"
            className="text-[13px] font-medium text-fg-muted hover:text-fg transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center rounded-md bg-fg text-bg h-8 px-3.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Start free
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-md h-8 px-3.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundImage: "var(--gradient-cool)" }}
          >
            Talk to sales
          </Link>
        </div>
        <button
          className="lg:hidden p-1.5 text-fg"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop mega-menu drawer */}
      {activeMenu && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-14 border-b border-border bg-panel shadow-lg animate-fade-in"
          onMouseEnter={() => activeMenu && handleEnter(activeMenu)}
          onMouseLeave={handleLeave}
        >
          <div className="mx-auto max-w-[1280px] px-6 py-8">
            {TOP_LINKS.filter((i) => "menu" in i && i.label === activeMenu).map((item) =>
              "menu" in item ? <MegaMenu key={item.label} columns={item.menu} /> : null
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-bg max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="px-6 py-4 flex flex-col gap-1">
            {TOP_LINKS.map((item) => {
              if ("menu" in item) {
                return (
                  <details key={item.label} className="group">
                    <summary className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-semibold text-fg cursor-pointer list-none">
                      {item.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pl-2 pb-2">
                      {item.menu.map((col) => (
                        <div key={col.title} className="mt-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle px-2">
                            {col.title}
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {col.links.map((l) => (
                              <li key={l.href}>
                                <Link
                                  href={l.href}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-md px-2 py-1.5 text-sm text-fg-muted hover:bg-bg-muted hover:text-fg"
                                >
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm font-semibold text-fg hover:bg-bg-muted"
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <ThemeToggle />
              <Link
                href="/auth/signin"
                className="flex-1 rounded-md border border-border bg-panel text-center h-9 inline-flex items-center justify-center text-sm font-medium text-fg hover:bg-bg-muted"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 rounded-md bg-fg text-bg text-center h-9 inline-flex items-center justify-center text-sm font-semibold"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MegaMenu({ columns }: { columns: MenuColumn[] }) {
  return (
    <div className="grid grid-cols-3 gap-8">
      {columns.map((col) => (
        <div key={col.title}>
          <p className="font-eyebrow text-[11px] font-medium uppercase tracking-[0.12em] text-fg-subtle">
            {col.title}
          </p>
          <ul className="mt-3 space-y-1">
            {col.links.map((l) => {
              const Icon = l.icon;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-start gap-3 rounded-md px-2 py-2 hover:bg-bg-muted transition-colors"
                  >
                    {Icon && (
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-fg-muted group-hover:text-fg">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-fg">{l.label}</span>
                        {l.badge && <Badge kind={l.badge} />}
                      </span>
                      {l.description && (
                        <span className="mt-0.5 block text-[12px] leading-snug text-fg-muted">
                          {l.description}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Badge({ kind }: { kind: "Live" | "Beta" | "Coming soon" }) {
  const styles =
    kind === "Live"
      ? "bg-success-subtle text-success border-success/20"
      : kind === "Beta"
      ? "bg-warning-subtle text-warning border-warning/20"
      : "bg-bg-muted text-fg-muted border-border";
  return (
    <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${styles}`}>
      {kind}
    </span>
  );
}
