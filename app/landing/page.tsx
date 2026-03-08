"use client";

import Link from "next/link";
import { useState } from "react";

const useCasesData = [
  {
    id: "engineering",
    label: "Engineering Teams",
    title: "System & Microservice Mapping",
    description:
      "Map every service, database, and API in your stack. See the blast radius of any change before you deploy.",
    bullets: [
      "Visualize service-to-service dependencies in real time",
      "Simulate blast radius before shipping changes",
      "Keep architecture docs always up to date",
    ],
  },
  {
    id: "platform",
    label: "Platform Teams",
    title: "Infrastructure Dependencies",
    description:
      "Visualize cloud resources, queues, caches, and every piece of infrastructure your platform runs on. Know exactly what depends on what.",
    bullets: [
      "Map cloud resources, queues, and caches",
      "Trace infrastructure dependencies end to end",
      "Reduce incident surface with clear ownership lines",
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    title: "Data Flow & Audit Maps",
    description:
      "Track where PII flows through your systems. Be audit-ready with visual, shareable data maps that anyone can understand.",
    bullets: [
      "Map PII and sensitive data flows across services",
      "Generate audit-ready visual reports",
      "Stay compliant with SOC 2, GDPR, and HIPAA",
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    title: "Org Knowledge & Onboarding",
    description:
      "Map tribal knowledge so it never walks out the door. Cut onboarding time from months to weeks with living system maps.",
    bullets: [
      "Capture tribal knowledge before it disappears",
      "Reduce new engineer ramp-up by 60%+",
      "Give leadership clear visibility into system complexity",
    ],
  },
];

const faqData = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, cancel anytime from your billing dashboard. Your access continues until the end of your billing period.",
  },
  {
    question: "What happens to my maps if I downgrade?",
    answer:
      "Your maps are preserved. You just can't create new ones beyond the free limit. Upgrade again anytime to regain full access.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! 14 days free on Pro and Team plans. No credit card required to start.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All data is encrypted in transit and at rest. We use industry-standard security practices.",
  },
  {
    question: "Can I import from other tools?",
    answer:
      "We support JSON import/export. Lucidchart and Draw.io import coming soon.",
  },
];

export default function LandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("engineering");
  const [annualBilling, setAnnualBilling] = useState(true);

  const activeUseCase = useCasesData.find((u) => u.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 scroll-smooth">
      {/* ───── NAVIGATION ───── */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/60 bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            SwayMaps
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#use-cases" className="transition hover:text-white">
              Use Cases
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        {/* glow blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-60 right-0 h-[400px] w-[600px] rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-28 text-center">
          <h1 className="bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            See What Depends on What.
            <br />
            Before It Breaks.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl">
            The visual dependency mapping platform for engineering teams. Map
            systems, trace impact, ship with confidence.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40"
            >
              Start Free &mdash; No Credit Card
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-slate-700 px-8 py-3.5 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/50"
            >
              Watch Demo
            </a>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Trusted by engineering teams worldwide
          </p>

          {/* Dashboard preview placeholder */}
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-[2px]">
            <div className="rounded-[14px] bg-slate-950 p-1">
              <div className="flex h-[340px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 sm:h-[420px]">
                <div className="text-center">
                  <div className="mb-2 text-3xl text-slate-600">&#9638;</div>
                  <span className="text-sm font-medium text-slate-500">
                    SwayMaps Dashboard Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── PROBLEM SECTION ───── */}
      <section className="relative py-28">
        <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-rose-500/5 blur-[100px]" />
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-center text-3xl font-extrabold text-transparent sm:text-4xl">
            Your systems are connected. Your knowledge isn&rsquo;t.
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Blind Deployments",
                body: "Teams ship changes without knowing what breaks downstream.",
              },
              {
                title: "Slow Incident Response",
                body: "Hours wasted tracing dependencies during outages.",
              },
              {
                title: "Painful Onboarding",
                body: "New engineers take 3-6 months to understand the system.",
              },
              {
                title: "Compliance Gaps",
                body: 'Auditors ask "what touches PII?" and nobody can answer.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700"
              >
                <h3 className="text-lg font-bold text-slate-100">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── USE CASES (TABS) ───── */}
      <section id="use-cases" className="relative py-28">
        <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-center text-3xl font-extrabold text-transparent sm:text-4xl">
            Built for teams that can&rsquo;t afford to guess
          </h2>

          {/* Tab buttons */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {useCasesData.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setActiveTab(uc.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === uc.id
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20"
                    : "border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {uc.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-white">
              {activeUseCase.title}
            </h3>
            <p className="mt-3 max-w-2xl text-slate-400">
              {activeUseCase.description}
            </p>
            <ul className="mt-6 space-y-3">
              {activeUseCase.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1 text-sky-400">&#10003;</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section id="features" className="relative py-28">
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-sky-500/5 blur-[100px]" />
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-center text-3xl font-extrabold text-transparent sm:text-4xl">
            Everything you need to map your world
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI-Powered Generation",
                body: "Describe what you want to map. AI builds the first draft in seconds.",
              },
              {
                title: "Real-time Collaboration",
                body: "Multiple people editing the same map. See who\u2019s where.",
              },
              {
                title: "Templates Library",
                body: "Start from proven templates: microservices, org charts, data flows, CI/CD.",
              },
              {
                title: "Export Anywhere",
                body: "Export as PNG, SVG, or PDF. Embed in Notion, Confluence, or your wiki.",
              },
              {
                title: "Public Sharing",
                body: "Share read-only maps with a link. Perfect for stakeholder updates.",
              },
              {
                title: "Version History",
                body: "Every change saved. Roll back anytime. Compare versions side-by-side.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700 hover:bg-slate-900/80"
              >
                <h3 className="text-lg font-bold text-slate-100">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="relative py-28">
        <div className="pointer-events-none absolute right-1/4 top-0 h-[500px] w-[600px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-center text-3xl font-extrabold text-transparent sm:text-4xl">
            Simple pricing. Start free, scale as you grow.
          </h2>

          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${!annualBilling ? "text-white" : "text-slate-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative h-7 w-12 rounded-full transition ${
                annualBilling ? "bg-gradient-to-r from-sky-500 to-indigo-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  annualBilling ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${annualBilling ? "text-white" : "text-slate-500"}`}
            >
              Annual
            </span>
            {annualBilling && (
              <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                Save 35%
              </span>
            )}
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h3 className="text-xl font-bold text-white">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-400">
                {[
                  "3 maps",
                  "1 workspace",
                  "Basic node types",
                  "5 AI brainstorms / mo",
                  "Community support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-sky-400">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl border border-slate-700 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">
                  ${annualBilling ? "19" : "29"}
                </span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              {annualBilling && (
                <p className="mt-1 text-xs text-slate-500">
                  billed annually
                </p>
              )}
              <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-400">
                {[
                  "Unlimited maps",
                  "5 workspaces",
                  "All node types",
                  "Unlimited AI",
                  "Export PDF / PNG / SVG",
                  "All templates",
                  "Public sharing",
                  "Email support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-sky-400">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Team */}
            <div className="relative flex flex-col rounded-2xl border-2 border-sky-500/50 bg-slate-900/60 p-8">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-1 text-xs font-bold text-white">
                Most Popular
              </span>
              <h3 className="text-xl font-bold text-white">Team</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">
                  ${annualBilling ? "59" : "79"}
                </span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              {annualBilling && (
                <p className="mt-1 text-xs text-slate-500">
                  billed annually
                </p>
              )}
              <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-400">
                {[
                  "Everything in Pro",
                  "Unlimited workspaces",
                  "Unlimited members",
                  "Version history",
                  "Priority support",
                  "API access (coming)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-sky-400">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40"
              >
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            All plans include a 14-day free trial. No credit card required.
            Cancel anytime.
          </p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-center text-3xl font-extrabold text-transparent sm:text-4xl">
            Frequently asked questions
          </h2>

          <div className="mt-12 space-y-4">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition hover:border-slate-700"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === idx ? null : idx)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-100">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-sky-400 transition-transform ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedFaq === idx && (
                  <div className="border-t border-slate-800 px-6 py-5">
                    <p className="text-sm leading-relaxed text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Ready to map your dependencies?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
            Start free. No credit card required. Upgrade when you&rsquo;re
            ready.
          </p>
          <div className="mt-10">
            <Link
              href="/auth/signup"
              className="inline-block rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition hover:shadow-sky-500/40"
            >
              Start Mapping for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-slate-800/60 bg-[#030712]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <span className="text-xl font-bold text-white">SwayMaps</span>
              <p className="mt-3 text-sm text-slate-500">
                Visual dependency mapping for engineering teams.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Product
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#features" className="transition hover:text-slate-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition hover:text-slate-300">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-300">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-300">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Company
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#" className="transition hover:text-slate-300">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-300">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-300">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Legal
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>
                  <Link href="/legal/privacy" className="transition hover:text-slate-300">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="transition hover:text-slate-300">
                    Terms
                  </Link>
                </li>
                <li>
                  <a href="mailto:security@swaymaps.com" className="transition hover:text-slate-300">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Support
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>
                  <a href="#" className="transition hover:text-slate-300">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@swaymaps.com" className="transition hover:text-slate-300">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-slate-300">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-slate-800/60 pt-8 text-center text-sm text-slate-600">
            &copy; 2026 SwayMaps. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
