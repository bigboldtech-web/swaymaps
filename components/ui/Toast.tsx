"use client";

import * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      offset={16}
      gap={8}
      visibleToasts={4}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-start gap-3 w-full rounded-md border border-border bg-panel p-3 pr-4 shadow-overlay text-sm text-fg",
          title: "font-medium text-fg",
          description: "text-fg-muted",
          actionButton:
            "ml-2 inline-flex items-center justify-center h-7 px-2.5 text-xs font-medium rounded-sm bg-fg text-fg-inverted hover:bg-fg/90",
          cancelButton:
            "ml-2 inline-flex items-center justify-center h-7 px-2.5 text-xs font-medium rounded-sm bg-bg-muted text-fg hover:bg-border",
          closeButton:
            "absolute top-2 right-2 text-fg-subtle hover:text-fg",
          error: "border-danger/30",
          success: "border-success/30",
          warning: "border-warning/30",
          info: "border-info/30",
        },
      }}
    />
  );
}

export { toast };
