import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Code2,
  Rocket,
  Workflow,
  ShieldCheck,
  Building2,
  Network,
  Wrench,
  Boxes,
  ShieldAlert,
  HeartHandshake,
  Layers,
  GitBranch,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Use cases — Engineering, Product, Ops, Security",
  description:
    "How engineering, platform, security, operations, product, and leadership teams use SwayMaps to map systems, ship faster, and stay aligned.",
};

type UseCase = {
  id: string;
  icon: any;
  role: string;
  headline: string;
  body: string;
  outcomes: string[];
  formats: string[];
  template: { title: string; href: string };
  gradient: string;
};

const ROLES: UseCase[] = [
  {
    id: "engineering",
    icon: Code2,
    role: "Engineering",
    headline: "Service maps that engineers actually maintain.",
    body:
      "Build a single source of truth for your service graph. Trace blast radius before changes. Keep on-call playbooks current. Generate runbooks with one Sidekick prompt.",
    outcomes: [
      "Reduce MTTR by surfacing dependencies in the incident channel",
      "Cut architecture review prep from days to hours",
      "Onboard new engineers with auto-generated service overviews",
    ],
    formats: ["Dependency map", "Flowchart", "Mind map"],
    template: { title: "Microservice architecture", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #6647F0 0%, #0091FF 100%)",
  },
  {
    id: "platform",
    icon: Network,
    role: "Platform engineering",
    headline: "Internal developer platform, mapped end-to-end.",
    body:
      "Show every service, queue, cache, and API your developers depend on — and who owns what. Tag with SLAs, runbooks, and on-call rotations.",
    outcomes: [
      "Answer 'who owns this?' in seconds, not Slack threads",
      "Document platform contracts visually instead of in stale wikis",
      "Pinpoint single points of failure with critical-node analysis",
    ],
    formats: ["Dependency map", "Mind map"],
    template: { title: "Platform service map", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #0091FF 0%, #16a34a 100%)",
  },
  {
    id: "devops",
    icon: Wrench,
    role: "DevOps & SRE",
    headline: "CI/CD, monitoring, and incident playbooks in one place.",
    body:
      "Map every stage of your deploy pipeline, every alert route, every escalation path. Run incident reviews live with the graph in front of you.",
    outcomes: [
      "Cut incident-review setup from hours to minutes",
      "Replace 14 PagerDuty escalation diagrams with one map",
      "Keep runbooks in sync with reality via Sidekick generation",
    ],
    formats: ["Flowchart", "Dependency map"],
    template: { title: "Incident response playbook", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #FC6D2D 0%, #FF02F0 100%)",
  },
  {
    id: "security",
    icon: ShieldCheck,
    role: "Security",
    headline: "Data flow diagrams the auditors will accept.",
    body:
      "Map data classes, residency, processors, encryption boundaries — and who has access to each. Export audit-ready PDFs in one click.",
    outcomes: [
      "Pass SOC 2 / ISO data-flow review on first try",
      "Find PII flows you didn't know existed",
      "Map zero-trust segmentation with named typed edges",
    ],
    formats: ["Dependency map", "Flowchart"],
    template: { title: "Data flow diagram (GDPR/SOC2)", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #FF02F0 0%, #6647F0 100%)",
  },
  {
    id: "grc",
    icon: ShieldAlert,
    role: "GRC & compliance",
    headline: "Compliance maps that update themselves.",
    body:
      "Vendor inventories, third-party risk maps, RACI matrices for compliance ownership. Audit log + version history mean every change is provable.",
    outcomes: [
      "Maintain TPRM inventory in one queryable place",
      "Audit log + 7-year retention covers SOC 2, HIPAA, ISO",
      "RACI mapping for every compliance domain",
    ],
    formats: ["Dependency map", "Mind map"],
    template: { title: "Vendor risk map", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #6647F0 0%, #16a34a 100%)",
  },
  {
    id: "data",
    icon: Boxes,
    role: "Data & ML",
    headline: "Lineage, ETL, and ML pipeline maps.",
    body:
      "Visualize your ETL graph from source systems through transformations to dashboards. Track ML model dependencies and feature lineage.",
    outcomes: [
      "Audit data lineage for regulators and stakeholders",
      "Spot redundant transformations and orphan datasets",
      "Map model-to-feature-to-source dependencies",
    ],
    formats: ["Dependency map", "Flowchart"],
    template: { title: "ETL pipeline", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #0091FF 0%, #FF02F0 100%)",
  },
  {
    id: "product",
    icon: Rocket,
    role: "Product",
    headline: "User flows, roadmaps, and feature dependencies.",
    body:
      "Map user journeys across screens, link to PRDs in nodes, plan releases with cross-team dependency graphs.",
    outcomes: [
      "Spot release-blocking dependencies before they bite",
      "Tie features to systems that need to support them",
      "Run roadmap reviews on a live, multiplayer canvas",
    ],
    formats: ["Dependency map", "Mind map", "Flowchart"],
    template: { title: "User journey", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #FC6D2D 0%, #16a34a 100%)",
  },
  {
    id: "operations",
    icon: Workflow,
    role: "Operations",
    headline: "SOPs, runbooks, and process maps.",
    body:
      "Document every workflow your operations team runs — onboarding, fulfillment, escalation. Turn tribal knowledge into searchable maps.",
    outcomes: [
      "Reduce ramp time for new ops hires from weeks to days",
      "Find process inefficiencies via critical-node analysis",
      "Generate SOPs from nodes with one Sidekick prompt",
    ],
    formats: ["Flowchart", "Dependency map"],
    template: { title: "Onboarding playbook", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #16a34a 0%, #0091FF 100%)",
  },
  {
    id: "leadership",
    icon: Building2,
    role: "Leadership",
    headline: "Strategy maps. RACI. Ownership graphs.",
    body:
      "Map who owns what across teams, products, and systems. Tie strategic bets to the services that need to support them. Run reviews against the live graph.",
    outcomes: [
      "See ownership and accountability at a glance",
      "Tie strategic bets to systems and teams",
      "Run leadership strategy reviews live, with maps as the artifact",
    ],
    formats: ["Dependency map", "Mind map"],
    template: { title: "RACI matrix", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #FF02F0 0%, #FC6D2D 100%)",
  },
  {
    id: "cs",
    icon: HeartHandshake,
    role: "Customer success",
    headline: "Account maps and onboarding flows.",
    body:
      "Map every stakeholder, integration touchpoint, and milestone in your customer's onboarding. Share read-only views with customers.",
    outcomes: [
      "Reduce time-to-value with shared onboarding maps",
      "Track stakeholder buy-in visually across accounts",
      "Run QBRs against living, customer-shared maps",
    ],
    formats: ["Dependency map", "Mind map", "Flowchart"],
    template: { title: "Customer onboarding", href: "/templates-gallery" },
    gradient: "linear-gradient(135deg, #6647F0 0%, #FC6D2D 100%)",
  },
];

export default function UseCasesPage() {
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
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(252, 109, 45, 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1200px] px-6 pt-20 pb-16">
          <div className="max-w-3xl">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--gradient-warm-stop-1)" }}>
              Use cases
            </p>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              Built for every team
              <br />
              that maps a system.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted leading-relaxed">
              From staff engineers to head of product to GRC leads — SwayMaps is the visual workspace for teams that need structure, not just freehand.
            </p>
          </div>

          {/* Quick links */}
          <div className="mt-10 flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <a
                key={r.id}
                href={`#${r.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-panel px-3 py-1.5 text-[12px] font-medium text-fg-muted hover:text-fg hover:border-border-strong transition-colors"
              >
                <r.icon className="h-3.5 w-3.5" />
                {r.role}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Role sections */}
      {ROLES.map((role, idx) => (
        <section
          key={role.id}
          id={role.id}
          className={idx % 2 === 0 ? "border-t border-border bg-bg-subtle" : "border-t border-border"}
        >
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <div className="grid lg:grid-cols-[1fr,1fr] gap-12 items-start">
              <div>
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                  style={{ background: role.gradient }}
                >
                  <role.icon className="h-5 w-5 text-white" />
                </div>
                <p className="mt-4 font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                  For {role.role}
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
                  {role.headline}
                </h2>
                <p className="mt-4 text-md text-fg-muted leading-relaxed">{role.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {role.formats.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-panel px-2.5 py-0.5 text-[11px] font-medium text-fg-muted"
                    >
                      <Layers className="h-3 w-3" />
                      {f}
                    </span>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={role.template.href}
                    className="inline-flex items-center gap-1.5 rounded-lg h-10 px-4 text-[13px] font-semibold text-white shadow-sm transition-all"
                    style={{ background: role.gradient }}
                  >
                    Use the {role.template.title} template
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-panel p-7">
                <p className="font-eyebrow text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                  Outcomes
                </p>
                <ul className="mt-4 space-y-3">
                  {role.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-[14px]">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />
                      <span className="text-fg leading-relaxed">{o}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-eyebrow text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    Pair with
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href="/features#ai"
                      className="rounded-md border border-border bg-bg p-3 hover:border-border-strong transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="text-[12px] font-semibold text-fg">Sidekick AI</span>
                      </div>
                      <p className="mt-1 text-[11px] text-fg-muted">Graph-aware tools.</p>
                    </Link>
                    <Link
                      href="/integrations"
                      className="rounded-md border border-border bg-bg p-3 hover:border-border-strong transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-3.5 w-3.5 text-accent" />
                        <span className="text-[12px] font-semibold text-fg">Integrations</span>
                      </div>
                      <p className="mt-1 text-[11px] text-fg-muted">Live context.</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-6 py-20">
          <div
            className="rounded-3xl border border-border p-12 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 2, 240, 0.06) 0%, rgba(252, 109, 45, 0.06) 50%, rgba(0, 145, 255, 0.06) 100%)",
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              Find your team in SwayMaps.
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              The free workspace gives you the full feature set. Scale up when you need SSO, audit, and unlimited workspaces.
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
