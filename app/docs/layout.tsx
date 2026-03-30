import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — Getting Started, Guides & API Reference",
  description:
    "Learn SwayMaps: getting started guide, node types reference, AI generation guide, YAML DSL documentation, collaboration setup, import/export guides, and API reference.",
  openGraph: {
    title: "SwayMaps Documentation — Getting Started, Guides & API Reference",
    description:
      "Learn SwayMaps: getting started guide, node types reference, AI generation guide, YAML DSL documentation, collaboration setup, import/export guides, and API reference.",
    url: "https://swaymaps.com/docs",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Documentation — Getting Started, Guides & API Reference",
    description:
      "Learn SwayMaps: getting started guide, node types reference, AI generation guide, YAML DSL documentation, collaboration setup, import/export guides, and API reference.",
  },
  alternates: { canonical: "https://swaymaps.com/docs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
