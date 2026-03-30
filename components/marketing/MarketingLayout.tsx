import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundEffects from "./BackgroundEffects";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: "#070b14" }}>
      <BackgroundEffects />
      <Navbar />
      <main className="relative z-10 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
