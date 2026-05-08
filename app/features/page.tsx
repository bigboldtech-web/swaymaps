import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight, Workflow, Users, FolderTree, Zap, Lock, ShieldCheck,
  History, Webhook, FileCode2, Layers, GitBranch,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Features",
  description: "Every capability SwayMaps delivers — for platform, security, and operations teams at Fortune 500 organizations.",
};

const FEATURES = [
  {
    section: "Modeling",
    items: [
      { icon: Workflow, title: "Dependency mapping", body: "Drag to connect systems, teams, processes, services. Strongly-typed node and edge metadata." },
      { icon: Layers, title: "11 node types", body: "Person, System, Service, API, Database, Queue, Cache, Process, External, Generic, Custom." },
      { icon: GitBranch, title: "Impact tracing", body: "Select any node to surface its full upstream and downstream graph in milliseconds." },
      { icon: FileCode2, title: "Custom fields", body: "Attach JSON metadata to any node. Owner, status, SLA, version, anything." },
    ],
  },
  {
    section: "Collaboration",
    items: [
      { icon: Users, title: "Real-time co-editing", body: "Cursor presence, conflict-free updates, live comments. Up to 25 collaborators per map." },
      { icon: History, title: "Version history", body: "Every change captured. Diff between revisions. One-click restore." },
      { icon: FolderTree, title: "Folders & nesting", body: "Unlimited-depth folder tree. Drag to reorganize. Per-folder ACL." },
    ],
  },
  {
    section: "Enterprise",
    items: [
      { icon: Lock, title: "SSO via SAML 2.0", body: "Okta, Azure AD, OneLogin, JumpCloud, and any SAML IdP." },
      { icon: ShieldCheck, title: "Granular RBAC", body: "Owner / Admin / Editor / Viewer / Guest. Per-folder ACL with inheritance." },
      { icon: ShieldCheck, title: "SCIM 2.0", body: "Auto-provision and de-provision users and groups via your identity provider." },
      { icon: FileCode2, title: "Audit log + export", body: "Every action recorded. CSV / JSON export. SIEM-ready." },
    ],
  },
  {
    section: "Integrations",
    items: [
      { icon: Webhook, title: "API & webhooks", body: "Programmatic access. Subscribe to map and folder events." },
      { icon: Zap, title: "Slack & Teams", body: "Notifications for shares, comments, and changes." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-fg">
            Capabilities, in detail.
          </h1>
          <p className="mt-4 text-md text-fg-muted max-w-2xl mx-auto">
            Everything SwayMaps does, grouped by where it shows up in your workflow.
          </p>
        </div>
      </section>

      {FEATURES.map((group) => (
        <section key={group.section} className="border-b border-border">
          <div className="mx-auto max-w-[1100px] px-6 py-16">
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {group.section}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
              {group.section} capabilities
            </h2>
            <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-2 border border-border rounded-md overflow-hidden">
              {group.items.map((f) => (
                <div key={f.title} className="bg-panel p-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-bg-muted text-fg">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-md font-semibold text-fg">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-panel p-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-fg">
                Ready to see it in your workspace?
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                Start free. No credit card. Upgrade to enterprise when you need it.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-accent-fg h-9 px-4 text-sm font-medium hover:bg-accent-hover"
              >
                Start free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel text-fg h-9 px-4 text-sm font-medium hover:bg-bg-muted"
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
