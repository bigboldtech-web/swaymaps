import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SwayMaps — Making Dependencies Visible",
  description:
    "SwayMaps is the visual planning and dependency mapping platform. Our mission: make complex relationships visible and accessible to every team.",
  openGraph: {
    title: "About SwayMaps — Making Dependencies Visible",
    description:
      "SwayMaps is the visual planning and dependency mapping platform. Our mission: make complex relationships visible and accessible to every team.",
    url: "https://swaymaps.com/about",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About SwayMaps — Making Dependencies Visible",
    description:
      "SwayMaps is the visual planning and dependency mapping platform. Our mission: make complex relationships visible and accessible to every team.",
  },
  alternates: { canonical: "https://swaymaps.com/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
