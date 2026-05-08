import Link from "next/link";
import type { Metadata } from "next";
import { Search, BookOpen, Code2, Users, Layers, Boxes, Zap, Webhook } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Setup guides, references, and best-practice articles for SwayMaps.",
};

const GUIDES = [
  { slug: "getting-started", icon: BookOpen, title: "Getting Started", desc: "Create your first map in 60 seconds." },
  { slug: "node-types", icon: Layers, title: "Node Types & Metadata", desc: "All 11 node types and their properties." },
  { slug: "ai-generation", icon: Zap, title: "AI Generation", desc: "Generate maps from natural language." },
  { slug: "yaml-dsl", icon: Code2, title: "YAML DSL Reference", desc: "Define maps as code." },
  { slug: "collaboration", icon: Users, title: "Collaboration & Workspaces", desc: "Team setup, roles, permissions, folders." },
  { slug: "import-export", icon: Boxes, title: "Import & Export", desc: "Supported formats and embedding." },
  { slug: "integrations", icon: Webhook, title: "Integrations", desc: "Slack, Teams, and webhook configuration." },
  { slug: "api-reference", icon: Code2, title: "API Reference", desc: "REST API documentation." },
];

const POPULAR = [
  { title: "How to set up your first workspace and invite your team", category: "Getting Started", slug: "getting-started" },
  { title: "Using AI brainstorm to scaffold microservice architectures", category: "AI Generation", slug: "ai-generation" },
  { title: "Exporting maps to Confluence and Notion", category: "Import & Export", slug: "import-export" },
  { title: "Understanding edge types: sync, async, and data flow", category: "Node Types", slug: "node-types" },
  { title: "Writing your first YAML DSL map definition", category: "YAML DSL", slug: "yaml-dsl" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-12">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Documentation</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
            Everything you need to ship with SwayMaps.
          </h1>
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-subtle pointer-events-none" />
            <input
              type="text"
              placeholder="Search docs…"
              className="w-full h-10 pl-9 pr-3 text-sm rounded-sm border border-border bg-panel text-fg placeholder:text-fg-subtle focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            Guides
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/docs/${g.slug}`}
                className="rounded-md border border-border bg-panel p-5 hover:bg-bg-muted transition-colors"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-bg-muted text-fg">
                  <g.icon className="h-3.5 w-3.5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-fg">{g.title}</h3>
                <p className="mt-1 text-xs text-fg-muted leading-relaxed">{g.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
            Popular articles
          </h2>
          <ul className="mt-4 divide-y divide-border border border-border rounded-md bg-panel">
            {POPULAR.map((a) => (
              <li key={a.slug + a.title}>
                <Link
                  href={`/docs/${a.slug}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-muted transition-colors"
                >
                  <span className="text-sm text-fg">{a.title}</span>
                  <span className="text-xs text-fg-subtle">{a.category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
