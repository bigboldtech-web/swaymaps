import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Providers } from "./providers";
import { Inter, Plus_Jakarta_Sans, Sometype_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sometypeMono = Sometype_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-eyebrow",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('swaymaps-theme');var d=document.documentElement;if(t==='dark'){d.classList.add('dark');d.classList.remove('light');}else{d.classList.add('light');d.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jakarta.variable} ${sometypeMono.variable} font-sans antialiased`}>
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
