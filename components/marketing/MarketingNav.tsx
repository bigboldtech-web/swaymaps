"use client";

import Link from "next/link";
import * as React from "react";
import { Menu, X } from "lucide-react";
import { SwayMapsIcon } from "@/components/SwayMapsLogo";

const NAV = [
  { label: "Product", href: "/features" },
  { label: "Templates", href: "/templates-gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Trust", href: "/trust" },
];

export function MarketingNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <SwayMapsIcon size={22} />
            <span className="text-sm font-semibold tracking-tight text-fg">SwayMaps</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-fg-muted hover:text-fg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/auth/signin"
            className="text-sm text-fg-muted hover:text-fg transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center rounded-sm bg-accent text-accent-fg h-8 px-3 text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            Start free
          </Link>
        </div>
        <button
          className="md:hidden p-1.5 text-fg"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-bg">
          <div className="px-6 py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-2 py-2 text-sm text-fg-muted hover:bg-bg-muted hover:text-fg"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <Link
                href="/auth/signin"
                className="flex-1 rounded-sm border border-border bg-panel text-center h-8 inline-flex items-center justify-center text-sm text-fg hover:bg-bg-muted"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 rounded-sm bg-accent text-accent-fg text-center h-8 inline-flex items-center justify-center text-sm font-medium hover:bg-accent-hover"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
