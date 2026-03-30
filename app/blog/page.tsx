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
const categories = ["All", "Engineering", "Compliance", "Product Updates", "Best Practices"];

const categoryColors: Record<string, string> = {
  Engineering: "#00c2ff",
  Compliance: "#8b5cf6",
  "Product Updates": "#22c55e",
  "Best Practices": "#f59e0b",
};

const featuredPost = {
  title: "Why Dependency Mapping is the Missing Layer in Your DevOps Stack",
  category: "Engineering",
  date: "March 15, 2026",
  readTime: "8 min read",
  excerpt: "Most DevOps teams have CI/CD, monitoring, and incident response. But they're missing the one thing that connects it all: a visual dependency map.",
};

const posts = [
  {
    title: "From 6-Month Onboarding to 2 Weeks",
    category: "Engineering",
    date: "March 10, 2026",
    readTime: "6 min read",
    excerpt: "How one fintech company cut new engineer ramp-up time by 75% using visual dependency maps as living documentation.",
  },
  {
    title: "SOC2 Compliance Made Visual",
    category: "Compliance",
    date: "March 5, 2026",
    readTime: "7 min read",
    excerpt: "Auditors love diagrams. Learn how to generate audit-ready data flow maps that satisfy SOC2 requirements.",
  },
  {
    title: "Diagram as Code: Architecture Maps in Git",
    category: "Best Practices",
    date: "February 28, 2026",
    readTime: "5 min read",
    excerpt: "Version-control your architecture diagrams using YAML DSL. Review map changes in pull requests alongside code.",
  },
  {
    title: "The True Cost of Blind Deployments",
    category: "Engineering",
    date: "February 20, 2026",
    readTime: "4 min read",
    excerpt: "When you can't see what depends on what, every deployment is a gamble. Here's how to quantify that risk.",
  },
  {
    title: "Microservices Dependency Hell: A Visual Solution",
    category: "Engineering",
    date: "February 15, 2026",
    readTime: "6 min read",
    excerpt: "Fifty services, hundreds of connections, zero visibility. A practical guide to mapping your way out of dependency chaos.",
  },
  {
    title: "SwayMaps v2.0: AI Generation and YAML DSL",
    category: "Product Updates",
    date: "February 10, 2026",
    readTime: "3 min read",
    excerpt: "Announcing two of our most requested features: AI-powered map generation and a full YAML DSL for diagram-as-code workflows.",
  },
];

/* ─── COMPONENT ─── */
export default function BlogPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const rootRef = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="landing-root" ref={rootRef}>
      {/* ─── BG ─── */}
      <div className="map-bg">
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
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
          <div className="eyebrow">Blog</div>
          <h1 style={{ fontSize: "clamp(2.6rem,5vw,3.8rem)" }}>
            Insights on dependency intelligence
          </h1>
          <p className="hero-sub">
            Engineering deep dives, product updates, and best practices for teams that map their systems.
          </p>
        </div>
      </section>

      {/* ─── CATEGORY FILTER ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 48 }}>
        <div className="container reveal" style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                background: activeCategory === cat ? "var(--accent)" : "transparent",
                border: activeCategory === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
                color: activeCategory === cat ? "#070b14" : "var(--t2)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font)",
                transition: "all var(--ease)",
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                  (e.currentTarget as HTMLElement).style.color = "var(--t1)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--t2)";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── FEATURED POST ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 56 }}>
        <div className="container">
          <a
            href="/blog"
            className="reveal"
            style={{
              display: "block",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "48px 44px",
              textDecoration: "none",
              transition: "all var(--ease)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            {/* Gradient accent line at top */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, var(--accent), #6366f1, #ec4899)",
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{
                padding: "4px 12px",
                borderRadius: 6,
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase" as const,
                letterSpacing: "0.04em",
                background: `${categoryColors[featuredPost.category]}15`,
                color: categoryColors[featuredPost.category],
              }}>
                {featuredPost.category}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                Featured
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "var(--t1)",
              lineHeight: 1.2,
              marginBottom: 16,
              maxWidth: 700,
            }}>
              {featuredPost.title}
            </h2>

            <p style={{
              fontSize: "1rem",
              color: "var(--t2)",
              lineHeight: 1.7,
              maxWidth: 640,
              marginBottom: 24,
            }}>
              {featuredPost.excerpt}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontSize: "0.8rem", fontFamily: "var(--mono)", color: "var(--t3)" }}>
                {featuredPost.date}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--border2)" }} />
              <span style={{ fontSize: "0.8rem", fontFamily: "var(--mono)", color: "var(--t3)" }}>
                {featuredPost.readTime}
              </span>
              <span style={{ marginLeft: "auto", fontSize: "0.88rem", fontWeight: 600, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                Read article &rarr;
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* ─── POST GRID ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 80 }}>
        <div className="container">
          <div className="reveal" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}>
            {filteredPosts.map((post, i) => (
              <a
                key={i}
                href="/blog"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "28px 24px",
                  textDecoration: "none",
                  transition: "all var(--ease)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <span style={{
                  alignSelf: "flex-start",
                  padding: "3px 10px",
                  borderRadius: 6,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.04em",
                  background: `${categoryColors[post.category]}15`,
                  color: categoryColors[post.category],
                  marginBottom: 18,
                }}>
                  {post.category}
                </span>

                <h3 style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--t1)",
                  lineHeight: 1.3,
                  marginBottom: 10,
                }}>
                  {post.title}
                </h3>

                <p style={{
                  fontSize: "0.84rem",
                  color: "var(--t2)",
                  lineHeight: 1.65,
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                  overflow: "hidden",
                  marginBottom: 20,
                }}>
                  {post.excerpt}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--t3)" }}>
                    {post.date}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border2)" }} />
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--t3)" }}>
                    {post.readTime}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAGINATION ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 100 }}>
        <div className="container reveal" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: num === 1 ? "var(--accent)" : "var(--bg3)",
                border: num === 1 ? "1px solid var(--accent)" : "1px solid var(--border)",
                color: num === 1 ? "#070b14" : "var(--t2)",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font)",
                transition: "all var(--ease)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {num}
            </button>
          ))}
          <button
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              color: "var(--t2)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font)",
              transition: "all var(--ease)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Next &rarr;
          </button>
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
