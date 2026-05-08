import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Lock,
  ShieldCheck,
  Users,
  FileCode2,
  Eye,
  Globe,
  Database,
  Boxes,
  Workflow,
  Cloud,
  Key,
  ServerCog,
  ShieldAlert,
  Network,
  Plug,
  Bell,
  Clock,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Security — Encryption, SSO, SCIM, audit, residency",
  description:
    "How SwayMaps protects your data. SAML SSO, SCIM 2.0, AES-256 encryption, audit log, single-tenant deployments, SOC 2 in progress.",
};

const PILLARS = [
  {
    icon: Lock,
    title: "Encryption",
    body:
      "AES-256-GCM at rest for all stored data, including MCP auth tokens. TLS 1.3 in transit. Encryption keys rotated quarterly.",
    items: [
      "AES-256-GCM at rest",
      "TLS 1.3 in transit",
      "Encrypted MCP tokens",
      "Quarterly key rotation",
    ],
    gradient: "linear-gradient(135deg, #6647F0 0%, #0091FF 100%)",
  },
  {
    icon: ShieldCheck,
    title: "Identity & access",
    body:
      "SAML 2.0 SSO via BoxyHQ Jackson, SCIM 2.0 for auto-provisioning, 5-role RBAC with per-folder ACLs and group-based scoping.",
    items: [
      "SAML 2.0 (Okta, Azure AD, JumpCloud)",
      "SCIM 2.0 user + group sync",
      "5-role RBAC + folder ACLs",
      "Workspace-enforced SSO",
    ],
    gradient: "linear-gradient(135deg, #0091FF 0%, #16a34a 100%)",
  },
  {
    icon: FileCode2,
    title: "Audit & monitoring",
    body:
      "Every workspace action logged with actor, target, timestamp, IP. Exportable to CSV/JSON. SIEM streaming on Enterprise.",
    items: [
      "Audit log per action",
      "CSV / JSON export",
      "90-day to 7-year retention",
      "SIEM streaming (Enterprise)",
    ],
    gradient: "linear-gradient(135deg, #FC6D2D 0%, #FF02F0 100%)",
  },
  {
    icon: Globe,
    title: "Data residency & isolation",
    body:
      "US default, EU on Enterprise. Single-tenant deployments available for regulated industries. Customer data isolated at the row level by workspace.",
    items: [
      "US data center (default)",
      "EU data center (Enterprise)",
      "Single-tenant available",
      "Per-workspace isolation",
    ],
    gradient: "linear-gradient(135deg, #FF02F0 0%, #FC6D2D 100%)",
  },
];

const COMPLIANCE = [
  { icon: ShieldCheck, title: "SOC 2 Type II", status: "In progress · Q3 2026", color: "var(--color-warning)" },
  { icon: ShieldCheck, title: "GDPR", status: "Ready", color: "var(--color-success)" },
  { icon: ShieldCheck, title: "CCPA", status: "Ready", color: "var(--color-success)" },
  { icon: ShieldCheck, title: "ISO 27001", status: "On roadmap", color: "var(--color-fg-muted)" },
  { icon: ShieldCheck, title: "HIPAA", status: "BAA available (Enterprise)", color: "var(--color-success)" },
  { icon: ShieldCheck, title: "DPA / SCC", status: "Available", color: "var(--color-success)" },
];

const PRACTICES = [
  { icon: Eye, title: "Vulnerability disclosure", body: "Responsible disclosure program. Email security@swaymaps.com." },
  { icon: ServerCog, title: "Penetration testing", body: "Annual third-party pentest. Summary available under NDA." },
  { icon: Bell, title: "Incident response", body: "24/7 on-call. SLA-bound notifications for affected customers." },
  { icon: Database, title: "Backups", body: "Hourly snapshots, 30-day retention, cross-region replication." },
  { icon: Cloud, title: "Infrastructure", body: "AWS multi-AZ. Hardened images. Least-privilege IAM." },
  { icon: Network, title: "Network segmentation", body: "VPC isolation. No public DB access. Bastion-only admin paths." },
  { icon: Key, title: "Secrets management", body: "AWS Secrets Manager. No plaintext secrets in code or config." },
  { icon: Workflow, title: "SDLC controls", body: "Mandatory PR review, automated SAST, signed commits in production." },
];

export default function SecurityPage() {
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
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34, 197, 94, 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-12">
          <div className="max-w-3xl">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-success">
              Security
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              Built for the procurement bar
              <br />
              your security team set.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted leading-relaxed">
              Encryption everywhere, SSO + SCIM as table stakes, audit logs the auditors actually accept, and single-tenant deployments for regulated industries.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/trust"
                className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Trust Center
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact?topic=security"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                Request DPA / pentest summary
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-6">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-panel p-7">
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-sm"
                  style={{ background: p.gradient }}
                >
                  <p.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-display font-bold tracking-tight text-fg">
                  {p.title}
                </h3>
                <p className="mt-2 text-[14px] text-fg-muted leading-relaxed">{p.body}</p>
                <ul className="mt-5 space-y-2 text-[13px]">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 mt-0.5 text-success shrink-0" />
                      <span className="text-fg-muted">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section>
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              Compliance
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              Audit-ready, today.
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              We label what&apos;s active vs in-progress so procurement teams know exactly what they&apos;re signing up for.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPLIANCE.map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-panel p-5 flex items-center gap-4">
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ background: `${c.color}1A` }}
                >
                  <c.icon className="h-5 w-5" style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-[14px] font-display font-semibold text-fg">{c.title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: c.color }}>
                    {c.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practices */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div className="grid lg:grid-cols-[320px,1fr] gap-12">
            <div>
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                Operational practices
              </p>
              <h2 className="mt-3 text-3xl font-display font-bold tracking-tight text-fg leading-tight">
                The practices behind the platform.
              </h2>
              <p className="mt-3 text-[14px] text-fg-muted leading-relaxed">
                What we do day-to-day so the controls keep working.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {PRACTICES.map((p) => (
                <div key={p.title} className="rounded-xl border border-border bg-panel p-5">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bg-subtle">
                    <p.icon className="h-4 w-4 text-fg-muted" />
                  </div>
                  <h3 className="mt-4 text-[14px] font-display font-semibold text-fg">{p.title}</h3>
                  <p className="mt-1.5 text-[13px] text-fg-muted leading-relaxed">{p.body}</p>
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
                "linear-gradient(135deg, rgba(102, 71, 240, 0.06) 0%, rgba(34, 197, 94, 0.06) 100%)",
            }}
          >
            <ShieldCheck className="h-10 w-10 mx-auto text-success" />
            <h2 className="mt-4 text-3xl font-display font-bold tracking-tight text-fg">
              Need our DPA, pentest summary, or BAA?
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              All available under NDA. Reach out to security@swaymaps.com or talk to sales.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact?topic=security"
                className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Contact security
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/trust"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                Visit Trust Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
