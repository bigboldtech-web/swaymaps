import * as React from "react";
import { cn } from "@/lib/cn";

export function Kbd({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-xs border border-border bg-bg-subtle px-1.5 min-w-[18px] h-[18px] text-[10px] font-medium text-fg-muted font-mono",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
