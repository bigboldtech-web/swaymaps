import type { Metadata } from "next";
import { ComparePage, type CompareConfig } from "@/components/marketing/ComparePage";

export const metadata: Metadata = {
  title: "SwayMaps vs Miro — Structured AI maps vs freeform whiteboards",
  description:
    "How SwayMaps compares to Miro. When typed nodes, edges, and graph-aware AI matter more than freeform sticky notes.",
};

const config: CompareConfig = {
  competitor: "Miro",
  competitorTagline: "Freeform whiteboard",
  competitorColor: "#FFD02F",
  hero: {
    title: "When pixels aren't enough.",
    sub: "Miro is a great whiteboard. SwayMaps is a structured workspace — typed nodes, semantic edges, and a graph-aware AI that reasons over your map.",
  },
  pitch:
    "Miro is the right choice for brainstorms, retros, and ad-hoc diagrams. SwayMaps is the right choice when your maps are systems — services, dependencies, data flows, org structure — and you need an AI that understands them, an audit log auditors accept, and SSO/SCIM your security team requires.",
  rows: [
    { feature: "Free-form whiteboard", sway: false, them: true, note: "We're a structured graph — by design" },
    { feature: "Sticky notes & shapes", sway: false, them: true },
    { feature: "Strongly-typed nodes (11 kinds)", sway: true, them: false, note: "Miro shapes have no semantic meaning" },
    { feature: "Semantic edges (14 kinds)", sway: true, them: false },
    { feature: "Graph-aware AI Sidekick", sway: true, them: false, note: "Miro AI is text generation only" },
    { feature: "find_dependencies, find_path tools", sway: true, them: false },
    { feature: "Real-time collaboration", sway: true, them: true },
    { feature: "Inline comments + threads", sway: true, them: true },
    { feature: "Version history", sway: "Unlimited", them: "30 days" },
    { feature: "Public sharing + embeds", sway: true, them: true },
    { feature: "Folders + ACL", sway: true, them: "Boards only" },
    { feature: "5-role RBAC + groups", sway: true, them: "3 roles" },
    { feature: "SAML SSO", sway: "Enterprise", them: "Enterprise" },
    { feature: "SCIM 2.0", sway: "Enterprise", them: "Enterprise" },
    { feature: "Audit log + 7yr retention", sway: "Enterprise", them: "Enterprise (limited)" },
    { feature: "Public REST API", sway: "Pro+", them: "Enterprise only" },
    { feature: "Signed webhooks", sway: "Pro+", them: "Enterprise only" },
    { feature: "MCP server connections", sway: true, them: false },
    { feature: "Import from Miro", sway: true, them: false },
    { feature: "Starting price (paid)", sway: "$19/mo", them: "$10/mo" },
  ],
  bestFor: {
    sway: [
      "Engineering teams mapping service architecture, data flows, dependencies",
      "Security/GRC teams that need typed data flow diagrams + audit log",
      "Platform teams building internal developer platform documentation",
      "Anyone using AI to reason over their visual structure",
    ],
    them: [
      "Cross-functional brainstorming and retros at scale",
      "Workshops with 100+ participants",
      "Free-form sketching with no structural constraints",
      "Visual collaboration with non-technical teams",
    ],
  },
  testimonial: {
    quote:
      "We loved Miro for retros, but our service maps lived in a separate Lucid file because Miro shapes have no meaning. SwayMaps replaced both — and the AI is the kicker.",
    author: "Lena Chen",
    role: "Staff Engineer",
    company: "Atlas Bank",
    color: "#6647F0",
  },
  faq: [
    {
      q: "Can I import my Miro boards?",
      a: "Partially. Our Miro JSON importer pulls connectors and shape labels and lets you map them onto typed nodes. We don't preserve free-form sketching — that's not what SwayMaps is for.",
    },
    {
      q: "Will my team miss Miro's freeform feel?",
      a: "Maybe — we're not a whiteboard. We're a structured graph. If your team needs free-form sketching for retros and brainstorms, keep Miro for that and use SwayMaps for the structural maps that need typed nodes and AI reasoning.",
    },
    {
      q: "What about Miro's massive integration ecosystem?",
      a: "We don't match it count-for-count. We do cover the high-value ones (Slack, GitHub, Linear, Jira, MCP servers) plus a public REST API and webhooks for everything else.",
    },
    {
      q: "Is SwayMaps cheaper?",
      a: "At entry price, Miro is cheaper. At Team/Enterprise tier with SSO + audit + advanced collab, the per-seat economics tend to favor SwayMaps — and you avoid running two tools.",
    },
  ],
};

export default function Page() {
  return <ComparePage config={config} />;
}
