import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases — Engineering, Product, Operations, Compliance & More",
  description:
    "See how engineering, product, operations, compliance, leadership, and project management teams use SwayMaps to map dependencies and plan visually.",
  openGraph: {
    title: "SwayMaps Use Cases — Engineering, Product, Operations & More",
    description:
      "See how engineering, product, operations, compliance, leadership, and project management teams use SwayMaps to map dependencies and plan visually.",
    url: "https://swaymaps.com/use-cases",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Use Cases — Engineering, Product, Operations & More",
    description:
      "See how engineering, product, operations, compliance, leadership, and project management teams use SwayMaps to map dependencies and plan visually.",
  },
  alternates: { canonical: "https://swaymaps.com/use-cases" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
