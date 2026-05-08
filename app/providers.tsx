"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { ToastProvider } from "../components/providers/ToastProvider";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { Toaster } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>
          <TooltipProvider delayDuration={250}>
            {children}
            <Toaster />
          </TooltipProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
