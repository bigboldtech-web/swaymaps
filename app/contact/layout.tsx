import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Book a Demo or Get Support",
  description:
    "Get in touch with the SwayMaps team. Book a demo, ask a question, or request enterprise pricing. We respond within 24 hours.",
  openGraph: {
    title: "Contact SwayMaps — Book a Demo or Get Support",
    description:
      "Get in touch with the SwayMaps team. Book a demo, ask a question, or request enterprise pricing. We respond within 24 hours.",
    url: "https://swaymaps.com/contact",
    siteName: "SwayMaps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact SwayMaps — Book a Demo or Get Support",
    description:
      "Get in touch with the SwayMaps team. Book a demo, ask a question, or request enterprise pricing. We respond within 24 hours.",
  },
  alternates: { canonical: "https://swaymaps.com/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
