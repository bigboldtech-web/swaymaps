import Link from "next/link";
import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "About",
  description: "SwayMaps — building visual dependency intelligence for the enterprise.",
};

const VALUES = [
  {
    title: "Clarity beats decoration.",
    body: "Enterprise software is judged by how fast it gets out of your way. We design for legibility, not effect.",
  },
  {
    title: "Compliance by default.",
    body: "Audit, RBAC, and SSO aren't bolted on. They are foundational from the first commit.",
  },
  {
    title: "Open at the edges.",
    body: "API-first. Webhooks. Standard protocols (SAML 2.0, SCIM 2.0). Your data, your terms.",
  },
  {
    title: "Build for the next decade.",
    body: "Software outlives the team that ships it. We optimize for systems that age well.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-[900px] px-6 pt-20 pb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-fg">
            We build infrastructure for understanding complex systems.
          </h1>
          <p className="mt-6 text-md text-fg-muted leading-relaxed">
            Every Fortune 500 organization runs on systems and decisions that span
            hundreds of teams and thousands of services. The cost of misunderstanding
            a single dependency is measured in incidents, audits, and missed deadlines.
          </p>
          <p className="mt-4 text-md text-fg-muted leading-relaxed">
            SwayMaps gives those organizations a single, living map. One that the
            platform, security, and operations teams maintain together, that
            procurement and audit can trust, and that scales from a single team
            to the whole enterprise.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-[900px] px-6 py-16">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            What we believe
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
            Four principles we don&apos;t compromise on.
          </h2>
          <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 border border-border rounded-md overflow-hidden">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-panel p-6">
                <h3 className="text-md font-semibold text-fg">{v.title}</h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[900px] px-6 py-16">
          <div className="rounded-md border border-border bg-panel p-8">
            <h2 className="text-xl font-semibold tracking-tight text-fg">
              We&apos;re hiring engineers who care about systems.
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              If software-as-craft and enterprise-grade rigor both excite you, we
              want to hear from you.
            </p>
            <Link
              href="/contact?topic=careers"
              className="mt-5 inline-flex items-center gap-1.5 rounded-sm bg-fg text-fg-inverted h-9 px-4 text-sm font-medium hover:bg-fg/90"
            >
              Reach out
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
