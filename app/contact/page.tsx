"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import "../landing/landing.css";

/* ═══ LOGO SVG ═══ */
function LogoMark() {
  return (
    <div className="logo-mark">
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 24, height: 24 }}>
        <path d="M 28 10 C 12 10, 12 20, 20 20 C 28 20, 28 30, 12 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="10" r="3.5" fill="white" />
        <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.6" />
        <circle cx="12" cy="30" r="3.5" fill="white" />
      </svg>
    </div>
  );
}

/* ═══ FAQ DATA ═══ */
const faqItems = [
  {
    q: "Do I need a demo to get started?",
    a: "No! SwayMaps is self-serve. Create a free account and start mapping in 60 seconds. Demos are available for teams evaluating the Team plan.",
  },
  {
    q: "Is there phone support?",
    a: "We currently offer email and in-app support. Team plan customers get priority response times.",
  },
  {
    q: "Can I request a custom feature?",
    a: "Absolutely! We love hearing from users. Send us your idea and we'll add it to our roadmap consideration.",
  },
];

/* ═══ INFO CARDS DATA ═══ */
const infoCards = [
  {
    icon: "M",
    label: "Email Us",
    value: "hello@swaymaps.com",
    note: "We respond within 24 hours",
    color: "#00c2ff",
  },
  {
    icon: "RT",
    label: "Response Time",
    value: "Under 24 hours",
    note: "Priority support for Pro and Team",
    color: "#22c55e",
  },
  {
    icon: "OH",
    label: "Office Hours",
    value: "Mon-Fri, 9am-6pm EST",
    note: "Book a 30-min demo call",
    color: "#f59e0b",
  },
];

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

  /* scroll listener for nav */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* reveal observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addReveal = useCallback((el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  /* ═══ shared input styles ═══ */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0b1120",
    border: "1px solid #1a2340",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#e4e9f4",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.88rem",
    outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
  };

  return (
    <div className="landing-root">
      {/* ═══ BACKGROUND ═══ */}
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
          <Link href="/landing" className="logo">
            <LogoMark />
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

      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ paddingBottom: 60 }}>
        <div className="container">
          <div className="eyebrow">Contact</div>
          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
            Let&#39;s talk about your<br />dependencies.
          </h1>
          <p className="hero-sub">
            Book a demo, ask a question, or just say hello.
          </p>
        </div>
      </section>

      {/* ═══ CONTACT SPLIT ═══ */}
      <section style={{ padding: "0 0 120px" }}>
        <div className="container" ref={addReveal}>
          <div
            className="reveal"
            ref={addReveal}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 40,
              alignItems: "start",
            }}
          >
            {/* LEFT — FORM */}
            <div
              style={{
                background: "#0f1629",
                border: "1px solid #1a2340",
                borderRadius: 14,
                padding: 36,
              }}
            >
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  marginBottom: 24,
                  letterSpacing: "-0.02em",
                }}
              >
                Send us a message
              </h2>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#8091b3",
                      marginBottom: 6,
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00c2ff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,194,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#1a2340";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#8091b3",
                      marginBottom: 6,
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00c2ff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,194,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#1a2340";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#8091b3",
                      marginBottom: 6,
                    }}
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00c2ff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,194,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#1a2340";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#8091b3",
                      marginBottom: 6,
                    }}
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%234a5a7a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00c2ff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,194,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#1a2340";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <option value="" disabled style={{ color: "#4a5a7a" }}>
                      Select your role
                    </option>
                    <option value="engineering-manager">Engineering Manager</option>
                    <option value="cto-vp">CTO/VP Engineering</option>
                    <option value="platform-engineer">Platform Engineer</option>
                    <option value="compliance-officer">Compliance Officer</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#8091b3",
                      marginBottom: 6,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us what you're looking for..."
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#00c2ff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,194,255,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#1a2340";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px 24px",
                    fontSize: "0.92rem",
                    borderRadius: 10,
                    marginTop: 4,
                  }}
                >
                  {sent ? "Message sent!" : "Send Message"}
                </button>
              </form>
            </div>

            {/* RIGHT — INFO CARDS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {infoCards.map((card) => (
                <div
                  key={card.label}
                  style={{
                    background: "#0f1629",
                    border: "1px solid #1a2340",
                    borderRadius: 14,
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: `${card.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      color: card.color,
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#4a5a7a",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      {card.label}
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#e4e9f4",
                        marginBottom: 4,
                      }}
                    >
                      {card.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#8091b3",
                        lineHeight: 1.5,
                      }}
                    >
                      {card.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: "80px 0 120px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }} ref={addReveal} className="reveal">
            <div className="eyebrow">FAQ</div>
            <h2 className="stitle">Frequently asked questions</h2>
          </div>

          <div
            ref={addReveal}
            className="reveal"
            style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}
          >
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#0f1629",
                  border: "1px solid #1a2340",
                  borderRadius: 14,
                  overflow: "hidden",
                  transition: "border-color 0.25s",
                  borderColor: openFaq === idx ? "#253060" : "#1a2340",
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#e4e9f4",
                    textAlign: "left",
                  }}
                >
                  {item.q}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{
                      flexShrink: 0,
                      transition: "transform 0.25s",
                      transform: openFaq === idx ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    <path
                      d="M4.5 6.75L9 11.25L13.5 6.75"
                      stroke="#8091b3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  style={{
                    maxHeight: openFaq === idx ? 200 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      padding: "0 24px 18px",
                      fontSize: "0.88rem",
                      color: "#8091b3",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="final-cta" ref={addReveal}>
        <div className="container reveal" ref={addReveal}>
          <h2>Or skip the form and start mapping.</h2>
          <p>
            Create a free account and see your dependencies in under 60 seconds.
          </p>
          <div className="fca">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Start Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/landing" className="logo" style={{ marginBottom: 14, display: "inline-flex" }}>
                <LogoMark />
                <span className="logo-text">SwayMaps</span>
              </Link>
              <p>
                The visual dependency intelligence platform. Map systems, trace impact, ship with confidence.
              </p>
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
            <span>2026 SwayMaps. All rights reserved.</span>
            <div className="footer-bottom-links">
              <Link href="/legal/terms">Terms</Link>
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ RESPONSIVE OVERRIDE ═══ */}
      <style jsx>{`
        @media (max-width: 768px) {
          .contact-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
