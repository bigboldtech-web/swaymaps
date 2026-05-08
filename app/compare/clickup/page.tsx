import type { Metadata } from "next";
import { ComparePage, type CompareConfig } from "@/components/marketing/ComparePage";

export const metadata: Metadata = {
  title: "SwayMaps vs ClickUp — Visual systems vs project management",
  description:
    "How SwayMaps compares to ClickUp. When you need to map systems and dependencies, not manage tasks.",
};

const config: CompareConfig = {
  competitor: "ClickUp",
  competitorTagline: "Project management",
  competitorColor: "#7B68EE",
  hero: {
    title: "Different problems, different tools.",
    sub: "ClickUp is a great project management suite. SwayMaps is a visual workspace for mapping systems, dependencies, and the connections between teams and tools.",
  },
  pitch:
    "If your job is to ship work — assign tasks, manage sprints, track time — ClickUp is excellent. If your job is to make sense of a system — services, services-of-services, who-owns-what, what-breaks-when — SwayMaps is the workspace that exists for that. Many teams use both.",
  rows: [
    { feature: "Task management (assign/sprint/time)", sway: false, them: true, note: "Use ClickUp or Linear for this" },
    { feature: "Visual canvas (graph)", sway: true, them: "Whiteboard only" },
    { feature: "11 typed node kinds", sway: true, them: false },
    { feature: "14 typed edge semantics", sway: true, them: false },
    { feature: "Graph-aware AI Sidekick", sway: true, them: "Generic AI writer" },
    { feature: "Generate runbook from graph", sway: true, them: false },
    { feature: "Find blast radius / dependencies", sway: true, them: false },
    { feature: "Mind map view of same graph", sway: true, them: false },
    { feature: "Flowchart view of same graph", sway: true, them: false },
    { feature: "Real-time collaboration", sway: true, them: true },
    { feature: "Version history", sway: "Unlimited", them: "Limited" },
    { feature: "SAML SSO", sway: "Enterprise", them: "Enterprise" },
    { feature: "SCIM 2.0", sway: "Enterprise", them: "Enterprise" },
    { feature: "Audit log", sway: "Enterprise (7yr)", them: "Enterprise" },
    { feature: "MCP server connections", sway: true, them: false },
    { feature: "Public REST API + webhooks", sway: true, them: true },
    { feature: "Starting price (paid)", sway: "$19/mo", them: "$7/mo" },
  ],
  bestFor: {
    sway: [
      "Engineering teams mapping service architecture and dependencies",
      "Security teams documenting data flow and zero-trust segmentation",
      "Platform teams building internal developer platform diagrams",
      "Anyone who needs an AI that understands their visual graph",
    ],
    them: [
      "Cross-functional task and sprint management",
      "Time tracking, billing, and resource planning",
      "Project portfolio dashboards and reports",
      "All-in-one suite for non-technical teams",
    ],
  },
  testimonial: {
    quote:
      "We use ClickUp for project work and SwayMaps for the architecture and dependency maps that ClickUp can't represent. Different tools, different jobs.",
    author: "Marcus Rivera",
    role: "Director of Platform",
    company: "Northwind Health",
    color: "#FC6D2D",
  },
  faq: [
    {
      q: "Can SwayMaps replace ClickUp?",
      a: "No, and we don't try to. SwayMaps is for mapping systems, not managing tasks. Most of our customers run both — ClickUp for delivery, SwayMaps for the structural map of what they're delivering on.",
    },
    {
      q: "Can I link from a SwayMaps node to a ClickUp task?",
      a: "Yes. Add a URL to any node — and on Pro+ you can use the REST API to wire up two-way sync programmatically.",
    },
    {
      q: "Why does SwayMaps cost more than ClickUp?",
      a: "We're a focused tool, not a suite. Pricing reflects deeper functionality in our specific category (graph-aware AI, typed structures, real-time CRDT collab) rather than breadth.",
    },
    {
      q: "Does SwayMaps have a Gantt or sprint view?",
      a: "No. Use ClickUp, Linear, or Jira for those. We focus on visual structure, not time-based work tracking.",
    },
  ],
};

export default function Page() {
  return <ComparePage config={config} />;
}
