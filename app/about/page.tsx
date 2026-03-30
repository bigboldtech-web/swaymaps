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

/* ---- LOGO ---- */
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

/* ---- DATA ---- */
const values = [
  {
    icon: "VF",
    title: "Visual First",
    desc: "We believe seeing is understanding. Every feature starts with how it looks on the canvas.",
    color: "rgba(0,194,255,0.12)",
    textColor: "var(--accent)",
  },
  {
    icon: "DX",
    title: "Developer Experience",
    desc: "Built by engineers, for engineers. Fast, keyboard-driven, and designed to stay out of your way.",
    color: "rgba(139,92,246,0.12)",
    textColor: "#8b5cf6",
  },
  {
    icon: "AI",
    title: "Accessible Intelligence",
    desc: "Dependency knowledge shouldn't be locked in one team's heads. We make it visual and shareable.",
    color: "rgba(236,72,153,0.12)",
    textColor: "#ec4899",
  },
  {
    icon: "OP",
    title: "Open by Default",
    desc: "YAML DSL, REST API, webhooks, export everything. Your data is yours.",
    color: "rgba(34,197,94,0.12)",
    textColor: "#22c55e",
  },
];

const team = [
  { initials: "RS", name: "R. Shaw", role: "Founder & CEO", bio: "Ex-platform engineer. Spent a decade untangling production dependencies the hard way.", color: "var(--accent)" },
  { initials: "AK", name: "A. Kumar", role: "Head of Engineering", bio: "Distributed systems veteran. Believes every architecture decision should be visible.", color: "#8b5cf6" },
  { initials: "MP", name: "M. Park", role: "Head of Design", bio: "Information design specialist. Obsessed with making complexity feel simple.", color: "#ec4899" },
  { initials: "JL", name: "J. Larsson", role: "Head of Growth", bio: "Developer tools GTM. Previously scaled two SaaS products from zero to 10K teams.", color: "#22c55e" },
];

/* ---- COMPONENT ---- */
export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About SwayMaps",
        "description": "SwayMaps is the visual planning and dependency mapping platform. Our mission: make complex relationships visible and accessible to every team.",
        "url": "https://swaymaps.com/about",
        "mainEntity": {
          "@type": "Organization",
          "name": "SwayMaps",
          "url": "https://swaymaps.com",
          "description": "The visual dependency intelligence platform. Map, understand, and manage complex relationships across your organization.",
          "sameAs": []
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://swaymaps.com" },
            { "@type": "ListItem", "position": 2, "name": "About", "item": "https://swaymaps.com/about" }
          ]
        }
      }) }} />

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
            <span className="lp-nav-logo-icon">
              <Logo size={20} />
            </span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span>SwayMaps</span>
              <span style={{ fontSize: ".55rem", fontWeight: 500, color: "var(--t3)", letterSpacing: ".04em", marginTop: "2px" }}>Shows The Way</span>
            </span>
          </Link>

          <ul className="lp-nav-links">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/use-cases">Use Cases</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/blog">Blog</Link></li>
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
      <section className="lp-section" style={{ paddingBottom: 40 }}>
        <div className="lp-container" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="lp-eyebrow">About</div>
            <h1 className="lp-section-title" style={{ fontSize: "clamp(2.6rem,5vw,3.8rem)" }}>
              Making dependencies visible.
            </h1>
            <p className="lp-section-subtitle" style={{ margin: "0 auto", maxWidth: 620 }}>
              We believe every team deserves to see how their systems, people, and processes connect.
            </p>
          </Reveal>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ paddingTop: 20, paddingBottom: 100, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{
              maxWidth: 760,
              margin: "0 auto",
              textAlign: "center",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "52px 48px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, var(--accent), #6366f1, #ec4899)",
              }} />

              <h2 style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 24,
              }}>
                Our Mission
              </h2>

              <p style={{
                fontSize: "1.2rem",
                color: "var(--t1)",
                lineHeight: 1.8,
                fontWeight: 500,
                marginBottom: 20,
              }}>
                Complex system relationships are invisible to most teams. The knowledge lives in a few
                engineers&apos; heads, scattered across wikis, or nowhere at all. When those people leave, the
                knowledge leaves with them.
              </p>

              <p style={{
                fontSize: "1.05rem",
                color: "var(--t2)",
                lineHeight: 1.8,
              }}>
                SwayMaps exists to make dependency intelligence accessible to everyone, not just platform
                engineers. We give teams a visual, living map of how their systems, services, data, and people
                connect. So that when something breaks, ships, or changes, everyone can see the full picture.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ paddingTop: 0, paddingBottom: 100, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="lp-eyebrow">Values</div>
              <h2 className="lp-section-title" style={{ fontSize: 36 }}>What drives us</h2>
              <p className="lp-section-subtitle" style={{ margin: "0 auto" }}>
                Four principles that shape every product decision.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 16,
            }}>
              {values.map((v, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "28px 24px",
                    transition: "all 0.25s var(--ease)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: 11,
                    background: v.color,
                    color: v.textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 18,
                  }}>
                    {v.icon}
                  </div>
                  <h3 style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--t1)",
                    marginBottom: 8,
                  }}>
                    {v.title}
                  </h3>
                  <p style={{
                    fontSize: "0.84rem",
                    color: "var(--t2)",
                    lineHeight: 1.65,
                  }}>
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ paddingTop: 0, paddingBottom: 100, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="lp-eyebrow">People</div>
              <h2 className="lp-section-title" style={{ fontSize: 36 }}>The Team</h2>
              <p className="lp-section-subtitle" style={{ margin: "0 auto" }}>
                A small, focused crew building the visual layer for infrastructure knowledge.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 20,
              maxWidth: 960,
              margin: "0 auto",
            }}>
              {team.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "32px 24px",
                    textAlign: "center",
                    transition: "all 0.25s var(--ease)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background: `${t.color}18`,
                    border: `2px solid ${t.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 18px",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: t.color,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.02em",
                  }}>
                    {t.initials}
                  </div>

                  <h3 style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--t1)",
                    marginBottom: 4,
                  }}>
                    {t.name}
                  </h3>

                  <p style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: t.color,
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 14,
                  }}>
                    {t.role}
                  </p>

                  <p style={{
                    fontSize: "0.84rem",
                    color: "var(--t2)",
                    lineHeight: 1.6,
                  }}>
                    {t.bio}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* JOIN US */}
      <section style={{ paddingTop: 0, paddingBottom: 120, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{
              textAlign: "center",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "56px 40px",
              maxWidth: 640,
              margin: "0 auto",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, #22c55e, var(--accent))",
              }} />

              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 100,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#22c55e",
                marginBottom: 24,
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }} />
                Hiring
              </div>

              <h2 style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--t1)",
                marginBottom: 12,
              }}>
                We&apos;re hiring
              </h2>
              <p style={{
                fontSize: "0.95rem",
                color: "var(--t2)",
                lineHeight: 1.7,
                marginBottom: 28,
                maxWidth: 460,
                marginLeft: "auto",
                marginRight: "auto",
              }}>
                We&apos;re looking for people who believe infrastructure knowledge should be visual,
                shareable, and never locked in someone&apos;s head. Remote-first, async-first.
              </p>
              <a href="mailto:hello@swaymaps.com" className="lp-btn lp-btn--primary lp-btn--lg">
                See Open Positions &rarr;
              </a>
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
                <span className="lp-nav-logo-icon">
                  <Logo size={20} />
                </span>
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
                <li><Link href="/use-cases">Use Cases</Link></li>
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
