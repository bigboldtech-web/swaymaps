"use client";

import Link from "next/link";
import { useState } from "react";
import { InteractiveLandingDemo } from "../../components/InteractiveLandingDemo";
import { FeatureShowcases } from "../../components/FeatureShowcases";

export default function LandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden scroll-smooth">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-900/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 48 48" className="h-10 w-10">
                <circle cx="36" cy="8" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="12" cy="40" r="4" fill="#ef4444" stroke="#0ea5e9" strokeWidth="3" />
                <path
                  d="M36 8 L22 18 L30 28 L12 40"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <div className="text-xl font-bold text-[#0ea5e9]">SwayMaps</div>
                <div className="text-xs text-slate-400">Systems mapping for fast-moving teams</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="https://app.swaymaps.com/auth/signup"
                className="rounded-full border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-slate-700 hover:bg-slate-900"
              >
                Sign up
              </Link>
              <Link
                href="https://app.swaymaps.com"
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              >
                Launch the app
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-12">

        <main className="mt-12 space-y-16">
          <div className="space-y-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200">
                Systems thinking, simplified
              </div>
              <h1 className="text-4xl font-bold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
                Map every dependency. Share context fast. Ship safer changes.
              </h1>
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                <div className="space-y-6">
                  <p className="max-w-2xl text-lg text-slate-300 lg:text-xl">
                    SwayMaps turns complex systems, teams, and processes into living maps you can navigate, comment on, and keep in sync. Perfect for incident prep, onboarding, and change reviews.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/"
                      className="rounded-full bg-sky-500 px-7 py-3 text-lg font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-[1px] hover:bg-sky-400"
                    >
                      Start mapping now
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="rounded-full border border-slate-700 px-7 py-3 text-lg font-semibold text-slate-100 hover:border-slate-600 hover:bg-slate-900/70"
                    >
                      Create a workspace
                    </Link>
                  </div>
                  <div className="rounded-full border border-slate-700/80 px-5 py-2 text-sm font-semibold text-slate-200 inline-flex items-center gap-2">
                    Use coupon <span className="text-sky-300 font-bold">DECODE20</span> on Pro or Team
                  </div>
                </div>
                <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-lg shadow-slate-900/40">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-sky-200">Why teams love it</div>
                    <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">Live</div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-200">
                    <div className="flex items-center gap-2"><span className="text-sky-300">•</span> Pins & focus views for incidents</div>
                    <div className="flex items-center gap-2"><span className="text-sky-300">•</span> Comments, tags, and sharing</div>
                    <div className="flex items-center gap-2"><span className="text-sky-300">•</span> Drag-and-drop nodes with notes</div>
                    <div className="flex items-center gap-2"><span className="text-sky-300">•</span> Works with your workspace invites</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 overflow-x-auto pb-2">
                {[
                  {
                    title: "Visual systems",
                    body: "Drag-and-drop maps for people, systems, and processes with rich notes and tags.",
                    icon: "🗺️"
                  },
                  {
                    title: "Shareable context",
                    body: "Invite teammates, pin critical nodes, and focus views without losing structure.",
                    icon: "🔗"
                  },
                  {
                    title: "Safer changes",
                    body: "Surface dependencies before deploys; capture learnings directly on the map.",
                    icon: "🛡️"
                  },
                  {
                    title: "Fast onboarding",
                    body: "Give new teammates the lay of the land in minutes, not meetings.",
                    icon: "⚡"
                  }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="min-w-[220px] flex-1 rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700 hover:bg-slate-900/60"
                  >
                    <div className="mb-2 text-2xl">{item.icon}</div>
                    <div className="text-sm font-semibold text-slate-100">{item.title}</div>
                    <p className="mt-2 text-sm text-slate-300">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-lg shadow-slate-900/40">
              <InteractiveLandingDemo />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-900/40">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold uppercase tracking-wide text-sky-200">Use cases</div>
              <h2 className="text-3xl font-bold text-slate-50">Built for the teams that keep systems moving</h2>
              <p className="text-slate-300">From platform to incidents to product alignment, SwayMaps keeps everyone on the same map.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "Platform teams", body: "Document services, owners, SLOs, and dependencies. Hand-off change reviews faster." },
                { title: "Ops & SRE", body: "Pin critical paths, link runbooks, and focus a map during incidents." },
                { title: "Product & Eng", body: "Show user flows plus backend systems to align PMs, designers, and engineers." }
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-sm font-semibold text-slate-100">{item.title}</div>
                  <p className="mt-2 text-sm text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Where it helps",
                  points: ["Incident prep & response", "Change reviews & RFCs", "Onboarding & ownership", "Architecture walk-throughs"]
                },
                {
                  title: "How it works",
                  points: ["Create a map in minutes", "Pin critical nodes for fast focus", "Share links or exports", "Keep notes and tags in one place"]
                }
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-sm font-semibold text-slate-100">{item.title}</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {item.points.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Section */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">
                Why teams choose SwayMaps
              </h2>
              <p className="mt-2 text-slate-300">See the difference in action</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-rose-800/50 bg-rose-950/20 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <h3 className="text-lg font-bold text-rose-300">Without SwayMaps</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Lost context during incidents",
                    "Weeks to onboard new engineers",
                    "Scattered documentation across tools",
                    "No visibility into dependencies",
                    "Static diagrams that get outdated"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1 text-rose-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/20 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <h3 className="text-lg font-bold text-emerald-300">With SwayMaps</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Instant visibility into entire stack",
                    "Same-day onboarding with living maps",
                    "All context in one collaborative space",
                    "Clear dependency visualization",
                    "Always up-to-date, living documentation"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-1 text-emerald-400">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Feature Showcases - Real Components */}
          <FeatureShowcases />

          {/* Stats Section */}
          <section className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/50 to-blue-950/30 p-12 shadow-2xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">
                  Trusted by teams worldwide
                </h2>
                <p className="mt-2 text-slate-300">Join thousands mapping smarter every day</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-4">
                {[
                  { value: "10K+", label: "Active Users" },
                  { value: "50K+", label: "Maps Created" },
                  { value: "1M+", label: "Nodes Mapped" },
                  { value: "99.9%", label: "Uptime" }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-4xl font-extrabold text-sky-300">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">
                What teams are saying
              </h2>
              <p className="mt-2 text-slate-300">See how SwayMaps transforms workflows</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  quote: "SwayMaps completely changed how we handle incidents. We can now visualize our entire stack and identify dependencies in seconds.",
                  author: "Sarah Chen",
                  role: "SRE Lead",
                  company: "TechCorp",
                  avatar: "🧑‍💻"
                },
                {
                  quote: "Onboarding new engineers used to take weeks. Now they get the full picture in their first day with our SwayMaps architecture diagrams.",
                  author: "Marcus Rodriguez",
                  role: "Engineering Manager",
                  company: "StartupXYZ",
                  avatar: "👨‍💼"
                },
                {
                  quote: "The ability to pin critical nodes and share focused views has been a game-changer for our change review process.",
                  author: "Emily Watson",
                  role: "Platform Architect",
                  company: "CloudScale",
                  avatar: "👩‍🔧"
                }
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="group rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-sky-700 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-sky-500/10"
                >
                  <div className="mb-4 text-3xl">{testimonial.avatar}</div>
                  <p className="mb-4 text-sm leading-relaxed text-slate-300">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="border-t border-slate-800 pt-4">
                    <div className="font-semibold text-slate-100">{testimonial.author}</div>
                    <div className="text-xs text-slate-400">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Deep Dive */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">
                Powerful features for modern teams
              </h2>
              <p className="mt-2 text-slate-300">Everything you need to visualize complex systems</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                {
                  icon: "🎯",
                  title: "Smart Pinning & Focus",
                  description: "Pin critical nodes and create focused views without losing context. Perfect for incident response and presentations.",
                  features: ["Pin unlimited nodes", "Quick focus mode", "Share focused links"]
                },
                {
                  icon: "📊",
                  title: "Rich Notes & Documentation",
                  description: "Attach detailed notes, tags, and metadata to every node and connection. Keep everything documented in one place.",
                  features: ["Markdown support", "Custom tags", "Edge annotations"]
                },
                {
                  icon: "👥",
                  title: "Team Collaboration",
                  description: "Work together in real-time with role-based access, workspace management, and audit logs.",
                  features: ["Real-time updates", "Role management", "Activity tracking"]
                },
                {
                  icon: "🔄",
                  title: "Export & Embed",
                  description: "Share your maps everywhere. Export as images, embed in docs, or share interactive links.",
                  features: ["PNG/SVG export", "Embed codes", "Public sharing"]
                },
                {
                  icon: "🎨",
                  title: "Customizable Design",
                  description: "Make it yours with custom colors, node types, and edge styles. Light and dark modes included.",
                  features: ["Custom colors", "Node templates", "Dark mode"]
                },
                {
                  icon: "⚡",
                  title: "Lightning Performance",
                  description: "Built on modern React and Next.js. Handle thousands of nodes with smooth, instant interactions.",
                  features: ["Sub-100ms response", "Optimized rendering", "Auto-save"]
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group rounded-xl border border-slate-800 bg-slate-900/40 p-6 transition hover:scale-[1.02] hover:border-sky-700 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-sky-500/10"
                >
                  <div className="mb-3 text-4xl">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-slate-100">{feature.title}</h3>
                  <p className="mb-4 text-sm text-slate-300">{feature.description}</p>
                  <ul className="space-y-1">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="text-sky-400">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-slate-50 sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-2 text-slate-300">Everything you need to know about SwayMaps</p>
            </div>
            <div className="mx-auto max-w-3xl space-y-4">
              {[
                {
                  question: "How is SwayMaps different from other diagramming tools?",
                  answer: "SwayMaps is specifically designed for systems mapping with features like smart pinning, real-time collaboration, and rich notes. Unlike traditional diagramming tools, we focus on helping teams understand dependencies, not just draw boxes."
                },
                {
                  question: "Can I import existing diagrams?",
                  answer: "Currently, SwayMaps uses its own format optimized for systems mapping. However, you can easily recreate diagrams using our fast drag-and-drop interface. Import features are on our roadmap."
                },
                {
                  question: "Is there a free plan?",
                  answer: "Yes! Our free plan includes 1 map per workspace and 1 workspace with unlimited nodes. Perfect for trying out SwayMaps or small personal projects."
                },
                {
                  question: "How does team collaboration work?",
                  answer: "Team and Pro plans include real-time collaboration with role-based access (owner, admin, editor, viewer). All changes are synced instantly, and you can see who's working on what."
                },
                {
                  question: "Can I export my maps?",
                  answer: "Yes! Pro and Team plans include export to PNG/SVG, embed codes for documentation, and shareable links. You always own your data."
                },
                {
                  question: "What happens if I cancel my subscription?",
                  answer: "Your data is kept for 90 days if you cancel. You can resubscribe anytime during this period to regain full access. After 90 days, data is permanently deleted unless you're on the free plan."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 transition hover:border-slate-700"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-900/60"
                  >
                    <span className="font-semibold text-slate-100">{faq.question}</span>
                    <span className={`text-sky-400 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedFaq === idx && (
                    <div className="border-t border-slate-800 bg-slate-950/50 p-5">
                      <p className="text-sm leading-relaxed text-slate-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/50 via-blue-950/30 to-indigo-950/30 p-12 text-center shadow-2xl">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-slate-50 sm:text-5xl">
                Ready to map smarter?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                Join thousands of teams who are already using SwayMaps to visualize their systems, processes, and dependencies.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/"
                  className="group relative overflow-hidden rounded-xl bg-sky-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-xl shadow-sky-500/30 transition hover:bg-sky-400"
                >
                  <span className="relative z-10">Start mapping for free</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full"></div>
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-xl border-2 border-slate-700 px-8 py-4 text-lg font-bold text-slate-100 transition hover:border-sky-500 hover:bg-slate-900/60"
                >
                  View pricing
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-400">
                No credit card required • 20% off with code <span className="font-semibold text-sky-300">DECODE20</span>
              </p>
            </div>
          </section>
        </main>

        <footer className="mt-16 flex flex-col gap-4 border-t border-slate-900 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} SwayMaps. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="mailto:hello@swaymaps.com" className="hover:text-slate-200">
              Contact
            </Link>
            <Link href="https://app.swaymaps.com" className="hover:text-slate-200">
              Open app
            </Link>
            <Link href="https://app.swaymaps.com/auth/signup" className="hover:text-slate-200">
              Get started
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
