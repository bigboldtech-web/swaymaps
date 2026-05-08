"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BreadcrumbItemData {
  label: string;
  onClick?: () => void;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItemData[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center min-w-0", className)}>
      <ol className="flex items-center gap-1 min-w-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1 min-w-0">
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />
              )}
              {isLast || (!item.onClick && !item.href) ? (
                <span
                  className={cn(
                    "text-sm truncate",
                    isLast ? "text-fg font-medium" : "text-fg-muted"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-sm text-fg-muted hover:text-fg transition-colors truncate"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
