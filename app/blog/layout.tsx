import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Insights on Dependency Intelligence & Visual Planning",
  description:
    "Read about dependency mapping best practices, visual planning strategies, compliance automation, engineering productivity, and SwayMaps product updates.",
  openGraph: {
    title: "SwayMaps Blog — Insights on Dependency Intelligence & Visual Planning",
    description:
      "Read about dependency mapping best practices, visual planning strategies, compliance automation, engineering productivity, and SwayMaps product updates.",
    url: "https://swaymaps.com/blog",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Blog — Insights on Dependency Intelligence & Visual Planning",
    description:
      "Read about dependency mapping best practices, visual planning strategies, compliance automation, engineering productivity, and SwayMaps product updates.",
  },
  alternates: { canonical: "https://swaymaps.com/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
