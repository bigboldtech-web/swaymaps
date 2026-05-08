"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Layers } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

type Category =
  | "all"
  | "architecture"
  | "compliance"
  | "data-flow"
  | "devops"
  | "organization"
  | "vendor";

interface Template {
  slug: string;
  name: string;
  description: string;
  category: Exclude<Category, "all">;
  nodes: number;
  edges: number;
}

const TEMPLATES: Template[] = [
  { slug: "microservices-architecture", name: "Microservices Architecture", description: "Map service dependencies across your distributed system", category: "architecture", nodes: 12, edges: 16 },
  { slug: "monolith-to-microservices", name: "Monolith to Microservices", description: "Plan your migration from monolith to distributed services", category: "architecture", nodes: 15, edges: 20 },
  { slug: "cicd-pipeline", name: "CI/CD Pipeline", description: "Visualize your build, test, and deployment workflow", category: "devops", nodes: 8, edges: 10 },
  { slug: "data-flow-diagram", name: "Data Flow Diagram", description: "Trace how data moves through your systems", category: "data-flow", nodes: 10, edges: 12 },
  { slug: "soc2-compliance-map", name: "SOC 2 Compliance Map", description: "Map controls and evidence for SOC 2 audit readiness", category: "compliance", nodes: 14, edges: 18 },
  { slug: "gdpr-data-flow", name: "GDPR Data Flow", description: "Track personal data processing across your organization", category: "compliance", nodes: 11, edges: 14 },
  { slug: "hipaa-system-map", name: "HIPAA System Map", description: "Visualize PHI data flows and access controls", category: "compliance", nodes: 13, edges: 16 },
  { slug: "organization-chart", name: "Organization Chart", description: "Map team structure, reporting lines, and responsibilities", category: "organization", nodes: 9, edges: 8 },
  { slug: "team-knowledge-map", name: "Team Knowledge Map", description: "Identify expertise distribution and knowledge gaps", category: "organization", nodes: 12, edges: 15 },
  { slug: "vendor-dependency-map", name: "Vendor Dependency Map", description: "Track third-party vendors and their service dependencies", category: "vendor", nodes: 10, edges: 12 },
  { slug: "supply-chain-risk-map", name: "Supply Chain Risk Map", description: "Assess risk across your supply chain dependencies", category: "vendor", nodes: 11, edges: 14 },
  { slug: "api-gateway-architecture", name: "API Gateway Architecture", description: "Map API routes, gateways, and backend services", category: "architecture", nodes: 10, edges: 14 },
  { slug: "event-driven-architecture", name: "Event-Driven Architecture", description: "Visualize event producers, consumers, and message flows", category: "architecture", nodes: 12, edges: 16 },
  { slug: "database-schema-dependencies", name: "Database Schema Dependencies", description: "Map table relationships, foreign keys, and data models", category: "data-flow", nodes: 8, edges: 12 },
  { slug: "cloud-infrastructure-map", name: "Cloud Infrastructure Map", description: "Map VPCs, subnets, load balancers, and cloud resources", category: "devops", nodes: 14, edges: 18 },
  { slug: "incident-response-runbook", name: "Incident Response Runbook", description: "Map escalation paths and response procedures", category: "devops", nodes: 9, edges: 11 },
  { slug: "onboarding-knowledge-graph", name: "Onboarding Knowledge Graph", description: "Guide new hires through systems, tools, and processes", category: "organization", nodes: 11, edges: 13 },
  { slug: "third-party-integration-map", name: "Third-Party Integration Map", description: "Track external APIs, webhooks, and integration points", category: "vendor", nodes: 10, edges: 14 },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "architecture", label: "Architecture" },
  { id: "data-flow", label: "Data flow" },
  { id: "devops", label: "DevOps" },
  { id: "compliance", label: "Compliance" },
  { id: "organization", label: "Organization" },
  { id: "vendor", label: "Vendor" },
];

export default function TemplatesGalleryPage() {
  const [category, setCategory] = React.useState<Category>("all");
  const [q, setQ] = React.useState("");

  const filtered = TEMPLATES.filter((t) => {
    if (category !== "all" && t.category !== category) return false;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      return t.name.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-10">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Templates</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
            Start from a proven blueprint.
          </h1>
          <p className="mt-3 text-md text-fg-muted max-w-xl">
            Skip the blank canvas. Pick a template, drop in your specifics,
            adapt to your stack.
          </p>
          <div className="mt-6 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-subtle pointer-events-none" />
            <Input
              className="pl-9 h-10 text-sm"
              placeholder="Search templates…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-3 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "h-7 px-3 rounded-sm text-xs font-medium transition-colors border",
                category === c.id
                  ? "bg-fg text-fg-inverted border-fg"
                  : "border-border bg-panel text-fg-muted hover:bg-bg-muted hover:text-fg"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-fg-muted">
              No templates match the current filters.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates-gallery/${t.slug}`}
                  className="rounded-md border border-border bg-panel p-5 hover:bg-bg-muted transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-bg-muted text-fg">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                    <Badge variant="default" size="sm">
                      {t.category}
                    </Badge>
                  </div>
                  <h2 className="mt-3 text-md font-semibold text-fg leading-snug">{t.name}</h2>
                  <p className="mt-1.5 text-sm text-fg-muted line-clamp-2 flex-1">
                    {t.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-border text-xs text-fg-subtle">
                    {t.nodes} nodes · {t.edges} edges
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
