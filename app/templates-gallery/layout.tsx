import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates — 25+ Ready-to-Use Maps for Any Team",
  description:
    "Browse 25+ templates: microservices architecture, org charts, CI/CD pipelines, compliance maps, vendor dependencies, project plans, and more. One-click start.",
  openGraph: {
    title: "SwayMaps Templates — 25+ Ready-to-Use Maps for Any Team",
    description:
      "Browse 25+ templates: microservices architecture, org charts, CI/CD pipelines, compliance maps, vendor dependencies, project plans, and more.",
    url: "https://swaymaps.com/templates-gallery",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Templates — 25+ Ready-to-Use Maps for Any Team",
    description:
      "Browse 25+ templates: microservices architecture, org charts, CI/CD pipelines, compliance maps, vendor dependencies, project plans, and more.",
  },
  alternates: { canonical: "https://swaymaps.com/templates-gallery" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
