import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Mail, ShieldCheck, Lock, Database, Globe2, FileCheck, AlertTriangle } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Trust & Security",
  description: "How SwayMaps protects your data, supports compliance reviews, and keeps you in control.",
};

const SUBPROCESSORS = [
  { name: "AWS", purpose: "Application hosting and database", region: "us-east-1, eu-west-1 (Enterprise)", url: "https://aws.amazon.com" },
  { name: "Stripe", purpose: "Payment processing", region: "Global", url: "https://stripe.com" },
  { name: "Resend", purpose: "Transactional email", region: "Global", url: "https://resend.com" },
  { name: "Cloudflare", purpose: "CDN and DDoS mitigation", region: "Global", url: "https://cloudflare.com" },
];

const PRACTICES = [
  {
    icon: Lock,
    title: "Encryption",
    body: "TLS 1.2+ for all traffic in transit. AES-256 at rest for application data and backups.",
  },
  {
    icon: Database,
    title: "Backups",
    body: "Automated daily snapshots with 30-day retention. Point-in-time recovery on Enterprise.",
  },
  {
    icon: Globe2,
    title: "Data residency",
    body: "US (us-east-1) by default. EU (eu-west-1) available on Enterprise. Single-tenant deployment by request.",
  },
  {
    icon: ShieldCheck,
    title: "Access control",
    body: "Granular RBAC, per-folder ACL, SSO via SAML 2.0, SCIM 2.0 provisioning, and full audit logging.",
  },
  {
    icon: FileCheck,
    title: "Audit logs",
    body: "Every meaningful action recorded. CSV / JSON export. SIEM integration via webhooks.",
  },
  {
    icon: AlertTriangle,
    title: "Incident response",
    body: "Documented runbooks, on-call rotation, and customer notification within 72 hours of confirmed incidents.",
  },
];

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-12">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Trust</p>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-fg">
            Built so your security and procurement teams can say yes.
          </h1>
          <p className="mt-5 text-md text-fg-muted max-w-2xl">
            We are honest about where we are: this page lists what we have today,
            what is in progress, and what is on the roadmap. No vague claims.
          </p>
        </div>
      </section>

      {/* Status snapshot */}
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            Compliance status (as of {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })})
          </h2>
          <div className="mt-4 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-md overflow-hidden">
            <StatusItem name="SOC 2 Type II" status="in-progress" body="Audit window opening Q3 2026." />
            <StatusItem name="ISO 27001" status="planned" body="Targeting 2027 after SOC 2 completes." />
            <StatusItem name="GDPR" status="ready" body="DPA available. EU data residency on Enterprise." />
            <StatusItem name="HIPAA" status="not-applicable" body="We do not currently handle PHI." />
            <StatusItem name="PCI DSS" status="not-applicable" body="Card data is handled by Stripe; we never store it." />
            <StatusItem name="CCPA" status="ready" body="Subject access and deletion supported." />
          </div>
          <p className="mt-4 text-xs text-fg-subtle">
            We do not display badges for certifications we have not earned. When SOC 2
            completes we will publish the report under NDA via{" "}
            <Link href="/contact?topic=enterprise" className="text-accent hover:text-accent-hover">
              sales
            </Link>.
          </p>
        </div>
      </section>

      {/* Practices */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-fg">
            Security practices
          </h2>
          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-md overflow-hidden">
            {PRACTICES.map((p) => (
              <div key={p.title} className="bg-panel p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-bg-muted text-fg">
                  <p.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-md font-semibold text-fg">{p.title}</h3>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subprocessors */}
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-fg">
            Subprocessors
          </h2>
          <p className="mt-3 text-sm text-fg-muted max-w-2xl">
            Third parties that may process customer data on our behalf. We review
            each annually and notify customers of material changes.
          </p>
          <div className="mt-6 overflow-hidden rounded-md border border-border bg-panel">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-subtle">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    Vendor
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    Purpose
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody>
                {SUBPROCESSORS.map((s, i) => (
                  <tr
                    key={s.name}
                    className={i !== SUBPROCESSORS.length - 1 ? "border-b border-border" : ""}
                  >
                    <td className="px-4 py-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-fg hover:text-accent"
                      >
                        {s.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-fg-muted">{s.purpose}</td>
                    <td className="px-4 py-3 text-sm text-fg-muted">{s.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-panel p-8">
            <Mail className="h-5 w-5 text-fg-muted" />
            <h2 className="mt-3 text-md font-semibold text-fg">Vulnerability disclosure</h2>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              Responsible disclosure is welcomed. Email{" "}
              <a href="mailto:security@swaymaps.com" className="text-accent hover:text-accent-hover">
                security@swaymaps.com
              </a>{" "}
              with details. We respond within one business day.
            </p>
          </div>
          <div className="rounded-md border border-border bg-panel p-8">
            <ShieldCheck className="h-5 w-5 text-fg-muted" />
            <h2 className="mt-3 text-md font-semibold text-fg">Need our security overview?</h2>
            <p className="mt-2 text-sm text-fg-muted leading-relaxed">
              Our security whitepaper, DPA, and (when available) SOC 2 report are
              shared under NDA via the sales team.
            </p>
            <Link
              href="/contact?topic=enterprise"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Request the documents <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function StatusItem({
  name,
  status,
  body,
}: {
  name: string;
  status: "ready" | "in-progress" | "planned" | "not-applicable";
  body: string;
}) {
  const VARIANT: Record<typeof status, "emerald" | "amber" | "default"> = {
    ready: "emerald",
    "in-progress": "amber",
    planned: "default",
    "not-applicable": "default",
  };
  const LABEL: Record<typeof status, string> = {
    ready: "Available",
    "in-progress": "In progress",
    planned: "Planned",
    "not-applicable": "N/A",
  };
  return (
    <div className="bg-panel p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-fg">{name}</span>
        <Badge variant={VARIANT[status]} size="sm">
          {LABEL[status]}
        </Badge>
      </div>
      <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{body}</p>
    </div>
  );
}
