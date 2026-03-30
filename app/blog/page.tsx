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
const categories = ["All", "Engineering", "Compliance", "Product Updates", "Best Practices"];

const categoryColors: Record<string, string> = {
  Engineering: "#00c2ff",
  Compliance: "#8b5cf6",
  "Product Updates": "#22c55e",
  "Best Practices": "#f59e0b",
};

const featuredPost = {
  slug: "youtube-architecture-dependency-map",
  title: "How YouTube's Architecture Works: A Visual Dependency Map",
  category: "Engineering",
  date: "March 25, 2026",
  readTime: "12 min read",
  excerpt: "YouTube serves over 2 billion logged-in users every month and processes 500 hours of video uploads per minute. Here is how its massive architecture actually works, mapped as a visual dependency graph.",
};

const posts = [
  {
    slug: "spotify-system-architecture-mapped",
    title: "Spotify's Microservices Architecture: 800+ Services Mapped",
    category: "Engineering",
    date: "March 18, 2026",
    readTime: "10 min read",
    excerpt: "Spotify runs over 800 microservices built by 2,000+ engineers across hundreds of teams. Here is how their architecture works and what it teaches us about managing dependencies at scale.",
  },
  {
    slug: "netflix-dependency-hell-visual-solution",
    title: "Netflix's Dependency Hell: How Visual Mapping Prevents Cascading Failures",
    category: "Engineering",
    date: "March 10, 2026",
    readTime: "9 min read",
    excerpt: "Netflix runs 700+ microservices in production. When one fails, the blast radius can be catastrophic. Here is how dependency mapping helps prevent cascading failures before they start.",
  },
  {
    slug: "soc2-compliance-visual-mapping-guide",
    title: "SOC2 Compliance Made Visual: Map Your Data Flows in Under an Hour",
    category: "Compliance",
    date: "March 5, 2026",
    readTime: "8 min read",
    excerpt: "SOC2 auditors need to see how data flows through your system. Here is a practical guide to creating audit-ready data flow diagrams that satisfy SOC2 requirements using visual dependency maps.",
  },
  {
    slug: "onboarding-engineers-faster-visual-maps",
    title: "From 6-Month Onboarding to 2 Weeks: The Power of Visual Dependency Maps",
    category: "Best Practices",
    date: "February 25, 2026",
    readTime: "7 min read",
    excerpt: "New engineers spend months building a mental model of your system architecture. Visual dependency maps can compress that timeline from months to weeks by making tribal knowledge explicit and explorable.",
  },
  {
    slug: "diagram-as-code-yaml-dsl-guide",
    title: "Diagram as Code: Why Your Architecture Maps Belong in Git",
    category: "Product Updates",
    date: "February 18, 2026",
    readTime: "6 min read",
    excerpt: "Architecture diagrams created in GUI tools rot because they live outside your development workflow. SwayMaps' YAML DSL lets you define, version, and review architecture maps alongside your code.",
  },
];

/* ---- COMPONENT ---- */
export default function BlogPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="lp-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "SwayMaps Blog",
        "description": "Read about dependency mapping best practices, visual planning strategies, compliance automation, engineering productivity, and SwayMaps product updates.",
        "url": "https://swaymaps.com/blog",
        "publisher": {
          "@type": "Organization",
          "name": "SwayMaps",
          "url": "https://swaymaps.com"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://swaymaps.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://swaymaps.com/blog" }
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
      <section className="lp-section" style={{ paddingBottom: 40 }}>
        <div className="lp-container" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="lp-eyebrow">Blog</div>
            <h1 className="lp-section-title" style={{ fontSize: "clamp(2.6rem,5vw,3.8rem)" }}>
              Insights on dependency intelligence
            </h1>
            <p className="lp-section-subtitle" style={{ margin: "0 auto", maxWidth: 620 }}>
              Engineering deep dives, product updates, and best practices for teams that map their systems.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section style={{ paddingTop: 0, paddingBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
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
                    fontFamily: "var(--font-body)",
                    transition: "all 0.2s var(--ease)",
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
          </Reveal>
        </div>
      </section>

      {/* FEATURED POST */}
      <section style={{ paddingTop: 0, paddingBottom: 56, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <Link
              href={`/blog/${featuredPost.slug}`}
              style={{
                display: "block",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "48px 44px",
                textDecoration: "none",
                transition: "all 0.25s var(--ease)",
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
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  background: `${categoryColors[featuredPost.category]}15`,
                  color: categoryColors[featuredPost.category],
                }}>
                  {featuredPost.category}
                </span>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
                <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--t3)" }}>
                  {featuredPost.date}
                </span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--border2)" }} />
                <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--t3)" }}>
                  {featuredPost.readTime}
                </span>
                <span style={{ marginLeft: "auto", fontSize: "0.88rem", fontWeight: 600, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Read article &rarr;
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* POST GRID */}
      <section style={{ paddingTop: 0, paddingBottom: 80, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}>
              {filteredPosts.map((post, i) => (
                <Link
                  key={i}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "28px 24px",
                    textDecoration: "none",
                    transition: "all 0.25s var(--ease)",
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
                    textTransform: "uppercase",
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
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--t3)" }}>
                      {post.date}
                    </span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border2)" }} />
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--t3)" }}>
                      {post.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PAGINATION */}
      <section style={{ paddingTop: 0, paddingBottom: 100, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{
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
                    fontFamily: "var(--font-body)",
                    transition: "all 0.2s var(--ease)",
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
                  fontFamily: "var(--font-body)",
                  transition: "all 0.2s var(--ease)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Next &rarr;
              </button>
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
