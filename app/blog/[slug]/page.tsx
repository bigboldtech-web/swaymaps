"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Badge } from "@/components/ui/Badge";
import { blogPosts, type ContentBlock } from "@/data/blogPosts";

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-bg text-fg">
        <MarketingNav />
        <div className="mx-auto max-w-[800px] px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Article not found</h1>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel text-fg h-9 px-4 text-sm font-medium hover:bg-bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All articles
          </Link>
        </div>
        <MarketingFooter />
      </div>
    );
  }

  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);
  const fillers = blogPosts.filter(
    (p) => p.slug !== slug && !related.some((r) => r.slug === p.slug)
  );
  while (related.length < 3 && fillers.length > 0) {
    const f = fillers.shift();
    if (f) related.push(f);
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <article>
        <div className="mx-auto max-w-[760px] px-6 pt-12 pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All articles
          </Link>

          <header className="mt-8">
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              <Badge variant="default" size="md">{post.category}</Badge>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
              {post.title}
            </h1>
            <p className="mt-3 text-md text-fg-muted leading-relaxed">{post.excerpt}</p>
            <p className="mt-4 text-xs text-fg-subtle">By {post.author}</p>
          </header>

          <div className="mt-10">
            {post.content.map((block, idx) => (
              <RenderBlock key={idx} block={block} />
            ))}
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <h2 className="text-md font-semibold text-fg">Keep reading</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="rounded-md border border-border bg-panel p-5 hover:bg-bg-muted transition-colors"
              >
                <div className="flex items-center gap-2 text-xs text-fg-muted">
                  <Badge variant="default" size="sm">{r.category}</Badge>
                  <span>·</span>
                  <span>{r.readTime}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-fg leading-snug">{r.title}</h3>
                <p className="mt-1 text-xs text-fg-muted line-clamp-2">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <div className="rounded-md border border-border bg-panel p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-md font-semibold text-fg">Try SwayMaps for yourself</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Free to start. Build your first dependency map in minutes.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-sm bg-accent text-accent-fg h-9 px-4 text-sm font-medium hover:bg-accent-hover"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight text-fg">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 mb-2 text-md font-semibold tracking-tight text-fg">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="my-4 text-md text-fg-muted leading-[1.7]">{block.text}</p>
      );
    case "list":
      return (
        <ul className="my-4 space-y-2 text-md text-fg-muted leading-relaxed">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-2.5 h-1 w-1 rounded-full bg-fg-subtle shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="my-5 rounded-md border border-border bg-bg-subtle p-4 overflow-x-auto">
          <code className="font-mono text-xs text-fg leading-relaxed">{block.code}</code>
        </pre>
      );
    case "nodes":
      return (
        <div className="my-5 grid gap-2 sm:grid-cols-2">
          {block.nodes.map((n, i) => (
            <div
              key={i}
              className="rounded-sm border border-border bg-panel px-3 py-2 flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" />
              <span className="text-sm font-medium text-fg flex-1 truncate">{n.label}</span>
              <span className="text-xs text-fg-subtle">{n.type}</span>
            </div>
          ))}
        </div>
      );
  }
}
