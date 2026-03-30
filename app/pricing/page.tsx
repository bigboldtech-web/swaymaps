"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../landing/landing.css";

/* ─── FAQ DATA ─── */
const faqData = [
  {
    id: "trial",
    question: "Can I try Pro or Team for free?",
    answer:
      "Yes! Both Pro and Team come with a 14-day free trial. No credit card required to start.",
  },
  {
    id: "trial-end",
    question: "What happens when my trial ends?",
    answer:
      "You'll be moved to the Free plan with 3 maps. No data is lost -- upgrade anytime to regain access to all your maps.",
  },
  {
    id: "switch",
    question: "Can I switch plans anytime?",
    answer:
      "Absolutely. Upgrade, downgrade, or cancel at any time. Changes take effect immediately with prorated billing.",
  },
  {
    id: "discounts",
    question: "Do you offer discounts for startups or nonprofits?",
    answer:
      "Yes! Contact us for special pricing for startups, nonprofits, and educational institutions.",
  },
  {
    id: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards via Stripe. Annual plans can also be paid by invoice.",
  },
  {
    id: "security",
    question: "Is my data secure?",
    answer:
      "Your data is encrypted at rest and in transit. We use PostgreSQL with regular backups. SOC2 compliance is on our roadmap.",
  },
  {
    id: "cancel",
    question: "Can I cancel anytime?",
    answer:
      "Yes, cancel with one click from your billing settings. No questions asked, no cancellation fees.",
  },
  {
    id: "enterprise",
    question: "Do you offer custom enterprise plans?",
    answer:
      "Yes! For teams of 20+ or custom requirements, contact us for a tailored plan with SSO, SAML, and dedicated support.",
  },
];

/* ─── COMPARISON TABLE DATA ─── */
const comparisonRows = [
  { feature: "Maps", free: "3", pro: "Unlimited", team: "Unlimited" },
  { feature: "Node Types", free: "All 11", pro: "All 11", team: "All 11" },
  {
    feature: "AI Generation",
    free: "Limited",
    pro: "Unlimited",
    team: "Unlimited",
  },
  { feature: "Templates", free: "All", pro: "All", team: "All" },
  {
    feature: "Export Formats",
    free: "PNG, JSON",
    pro: "PNG, SVG, PDF, JSON",
    team: "All",
  },
  {
    feature: "Version History",
    free: false,
    pro: false,
    team: "50 versions",
  },
  {
    feature: "Collaboration",
    free: false,
    pro: false,
    team: "Workspaces + Roles",
  },
  { feature: "Public Sharing", free: false, pro: true, team: true },
  { feature: "Inline Comments", free: false, pro: false, team: true },
  {
    feature: "Integrations",
    free: false,
    pro: false,
    team: "Slack, Teams, Webhooks",
  },
  {
    feature: "Health Dashboard",
    free: "Basic",
    pro: "Full",
    team: "Full",
  },
  { feature: "Command Palette", free: true, pro: true, team: true },
  { feature: "Import", free: false, pro: true, team: true },
  {
    feature: "API Access",
    free: false,
    pro: false,
    team: "Coming Soon",
  },
  {
    feature: "Support",
    free: "Community",
    pro: "Priority Email",
    team: "Dedicated",
  },
];

/* ─── SCROLL REVEAL HOOK ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const targets = el.querySelectorAll(".reveal");
    targets.forEach((t) => observer.observe(t));

    return () => {
      targets.forEach((t) => observer.unobserve(t));
    };
  }, []);

  return ref;
}

/* ─── CELL RENDERER ─── */
function CellValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: 6,
          background: "rgba(34,197,94,0.1)",
          color: "var(--healthy)",
          fontSize: ".75rem",
          fontWeight: 700,
        }}
      >
        &#10003;
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: 6,
          background: "rgba(74,90,122,0.1)",
          color: "var(--t3)",
          fontSize: ".85rem",
          fontWeight: 500,
        }}
      >
        &mdash;
      </span>
    );
  }
  return <span>{value}</span>;
}

/* ─── PAGE ─── */
export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-root" ref={rootRef}>
      {/* ═══ MAP BACKGROUND ═══ */}
      <div className="map-bg">
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
        <div className="orb c" />
      </div>

      {/* ═══ NAV ═══ */}
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 18C4 18 8 10 12 12C16 14 20 6 20 6"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="4" cy="18" r="2.2" fill="white" />
                <circle cx="12" cy="12" r="2.2" fill="white" />
                <circle cx="20" cy="6" r="2.2" fill="white" />
              </svg>
            </div>
            <span className="logo-text">SwayMaps</span>
          </Link>

          <div className="nav-links">
            <Link href="/landing#features">Features</Link>
            <Link href="/landing#use-cases">Use Cases</Link>
            <Link href="/pricing">Pricing</Link>
            <a href="#faq">FAQ</a>
          </div>

          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            Pricing
          </div>
          <h1
            className="stitle"
            style={{
              fontSize: "clamp(2.6rem,5.5vw,4rem)",
              marginBottom: 18,
            }}
          >
            Start free. <span className="grad">Scale as you grow.</span>
          </h1>
          <p
            className="sdesc"
            style={{
              margin: "0 auto",
              textAlign: "center",
              maxWidth: 520,
              fontSize: "1.15rem",
            }}
          >
            3 maps free forever. No credit card required.
          </p>

          {/* Toggle */}
          <div
            className="pricing-toggle"
            style={{ marginTop: 32, display: "inline-flex" }}
          >
            <button
              className={annual ? "" : "active"}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={annual ? "active" : ""}
              onClick={() => setAnnual(true)}
            >
              Annual
            </button>
            <span className="save-badge">Save 30%</span>
          </div>
        </div>
      </section>

      {/* ═══ PRICING CARDS ═══ */}
      <section style={{ paddingTop: 0, paddingBottom: 100 }}>
        <div className="container">
          <div className="pricing-grid reveal">
            {/* Free */}
            <div className="pc-card">
              <div className="ptier">Free</div>
              <div className="pamt">
                $0<span className="per"> /mo</span>
              </div>
              <div className="pann">Free forever</div>
              <ul className="pf">
                {[
                  "3 maps",
                  "All 11 node types",
                  "Limited AI generation",
                  "All templates",
                  "PNG & JSON export",
                  "Community support",
                ].map((f) => (
                  <li key={f}>
                    <span className="ck y">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="pbtn secondary">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="pc-card pop">
              <div className="ptier">Pro</div>
              <div className="pamt">
                ${annual ? "19" : "29"}
                <span className="per"> /mo</span>
              </div>
              <div className="pann">
                {annual
                  ? "Billed $228/year"
                  : "Billed monthly"}
              </div>
              <ul className="pf">
                <li style={{ fontWeight: 600, color: "var(--t1)" }}>
                  <span className="ck y">&#10003;</span>
                  Everything in Free +
                </li>
                {[
                  "Unlimited maps",
                  "Unlimited AI generation",
                  "SVG & PDF export",
                  "Public sharing links",
                  "Priority email support",
                ].map((f) => (
                  <li key={f}>
                    <span className="ck y">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="pbtn primary">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Team */}
            <div className="pc-card">
              <div className="ptier">Team</div>
              <div className="pamt">
                ${annual ? "59" : "79"}
                <span className="per"> /mo</span>
              </div>
              <div className="pann">
                {annual
                  ? "Billed $708/year"
                  : "Billed monthly"}
              </div>
              <ul className="pf">
                <li style={{ fontWeight: 600, color: "var(--t1)" }}>
                  <span className="ck y">&#10003;</span>
                  Everything in Pro +
                </li>
                {[
                  "50 versions + diff viewer",
                  "Workspaces & roles",
                  "Inline comments",
                  "Slack / Teams / webhooks",
                  "Health dashboard",
                  "Dedicated support",
                ].map((f) => (
                  <li key={f}>
                    <span className="ck y">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="pbtn primary">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURE COMPARISON TABLE ═══ */}
      <section
        className="compare-section"
        style={{ padding: "100px 0" }}
      >
        <div className="container">
          <div
            className="pricing-header reveal"
            style={{ marginBottom: 0 }}
          >
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              Compare Plans
            </div>
            <h2 className="stitle" style={{ textAlign: "center" }}>
              Full feature breakdown
            </h2>
            <p
              className="sdesc"
              style={{
                textAlign: "center",
                margin: "16px auto 0",
              }}
            >
              See exactly what you get with each plan.
            </p>
          </div>

          <div className="ct reveal rd1">
            {/* Header row */}
            <div
              className="ctr cth"
              style={{
                gridTemplateColumns: "200px 1fr 1fr 1fr",
              }}
            >
              <div>Feature</div>
              <div>Free</div>
              <div>Pro</div>
              <div style={{ color: "var(--accent)", fontWeight: 700 }}>
                Team
              </div>
            </div>

            {comparisonRows.map((row, idx) => (
              <div
                className="ctr"
                key={row.feature}
                style={{
                  gridTemplateColumns: "200px 1fr 1fr 1fr",
                  ...(idx % 2 === 1
                    ? { background: "rgba(15,22,41,0.5)" }
                    : {}),
                }}
              >
                <div>{row.feature}</div>
                <div>
                  <CellValue value={row.free} />
                </div>
                <div>
                  <CellValue value={row.pro} />
                </div>
                <div>
                  <CellValue value={row.team} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" style={{ padding: "100px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div
            className="pricing-header reveal"
            style={{ marginBottom: 48 }}
          >
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              FAQ
            </div>
            <h2 className="stitle" style={{ textAlign: "center" }}>
              Frequently asked questions
            </h2>
          </div>

          <div
            className="reveal rd1"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {faqData.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r)",
                    overflow: "hidden",
                    transition: "border-color var(--ease)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--border2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--border)")
                  }
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(isOpen ? null : faq.id)
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px 22px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font)",
                      fontSize: ".92rem",
                      fontWeight: 600,
                      color: "var(--t1)",
                      textAlign: "left",
                      lineHeight: 1.5,
                    }}
                  >
                    <span>{faq.question}</span>
                    <span
                      style={{
                        flexShrink: 0,
                        marginLeft: 16,
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        background: isOpen
                          ? "rgba(0,194,255,0.1)"
                          : "rgba(74,90,122,0.1)",
                        color: isOpen
                          ? "var(--accent)"
                          : "var(--t3)",
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        transition: "all var(--ease)",
                      }}
                    >
                      {isOpen ? "\u2212" : "+"}
                    </span>
                  </button>
                  <div
                    style={{
                      maxHeight: isOpen ? 300 : 0,
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition:
                        "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "0 22px 20px",
                        fontSize: ".88rem",
                        color: "var(--t2)",
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="final-cta reveal">
        <div className="container">
          <h2>
            Ready to see what <span className="grad">depends on what</span>?
          </h2>
          <p>
            Start mapping for free. Upgrade when your team is ready.
          </p>
          <div className="fca">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Start Free
            </Link>
            <a
              href="mailto:sales@swaymaps.com"
              className="btn btn-outline btn-lg"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="logo" style={{ marginBottom: 14 }}>
                <div className="logo-mark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 18C4 18 8 10 12 12C16 14 20 6 20 6"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="4" cy="18" r="2.2" fill="white" />
                    <circle cx="12" cy="12" r="2.2" fill="white" />
                    <circle cx="20" cy="6" r="2.2" fill="white" />
                  </svg>
                </div>
                <span className="logo-text">SwayMaps</span>
              </Link>
              <p>
                The visual dependency intelligence platform for engineering
                teams.
              </p>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/landing#features">Features</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/landing">Templates</Link>
              <a href="#">Changelog</a>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/terms">Terms</Link>
              <a href="mailto:security@swaymaps.com">Security</a>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">Docs</a>
              <a href="mailto:hello@swaymaps.com">Contact</a>
              <a href="#">Status</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; 2026 SwayMaps. All rights reserved.</span>
            <div className="footer-bottom-links">
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
