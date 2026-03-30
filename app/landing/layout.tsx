import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SwayMaps — See What Depends on What | Visual Dependency Mapping",
  description:
    "The visual planning and dependency mapping platform for every team. Map systems, trace impact, align stakeholders. AI-powered, real-time collaboration, 25+ templates. Start free.",
  keywords: [
    "dependency mapping",
    "visual planning",
    "system architecture",
    "project dependencies",
    "microservices map",
    "org chart",
    "compliance mapping",
    "AI diagram generator",
    "team collaboration",
    "dependency visualization",
  ],
  openGraph: {
    title: "SwayMaps — See What Depends on What",
    description:
      "The visual planning and dependency mapping platform for every team. Map systems, trace impact, align stakeholders.",
    url: "https://swaymaps.com",
    siteName: "SwayMaps",
    type: "website",
    locale: "en_US",
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
    title: "SwayMaps — See What Depends on What",
    description:
      "Visual planning and dependency mapping for every team.",
    images: ["https://swaymaps.com/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://swaymaps.com" },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
