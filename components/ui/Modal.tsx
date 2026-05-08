"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./Dialog";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hideClose?: boolean;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * Compatibility wrapper around Radix Dialog, preserving the old Modal API.
 * New code should use Dialog primitives directly.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  hideClose = false,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        showClose={!hideClose}
        className={cn("max-h-[90vh] overflow-y-auto p-0", sizeClasses[size])}
      >
        {(title || description) && (
          <DialogHeader className="border-b border-border px-6 py-4">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="px-6 py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
