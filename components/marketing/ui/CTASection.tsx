import Button from "./Button";

interface CTASectionProps {
  heading?: string;
  subtitle?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  className?: string;
}

export default function CTASection({
  heading = "Ready to map your system?",
  subtitle = "Start for free. No credit card required. Upgrade when you need more.",
  primaryText = "Start Free",
  primaryHref = "/auth/signup",
  secondaryText = "View Pricing",
  secondaryHref = "/pricing",
  className = "",
}: CTASectionProps) {
  return (
    <section className={`relative py-24 sm:py-32 ${className}`}>
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 -z-10 mx-auto"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,194,255,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e4e9f4] tracking-tight leading-tight"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {heading}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#8091b3] leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="primary" size="lg" href={primaryHref}>
            {primaryText}
          </Button>
          <Button variant="outline" size="lg" href={secondaryHref}>
            {secondaryText}
          </Button>
        </div>
      </div>
    </section>
  );
}
