import Link from "next/link";
import { ArrowRight, Check, Minus, Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export type CompareConfig = {
  competitor: string;
  competitorTagline: string;
  competitorColor: string;
  hero: {
    title: string;
    sub: string;
  };
  pitch: string;
  rows: Array<{ feature: string; sway: string | boolean; them: string | boolean; note?: string }>;
  bestFor: { sway: string[]; them: string[] };
  testimonial: { quote: string; author: string; role: string; company: string; color: string };
  faq: Array<{ q: string; a: string }>;
};

export function ComparePage({ config }: { config: CompareConfig }) {
  const c = config;
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(102, 71, 240, 0.07) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              SwayMaps vs {c.competitor}
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-fg leading-[1.05]">
              {c.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-fg-muted leading-relaxed">{c.hero.sub}</p>

            {/* Versus tag */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="rounded-2xl border border-border bg-panel px-6 py-4 text-center">
                <p className="font-display text-lg font-bold text-fg">SwayMaps</p>
                <p className="text-[11px] text-fg-muted mt-0.5">Visual workspace + AI</p>
              </div>
              <span className="font-eyebrow text-[10px] uppercase tracking-wider text-fg-subtle">vs</span>
              <div className="rounded-2xl border border-border bg-panel px-6 py-4 text-center">
                <p className="font-display text-lg font-bold text-fg">{c.competitor}</p>
                <p className="text-[11px] text-fg-muted mt-0.5">{c.competitorTagline}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[900px] px-6 py-16">
          <div className="rounded-2xl border border-border bg-panel p-8">
            <Sparkles className="h-5 w-5 text-accent" />
            <p className="mt-3 text-lg text-fg leading-relaxed">{c.pitch}</p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              Feature comparison
            </h2>
            <p className="mt-3 text-md text-fg-muted">Honest, line by line.</p>
          </div>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <div className="grid grid-cols-3 border-b border-border bg-bg-subtle">
              <div className="px-5 py-4">
                <span className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
                  Capability
                </span>
              </div>
              <div className="px-5 py-4 text-center border-l border-border">
                <p className="text-sm font-display font-bold text-fg">SwayMaps</p>
              </div>
              <div className="px-5 py-4 text-center border-l border-border">
                <p className="text-sm font-display font-bold" style={{ color: c.competitorColor }}>
                  {c.competitor}
                </p>
              </div>
            </div>
            {c.rows.map((row) => (
              <div key={row.feature} className="grid grid-cols-3 border-b border-border last:border-b-0">
                <div className="px-5 py-4">
                  <p className="text-[14px] font-medium text-fg">{row.feature}</p>
                  {row.note && <p className="text-[11px] text-fg-subtle mt-0.5">{row.note}</p>}
                </div>
                <div className="px-5 py-4 text-center border-l border-border">
                  {renderCell(row.sway)}
                </div>
                <div className="px-5 py-4 text-center border-l border-border">
                  {renderCell(row.them)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best-for */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1100px] px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg">
              Best for...
            </h2>
            <p className="mt-3 text-md text-fg-muted">Both tools are good. Different jobs, different fits.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-panel p-7">
              <p className="font-display text-lg font-bold text-fg">SwayMaps is best for</p>
              <ul className="mt-4 space-y-3">
                {c.bestFor.sway.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[14px]">
                    <Check className="h-4 w-4 mt-0.5 text-success shrink-0" />
                    <span className="text-fg-muted leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-panel p-7">
              <p className="font-display text-lg font-bold" style={{ color: c.competitorColor }}>
                {c.competitor} is best for
              </p>
              <ul className="mt-4 space-y-3">
                {c.bestFor.them.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[14px]">
                    <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: c.competitorColor }} />
                    <span className="text-fg-muted leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[900px] px-6 py-16">
          <figure className="rounded-2xl border border-border bg-panel p-10 text-center">
            <p className="font-eyebrow text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
              Customer story
            </p>
            <blockquote className="mt-4 text-xl sm:text-2xl font-display font-bold text-fg leading-snug">
              &ldquo;{c.testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-center gap-3">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ background: c.testimonial.color }}
              >
                {c.testimonial.author
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="text-left">
                <span className="block text-[14px] font-semibold text-fg">{c.testimonial.author}</span>
                <span className="block text-[12px] text-fg-muted">
                  {c.testimonial.role} · {c.testimonial.company}
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[860px] px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold tracking-tight text-fg">
              Common questions
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-panel divide-y divide-border overflow-hidden">
            {c.faq.map((q) => (
              <details key={q.q} className="group p-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[15px] font-display font-semibold text-fg pr-4">
                    {q.q}
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-fg-muted shrink-0 group-open:rotate-45 transition-transform">
                    <span className="text-base leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] text-fg-muted leading-relaxed">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-20">
          <div
            className="rounded-3xl border border-border p-12 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 71, 240, 0.06) 0%, rgba(0, 145, 255, 0.06) 100%)",
            }}
          >
            <h2 className="text-3xl font-display font-bold tracking-tight text-fg">
              Try SwayMaps for free.
            </h2>
            <p className="mt-3 text-md text-fg-muted">
              Import your maps from {c.competitor} in one click.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact?topic=migrate"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                Talk to migration team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function renderCell(v: string | boolean) {
  if (typeof v === "boolean") {
    return v ? (
      <Check className="h-4 w-4 text-success inline" />
    ) : (
      <Minus className="h-4 w-4 text-fg-disabled inline" />
    );
  }
  return <span className="text-[13px] font-medium text-fg">{v}</span>;
}
