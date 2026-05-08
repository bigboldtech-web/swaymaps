"use client";

import { useState } from "react";
import { Mail, Building2, MessageSquare, Briefcase } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";

const TOPICS = [
  { id: "demo", label: "Book a demo", icon: Building2, body: "Walk through SwayMaps with our team. We'll tailor it to your stack and use case." },
  { id: "enterprise", label: "Enterprise pricing", icon: Briefcase, body: "Custom seat counts, SSO, SCIM, single-tenant deployment, and SLAs." },
  { id: "support", label: "Support", icon: MessageSquare, body: "Already a customer? Reach out and our team will respond within one business day." },
  { id: "general", label: "Something else", icon: Mail, body: "Any other questions, partnerships, or feedback. We read every message." },
];

export default function ContactPage() {
  const [topic, setTopic] = useState("demo");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 pt-20 pb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-fg">
            Talk to us.
          </h1>
          <p className="mt-3 text-md text-fg-muted max-w-xl">
            Whether you&apos;re evaluating SwayMaps for the enterprise or have a quick
            question, we read every message and respond within one business day.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-12 grid gap-8 lg:grid-cols-[280px,1fr]">
          {/* Topics */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted mb-3">
              What is this about?
            </p>
            <ul className="space-y-1">
              {TOPICS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`w-full flex items-start gap-2.5 rounded-sm border px-3 py-2.5 text-left transition-colors ${
                      topic === t.id
                        ? "border-accent bg-accent-subtle"
                        : "border-border bg-panel hover:bg-bg-muted"
                    }`}
                    onClick={() => setTopic(t.id)}
                  >
                    <t.icon className="h-3.5 w-3.5 mt-0.5 text-fg-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-fg">{t.label}</div>
                      <p className="mt-0.5 text-xs text-fg-muted leading-relaxed">{t.body}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-md border border-border bg-panel p-6">
            {submitted ? (
              <div className="py-12 text-center">
                <h2 className="text-lg font-semibold text-fg">Thanks — message received.</h2>
                <p className="mt-2 text-sm text-fg-muted">
                  We&apos;ll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Work email</Label>
                    <Input id="email" name="email" type="email" required className="mt-1.5" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="role">Your role</Label>
                    <Input id="role" name="role" placeholder="Platform engineer, CISO, …" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="mt-1.5"
                    placeholder={
                      topic === "enterprise"
                        ? "Tell us about your team size, IdP, deployment preference, and timeline."
                        : "Anything you'd like us to know."
                    }
                  />
                </div>
                <input type="hidden" name="topic" value={topic} />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-fg-subtle">
                    By submitting, you agree to our privacy policy.
                  </p>
                  <Button type="submit" variant="primary" size="lg">
                    Send message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
