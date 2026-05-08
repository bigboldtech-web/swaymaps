import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Providers } from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SwayMaps — Visual Dependency Intelligence Platform",
    template: "%s | SwayMaps",
  },
  description:
    "The visual planning and dependency mapping platform for every team. Map systems, trace impact, align stakeholders. AI-powered, real-time collaboration, 25+ templates.",
  metadataBase: new URL("https://swaymaps.com"),
  openGraph: {
    title: "SwayMaps — Visual Dependency Intelligence Platform",
    description:
      "The visual planning and dependency mapping platform for every team. Map systems, trace impact, align stakeholders.",
    url: "https://swaymaps.com",
    siteName: "SwayMaps",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://swaymaps.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SwayMaps — Visual Dependency Mapping Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps — Visual Dependency Intelligence Platform",
    description:
      "Visual planning and dependency mapping for every team.",
    images: ["https://swaymaps.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SwayMaps",
              "url": "https://swaymaps.com",
              "logo": "https://swaymaps.com/logo.png",
              "description": "The visual planning and dependency mapping platform for every team.",
              "sameAs": [
                "https://twitter.com/swaymaps",
                "https://github.com/swaymaps",
                "https://linkedin.com/company/swaymaps"
              ],
            }),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
