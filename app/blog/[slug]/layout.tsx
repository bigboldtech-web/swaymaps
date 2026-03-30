import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — SwayMaps",
  description:
    "Read engineering deep dives, product updates, and best practices for visual dependency mapping from the SwayMaps team.",
  openGraph: {
    title: "SwayMaps Blog",
    description:
      "Read engineering deep dives, product updates, and best practices for visual dependency mapping from the SwayMaps team.",
    url: "https://swaymaps.com/blog",
    siteName: "SwayMaps",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Blog",
    description:
      "Read engineering deep dives, product updates, and best practices for visual dependency mapping from the SwayMaps team.",
  },
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
