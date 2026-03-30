import MarketingLayout from "@/components/marketing/MarketingLayout";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
