import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Providers } from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "SwayMaps — Visual Dependency Intelligence Platform",
    template: "%s | SwayMaps",
  },
  description:
    "Map people, systems, processes, and dependencies in a visual canvas. Collaborate in real-time, brainstorm with AI, and export production-ready diagrams.",
  metadataBase: new URL("https://swaymaps.com"),
  openGraph: {
    title: "SwayMaps — Visual Dependency Intelligence Platform",
    description:
      "Map people, systems, processes, and dependencies in a visual canvas. Collaborate in real-time, brainstorm with AI, and export production-ready diagrams.",
    url: "https://swaymaps.com",
    siteName: "SwayMaps",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps — Visual Dependency Intelligence Platform",
    description:
      "Map people, systems, processes, and dependencies in a visual canvas.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
