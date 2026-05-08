import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Security",
  description: "Technical security details: architecture, encryption, identity, monitoring.",
};

const SECTIONS = [
  {
    title: "Architecture",
    body:
      "SwayMaps is a multi-tenant SaaS hosted on AWS (us-east-1 by default, eu-west-1 on Enterprise). Application traffic terminates at Cloudflare with DDoS mitigation, then routes to Next.js application servers behind a load balancer. Data lives in PostgreSQL with encrypted block storage. Single-tenant Enterprise deployments isolate compute and database within a dedicated VPC.",
  },
  {
    title: "Identity",
    body:
      "Default authentication uses email + password (bcrypt at cost factor 10) and supports OAuth (Google, GitHub). Enterprise plans add SAML 2.0 SSO and SCIM 2.0 provisioning via BoxyHQ Jackson. Sessions are JWT-based, signed with HS256, and rotate every 24 hours. Granular RBAC (Owner / Admin / Editor / Viewer / Guest) is enforced at the API layer; per-folder ACL refines access for shared workspaces.",
  },
  {
    title: "Encryption",
    body:
      "All HTTP traffic is TLS 1.2+ with HSTS enabled. Application data at rest is encrypted with AES-256 via AWS-managed keys (KMS). Database backups inherit the same encryption. Customer-managed keys (BYOK) are available on Enterprise.",
  },
  {
    title: "Audit & monitoring",
    body:
      "Every meaningful action — map and folder mutations, member changes, permission changes, SSO and SCIM events — is recorded in an append-only audit log. Logs are retained 90 days on Pro, 1 year on Team, 7 years on Enterprise. Customers can export to CSV / JSON or stream to their SIEM via webhooks. Operational metrics flow to internal monitoring; customer-impacting incidents are surfaced on the public status page.",
  },
  {
    title: "Software supply chain",
    body:
      "Dependencies are pinned in package-lock.json and reviewed during pull request. Automated dependency scanning runs on every commit and weekly against the main branch. Critical CVEs trigger immediate triage. We avoid transitive dependencies that lack active maintainers.",
  },
  {
    title: "Vulnerability management",
    body:
      "Annual third-party penetration testing (planned for Q4 2026 ahead of SOC 2 audit). Public vulnerability disclosure inbox at security@swaymaps.com. We commit to triaging valid reports within one business day and publishing fixes for critical issues within 30 days.",
  },
  {
    title: "Backups & disaster recovery",
    body:
      "Automated daily database snapshots retained 30 days. Point-in-time recovery available on Enterprise (1-hour RPO). Geographic redundancy across two AWS availability zones. RTO target: 4 hours for catastrophic failure.",
  },
  {
    title: "Personnel",
    body:
      "All employees and contractors with access to production data complete annual security training and sign confidentiality agreements. Production access requires hardware-key-protected SSO and is logged.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[900px] px-6 pt-20 pb-12">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Security</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
            How we protect your data, in detail.
          </h1>
          <p className="mt-4 text-md text-fg-muted">
            For higher-level coverage and compliance status, see{" "}
            <Link href="/trust" className="text-accent hover:text-accent-hover">
              Trust
            </Link>
            . This page is the deeper technical read for security reviewers.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-12 space-y-12">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-md font-semibold text-fg">{s.title}</h2>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[900px] px-6 py-12">
          <div className="rounded-md border border-border bg-panel p-6">
            <h3 className="text-md font-semibold text-fg">Questions from your security review?</h3>
            <p className="mt-1.5 text-sm text-fg-muted">
              We respond to security questionnaires (CAIQ, SIG Lite, custom) within
              two business days.
            </p>
            <Link
              href="/contact?topic=enterprise"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Reach out <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
