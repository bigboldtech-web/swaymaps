"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../landing/landing.css";

/* ---- SVG ICONS ---- */
function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

function IconCheck({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6.5l3 3 5-6" />
    </svg>
  );
}

function IconMinus({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 6h8" />
    </svg>
  );
}

function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
      <path d="M 28 10 C 12 10, 12 20, 20 20 C 28 20, 28 30, 12 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="10" r="3.5" fill="white" />
      <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.6" />
      <circle cx="12" cy="30" r="3.5" fill="white" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ---- SCROLL REVEAL ---- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`lp-reveal ${className}`}>
      {children}
    </div>
  );
}

/* ---- FAQ DATA ---- */
const faqData = [
  {
    question: "Can I try Pro or Team for free?",
    answer: "Yes! Both Pro and Team come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What happens when my trial ends?",
    answer: "You'll be moved to the Free plan with 3 maps. No data is lost -- upgrade anytime to regain access to all your maps.",
  },
  {
    question: "Can I switch plans anytime?",
    answer: "Absolutely. Upgrade, downgrade, or cancel at any time. Changes take effect immediately with prorated billing.",
  },
  {
    question: "Do you offer discounts for startups or nonprofits?",
    answer: "Yes! We offer special pricing for qualifying startups and nonprofit organizations. Contact us at hello@swaymaps.com for details.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, Amex) via Stripe. All payments are securely processed.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. All data is encrypted in transit and at rest. We use PostgreSQL with regular automated backups and follow industry best practices for security.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, one click in your billing settings. You keep access until the end of your current billing period.",
  },
  {
    question: "Do you offer enterprise plans?",
    answer: "Yes! For teams of 20+, we offer custom enterprise plans with dedicated support, SLA, SSO, and custom integrations. Contact sales@swaymaps.com.",
  },
];

/* ---- COMPARISON TABLE DATA ---- */
const comparisonRows: { feature: string; free: string; pro: string; team: string }[] = [
  { feature: "Maps", free: "3", pro: "Unlimited", team: "Unlimited" },
  { feature: "Node types", free: "All 11", pro: "All 11", team: "All 11" },
  { feature: "AI map generation", free: "5 / month", pro: "Unlimited", team: "Unlimited" },
  { feature: "PNG export", free: "\u2713", pro: "\u2713", team: "\u2713" },
  { feature: "JSON export", free: "\u2713", pro: "\u2713", team: "\u2713" },
  { feature: "SVG export", free: "\u2014", pro: "\u2713", team: "\u2713" },
  { feature: "PDF export", free: "\u2014", pro: "\u2713", team: "\u2713" },
  { feature: "Public sharing links", free: "\u2713", pro: "\u2713", team: "\u2713" },
  { feature: "Community templates", free: "\u2713", pro: "\u2713", team: "\u2713" },
  { feature: "Health dashboard", free: "Basic", pro: "Advanced", team: "Advanced" },
  { feature: "Team workspaces", free: "\u2014", pro: "\u2014", team: "\u2713" },
  { feature: "Role-based access", free: "\u2014", pro: "\u2014", team: "\u2713" },
  { feature: "Inline comments", free: "\u2014", pro: "\u2014", team: "\u2713" },
  { feature: "Version history + diff", free: "\u2014", pro: "\u2014", team: "50 versions" },
  { feature: "Integrations (Slack, Teams)", free: "\u2014", pro: "\u2014", team: "\u2713" },
];

/* ============================================================
   PRICING PAGE
   ============================================================ */
export default function PricingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const proPrice = annual ? 19 : 29;
  const teamPrice = annual ? 59 : 79;

  return (
    <div className="lp-root">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "SwayMaps Pricing",
            "description": "Start free. Scale as you grow. 3 maps free forever, no credit card required.",
            "url": "https://swaymaps.com/pricing",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "SwayMaps",
              "offers": [
                { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD" },
                { "@type": "Offer", "name": "Pro", "price": "29", "priceCurrency": "USD", "billingIncrement": "P1M" },
                { "@type": "Offer", "name": "Team", "price": "79", "priceCurrency": "USD", "billingIncrement": "P1M" },
              ],
            },
          }),
        }}
      />

      {/* BACKGROUND */}
      <div className="lp-bg">
        <div className="lp-orb lp-orb--1" />
        <div className="lp-orb lp-orb--2" />
        <div className="lp-orb lp-orb--3" />
      </div>

      {/* NAVBAR */}
      <nav className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <Link href="/" className="lp-nav-logo">
            <span className="lp-nav-logo-icon"><Logo size={20} /></span>
            SwayMaps
          </Link>
          <ul className="lp-nav-links">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/use-cases">Use Cases</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/docs">Docs</Link></li>
          </ul>
          <div className="lp-nav-ctas">
            <Link href="/auth/signin" className="lp-btn lp-btn--ghost">Sign In</Link>
            <Link href="/auth/signup" className="lp-btn lp-btn--primary">
              Get Started <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero" style={{ paddingBottom: 60 }}>
        <div className="lp-container">
          <div className="lp-eyebrow" style={{ textAlign: "center" }}>PRICING</div>
          <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 16 }}>
            Start free. Scale as you grow.
          </h1>
          <p className="lp-hero-sub">
            3 maps free forever. No credit card required.
          </p>
        </div>
      </section>

      {/* TOGGLE */}
      <section style={{ position: "relative", zIndex: 1 }}>
        <div className="lp-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 100,
            padding: 4,
            gap: 0,
          }}>
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                border: "none",
                background: !annual ? "var(--accent)" : "transparent",
                color: !annual ? "#070b14" : "var(--t3)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                border: "none",
                background: annual ? "var(--accent)" : "transparent",
                color: annual ? "#070b14" : "var(--t3)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Annual
            </button>
          </div>
          <span className="lp-pricing-save">Save 30%</span>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: 120 }}>
        <div className="lp-container">
          <Reveal>
            <div className="lp-pricing-grid">
              {/* FREE */}
              <div style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 36,
                display: "flex",
                flexDirection: "column",
              }}>
                <div className="lp-pricing-name">Free</div>
                <div className="lp-pricing-price">
                  <span className="lp-pricing-amount">$0</span>
                </div>
                <div className="lp-pricing-billed">Free forever</div>
                <ul className="lp-pricing-features">
                  {["3 maps", "All 11 node types", "PNG & JSON export", "Public sharing", "Community templates", "Basic health dashboard"].map((f) => (
                    <li key={f} className="lp-pricing-feature">
                      <span className="lp-pricing-check lp-pricing-check--yes"><IconCheck /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="lp-btn lp-btn--ghost lp-pricing-cta" style={{ justifyContent: "center", borderColor: "var(--border2)" }}>
                  Get Started Free
                </Link>
              </div>

              {/* PRO */}
              <div style={{
                background: "var(--bg3)",
                border: "1px solid var(--accent)",
                borderRadius: 14,
                padding: 36,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: "0 0 40px rgba(0,194,255,0.08)",
              }}>
                <span className="lp-pricing-popular-badge">MOST POPULAR</span>
                <div className="lp-pricing-name">Pro</div>
                <div className="lp-pricing-price">
                  <span className="lp-pricing-amount">${proPrice}</span>
                  <span className="lp-pricing-period">/mo</span>
                </div>
                <div className="lp-pricing-billed">
                  {annual ? "Billed annually ($228/yr)" : "Billed monthly"}
                </div>
                <ul className="lp-pricing-features">
                  <li className="lp-pricing-feature" style={{ color: "var(--t3)", fontSize: 13, fontWeight: 600 }}>
                    Everything in Free, plus:
                  </li>
                  {["Unlimited maps", "Unlimited AI generation", "SVG & PDF export", "Public sharing links", "Priority email support"].map((f) => (
                    <li key={f} className="lp-pricing-feature">
                      <span className="lp-pricing-check lp-pricing-check--yes"><IconCheck /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup?plan=pro" className="lp-btn lp-btn--primary lp-pricing-cta" style={{ justifyContent: "center" }}>
                  Start 14-Day Free Trial <IconArrowRight size={14} />
                </Link>
              </div>

              {/* TEAM */}
              <div style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 36,
                display: "flex",
                flexDirection: "column",
              }}>
                <div className="lp-pricing-name">Team</div>
                <div className="lp-pricing-price">
                  <span className="lp-pricing-amount">${teamPrice}</span>
                  <span className="lp-pricing-period">/mo</span>
                </div>
                <div className="lp-pricing-billed">
                  {annual ? "Billed annually ($708/yr)" : "Billed monthly"}
                </div>
                <ul className="lp-pricing-features">
                  <li className="lp-pricing-feature" style={{ color: "var(--t3)", fontSize: 13, fontWeight: 600 }}>
                    Everything in Pro, plus:
                  </li>
                  {[
                    "Team workspaces",
                    "Role-based access",
                    "Inline comments",
                    "50 versions + diff viewer",
                    "Slack / Teams / webhooks",
                    "Dedicated support",
                    "SSO (coming soon)",
                  ].map((f) => (
                    <li key={f} className="lp-pricing-feature">
                      <span className="lp-pricing-check lp-pricing-check--yes"><IconCheck /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup?plan=team" className="lp-btn lp-btn--primary lp-pricing-cta" style={{ justifyContent: "center" }}>
                  Start 14-Day Free Trial <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="lp-eyebrow" style={{ textAlign: "center" }}>COMPARE PLANS</div>
              <h2 className="lp-section-title">Feature comparison</h2>
            </div>
          </Reveal>
          <Reveal>
            <div style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 14, fontWeight: 600, color: "var(--t2)" }}>Feature</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--t2)", width: 140 }}>Free</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--accent)", width: 140 }}>Pro</th>
                    <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--t2)", width: 140 }}>Team</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} style={{ borderBottom: i < comparisonRows.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "14px 24px", fontSize: 14, color: "var(--t1)", fontWeight: 500 }}>{row.feature}</td>
                      {[row.free, row.pro, row.team].map((val, j) => (
                        <td key={j} style={{
                          padding: "14px 24px",
                          textAlign: "center",
                          fontSize: 13,
                          fontFamily: val === "\u2713" || val === "\u2014" ? "var(--font-body)" : "var(--font-mono)",
                          fontWeight: 500,
                          color: val === "\u2713" ? "var(--accent)" : val === "\u2014" ? "var(--t3)" : "var(--t2)",
                        }}>
                          {val === "\u2713" ? <IconCheck size={14} /> : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-faq">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div className="lp-eyebrow" style={{ textAlign: "center" }}>FAQ</div>
              <h2 className="lp-section-title">Frequently asked questions</h2>
            </div>
          </Reveal>

          <div className="lp-faq-list">
            {faqData.map((item, i) => (
              <Reveal key={i}>
                <div className={`lp-faq-item ${openFaq === i ? "is-open" : ""}`}>
                  <button className="lp-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {item.question}
                    <span className="lp-faq-icon">{openFaq === i ? "\u2212" : "+"}</span>
                  </button>
                  <div className="lp-faq-answer-wrapper" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                    <div className="lp-faq-answer">{item.answer}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow" />
        <div className="lp-container">
          <Reveal>
            <h2 className="lp-cta-title">
              Ready to see what<br />depends on what?
            </h2>
            <p className="lp-cta-sub">
              Start mapping for free today. No credit card required.
            </p>
            <div className="lp-cta-buttons">
              <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-btn--lg">
                Get Started Free <IconArrowRight size={16} />
              </Link>
              <Link href="/features" className="lp-btn lp-btn--outline-lg">
                See How It Works
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-footer-brand-logo">
                <span className="lp-nav-logo-icon"><Logo size={20} /></span>
                SwayMaps
              </Link>
              <p className="lp-footer-brand-desc">
                The visual planning and dependency mapping platform for every team.
              </p>
            </div>
            <div>
              <div className="lp-footer-col-title">Product</div>
              <ul className="lp-footer-links">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/templates-gallery">Templates</Link></li>
                <li><Link href="/changelog">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <div className="lp-footer-col-title">Resources</div>
              <ul className="lp-footer-links">
                <li><Link href="/docs">Docs</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/use-cases">Use Cases</Link></li>
              </ul>
            </div>
            <div>
              <div className="lp-footer-col-title">Company</div>
              <ul className="lp-footer-links">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="lp-footer-col-title">Legal</div>
              <ul className="lp-footer-links">
                <li><Link href="/legal/terms">Terms</Link></li>
                <li><Link href="/legal/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span className="lp-footer-copy">&copy; 2026 SwayMaps. All rights reserved.</span>
            <div className="lp-footer-socials">
              <a href="https://twitter.com/swaymaps" target="_blank" rel="noopener noreferrer"><IconTwitter /></a>
              <a href="https://github.com/swaymaps" target="_blank" rel="noopener noreferrer"><IconGitHub /></a>
              <a href="https://linkedin.com/company/swaymaps" target="_blank" rel="noopener noreferrer"><IconLinkedIn /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
