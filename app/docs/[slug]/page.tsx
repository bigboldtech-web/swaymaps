"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { guides, type GuideSection } from "@/data/guides";
import { cn } from "@/lib/cn";

export default function GuideSlugPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const guide = guides.find((g) => g.slug === slug);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!guide) return;
    const handler = () => {
      let current: string | null = null;
      for (const s of guide.sections) {
        const el = document.getElementById(`section-${s.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < 120) current = s.id;
      }
      setActiveId(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [guide]);

  if (!guide) {
    return (
      <div className="min-h-screen bg-bg text-fg">
        <MarketingNav />
        <div className="mx-auto max-w-[800px] px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Guide not found</h1>
          <Link
            href="/docs"
            className="mt-6 inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel text-fg h-9 px-4 text-sm font-medium hover:bg-bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All docs
          </Link>
        </div>
        <MarketingFooter />
      </div>
    );
  }

  const related = guide.relatedSlugs
    .map((s) => guides.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => !!g);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <div className="mx-auto max-w-[1100px] px-6 pt-12 pb-12 grid gap-10 lg:grid-cols-[200px,1fr]">
        {/* Side TOC */}
        <aside className="lg:sticky lg:top-20 self-start">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All docs
          </Link>
          <nav className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              On this page
            </p>
            <ul className="mt-2 space-y-1 border-l border-border">
              {guide.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#section-${s.id}`}
                    className={cn(
                      "block pl-3 -ml-px py-1 text-sm border-l transition-colors",
                      activeId === s.id
                        ? "text-fg border-accent"
                        : "text-fg-muted border-transparent hover:text-fg"
                    )}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Article */}
        <article className="min-w-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-fg-muted" />
            <span className="text-xs uppercase tracking-wide text-fg-muted">
              Documentation
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">
            {guide.title}
          </h1>
          <p className="mt-2 text-md text-fg-muted">{guide.description}</p>

          <div className="mt-10 space-y-12">
            {guide.sections.map((s) => (
              <Section key={s.id} section={s} />
            ))}
          </div>

          {related.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">
                Related guides
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/docs/${r.slug}`}
                    className="rounded-md border border-border bg-panel p-4 hover:bg-bg-muted transition-colors"
                  >
                    <h3 className="text-sm font-semibold text-fg">{r.title}</h3>
                    <p className="mt-1 text-xs text-fg-muted line-clamp-2">{r.description}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      <MarketingFooter />
    </div>
  );
}

function Section({ section }: { section: GuideSection }) {
  return (
    <section id={`section-${section.id}`} className="scroll-mt-20">
      <h2 className="text-xl font-semibold tracking-tight text-fg">{section.title}</h2>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="mt-3 text-md text-fg-muted leading-[1.7]">
          {p}
        </p>
      ))}

      {section.list && (
        <ul className="mt-3 space-y-2 text-md text-fg-muted leading-relaxed">
          {section.list.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2.5 h-1 w-1 rounded-full bg-fg-subtle shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.nodeChips && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {section.nodeChips.map((n, i) => (
            <div
              key={i}
              className="rounded-sm border border-border bg-panel px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" />
                <span className="text-sm font-medium text-fg">{n.name}</span>
              </div>
              <p className="mt-1 text-xs text-fg-muted">{n.description}</p>
            </div>
          ))}
        </div>
      )}

      {section.code && (
        <pre className="mt-4 rounded-md border border-border bg-bg-subtle p-4 overflow-x-auto">
          <code className="font-mono text-xs text-fg leading-relaxed">{section.code.code}</code>
        </pre>
      )}

      {section.tip && (
        <div className="mt-4 rounded-sm border border-info/30 bg-info-subtle p-3 flex items-start gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-info mt-0.5 shrink-0" />
          <p className="text-sm text-fg leading-relaxed">{section.tip}</p>
        </div>
      )}
    </section>
  );
}
