"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-xs border px-1.5 h-[18px] text-[11px] font-medium leading-none",
  {
    variants: {
      variant: {
        default: "bg-bg-muted text-fg-muted border-border",
        sky: "bg-accent-subtle text-accent border-accent/20",
        indigo: "bg-accent-subtle text-accent border-accent/20",
        emerald: "bg-success-subtle text-success border-success/20",
        amber: "bg-warning-subtle text-warning border-warning/20",
        rose: "bg-danger-subtle text-danger border-danger/20",
        violet: "bg-accent-subtle text-accent border-accent/20",
        outline: "bg-transparent text-fg-muted border-border",
      },
      size: {
        sm: "h-[16px] px-1 text-[10px]",
        md: "h-[18px] px-1.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ children, variant, size, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}
