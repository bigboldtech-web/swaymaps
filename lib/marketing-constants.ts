// ─── SwayMaps Marketing Constants ───

// Node type color map
export const nodeColors: Record<string, string> = {
  person: "#ec4899",
  system: "#3b82f6",
  api: "#06b6d4",
  database: "#8b5cf6",
  queue: "#2563eb",
  cache: "#ef4444",
  process: "#22c55e",
  generic: "#14b8a6",
  cloud: "#6366f1",
  vendor: "#f59e0b",
  team: "#f97316",
};

// Status colors
export const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  healthy: { bg: "rgba(34,197,94,0.12)", text: "#22c55e", dot: "#22c55e" },
  warning: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b", dot: "#f59e0b" },
  critical: { bg: "rgba(239,68,68,0.12)", text: "#ef4444", dot: "#ef4444" },
};

// Design system colors
export const colors = {
  bg: "#070b14",
  bg2: "#0b1120",
  bg3: "#0f1629",
  bg4: "#131b33",
  bg5: "#161e35",
  border1: "#1a2340",
  border2: "#253060",
  border3: "#3a5ccc",
  text1: "#e4e9f4",
  text2: "#8091b3",
  text3: "#4a5a7a",
  accent: "#00c2ff",
};

// Pricing plans
export interface PricingPlan {
  name: string;
  slug: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    slug: "free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "For individuals exploring dependency mapping.",
    features: [
      "Up to 3 maps",
      "4 node types",
      "PNG export",
      "Community templates",
      "Basic search",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    slug: "pro",
    monthlyPrice: 29,
    annualPrice: 19,
    description: "For professionals who need full mapping power.",
    features: [
      "Unlimited maps",
      "11 node types",
      "PNG, SVG, PDF, JSON export",
      "All templates",
      "AI brainstorm",
      "Version history",
      "Public sharing",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    slug: "team",
    monthlyPrice: 79,
    annualPrice: 59,
    description: "For teams mapping complex systems together.",
    features: [
      "Everything in Pro",
      "Unlimited collaborators",
      "Workspace management",
      "Role-based access",
      "Version history with diff",
      "Audit logs",
      "Workspace invites",
      "Team templates",
      "Dedicated support",
    ],
    cta: "Start Free Trial",
  },
];

// Template data
export interface TemplateItem {
  name: string;
  description: string;
  category: string;
  nodeCount: number;
  edgeCount: number;
}

export const templates: TemplateItem[] = [
  {
    name: "Microservices Architecture",
    description: "Map services, APIs, databases, and message queues in a typical microservices system.",
    category: "Architecture",
    nodeCount: 12,
    edgeCount: 18,
  },
  {
    name: "CI/CD Pipeline",
    description: "Visualize your build, test, and deployment pipeline from commit to production.",
    category: "DevOps",
    nodeCount: 9,
    edgeCount: 11,
  },
  {
    name: "AWS Infrastructure",
    description: "Map your AWS services including VPCs, load balancers, EC2, RDS, and S3.",
    category: "Cloud",
    nodeCount: 14,
    edgeCount: 20,
  },
  {
    name: "Data Pipeline",
    description: "Track data flow from ingestion through transformation to analytics and reporting.",
    category: "Data",
    nodeCount: 10,
    edgeCount: 13,
  },
  {
    name: "Organization Chart",
    description: "Map teams, reporting lines, and cross-functional dependencies.",
    category: "People",
    nodeCount: 16,
    edgeCount: 15,
  },
  {
    name: "API Gateway",
    description: "Visualize API routes, middleware, rate limiting, and downstream services.",
    category: "Architecture",
    nodeCount: 11,
    edgeCount: 16,
  },
  {
    name: "Kubernetes Cluster",
    description: "Map pods, services, ingress controllers, and persistent volumes.",
    category: "DevOps",
    nodeCount: 13,
    edgeCount: 17,
  },
  {
    name: "Event-Driven System",
    description: "Visualize event producers, consumers, topics, and dead letter queues.",
    category: "Architecture",
    nodeCount: 10,
    edgeCount: 14,
  },
  {
    name: "Database Schema",
    description: "Map tables, relationships, indexes, and foreign key dependencies.",
    category: "Data",
    nodeCount: 8,
    edgeCount: 12,
  },
  {
    name: "Incident Response",
    description: "Map the flow from alert detection through triage, mitigation, and post-mortem.",
    category: "Process",
    nodeCount: 7,
    edgeCount: 9,
  },
  {
    name: "GCP Infrastructure",
    description: "Visualize Google Cloud services including GKE, Cloud SQL, Pub/Sub, and BigQuery.",
    category: "Cloud",
    nodeCount: 12,
    edgeCount: 16,
  },
  {
    name: "Monolith to Microservices",
    description: "Plan your migration path from monolithic architecture to distributed services.",
    category: "Architecture",
    nodeCount: 15,
    edgeCount: 22,
  },
  {
    name: "Authentication Flow",
    description: "Map OAuth, SSO, token refresh, and session management across services.",
    category: "Security",
    nodeCount: 9,
    edgeCount: 13,
  },
  {
    name: "Feature Flag System",
    description: "Visualize flag management, rollout stages, and service dependencies.",
    category: "Process",
    nodeCount: 8,
    edgeCount: 10,
  },
  {
    name: "Multi-Region Deployment",
    description: "Map services across regions with failover, replication, and CDN routing.",
    category: "Cloud",
    nodeCount: 18,
    edgeCount: 24,
  },
  {
    name: "Vendor Integration Map",
    description: "Track all third-party integrations, APIs, webhooks, and data flows.",
    category: "Architecture",
    nodeCount: 11,
    edgeCount: 15,
  },
  {
    name: "On-Call Runbook",
    description: "Map escalation paths, service owners, communication channels, and playbooks.",
    category: "People",
    nodeCount: 10,
    edgeCount: 12,
  },
  {
    name: "ML Pipeline",
    description: "Visualize data collection, training, model serving, and monitoring feedback loops.",
    category: "Data",
    nodeCount: 11,
    edgeCount: 14,
  },
];

// Template categories derived from templates
export const templateCategories = Array.from(new Set(templates.map((t) => t.category)));

// Blog posts
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-dependency-mapping-matters",
    title: "Why Dependency Mapping Matters More Than Ever",
    excerpt:
      "As systems grow more distributed, understanding how services connect is no longer optional. Here is why visual dependency mapping has become a critical practice.",
    date: "2026-03-15",
    readTime: "6 min",
    category: "Engineering",
    author: "SwayMaps Team",
  },
  {
    slug: "microservices-visibility-gap",
    title: "The Microservices Visibility Gap and How to Close It",
    excerpt:
      "Most teams know their services exist but cannot explain how they interact. This gap leads to outages, slow onboarding, and wasted time.",
    date: "2026-03-08",
    readTime: "8 min",
    category: "Architecture",
    author: "SwayMaps Team",
  },
  {
    slug: "ai-assisted-architecture-docs",
    title: "AI-Assisted Architecture Documentation",
    excerpt:
      "Using AI to generate the first draft of your dependency map saves hours of manual work and catches connections humans miss.",
    date: "2026-02-28",
    readTime: "5 min",
    category: "Product",
    author: "SwayMaps Team",
  },
  {
    slug: "incident-response-dependency-maps",
    title: "How Dependency Maps Accelerate Incident Response",
    excerpt:
      "When production breaks at 2am, having a clear map of service dependencies cuts mean time to resolution by more than half.",
    date: "2026-02-20",
    readTime: "7 min",
    category: "Operations",
    author: "SwayMaps Team",
  },
  {
    slug: "onboarding-engineers-faster",
    title: "Onboarding Engineers Faster with Visual System Maps",
    excerpt:
      "New engineers spend weeks building mental models of your system. A living dependency map compresses that to days.",
    date: "2026-02-12",
    readTime: "5 min",
    category: "Engineering",
    author: "SwayMaps Team",
  },
  {
    slug: "from-whiteboard-to-living-document",
    title: "From Whiteboard Sketch to Living Document",
    excerpt:
      "Architecture diagrams drawn on whiteboards become stale within weeks. Here is how to keep your system maps always current.",
    date: "2026-02-05",
    readTime: "6 min",
    category: "Best Practices",
    author: "SwayMaps Team",
  },
];

// Changelog entries
export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: "1.5.0",
    date: "2026-03-25",
    title: "AI Brainstorm and Template Library",
    description: "Generate maps with AI and pick from 18 ready-made templates.",
    changes: [
      "AI brainstorm generates dependency maps from natural language",
      "18 curated templates across Architecture, DevOps, Cloud, Data, and more",
      "Template preview with node and edge counts",
      "One-click template instantiation",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-03-10",
    title: "Version History and Diff Viewer",
    description: "Track every change to your maps with automatic versioning.",
    changes: [
      "Auto-save creates version snapshots on every edit",
      "Visual diff viewer highlights added, removed, and moved nodes",
      "Restore any previous version with one click",
      "Version history available on Team plan",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-02-22",
    title: "Team Workspaces and Collaboration",
    description: "Invite your team and work on maps together with role-based access.",
    changes: [
      "Create and manage team workspaces",
      "Invite members via email",
      "Role-based access: owner, admin, editor, viewer",
      "Audit logs for workspace activity",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-02-08",
    title: "Advanced Export Options",
    description: "Export maps in PNG, SVG, PDF, and JSON formats.",
    changes: [
      "High-resolution PNG export",
      "Scalable SVG export for documentation",
      "PDF export with metadata",
      "JSON export for programmatic access",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-01-25",
    title: "11 Node Types and Custom Styling",
    description: "Expanded node types to cover every part of your system.",
    changes: [
      "Added API, Database, Queue, Cache, Cloud, Vendor, and Team node types",
      "Custom color coding per node type",
      "Status indicators: healthy, warning, critical",
      "Edge labels and directional arrows",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-01-10",
    title: "SwayMaps Launch",
    description: "The visual dependency intelligence platform is live.",
    changes: [
      "Interactive canvas with drag-and-drop nodes",
      "4 core node types: Person, System, Process, Generic",
      "Real-time auto-save",
      "Public sharing via unique links",
      "Free, Pro, and Team plans",
    ],
  },
];

// FAQ data (pricing page)
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Both Pro and Team plans include a 14-day free trial. No credit card required to start. You get full access to all plan features during the trial period.",
  },
  {
    question: "Can I switch between monthly and annual billing?",
    answer:
      "Yes. You can switch between monthly and annual billing at any time from your account settings. When switching to annual, you will receive the discounted rate immediately.",
  },
  {
    question: "What happens when my trial ends?",
    answer:
      "When your trial ends, your account will revert to the Free plan. All your maps are preserved, but you will only be able to access the first 3. Upgrade anytime to regain access.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no long-term contracts. Cancel from your billing portal at any time. Your access continues through the end of your current billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards via Stripe, including Visa, Mastercard, and American Express. Annual plans can also be paid via invoice for Team accounts.",
  },
  {
    question: "Do you offer discounts for startups or nonprofits?",
    answer:
      "Yes. We offer 50% off the first year for verified startups and registered nonprofits. Contact our team at support@swaymaps.com with verification details.",
  },
  {
    question: "How does team billing work?",
    answer:
      "The Team plan is a flat rate that includes unlimited collaborators in your workspace. You pay one price regardless of how many members you invite.",
  },
  {
    question: "Can I export my data if I cancel?",
    answer:
      "Yes. You can export all your maps as JSON at any time, even on the Free plan. We believe your data belongs to you. PNG, SVG, and PDF exports are available on Pro and Team.",
  },
];

// Use cases
export interface UseCase {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  benefits: string[];
}

export const useCases: UseCase[] = [
  {
    slug: "microservices",
    title: "Microservices Architecture",
    subtitle: "Map every service, API, and data store",
    description:
      "Visualize how your microservices communicate, which databases they depend on, and where message queues sit in the flow. Spot single points of failure before they cause outages.",
    icon: "{}",
    benefits: [
      "Identify circular dependencies",
      "Plan service decomposition",
      "Accelerate incident response",
      "Simplify new engineer onboarding",
    ],
  },
  {
    slug: "platform-engineering",
    title: "Platform Engineering",
    subtitle: "Document your internal developer platform",
    description:
      "Map CI/CD pipelines, infrastructure components, and developer tooling. Keep platform documentation alive instead of letting it rot in Confluence.",
    icon: "PE",
    benefits: [
      "Visualize CI/CD pipelines end-to-end",
      "Track infrastructure dependencies",
      "Document platform service boundaries",
      "Reduce platform team support load",
    ],
  },
  {
    slug: "incident-response",
    title: "Incident Response",
    subtitle: "Navigate outages with dependency context",
    description:
      "When production breaks, dependency maps show the blast radius instantly. Trace failures upstream and downstream to find root cause faster.",
    icon: "IR",
    benefits: [
      "Cut mean time to resolution",
      "Identify blast radius instantly",
      "Trace cascading failures",
      "Build runbooks with visual context",
    ],
  },
  {
    slug: "team-onboarding",
    title: "Team Onboarding",
    subtitle: "Get new engineers productive in days, not weeks",
    description:
      "Replace tribal knowledge with visual maps that show how your system actually works. New team members explore the architecture interactively instead of reading stale docs.",
    icon: "T+",
    benefits: [
      "Reduce onboarding time by 60%",
      "Eliminate reliance on tribal knowledge",
      "Self-serve architecture exploration",
      "Keep maps updated as systems evolve",
    ],
  },
  {
    slug: "cloud-migration",
    title: "Cloud Migration",
    subtitle: "Plan and track migration dependencies",
    description:
      "Map your current state, define your target architecture, and track which services have been migrated. Visualize the dependencies that determine migration order.",
    icon: "CM",
    benefits: [
      "Map current and target state",
      "Identify migration order constraints",
      "Track migration progress visually",
      "Communicate plans to stakeholders",
    ],
  },
  {
    slug: "compliance-audit",
    title: "Compliance and Audit",
    subtitle: "Demonstrate system boundaries and data flows",
    description:
      "Show auditors exactly where data flows, which services handle PII, and how security boundaries are enforced. Export maps as evidence for compliance reviews.",
    icon: "CA",
    benefits: [
      "Document data flow for GDPR/SOC2",
      "Map security boundaries clearly",
      "Export audit-ready documentation",
      "Track vendor and third-party dependencies",
    ],
  },
];

// Features
export interface Feature {
  title: string;
  description: string;
  icon: string;
  category: string;
}

export const features: Feature[] = [
  {
    title: "Visual Dependency Canvas",
    description:
      "Drag-and-drop nodes onto an infinite canvas. Connect them with labeled edges. Zoom, pan, and organize complex systems visually.",
    icon: "VD",
    category: "Core",
  },
  {
    title: "11 Node Types",
    description:
      "Person, System, API, Database, Queue, Cache, Process, Generic, Cloud, Vendor, and Team. Each with distinct colors and iconography.",
    icon: "NT",
    category: "Core",
  },
  {
    title: "AI Brainstorm",
    description:
      "Describe your system in plain English and AI generates a dependency map draft. Edit, refine, and expand from there.",
    icon: "AI",
    category: "Intelligence",
  },
  {
    title: "Template Library",
    description:
      "Start from 18 curated templates covering microservices, CI/CD, cloud infrastructure, data pipelines, and more.",
    icon: "TL",
    category: "Productivity",
  },
  {
    title: "Multi-Format Export",
    description:
      "Export maps as high-resolution PNG, scalable SVG, print-ready PDF, or structured JSON for programmatic access.",
    icon: "EX",
    category: "Productivity",
  },
  {
    title: "Version History",
    description:
      "Every save creates a version snapshot. Compare versions with a visual diff viewer. Restore any previous state instantly.",
    icon: "VH",
    category: "Intelligence",
  },
  {
    title: "Team Workspaces",
    description:
      "Create shared workspaces. Invite members via email. Assign roles: owner, admin, editor, or viewer.",
    icon: "TW",
    category: "Collaboration",
  },
  {
    title: "Public Sharing",
    description:
      "Generate a unique public link to share maps with anyone. No account required to view. Perfect for documentation and presentations.",
    icon: "PS",
    category: "Collaboration",
  },
  {
    title: "Status Indicators",
    description:
      "Mark nodes as healthy, warning, or critical. See system health at a glance and track incidents visually.",
    icon: "SI",
    category: "Intelligence",
  },
  {
    title: "Audit Logs",
    description:
      "Track every action in your workspace. See who changed what and when. Essential for compliance and governance.",
    icon: "AL",
    category: "Collaboration",
  },
];

// Feature categories derived from features
export const featureCategories = Array.from(new Set(features.map((f) => f.category)));

// Comparison table
export interface CompetitorComparison {
  name: string;
  visualCanvas: boolean;
  aiGeneration: boolean;
  realTimeCollab: boolean;
  nodeTypes: string;
  exportFormats: string;
  startingPrice: string;
  versionHistory: boolean;
  publicSharing: boolean;
}

export const comparisonData: CompetitorComparison[] = [
  {
    name: "SwayMaps",
    visualCanvas: true,
    aiGeneration: true,
    realTimeCollab: true,
    nodeTypes: "11",
    exportFormats: "PNG, SVG, PDF, JSON",
    startingPrice: "Free",
    versionHistory: true,
    publicSharing: true,
  },
  {
    name: "Lucidchart",
    visualCanvas: true,
    aiGeneration: false,
    realTimeCollab: true,
    nodeTypes: "Generic shapes",
    exportFormats: "PNG, SVG, PDF",
    startingPrice: "$7.95/mo",
    versionHistory: true,
    publicSharing: true,
  },
  {
    name: "Miro",
    visualCanvas: true,
    aiGeneration: false,
    realTimeCollab: true,
    nodeTypes: "Generic shapes",
    exportFormats: "PNG, PDF",
    startingPrice: "$8/mo",
    versionHistory: false,
    publicSharing: true,
  },
  {
    name: "Draw.io",
    visualCanvas: true,
    aiGeneration: false,
    realTimeCollab: false,
    nodeTypes: "Generic shapes",
    exportFormats: "PNG, SVG, PDF, XML",
    startingPrice: "Free",
    versionHistory: false,
    publicSharing: false,
  },
];

// Navigation links
export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Pricing", href: "/pricing" },
  { label: "Templates", href: "/templates" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

// Footer links
export interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

export const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Templates", href: "/templates" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "#" },
      { label: "DPA", href: "#" },
    ],
  },
];
