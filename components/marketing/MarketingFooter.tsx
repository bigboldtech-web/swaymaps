import Link from "next/link";
import { SwayMapsIcon } from "@/components/SwayMapsLogo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Templates", href: "/templates-gallery" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Use cases", href: "/use-cases" },
      { label: "For Platform teams", href: "/use-cases#platform" },
      { label: "For Security teams", href: "/use-cases#security" },
      { label: "For Operations", href: "/use-cases#operations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Trust & Security", href: "/trust" },
      { label: "Status", href: "https://status.swaymaps.com" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <SwayMapsIcon size={22} />
              <span className="text-sm font-semibold tracking-tight text-fg">SwayMaps</span>
            </Link>
            <p className="mt-3 text-xs text-fg-muted leading-relaxed max-w-[200px]">
              Visual dependency intelligence for the enterprise.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-fg">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-fg-muted hover:text-fg transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-fg-subtle">
            © {new Date().getFullYear()} SwayMaps. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-fg-subtle">
            <span>SOC 2 in progress</span>
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
