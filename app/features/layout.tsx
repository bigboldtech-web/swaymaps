import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — AI Generation, Collaboration, Version History & More",
  description:
    "Explore SwayMaps features: AI-powered map generation, real-time collaboration, version history with diff viewer, YAML diagram-as-code, 25+ templates, health dashboard, and more.",
  openGraph: {
    title: "SwayMaps Features — Everything You Need to Map Your World",
    description:
      "AI generation, real-time collaboration, version history, diagram-as-code, 25+ templates, and more.",
    url: "https://swaymaps.com/features",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Features — Everything You Need to Map Your World",
    description:
      "AI generation, real-time collaboration, version history, diagram-as-code, 25+ templates, and more.",
  },
  alternates: { canonical: "https://swaymaps.com/features" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
