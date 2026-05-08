import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Lock, Workflow, FileCode2, Users, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MAP_TYPES } from "@/lib/mapTypes";

export const metadata: Metadata = {
  title: "SwayMaps — The visual workspace for systems, ideas, and teams",
  description:
    "One canvas for every kind of map. Dependency intelligence, whiteboards, mind maps, flowcharts, kanbans, org charts, and product flows — all in one enterprise-grade workspace.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-20 sm:pt-32 sm:pb-24">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Built for Fortune 500 teams · SOC 2 in progress
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-fg">
              The visual workspace for
              <span className="block text-fg-muted">systems, ideas, and teams.</span>
            </h1>
            <p className="mt-5 max-w-xl text-md text-fg-muted">
              SwayMaps is one workspace for every kind of map your organization
              draws — dependency graphs, whiteboards, mind maps, flowcharts,
              kanban boards, org charts, and product flows. Pick the right shape
              for what you&apos;re modelling. Bring everyone into the same canvas.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-accent-fg h-10 px-5 text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact?topic=demo"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel text-fg h-10 px-5 text-sm font-medium hover:bg-bg-muted transition-colors"
              >
                Book a demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-fg-subtle">
              Free workspace · No credit card · SSO &amp; SCIM available on Enterprise
            </p>
          </div>
        </div>

        {/* Subtle grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--color-fg) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
          }}
        />
      </section>

      {/* ─── Format showcase ─── */}
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Seven formats. One workspace.
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
              The right shape for every job.
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              Strongly-typed dependency graphs are still our flagship. But
              brainstorms aren&apos;t graphs and roadmaps aren&apos;t whiteboards —
              so we made room for the shapes your team actually needs.
            </p>
          </div>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-md overflow-hidden">
            {MAP_TYPES.map((t) => (
              <div key={t.id} className="bg-panel p-5 flex flex-col">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-bg-muted text-fg">
                  <t.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-fg">{t.label}</h3>
                <p className="mt-1.5 text-xs text-fg-muted leading-relaxed flex-1">
                  {t.blurb}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {t.examples.slice(0, 2).map((ex) => (
                    <span
                      key={ex}
                      className="text-[10px] text-fg-subtle border border-border rounded-xs px-1.5 h-[18px] inline-flex items-center"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why one workspace ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Why one workspace
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
              Every map your team draws, in one place.
            </h2>
          </div>
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-md overflow-hidden">
            {WHY.map((w) => (
              <div key={w.title} className="bg-panel p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-bg-muted text-fg">
                  <w.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-md font-semibold text-fg">{w.title}</h3>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Logo bar ─── */}
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-10">
          <p className="text-center text-xs uppercase tracking-wide text-fg-subtle">
            Trusted by platform, security, and operations teams
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["Atlas Bank", "Northwind Health", "Kepler Aerospace", "Pinetree Logistics", "Vela Telecom", "Halcyon Insurance"].map((name) => (
              <span key={name} className="text-sm font-medium text-fg-muted">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Enterprise band ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr,1.2fr] items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-accent">Enterprise</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                Built for the security and procurement bar of Fortune 500.
              </h2>
              <p className="mt-3 text-md text-fg-muted">
                We meet IT, security, and legal where they are. SSO, granular
                permissions, audit trails, data residency, and a clear roadmap to
                the certifications enterprise procurement requires.
              </p>
              <Link
                href="/trust"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
              >
                Read the security overview
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ul className="grid gap-px bg-border border border-border rounded-md overflow-hidden sm:grid-cols-2">
              {ENTERPRISE.map((b) => (
                <li key={b.title} className="bg-panel p-5">
                  <div className="flex items-center gap-2">
                    <b.icon className="h-3.5 w-3.5 text-fg-muted" />
                    <span className="text-sm font-semibold text-fg">{b.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="rounded-md border border-border bg-panel px-8 py-12 sm:px-12 sm:py-16">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
                One workspace for every map your team draws.
              </h2>
              <p className="mt-3 text-md text-fg-muted">
                Start with a free workspace. Pick any format. Add SSO, SCIM, and
                granular controls when you&apos;re ready to roll out across the
                business.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-accent-fg h-10 px-5 text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Start free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel text-fg h-10 px-5 text-sm font-medium hover:bg-bg-muted transition-colors"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

const WHY = [
  {
    icon: Workflow,
    title: "One source of truth",
    body: "All your team's diagrams in one workspace, not scattered across five tools. Search across them. Link between them.",
  },
  {
    icon: Users,
    title: "Real-time co-editing",
    body: "Cursor presence, comments, and version history come standard on every format.",
  },
  {
    icon: FileCode2,
    title: "Folders & nesting",
    body: "Organize by domain, business unit, or project. Drag-and-drop. Per-folder permissions.",
  },
  {
    icon: Zap,
    title: "Pick the right shape",
    body: "A whiteboard for brainstorms, a flowchart for processes, a dependency graph for systems. Use the right format every time.",
  },
  {
    icon: Lock,
    title: "Granular access control",
    body: "Workspace roles, folder ACLs, and group-based permissions sourced from your identity provider.",
  },
  {
    icon: ShieldCheck,
    title: "Audit and compliance",
    body: "Every change is logged. Export, filter, integrate with your SIEM. SOC 2 in progress.",
  },
];

const ENTERPRISE = [
  { icon: Lock, title: "SSO via SAML 2.0", body: "Okta, Azure AD, OneLogin, JumpCloud, and any SAML IdP." },
  { icon: Users, title: "SCIM 2.0 provisioning", body: "Auto-provision and de-provision users and groups." },
  { icon: ShieldCheck, title: "Granular RBAC", body: "Owner, Admin, Editor, Viewer. Per-folder ACL overrides." },
  { icon: FileCode2, title: "Audit log + export", body: "Every action recorded. CSV / JSON export. SIEM-ready." },
  { icon: Workflow, title: "API & webhooks", body: "Programmatic access for platform integrations and ETL." },
  { icon: Zap, title: "Data residency", body: "US default. EU on Enterprise. Single-tenant available." },
];
