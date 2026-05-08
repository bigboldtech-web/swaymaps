import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Server, ShieldCheck, Wrench, Briefcase, GitBranch, Boxes } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Use cases",
  description: "How platform, security, and operations teams use SwayMaps to ship safer changes and align faster.",
};

const CASES = [
  {
    id: "platform",
    icon: Server,
    title: "Platform engineering",
    summary: "Map every service, dependency, and ownership boundary. Make changes with full upstream/downstream visibility.",
    bullets: [
      "Service catalogs with strongly-typed metadata",
      "Impact analysis before infrastructure changes",
      "On-call handoff documentation that stays current",
      "Cross-service dependency review during architecture proposals",
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security & compliance",
    summary: "Diagram trust boundaries, data flows, and access paths. Ship audit evidence faster.",
    bullets: [
      "Data classification and flow diagrams for SOC 2 / ISO",
      "Trust-boundary maps for threat modeling",
      "Access control reviews with per-folder ACL",
      "Incident response runbooks with linked context",
    ],
  },
  {
    id: "operations",
    icon: Wrench,
    title: "Operations & SRE",
    summary: "Document runbooks, escalation paths, and system health where everyone can see them.",
    bullets: [
      "Incident playbooks tied to system maps",
      "On-call rotation and escalation hierarchies",
      "Service-level dependency maps for postmortems",
      "Change management with reviewer assignments",
    ],
  },
  {
    id: "leadership",
    icon: Briefcase,
    title: "Engineering leadership",
    summary: "See the org and its tech stack as one connected picture. Plan transformations with confidence.",
    bullets: [
      "Org charts wired to systems they own",
      "Migration planning with explicit risk surfacing",
      "Vendor and SaaS dependency overview",
      "Strategic-initiative tracking with stakeholder alignment",
    ],
  },
  {
    id: "data",
    icon: GitBranch,
    title: "Data & analytics",
    summary: "Trace pipeline lineage, model relationships, and ETL dependencies.",
    bullets: [
      "End-to-end data lineage from source to dashboard",
      "Schema relationship maps for migrations",
      "ETL/ELT pipeline visualization with ownership",
      "Privacy and PII flow documentation",
    ],
  },
  {
    id: "product",
    icon: Boxes,
    title: "Product & design",
    summary: "Visualize user journeys, feature dependencies, and team alignment.",
    bullets: [
      "Customer journey and touchpoint maps",
      "Feature → service dependency for prioritization",
      "Cross-functional team alignment for initiatives",
      "Roadmap blockers surfaced as graph edges",
    ],
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-fg">
            Built for the teams that hold the org together.
          </h1>
          <p className="mt-4 text-md text-fg-muted max-w-2xl mx-auto">
            From the first systems diagram to enterprise-wide rollout, SwayMaps
            adapts to how your team already works.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CASES.map((c) => (
              <div
                key={c.id}
                id={c.id}
                className="rounded-md border border-border bg-panel p-6 flex flex-col"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-bg-muted text-fg">
                  <c.icon className="h-4 w-4" />
                </div>
                <h2 className="mt-4 text-md font-semibold text-fg">{c.title}</h2>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{c.summary}</p>
                <ul className="mt-4 space-y-2 text-sm text-fg-muted border-t border-border pt-4">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-fg-subtle shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-panel p-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-fg">
                Want a tour for your team?
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                We&apos;ll show you exactly how teams in your industry are using SwayMaps.
              </p>
            </div>
            <Link
              href="/contact?topic=demo"
              className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-accent-fg h-9 px-4 text-sm font-medium hover:bg-accent-hover"
            >
              Book a demo <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
