import Link from "next/link";
import { SwayMapsIcon } from "@/components/SwayMapsLogo";
import { ShieldCheck } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Templates", href: "/templates-gallery" },
      { label: "Integrations", href: "/integrations" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    title: "Views",
    links: [
      { label: "Dependency map", href: "/features#canvas" },
      { label: "Mind map", href: "/features#canvas" },
      { label: "Flowchart", href: "/features#canvas" },
      { label: "Templates", href: "/templates-gallery" },
      { label: "Import & export", href: "/features#import" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Engineering", href: "/use-cases#engineering" },
      { label: "For Platform teams", href: "/use-cases#platform" },
      { label: "For Security", href: "/use-cases#security" },
      { label: "For Operations", href: "/use-cases#operations" },
      { label: "For Product", href: "/use-cases#product" },
      { label: "For Leadership", href: "/use-cases#leadership" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "vs Miro", href: "/compare/miro" },
      { label: "vs ClickUp", href: "/compare/clickup" },
      { label: "vs Lucidchart", href: "/compare/lucidchart" },
      { label: "Customers", href: "/customers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "API reference", href: "/docs/api-reference" },
      { label: "Brand kit", href: "/about" },
      { label: "Contact sales", href: "/contact" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Trust Center", href: "/trust" },
      { label: "Security", href: "/security" },
      { label: "Status", href: "https://status.swaymaps.com" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <SwayMapsIcon size={24} />
              <span className="font-display text-base font-bold tracking-tight text-fg">SwayMaps</span>
            </Link>
            <p className="mt-3 text-[12px] text-fg-muted leading-relaxed max-w-[220px]">
              The visual workspace for engineering, product, and ops teams that need to map systems, ship faster, and stay aligned.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[
                { label: "Twitter", href: "https://twitter.com/swaymaps", text: "X" },
                { label: "GitHub", href: "https://github.com/swaymaps", text: "GH" },
                { label: "LinkedIn", href: "https://linkedin.com/company/swaymaps", text: "in" },
              ].map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-fg-muted hover:text-fg hover:bg-bg-muted text-[10px] font-bold">
                  {s.text}
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-eyebrow text-[10px] font-semibold uppercase tracking-[0.14em] text-fg">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-fg-muted hover:text-fg transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p className="text-[12px] text-fg-subtle">
            © {new Date().getFullYear()} SwayMaps. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-[12px] text-fg-subtle">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              SOC 2 Type II in progress
            </span>
            <span className="opacity-50">·</span>
            <span>GDPR ready</span>
            <span className="opacity-50">·</span>
            <span>Data residency: US, EU on Enterprise</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
