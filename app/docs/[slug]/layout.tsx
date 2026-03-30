import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SwayMaps Guide",
  description:
    "In-depth guide for SwayMaps — the visual dependency mapping platform for every team.",
  openGraph: {
    title: "SwayMaps Guide",
    description:
      "In-depth guide for SwayMaps — the visual dependency mapping platform for every team.",
    url: "https://swaymaps.com/docs",
    siteName: "SwayMaps",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Guide",
    description:
      "In-depth guide for SwayMaps — the visual dependency mapping platform for every team.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
