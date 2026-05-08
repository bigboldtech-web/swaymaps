"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Layers, GitBranch, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Badge } from "@/components/ui/Badge";
import { templates, slugToTemplate, type Template } from "@/data/templates";

export default function TemplatePreviewPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const template = slugToTemplate.get(slug);

  if (!template) return <NotFound />;

  // Related templates: same category first, fill the rest from others
  const sameCategory = templates.filter(
    (t) => t.category === template.category && t.slug !== template.slug
  );
  const others = templates.filter(
    (t) => t.slug !== template.slug && !sameCategory.some((r) => r.slug === t.slug)
  );
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-12 pb-12">
          <Link
            href="/templates-gallery"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All templates
          </Link>
          <div className="mt-6 flex items-center gap-2">
            <Badge variant="default" size="md">{template.category}</Badge>
            <span className="text-xs text-fg-subtle">
              {template.nodes.length} nodes · {template.edges.length} edges
            </span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
            {template.name}
          </h1>
          <p className="mt-3 text-md text-fg-muted max-w-2xl">{template.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-accent-fg h-9 px-4 text-sm font-medium hover:bg-accent-hover"
            >
              Use this template <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/templates-gallery"
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel text-fg h-9 px-4 text-sm font-medium hover:bg-bg-muted"
            >
              Browse more
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-12 grid gap-8 lg:grid-cols-[1.4fr,1fr]">
          <div>
            <h2 className="text-md font-semibold text-fg">About this template</h2>
            <p className="mt-3 text-sm text-fg-muted leading-relaxed whitespace-pre-line">
              {template.longDescription}
            </p>

            {template.useCases.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                  Best for
                </p>
                <p className="mt-2 text-sm text-fg-muted">{template.bestFor}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-fg-muted">
                  Common use cases
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-fg-muted">
                  {template.useCases.map((u) => (
                    <li key={u} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-fg-subtle shrink-0" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="rounded-md border border-border bg-panel p-5">
            <h3 className="text-md font-semibold text-fg">Included nodes</h3>
            <p className="mt-1 text-xs text-fg-subtle">
              {template.nodes.length} preconfigured. Edit, rename, or remove anything in the editor.
            </p>
            <ul className="mt-4 max-h-[320px] overflow-y-auto divide-y divide-border border border-border rounded-sm bg-bg-subtle">
              {template.nodes.map((n) => (
                <li
                  key={n.id}
                  className="flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Layers className="h-3 w-3 text-fg-subtle shrink-0" />
                  <span className="flex-1 truncate text-fg">{n.label}</span>
                  <span className="text-xs text-fg-subtle">{n.type}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-md font-semibold text-fg">Connections</h3>
            <p className="mt-1 text-xs text-fg-subtle">
              {template.edges.length} edges defining the dependency graph.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-fg-muted">
              <GitBranch className="h-3.5 w-3.5" />
              <span>{template.edges.length} relationships</span>
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <h2 className="text-md font-semibold text-fg">Related templates</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/templates-gallery/${r.slug}`}
                className="rounded-md border border-border bg-panel p-5 hover:bg-bg-muted transition-colors flex flex-col"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-bg-muted text-fg">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <Badge variant="default" size="sm">{r.category}</Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-fg leading-snug">{r.name}</h3>
                <p className="mt-1 text-xs text-fg-muted line-clamp-2">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <div className="rounded-md border border-border bg-panel p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-md font-semibold text-fg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Start with this template in your workspace
              </h2>
              <p className="mt-1 text-sm text-fg-muted">
                Free to start. Upgrade when you outgrow the limits.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-accent-fg h-9 px-4 text-sm font-medium hover:bg-accent-hover"
            >
              Use this template <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />
      <div className="mx-auto max-w-[800px] px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Template not found</h1>
        <p className="mt-2 text-sm text-fg-muted">
          We couldn&apos;t find that template. Browse the full gallery instead.
        </p>
        <Link
          href="/templates-gallery"
          className="mt-6 inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel text-fg h-9 px-4 text-sm font-medium hover:bg-bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Browse templates
        </Link>
      </div>
      <MarketingFooter />
    </div>
  );
}
