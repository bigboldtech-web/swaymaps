import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — What's New in SwayMaps",
  description:
    "Follow SwayMaps development: new features, improvements, and fixes. See our latest releases including AI generation, YAML DSL, version history, and more.",
  openGraph: {
    title: "SwayMaps Changelog — What's New in SwayMaps",
    description:
      "Follow SwayMaps development: new features, improvements, and fixes. See our latest releases including AI generation, YAML DSL, version history, and more.",
    url: "https://swaymaps.com/changelog",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Changelog — What's New in SwayMaps",
    description:
      "Follow SwayMaps development: new features, improvements, and fixes. See our latest releases including AI generation, YAML DSL, version history, and more.",
  },
  alternates: { canonical: "https://swaymaps.com/changelog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
