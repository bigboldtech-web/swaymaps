import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SwayMaps",
  description: "Visualize people, features, processes, systems, and issues."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
