import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Free Forever, Pro from $19/mo, Team from $59/mo",
  description:
    "SwayMaps pricing: Free plan with 3 maps forever. Pro at $29/mo ($19 annual) for unlimited maps. Team at $79/mo ($59 annual) for workspaces, version history, and integrations.",
  openGraph: {
    title: "SwayMaps Pricing — Free Forever, Pro from $19/mo, Team from $59/mo",
    description:
      "Free plan with 3 maps forever. Pro at $29/mo ($19 annual) for unlimited maps. Team at $79/mo ($59 annual) for workspaces, version history, and integrations.",
    url: "https://swaymaps.com/pricing",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwayMaps Pricing — Free Forever, Pro from $19/mo, Team from $59/mo",
    description:
      "Free plan with 3 maps forever. Pro at $29/mo ($19 annual) for unlimited maps. Team at $79/mo ($59 annual) for workspaces, version history, and integrations.",
  },
  alternates: { canonical: "https://swaymaps.com/pricing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
