import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every shipped change to SwayMaps, in reverse-chronological order.",
};

interface Entry {
  date: string;
  version: string;
  type: "feature" | "improvement" | "fix";
  title: string;
  body: string;
}

const ENTRIES: Entry[] = [
  {
    date: "May 8, 2026",
    version: "2.0",
    type: "feature",
    title: "Folders, RBAC, and audit log",
    body: "Nested folder hierarchy with drag-and-drop, granular role-based access control (Owner / Admin / Editor / Viewer / Guest), per-folder ACL, and a workspace audit log with CSV export. Visual refresh across the editor and marketing.",
  },
  {
    date: "April 22, 2026",
    version: "1.9",
    type: "feature",
    title: "Multiple workspaces",
    body: "Switch between workspaces from the sidebar. Per-workspace billing, members, and integrations.",
  },
  {
    date: "April 5, 2026",
    version: "1.8",
    type: "improvement",
    title: "ReactFlow performance",
    body: "Map rendering is up to 4× faster on graphs with 500+ nodes. Reduced memory footprint by 28%.",
  },
  {
    date: "March 18, 2026",
    version: "1.7",
    type: "feature",
    title: "API v1 and webhooks",
    body: "Programmatic CRUD on maps, nodes, and edges. Subscribe to map and folder events from your own systems.",
  },
  {
    date: "February 28, 2026",
    version: "1.6",
    type: "improvement",
    title: "Version history diff",
    body: "Compare any two map versions side-by-side. Restore individual nodes or edges from a prior version.",
  },
  {
    date: "February 12, 2026",
    version: "1.5",
    type: "feature",
    title: "AI brainstorm",
    body: "Generate a starter map from a natural-language prompt. Backed by GPT-4o-mini.",
  },
];

const TYPE_VARIANT: Record<Entry["type"], "emerald" | "amber" | "rose" | "indigo"> = {
  feature: "indigo",
  improvement: "emerald",
  fix: "amber",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[800px] px-6 pt-20 pb-10">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Changelog</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
            What we shipped, when, and why.
          </h1>
          <p className="mt-3 text-md text-fg-muted">
            Subscribe in your RSS reader at <code className="font-mono text-xs">/changelog/feed.xml</code>{" "}
            (coming soon).
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[800px] px-6 py-12">
          <ol className="space-y-8">
            {ENTRIES.map((e) => (
              <li key={e.version} className="rounded-md border border-border bg-panel p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
                  <span>{e.date}</span>
                  <span>·</span>
                  <span className="font-mono">v{e.version}</span>
                  <Badge variant={TYPE_VARIANT[e.type]} size="sm">
                    {e.type}
                  </Badge>
                </div>
                <h2 className="mt-2 text-md font-semibold text-fg">{e.title}</h2>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{e.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
