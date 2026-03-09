"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { ToastProvider } from "../components/providers/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
