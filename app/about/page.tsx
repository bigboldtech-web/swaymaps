"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../landing/landing.css";

/* ─── SCROLL REVEAL HOOK ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── DATA ─── */
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

/* ─── COMPONENT ─── */
export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-root" ref={rootRef}>
      {/* ─── BG ─── */}
      <div className="map-bg">
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
        <div className="orb c" />
      </div>

      {/* ─── NAV ─── */}
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/landing" className="logo">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 18 C8 18 8 6 12 6 C16 6 16 18 20 18" />
              </svg>
            </div>
            <span className="logo-text">SwayMaps</span>
          </Link>
          <div className="nav-links">
            <Link href="/features">Features</Link>
            <Link href="/use-cases">Use Cases</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/templates-gallery">Templates</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">Sign In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free &rarr;</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">About</div>
          <h1 style={{ fontSize: "clamp(2.6rem,5vw,3.8rem)" }}>
            Making dependencies visible.
          </h1>
          <p className="hero-sub">
            We believe every team deserves to see how their systems, people, and processes connect.
          </p>
        </div>
      </section>

      {/* ─── MISSION ─── */}
      <section style={{ paddingTop: 20, paddingBottom: 100 }}>
        <div className="container reveal" style={{ maxWidth: 760, textAlign: "center" }}>
          <div style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "52px 48px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Accent top line */}
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
              fontFamily: "var(--mono)",
              textTransform: "uppercase" as const,
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
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 100 }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow">Values</div>
            <h2 className="stitle">What drives us</h2>
            <p className="sdesc" style={{ margin: "0 auto" }}>
              Four principles that shape every product decision.
            </p>
          </div>

          <div className="reveal" style={{
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
                  transition: "all var(--ease)",
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
                  fontFamily: "var(--mono)",
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
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 100 }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow">People</div>
            <h2 className="stitle">The Team</h2>
            <p className="sdesc" style={{ margin: "0 auto" }}>
              A small, focused crew building the visual layer for infrastructure knowledge.
            </p>
          </div>

          <div className="reveal" style={{
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
                  transition: "all var(--ease)",
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
                {/* Avatar circle */}
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
                  fontFamily: "var(--mono)",
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
                  fontFamily: "var(--mono)",
                  textTransform: "uppercase" as const,
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
        </div>
      </section>

      {/* ─── JOIN US ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 120 }}>
        <div className="container reveal" style={{ textAlign: "center" }}>
          <div style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "56px 40px",
            maxWidth: 640,
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Accent top line */}
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
            <a href="mailto:hello@swaymaps.com" className="btn btn-primary btn-lg">
              See Open Positions &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/landing" className="logo" style={{ marginBottom: 12 }}>
                <div className="logo-mark" style={{ width: 28, height: 28, borderRadius: 7 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ width: 18, height: 18 }}>
                    <path d="M4 18 C8 18 8 6 12 6 C16 6 16 18 20 18" />
                  </svg>
                </div>
                <span className="logo-text" style={{ fontSize: "1.1rem" }}>SwayMaps</span>
              </Link>
              <p>Visual dependency mapping for engineering teams.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/features">Features</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/use-cases">Use Cases</Link>
              <Link href="/templates-gallery">Templates</Link>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <Link href="/docs">Documentation</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/docs">API Reference</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
              <a href="mailto:support@swaymaps.com">Support</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/legal/terms">Terms of Service</Link>
              <Link href="/legal/privacy">Privacy Policy</Link>
              <Link href="/legal/privacy">Cookie Policy</Link>
              <Link href="/legal/privacy">GDPR</Link>
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
