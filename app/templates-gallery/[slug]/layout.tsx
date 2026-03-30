import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Template Preview — SwayMaps",
  description:
    "Interactive preview of a SwayMaps template. See real nodes, edges, and architecture before you start. One-click to begin mapping.",
  openGraph: {
    title: "Template Preview — SwayMaps",
    description:
      "Interactive preview of a SwayMaps template. See real nodes, edges, and architecture before you start.",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Template Preview — SwayMaps",
    description:
      "Interactive preview of a SwayMaps template. See real nodes, edges, and architecture before you start.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
