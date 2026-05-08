import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering, compliance, product, and best-practice articles from the SwayMaps team.",
};

const FEATURED = {
  slug: "youtube-architecture-dependency-map",
  title: "How YouTube's Architecture Works: A Visual Dependency Map",
  category: "Engineering",
  date: "March 25, 2026",
  readTime: "12 min read",
  excerpt:
    "YouTube serves over 2 billion logged-in users every month and processes 500 hours of video uploads per minute. Here is how its massive architecture actually works, mapped as a visual dependency graph.",
};

const POSTS = [
  {
    slug: "spotify-system-architecture-mapped",
    title: "Spotify's Microservices Architecture: 800+ Services Mapped",
    category: "Engineering",
    date: "March 18, 2026",
    readTime: "10 min read",
    excerpt:
      "Spotify runs over 800 microservices built by 2,000+ engineers across hundreds of teams. Here is how their architecture works and what it teaches us about managing dependencies at scale.",
  },
  {
    slug: "netflix-dependency-hell-visual-solution",
    title: "Netflix's Dependency Hell: How Visual Mapping Prevents Cascading Failures",
    category: "Engineering",
    date: "March 10, 2026",
    readTime: "9 min read",
    excerpt:
      "Netflix runs 700+ microservices in production. When one fails, the blast radius can be catastrophic. Here is how dependency mapping helps prevent cascading failures before they start.",
  },
  {
    slug: "soc2-compliance-visual-mapping-guide",
    title: "SOC2 Compliance Made Visual: Map Your Data Flows in Under an Hour",
    category: "Compliance",
    date: "March 5, 2026",
    readTime: "8 min read",
    excerpt:
      "SOC2 auditors need to see how data flows through your system. Here is a practical guide to creating audit-ready data flow diagrams that satisfy SOC2 requirements using visual dependency maps.",
  },
  {
    slug: "onboarding-engineers-faster-visual-maps",
    title: "From 6-Month Onboarding to 2 Weeks: The Power of Visual Dependency Maps",
    category: "Best Practices",
    date: "February 25, 2026",
    readTime: "7 min read",
    excerpt:
      "New engineers spend months building a mental model of your system architecture. Visual dependency maps can compress that timeline from months to weeks by making tribal knowledge explicit and explorable.",
  },
  {
    slug: "diagram-as-code-yaml-dsl-guide",
    title: "Diagram as Code: Why Your Architecture Maps Belong in Git",
    category: "Product Updates",
    date: "February 18, 2026",
    readTime: "6 min read",
    excerpt:
      "Architecture diagrams created in GUI tools rot because they live outside your development workflow. SwayMaps' YAML DSL lets you define, version, and review architecture maps alongside your code.",
  },
];

const CATEGORIES = ["All", "Engineering", "Compliance", "Product Updates", "Best Practices"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-10">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Blog</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
            Notes on systems, compliance, and engineering rigor.
          </h1>
        </div>
      </section>

      {/* Featured */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-12">
          <Link
            href={`/blog/${FEATURED.slug}`}
            className="block rounded-md border border-border bg-panel p-8 hover:bg-bg-muted transition-colors"
          >
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              <span className="rounded-xs bg-accent-subtle text-accent px-1.5 h-[18px] inline-flex items-center font-medium">
                Featured
              </span>
              <span>{FEATURED.category}</span>
              <span>·</span>
              <span>{FEATURED.date}</span>
              <span>·</span>
              <span>{FEATURED.readTime}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-fg">
              {FEATURED.title}
            </h2>
            <p className="mt-3 text-md text-fg-muted leading-relaxed max-w-3xl">
              {FEATURED.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Read article <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Categories (decorative; full filtering in Phase 3) */}
      <section className="border-b border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className="text-xs text-fg-muted px-2.5 h-7 inline-flex items-center rounded-sm border border-border bg-panel"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-12 grid gap-4 md:grid-cols-2">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="rounded-md border border-border bg-panel p-6 hover:bg-bg-muted transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <span>{p.category}</span>
                <span>·</span>
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.readTime}</span>
              </div>
              <h3 className="mt-2 text-md font-semibold text-fg leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-fg-muted line-clamp-3">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
