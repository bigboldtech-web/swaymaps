import type { Metadata } from "next";
import { ComparePage, type CompareConfig } from "@/components/marketing/ComparePage";

export const metadata: Metadata = {
  title: "SwayMaps vs Lucidchart — Live, AI-powered diagrams vs static charts",
  description:
    "How SwayMaps compares to Lucidchart. When you need real-time multiplayer, AI that understands your graph, and an audit-ready collaboration model.",
};

const config: CompareConfig = {
  competitor: "Lucidchart",
  competitorTagline: "Static diagramming",
  competitorColor: "#F2994A",
  hero: {
    title: "Diagrams that think.",
    sub: "Lucidchart draws diagrams. SwayMaps builds living systems — multiplayer CRDT collab, typed graph structure, and an AI that reasons over every node.",
  },
  pitch:
    "Lucidchart is a solid drawing tool with broad shape libraries. SwayMaps is what diagramming becomes when the underlying data is a queryable graph — when you can ask an AI 'what breaks if Stripe goes down,' generate runbooks from your map, and trust that every change is captured for audit.",
  rows: [
    { feature: "Drag-drop diagramming", sway: true, them: true },
    { feature: "Pre-built shape libraries (1000s)", sway: "20+ templates", them: true, note: "Lucid has the broader library count" },
    { feature: "Strongly-typed nodes", sway: "11 kinds", them: false },
    { feature: "Semantic edges", sway: "14 kinds", them: false },
    { feature: "Graph-aware AI", sway: true, them: false, note: "Lucid AI generates diagrams from text only" },
    { feature: "find_path / blast radius queries", sway: true, them: false },
    { feature: "Real-time multiplayer (CRDT)", sway: true, them: true, note: "Lucid uses last-write-wins" },
    { feature: "Inline comments", sway: true, them: true },
    { feature: "Version history", sway: "Unlimited", them: "30 days" },
    { feature: "Public sharing + embeds", sway: true, them: true },
    { feature: "Folders + ACL", sway: true, them: true },
    { feature: "5-role RBAC", sway: true, them: "3 roles" },
    { feature: "SAML SSO", sway: "Enterprise", them: "Enterprise" },
    { feature: "SCIM 2.0", sway: "Enterprise", them: "Enterprise" },
    { feature: "Audit log + 7yr retention", sway: "Enterprise", them: "Enterprise" },
    { feature: "Public REST API", sway: "Pro+", them: "Enterprise only" },
    { feature: "MCP server connections", sway: true, them: false },
    { feature: "Import from Lucidchart", sway: true, them: false },
    { feature: "Starting price (paid)", sway: "$19/mo", them: "$8/mo" },
  ],
  bestFor: {
    sway: [
      "Engineering teams whose diagrams represent live systems they query and reason about",
      "Teams that want AI to walk their graph, not redraw it from a prompt",
      "Multiplayer-first work where last-write-wins isn't acceptable",
      "Compliance/audit-driven environments needing 7-year history",
    ],
    them: [
      "Generic flowcharts and BPMN diagrams",
      "Generic flowcharts and shape-library-driven diagrams",
      "Teams locked into Microsoft/Google ecosystems via Lucid integrations",
      "Single-person diagram authorship without real-time collab",
    ],
  },
  testimonial: {
    quote:
      "We migrated 200+ Lucid diagrams to SwayMaps. The CSV importer preserved everything. The Sidekick made the maps feel alive — instead of static pictures, they're now queryable systems.",
    author: "Priya Anand",
    role: "Head of SRE",
    company: "Vela Telecom",
    color: "#0091FF",
  },
  faq: [
    {
      q: "Can I import my Lucidchart diagrams?",
      a: "Yes. Native Lucidchart CSV import preserves shape labels and connectors. We'll help you tag them with node kinds post-import to unlock Sidekick reasoning.",
    },
    {
      q: "Does SwayMaps have BPMN / UML stencils?",
      a: "Not yet. Our focus is dependency intelligence — typed nodes and semantic edges. For full BPMN/UML notation depth, Lucid is stronger today.",
    },
    {
      q: "Is multiplayer really better with CRDT?",
      a: "Yes — for a structured graph, conflict-free merging matters. Two engineers editing the same dependency map simultaneously will see deterministic merges instead of one of them losing work to a refresh.",
    },
    {
      q: "What about large enterprise deployments?",
      a: "Both tools scale. SwayMaps offers single-tenant deployments on Enterprise for regulated industries — Lucid's offering is multi-tenant only at the time of writing.",
    },
  ],
};

export default function Page() {
  return <ComparePage config={config} />;
}
