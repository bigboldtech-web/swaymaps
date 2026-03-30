"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import "../../landing/landing.css";

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

/* ---- TYPES ---- */
interface NodeChip {
  name: string;
  color: string;
  description: string;
}

interface CodeBlock {
  language: string;
  code: string;
}

interface GuideSection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  code?: CodeBlock;
  nodeChips?: NodeChip[];
  tip?: string;
}

interface Guide {
  slug: string;
  title: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  description: string;
  sections: GuideSection[];
  relatedSlugs: string[];
}

/* ---- GUIDE DATA ---- */
const guides: Guide[] = [
  {
    slug: "getting-started",
    title: "Getting Started with SwayMaps",
    icon: "01",
    iconColor: "var(--accent)",
    iconBg: "rgba(0,194,255,0.12)",
    description: "Go from zero to your first dependency map in under 60 seconds. This guide walks you through account creation, your first map, and the core concepts you need to know.",
    sections: [
      {
        id: "create-account",
        title: "Create Your Account",
        paragraphs: [
          "Head to swaymaps.com and click Get Started. You can sign up with your email address or use Google or GitHub single sign-on. No credit card is required -- the Free plan gives you up to 3 maps with unlimited nodes per map.",
          "After signing up you will land on your dashboard. This is your home base where all your maps live. You can create workspaces later to organize maps by team or project."
        ],
        tip: "If your team already has a workspace, ask the owner to send you an invite link. You will be added automatically after signing up."
      },
      {
        id: "first-map",
        title: "Create Your First Map",
        paragraphs: [
          "Click the New Map button in the top-left corner of your dashboard. You will see two options:"
        ],
        list: [
          "Blank Canvas -- start from scratch with an empty canvas",
          "From Template -- choose from built-in templates like Microservice Architecture, Org Chart, CI/CD Pipeline, Data Flow, and more"
        ],
        paragraphs2: [
          "Templates come pre-loaded with node types, edges, and layout so you can see how a well-structured map looks before building your own."
        ],
        tip: "Try the Microservice Architecture template first. It demonstrates all the core node types and edge patterns."
      } as any,
      {
        id: "add-nodes",
        title: "Add Your First Nodes",
        paragraphs: [
          "There are two ways to add nodes to your canvas:"
        ],
        list: [
          "Double-click anywhere on the canvas to drop a new node at that position",
          "Click the + button in the toolbar to open the node type picker"
        ],
        paragraphs2: [
          "When you add a node, pick a type that matches what it represents. SwayMaps has 11 node types -- Person, System, API, Database, Queue, Cache, Process, Generic, Cloud, Vendor, and Team. Each has a distinct color and icon so your map is instantly readable."
        ],
      } as any,
      {
        id: "connect-edges",
        title: "Connect Nodes with Edges",
        paragraphs: [
          "Every node has connection handles on its edges (the small circles on the top, bottom, left, and right sides). To create a connection:",
        ],
        list: [
          "Hover over a node until you see the connection handles appear",
          "Click and drag from one handle to another node's handle",
          "Release to create the edge"
        ],
        paragraphs2: [
          "You can label edges by clicking on them and typing a description -- for example 'REST API', 'publishes events', or 'reads from'. Labels make your map self-documenting."
        ],
      } as any,
      {
        id: "add-metadata",
        title: "Add Metadata",
        paragraphs: [
          "Click any node to open its detail panel on the right side of the screen. Here you can set:"
        ],
        list: [
          "Title -- the display name shown on the canvas",
          "Description -- a longer explanation of what this node represents",
          "Status -- Healthy, Warning, or Critical for real-time status tracking",
          "Owner -- assign a team member responsible for this component",
          "Tags -- add searchable labels like 'production', 'v2', 'deprecated'"
        ],
        paragraphs2: [
          "Metadata turns your map from a simple diagram into a living knowledge base. Stakeholders can click any node to understand what it is, who owns it, and what state it is in."
        ]
      } as any,
      {
        id: "share-map",
        title: "Share Your Map",
        paragraphs: [
          "SwayMaps gives you two ways to share:"
        ],
        list: [
          "Public link -- click Share and toggle on public access. Anyone with the link can view (but not edit) your map. Perfect for stakeholder reviews.",
          "Invite team members -- create a workspace and invite collaborators by email. Assign roles (Owner, Admin, Editor, Viewer) to control who can do what."
        ],
        tip: "Public links use a unique UUID token and do not expose your account information. You can revoke a public link at any time."
      },
      {
        id: "next-steps",
        title: "Next Steps",
        paragraphs: [
          "Now that you have the basics down, here is where to go next:"
        ],
        list: [
          "Explore the Templates Gallery to see real-world map patterns",
          "Try AI Generation to build maps from natural language descriptions",
          "Learn about YAML DSL to define maps as code",
          "Set up a Workspace to collaborate with your team",
          "Read the Node Types guide to master all 11 types and their use cases"
        ]
      }
    ],
    relatedSlugs: ["node-types", "ai-generation", "collaboration"]
  },

  {
    slug: "node-types",
    title: "Node Types & Metadata",
    icon: "NT",
    iconColor: "#8b5cf6",
    iconBg: "rgba(139,92,246,0.12)",
    description: "SwayMaps supports 11 distinct node types, each with a unique color and purpose. Choosing the right node type makes your maps instantly scannable and semantically rich.",
    sections: [
      {
        id: "overview",
        title: "All 11 Node Types",
        paragraphs: [
          "Each node type has a dedicated color, default icon, and semantic meaning. Using the correct type ensures your map communicates architecture at a glance. Here is every type available in SwayMaps:"
        ],
        nodeChips: [
          { name: "Person", color: "#ec4899", description: "People, roles, and stakeholders. Use for team members, customers, user personas, and anyone who interacts with your system." },
          { name: "System", color: "#3b82f6", description: "Services, applications, and platforms. Use for microservices, monoliths, web apps, mobile apps, and any standalone software component." },
          { name: "API", color: "#06b6d4", description: "API endpoints, gateways, and interfaces. Use for REST APIs, GraphQL endpoints, gRPC services, webhooks, and API gateways." },
          { name: "Database", color: "#8b5cf6", description: "Data stores, tables, and warehouses. Use for PostgreSQL, MongoDB, Redis (as primary store), S3 buckets, data lakes, and data warehouses." },
          { name: "Queue", color: "#2563eb", description: "Message queues and event streams. Use for Kafka topics, RabbitMQ exchanges, AWS SQS queues, and any async messaging infrastructure." },
          { name: "Cache", color: "#ef4444", description: "Caching layers and in-memory stores. Use for Redis (as cache), Memcached, CDN edge caches, and application-level caches." },
          { name: "Process", color: "#22c55e", description: "Workflows, pipelines, and automations. Use for CI/CD pipelines, ETL jobs, cron jobs, approval workflows, and batch processes." },
          { name: "Generic", color: "#14b8a6", description: "Anything that does not fit the other types. Use for abstract concepts, milestones, decision points, and custom elements." },
          { name: "Cloud", color: "#6366f1", description: "Cloud services and infrastructure. Use for AWS Lambda, GCP Cloud Run, Azure Functions, Kubernetes clusters, and cloud-managed resources." },
          { name: "Vendor", color: "#f59e0b", description: "Third-party services and external providers. Use for Stripe, Twilio, SendGrid, Auth0, Datadog, and any SaaS dependency." },
          { name: "Team", color: "#f97316", description: "Teams, departments, and squads. Use for engineering teams, product squads, support groups, and organizational units when mapping ownership." }
        ]
      },
      {
        id: "choosing-types",
        title: "Choosing the Right Type",
        paragraphs: [
          "When in doubt, ask: what role does this component play in the system? If it stores data, use Database. If it processes work asynchronously, use Queue. If it is a human, use Person. If it is a third-party you do not control, use Vendor.",
          "You can always change a node's type after creation by clicking the node and selecting a new type from the detail panel."
        ],
        tip: "Consistency matters more than perfection. If your team decides to represent Kubernetes as a System instead of Cloud, that is fine -- just be consistent across all maps."
      },
      {
        id: "metadata",
        title: "Node Metadata Fields",
        paragraphs: [
          "Every node supports these metadata fields regardless of type:"
        ],
        list: [
          "Title -- the label displayed on the canvas (required)",
          "Description -- free-text explanation, supports markdown",
          "Status -- one of Healthy (green), Warning (amber), or Critical (red)",
          "Owner -- the person or team responsible for this component",
          "Tags -- comma-separated labels for filtering and search",
          "URL -- optional link to external documentation or dashboards"
        ]
      },
      {
        id: "status-indicators",
        title: "Status Indicators",
        paragraphs: [
          "Each node can display a status badge that communicates operational health at a glance:"
        ],
        list: [
          "Healthy (green) -- the component is operating normally",
          "Warning (amber) -- the component is degraded or needs attention",
          "Critical (red) -- the component is down or experiencing failures"
        ],
        paragraphs2: [
          "Status indicators are especially useful during incident reviews and architecture audits. At a glance, stakeholders can see which parts of the system are affected."
        ]
      } as any,
      {
        id: "edge-types",
        title: "Edge Types & Labels",
        paragraphs: [
          "Edges connect nodes and represent relationships or data flow. Every edge can have:"
        ],
        list: [
          "Label -- a text description of the relationship (e.g., 'sends events to', 'reads from')",
          "Type -- visual style that conveys the nature of the connection",
          "Animated -- toggle animation to highlight active data flows"
        ],
        paragraphs2: [
          "Well-labeled edges are what transform a box-and-line diagram into a dependency map that anyone can understand."
        ]
      } as any
    ],
    relatedSlugs: ["getting-started", "yaml-dsl", "ai-generation"]
  },

  {
    slug: "ai-generation",
    title: "AI Generation Guide",
    icon: "AI",
    iconColor: "#ec4899",
    iconBg: "rgba(236,72,153,0.12)",
    description: "SwayMaps uses GPT-4o-mini to turn natural language descriptions into fully structured dependency maps. Describe your system and get a map in seconds.",
    sections: [
      {
        id: "how-it-works",
        title: "How AI Generation Works",
        paragraphs: [
          "When you click Generate with AI, SwayMaps sends your text prompt to a language model that understands system architecture. The AI identifies components, classifies them into node types, determines relationships, and returns a structured map definition.",
          "The result is applied to your canvas immediately -- nodes are placed with an automatic layout and edges are drawn between related components. You can then drag nodes to refine the layout, edit labels, add metadata, and adjust connections."
        ],
        tip: "AI generation works best for system architecture, infrastructure, and organizational maps. For very specific layouts, the YAML DSL gives you more control."
      },
      {
        id: "writing-prompts",
        title: "Writing Good Prompts",
        paragraphs: [
          "The quality of the generated map depends directly on the specificity of your prompt. Here are tips for getting the best results:"
        ],
        list: [
          "Be specific about components -- name your services, databases, and tools explicitly",
          "Mention node types -- saying 'a PostgreSQL database' will be classified as Database, 'a React frontend' as System",
          "Describe relationships -- explain how components interact: 'the API gateway routes to the auth service and the order service'",
          "Specify scope -- mention how many components you expect: 'a 6-service microservice architecture'",
          "Include context -- mention the domain: 'an e-commerce checkout flow' gives the AI contextual understanding"
        ]
      },
      {
        id: "example-prompts",
        title: "Example Prompts",
        paragraphs: [
          "Here are five example prompts and what they generate:"
        ],
        list: [
          "'A microservice architecture for a food delivery app with an API gateway, auth service, restaurant service, order service, delivery tracking service, PostgreSQL databases for orders and restaurants, a Redis cache, and Kafka for async events between services.' -- Generates 9 nodes with typed edges showing sync REST calls and async event flows.",
          "'Our team structure: Platform team owns the Kubernetes cluster and CI/CD pipeline, Backend team owns the API and database, Frontend team owns the React app and design system, and Data team owns the analytics pipeline and data warehouse.' -- Generates 11 nodes across 4 Team nodes with ownership edges.",
          "'CI/CD pipeline: GitHub repo triggers GitHub Actions, which runs tests, builds a Docker image, pushes to ECR, deploys to EKS staging, runs integration tests, then promotes to EKS production.' -- Generates a linear Process flow with 8 nodes.",
          "'E-commerce checkout: customer visits Next.js storefront, adds items to cart stored in Redis, proceeds to checkout which calls Stripe API for payment, order service writes to PostgreSQL, sends confirmation via SendGrid email, and publishes event to Kafka for the fulfillment service.' -- Generates 8 nodes with a clear data flow path.",
          "'SaaS monitoring stack: application sends logs to Datadog, metrics to Prometheus which feeds Grafana dashboards, alerts go to PagerDuty which notifies the on-call engineer via Slack.' -- Generates 6 nodes with a left-to-right observability flow."
        ]
      },
      {
        id: "brainstorm-mode",
        title: "AI Brainstorm Mode",
        paragraphs: [
          "Brainstorm mode works on an existing map. Select one or more nodes, then click AI Brainstorm. The AI analyzes your current map and suggests additional components, missing connections, and potential improvements.",
          "For example, if you have a web app connected to a database, brainstorm might suggest adding a cache layer, a CDN, an API gateway, and a monitoring service. Each suggestion appears as a ghost node that you can accept or dismiss."
        ],
        tip: "Brainstorm mode is great for architecture reviews. Paste your current architecture, run brainstorm, and see what gaps the AI identifies."
      },
      {
        id: "editing-results",
        title: "Editing AI Results",
        paragraphs: [
          "AI-generated maps are fully editable. After generation:"
        ],
        list: [
          "Drag nodes to adjust the layout to your preference",
          "Click any node to change its type, title, or metadata",
          "Delete nodes or edges that are not relevant",
          "Add new nodes manually to fill in gaps the AI missed",
          "Re-run generation with a refined prompt if the first result was not close enough"
        ],
        paragraphs2: [
          "Think of AI generation as a fast first draft. It gets you 80% of the way in seconds, then you polish with manual edits."
        ]
      } as any
    ],
    relatedSlugs: ["getting-started", "yaml-dsl", "node-types"]
  },

  {
    slug: "yaml-dsl",
    title: "YAML DSL Reference",
    icon: "{}",
    iconColor: "#22c55e",
    iconBg: "rgba(34,197,94,0.12)",
    description: "Define SwayMaps as code using the YAML Domain Specific Language. Version control your maps, generate them in CI/CD, or bulk-create complex architectures.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "The SwayMaps YAML DSL lets you define dependency maps in a text format. This is useful for teams that want to version-control their architecture diagrams alongside code, generate maps from CI/CD pipelines, or define complex maps more efficiently than dragging nodes manually.",
          "You can write YAML in any editor, paste it into the SwayMaps YAML panel, and click Apply to render it on the canvas. You can also export any existing map to YAML."
        ]
      },
      {
        id: "basic-structure",
        title: "Basic Structure",
        paragraphs: [
          "A SwayMaps YAML file has two top-level arrays: nodes and edges."
        ],
        code: {
          language: "yaml",
          code: `nodes:
  - id: api-gateway
    type: api
    title: API Gateway
    position: [0, 0]

  - id: user-service
    type: system
    title: User Service
    position: [250, 0]

  - id: user-db
    type: database
    title: Users DB
    position: [500, 0]

edges:
  - from: api-gateway
    to: user-service
    label: routes /users

  - from: user-service
    to: user-db
    label: reads/writes`
        }
      },
      {
        id: "node-properties",
        title: "Node Properties",
        paragraphs: [
          "Each node in the nodes array supports these properties:"
        ],
        list: [
          "id (required) -- unique identifier, used by edges to reference this node. Use kebab-case.",
          "type (required) -- one of: person, system, api, database, queue, cache, process, generic, cloud, vendor, team",
          "title (required) -- display label shown on the canvas",
          "status (optional) -- one of: healthy, warning, critical",
          "owner (optional) -- name of the person or team responsible",
          "tags (optional) -- array of string labels, e.g. ['production', 'critical-path']",
          "description (optional) -- longer text explanation",
          "position (optional) -- [x, y] coordinates on the canvas. If omitted, auto-layout is used."
        ]
      },
      {
        id: "edge-properties",
        title: "Edge Properties",
        paragraphs: [
          "Each edge in the edges array supports these properties:"
        ],
        list: [
          "from (required) -- the id of the source node",
          "to (required) -- the id of the target node",
          "label (optional) -- text shown on the edge describing the relationship",
          "type (optional) -- visual style: 'default', 'animated', 'dashed'"
        ]
      },
      {
        id: "full-example",
        title: "Full Example",
        paragraphs: [
          "Here is a complete YAML definition for a 6-node microservice architecture:"
        ],
        code: {
          language: "yaml",
          code: `nodes:
  - id: gateway
    type: api
    title: API Gateway
    status: healthy
    owner: Platform Team
    tags: [production, critical-path]
    position: [0, 150]

  - id: auth-svc
    type: system
    title: Auth Service
    status: healthy
    owner: Backend Team
    tags: [production]
    position: [250, 0]

  - id: order-svc
    type: system
    title: Order Service
    status: warning
    owner: Backend Team
    tags: [production, needs-scaling]
    position: [250, 300]

  - id: order-db
    type: database
    title: Orders DB
    description: PostgreSQL 15, primary replica in us-east-1
    status: healthy
    owner: Backend Team
    position: [500, 300]

  - id: cache
    type: cache
    title: Redis Cache
    status: healthy
    owner: Platform Team
    position: [500, 0]

  - id: events
    type: queue
    title: Event Bus
    description: Kafka cluster, 3 brokers
    status: healthy
    owner: Platform Team
    position: [500, 150]

edges:
  - from: gateway
    to: auth-svc
    label: authenticates via JWT

  - from: gateway
    to: order-svc
    label: routes /orders

  - from: auth-svc
    to: cache
    label: session lookup

  - from: order-svc
    to: order-db
    label: reads/writes orders

  - from: order-svc
    to: events
    label: publishes order.created
    type: animated`
        }
      },
      {
        id: "apply-to-canvas",
        title: "Applying YAML to Canvas",
        paragraphs: [
          "To apply a YAML definition to your canvas:"
        ],
        list: [
          "Open any map (or create a new blank map)",
          "Click the YAML button in the toolbar (or press Ctrl/Cmd + Y)",
          "Paste your YAML definition into the editor panel",
          "Click Apply to render the map on the canvas",
          "If there are syntax errors, the editor will highlight them with line numbers"
        ],
        tip: "Applying YAML replaces the current canvas content. If you want to merge, export your current map to YAML first, combine the definitions, then apply."
      },
      {
        id: "export-yaml",
        title: "Exporting to YAML",
        paragraphs: [
          "Any map on your canvas can be exported to YAML:"
        ],
        list: [
          "Click the Export button in the toolbar",
          "Select YAML / JSON from the format options",
          "The YAML definition is copied to your clipboard or downloaded as a .yaml file"
        ],
        paragraphs2: [
          "Exported YAML is round-trip compatible -- you can export, edit in a text editor, and re-import without losing any data."
        ]
      } as any
    ],
    relatedSlugs: ["node-types", "ai-generation", "import-export"]
  },

  {
    slug: "collaboration",
    title: "Collaboration & Workspaces",
    icon: "WS",
    iconColor: "#f97316",
    iconBg: "rgba(249,115,22,0.12)",
    description: "Workspaces let your team collaborate on maps in real time. Manage members, assign roles, track changes, and share maps with stakeholders.",
    sections: [
      {
        id: "creating-workspace",
        title: "Creating a Workspace",
        paragraphs: [
          "A workspace is a shared container for maps and team members. To create one:",
        ],
        list: [
          "Go to your dashboard and click the Workspaces tab",
          "Click Create Workspace",
          "Give it a name (e.g., 'Engineering', 'Product', 'Infrastructure')",
          "Choose a plan -- Free workspaces allow up to 3 maps, Pro and Team plans allow unlimited maps"
        ],
        paragraphs2: [
          "You can create multiple workspaces to separate concerns -- for example, one for backend architecture and another for organizational mapping."
        ]
      } as any,
      {
        id: "inviting-members",
        title: "Inviting Members",
        paragraphs: [
          "Once your workspace is created, invite team members by email:"
        ],
        list: [
          "Open the workspace settings by clicking the gear icon",
          "Go to the Members tab",
          "Enter the email addresses of people you want to invite",
          "Select a role for each invite (Admin, Editor, or Viewer)",
          "Click Send Invites"
        ],
        paragraphs2: [
          "Invitees receive an email with a link to join. If they do not have a SwayMaps account yet, they will be prompted to create one first. The invite remains valid for 7 days."
        ]
      } as any,
      {
        id: "roles-permissions",
        title: "Roles & Permissions",
        paragraphs: [
          "Every workspace member has one of four roles:"
        ],
        list: [
          "Owner -- full control. Can delete the workspace, manage billing, and do everything an Admin can. Only one owner per workspace.",
          "Admin -- can invite and remove members, change roles, create and delete maps, and edit all maps in the workspace.",
          "Editor -- can create new maps and edit any existing map. Cannot manage members or workspace settings.",
          "Viewer -- read-only access. Can view all maps in the workspace but cannot make changes. Ideal for stakeholders and executives."
        ],
        tip: "You can change a member's role at any time from the workspace Members tab. Downgrading a role takes effect immediately."
      },
      {
        id: "comments",
        title: "Inline Comments",
        paragraphs: [
          "Team members can leave comments on any node in the map:"
        ],
        list: [
          "Click a node to open its detail panel",
          "Scroll to the Comments section",
          "Type your comment and press Enter to post",
          "Reply to existing comments to create threads",
          "Mention team members with @name to notify them"
        ],
        paragraphs2: [
          "Comments are visible to all workspace members and persist across sessions. Use them for architecture review discussions, questions about ownership, and change requests."
        ]
      } as any,
      {
        id: "public-sharing",
        title: "Public Sharing",
        paragraphs: [
          "Sometimes you need to share a map with someone outside your workspace -- a client, a contractor, or a stakeholder who does not need a full account."
        ],
        list: [
          "Open the map you want to share",
          "Click the Share button in the toolbar",
          "Toggle on Enable public link",
          "Copy the generated URL and send it to anyone"
        ],
        paragraphs2: [
          "Public links provide read-only access. Viewers can zoom, pan, and click nodes to see metadata, but cannot edit. The link uses a unique UUID token and does not reveal your account or workspace details. You can revoke the link at any time by toggling it off."
        ]
      } as any,
      {
        id: "activity-log",
        title: "Activity Log",
        paragraphs: [
          "Every action in a workspace is tracked in the activity log. This includes:"
        ],
        list: [
          "Map created, updated, and deleted events",
          "Node and edge additions, modifications, and removals",
          "Member invites, joins, role changes, and removals",
          "Comment posts and replies",
          "Public link enabled and disabled"
        ],
        paragraphs2: [
          "Access the activity log from the workspace settings. It shows who did what and when, making it easy to audit changes and understand the history of your architecture documentation."
        ]
      } as any
    ],
    relatedSlugs: ["getting-started", "import-export", "integrations"]
  },

  {
    slug: "import-export",
    title: "Import & Export",
    icon: "IO",
    iconColor: "#06b6d4",
    iconBg: "rgba(6,182,212,0.12)",
    description: "Bring in existing diagrams from other tools and export SwayMaps to images, documents, and data formats for sharing and embedding.",
    sections: [
      {
        id: "importing",
        title: "Importing Maps",
        paragraphs: [
          "SwayMaps can import diagrams from several popular tools:"
        ],
        list: [
          "Draw.io (XML) -- export your Draw.io diagram as XML, then import it into SwayMaps. Shapes are mapped to the closest node type based on their label and style.",
          "Lucidchart (CSV) -- export your Lucidchart diagram as CSV. SwayMaps reads the columns and maps them to node properties. You can customize the column mapping during import.",
          "Miro (JSON) -- export a Miro board as JSON via the Miro API. SwayMaps parses sticky notes as nodes and lines as edges."
        ],
        tip: "After importing, review the auto-assigned node types and correct any that do not match. The import process does its best to infer types from labels and colors but may not always be accurate."
      },
      {
        id: "import-steps",
        title: "Import Steps",
        paragraphs: [
          "The import workflow is the same regardless of source format:"
        ],
        list: [
          "Open the map where you want to import (or create a new one)",
          "Click Import in the toolbar",
          "Select your file (XML, CSV, or JSON)",
          "Review the preview -- SwayMaps shows a summary of detected nodes and edges",
          "Map columns to node properties if importing from CSV",
          "Click Confirm Import to add the nodes and edges to your canvas",
          "Adjust the auto-layout by dragging nodes into position"
        ]
      },
      {
        id: "exporting",
        title: "Exporting",
        paragraphs: [
          "SwayMaps supports four export formats, each optimized for a different use case:"
        ],
        list: [
          "PNG -- high-resolution raster image. Best for pasting into presentations, Slack messages, and documents. Supports transparent background.",
          "SVG -- scalable vector graphic. Best for technical documentation where you need crisp rendering at any zoom level. Editable in Figma, Illustrator, and Inkscape.",
          "PDF -- paginated document. Best for formal architecture documents, print-outs, and stakeholder handoffs. Includes a title page with map name and metadata.",
          "JSON -- raw map data. Best for backups, programmatic access, and migration. Contains all nodes, edges, metadata, and layout positions."
        ]
      },
      {
        id: "embedding",
        title: "Embedding Maps",
        paragraphs: [
          "You can embed any SwayMaps map in external tools using an iframe. This is useful for keeping architecture diagrams live in your team's wiki or documentation site."
        ],
        list: [
          "Enable public sharing on the map (see Collaboration guide)",
          "Click Embed in the share panel",
          "Copy the iframe snippet",
          "Paste it into Notion, Confluence, your internal wiki, or any HTML page"
        ],
        code: {
          language: "html",
          code: `<iframe
  src="https://swaymaps.com/embed/abc123-def456"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen
></iframe>`
        },
        tip: "Embedded maps are interactive -- viewers can zoom, pan, and click nodes to see metadata. They update in real time as you edit the source map."
      } as any
    ],
    relatedSlugs: ["yaml-dsl", "collaboration", "api-reference"]
  },

  {
    slug: "integrations",
    title: "Integrations Setup",
    icon: "IN",
    iconColor: "#6366f1",
    iconBg: "rgba(99,102,241,0.12)",
    description: "Connect SwayMaps to your team's communication tools. Get notified in Slack or Teams when maps change, or build custom workflows with webhooks.",
    sections: [
      {
        id: "slack",
        title: "Slack Integration",
        paragraphs: [
          "The Slack integration sends notifications to a Slack channel whenever key events happen in your workspace."
        ],
        list: [
          "Go to Workspace Settings > Integrations",
          "Click Connect Slack",
          "Select the Slack channel where you want notifications",
          "Choose which events trigger notifications (see Notification Events below)",
          "Click Save"
        ],
        paragraphs2: [
          "Notifications include a rich Slack message with the event type, map name, who triggered it, and a direct link to the map."
        ]
      } as any,
      {
        id: "teams",
        title: "Microsoft Teams",
        paragraphs: [
          "The Teams integration uses incoming webhooks to post notifications as MessageCard format messages."
        ],
        list: [
          "In Microsoft Teams, go to the channel where you want notifications",
          "Click the ... menu > Connectors > Incoming Webhook",
          "Name it 'SwayMaps' and copy the webhook URL",
          "In SwayMaps, go to Workspace Settings > Integrations > Microsoft Teams",
          "Paste the webhook URL and select your notification events",
          "Click Save and test the connection"
        ],
        tip: "Teams webhook URLs are channel-specific. If you want notifications in multiple channels, create a separate webhook for each."
      },
      {
        id: "custom-webhooks",
        title: "Custom Webhooks",
        paragraphs: [
          "For tools beyond Slack and Teams, or for building custom workflows, SwayMaps supports generic webhooks. Any HTTP endpoint that accepts POST requests can receive SwayMaps events."
        ],
        list: [
          "Go to Workspace Settings > Integrations > Custom Webhooks",
          "Click Add Webhook",
          "Enter the endpoint URL",
          "Optionally add a secret token for signature verification",
          "Select the events you want to trigger this webhook",
          "Click Save"
        ],
        code: {
          language: "json",
          code: `{
  "event": "map.updated",
  "timestamp": "2026-03-30T14:22:00Z",
  "workspace_id": "ws_abc123",
  "map_id": "map_def456",
  "map_name": "Backend Architecture",
  "user": {
    "id": "usr_ghi789",
    "name": "Alex Chen",
    "email": "alex@example.com"
  },
  "changes": {
    "nodes_added": 2,
    "nodes_removed": 0,
    "edges_added": 3,
    "edges_removed": 1
  }
}`
        }
      },
      {
        id: "events",
        title: "Notification Events",
        paragraphs: [
          "The following events can trigger notifications across all integration types:"
        ],
        list: [
          "map.created -- a new map is created in the workspace",
          "map.updated -- nodes or edges are added, removed, or modified",
          "map.deleted -- a map is deleted",
          "map.shared -- a public share link is enabled",
          "member.invited -- a new member is invited to the workspace",
          "member.joined -- an invited member accepts and joins",
          "member.removed -- a member is removed from the workspace",
          "comment.added -- a new comment is posted on a node",
          "comment.replied -- a reply is added to an existing comment thread"
        ],
        tip: "For high-activity workspaces, consider only subscribing to map.created and map.deleted events to avoid notification overload. You can always change this later."
      }
    ],
    relatedSlugs: ["collaboration", "api-reference", "import-export"]
  },

  {
    slug: "api-reference",
    title: "API Reference",
    icon: "AP",
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.12)",
    description: "Programmatic access to SwayMaps. Create, read, and update maps from your own applications, scripts, and CI/CD pipelines.",
    sections: [
      {
        id: "authentication",
        title: "Authentication",
        paragraphs: [
          "All API requests require authentication via an API key. To generate a key:"
        ],
        list: [
          "Go to Settings > API Keys",
          "Click Generate New Key",
          "Give it a descriptive name (e.g., 'CI/CD Pipeline', 'Internal Dashboard')",
          "Copy the key immediately -- it is only shown once"
        ],
        paragraphs2: [
          "Include the key in the Authorization header of every request:"
        ]
      } as any,
      {
        id: "auth-header",
        title: "Authorization Header",
        code: {
          language: "bash",
          code: `curl -H "Authorization: Bearer sk_live_your_api_key_here" \\
  https://swaymaps.com/api/v1/maps`
        }
      },
      {
        id: "base-url",
        title: "Base URL",
        paragraphs: [
          "All API endpoints are served from:"
        ],
        code: {
          language: "text",
          code: "https://swaymaps.com/api/v1"
        },
        tip: "Always use HTTPS. HTTP requests are rejected with a 301 redirect."
      } as any,
      {
        id: "endpoints",
        title: "Endpoints",
        paragraphs: [
          "The SwayMaps REST API provides the following endpoints:"
        ],
        list: [
          "GET /maps -- list all maps in your workspace. Returns an array of map objects with id, name, created_at, and updated_at.",
          "GET /maps/:id -- get a single map by ID. Returns the full map object including all nodes and edges.",
          "POST /maps -- create a new map. Request body: { name: string, workspace_id?: string }. Returns the created map object.",
          "PUT /maps/:id/state -- update the map state (nodes and edges). Request body: { nodes: Node[], edges: Edge[] }. Returns the updated map.",
          "GET /maps/:id/nodes -- list all nodes in a map. Returns an array of node objects.",
          "POST /maps/:id/nodes -- add a node to a map. Request body: { type: string, title: string, position?: [x, y], metadata?: object }.",
          "GET /maps/:id/edges -- list all edges in a map. Returns an array of edge objects."
        ]
      },
      {
        id: "example-request",
        title: "Example Request",
        paragraphs: [
          "Here is a complete example of creating a new map and adding nodes to it:"
        ],
        code: {
          language: "bash",
          code: `# Create a new map
curl -X POST https://swaymaps.com/api/v1/maps \\
  -H "Authorization: Bearer sk_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Payment Service Architecture",
    "workspace_id": "ws_abc123"
  }'

# Response:
# { "id": "map_xyz789", "name": "Payment Service Architecture", ... }

# Add a node
curl -X POST https://swaymaps.com/api/v1/maps/map_xyz789/nodes \\
  -H "Authorization: Bearer sk_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "api",
    "title": "Payment API",
    "position": [0, 0],
    "metadata": {
      "status": "healthy",
      "owner": "Payments Team",
      "tags": ["production", "critical-path"]
    }
  }'`
        }
      },
      {
        id: "rate-limits",
        title: "Rate Limits",
        paragraphs: [
          "API requests are rate-limited per workspace to ensure fair usage:"
        ],
        list: [
          "Free plan -- 20 requests per minute",
          "Pro plan -- 100 requests per minute",
          "Team plan -- 500 requests per minute"
        ],
        paragraphs2: [
          "When you exceed the rate limit, the API returns a 429 Too Many Requests response with a Retry-After header indicating how many seconds to wait before retrying."
        ]
      } as any,
      {
        id: "errors",
        title: "Error Handling",
        paragraphs: [
          "The API returns standard HTTP status codes:"
        ],
        list: [
          "200 OK -- request succeeded",
          "201 Created -- resource created successfully",
          "400 Bad Request -- invalid request body or parameters",
          "401 Unauthorized -- missing or invalid API key",
          "403 Forbidden -- API key does not have permission for this resource",
          "404 Not Found -- map or resource does not exist",
          "429 Too Many Requests -- rate limit exceeded",
          "500 Internal Server Error -- something went wrong on our end"
        ],
        code: {
          language: "json",
          code: `{
  "error": {
    "code": "invalid_request",
    "message": "The 'type' field is required when creating a node.",
    "details": {
      "field": "type",
      "expected": "one of: person, system, api, database, queue, cache, process, generic, cloud, vendor, team"
    }
  }
}`
        }
      }
    ],
    relatedSlugs: ["integrations", "yaml-dsl", "collaboration"]
  }
];

/* ---- HELPERS ---- */
function slugToGuide(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug);
}

function getRelatedGuides(slugs: string[]): { slug: string; title: string; icon: string; iconColor: string; iconBg: string; description: string }[] {
  return slugs
    .map(s => guides.find(g => g.slug === s))
    .filter(Boolean)
    .map(g => ({ slug: g!.slug, title: g!.title, icon: g!.icon, iconColor: g!.iconColor, iconBg: g!.iconBg, description: g!.description }));
}

/* ---- STYLES ---- */
const styles = {
  pageWrapper: {
    maxWidth: 840,
    margin: "0 auto",
    padding: "0 24px",
  } as React.CSSProperties,
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.82rem",
    color: "var(--t3)",
    marginBottom: 32,
    paddingTop: 120,
  } as React.CSSProperties,
  breadcrumbLink: {
    color: "var(--t2)",
    textDecoration: "none",
    transition: "color 0.2s",
  } as React.CSSProperties,
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 16,
  } as React.CSSProperties,
  iconBox: (bg: string, color: string) => ({
    width: 56,
    height: 56,
    borderRadius: 14,
    background: bg,
    color: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "1rem",
    fontFamily: "var(--font-mono)",
    flexShrink: 0,
  } as React.CSSProperties),
  h1: {
    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "var(--t1)",
    lineHeight: 1.2,
  } as React.CSSProperties,
  description: {
    fontSize: "1.02rem",
    color: "var(--t2)",
    lineHeight: 1.75,
    marginBottom: 40,
  } as React.CSSProperties,
  tocBox: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "24px 28px",
    marginBottom: 48,
  } as React.CSSProperties,
  tocTitle: {
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    color: "var(--t3)",
    marginBottom: 14,
  } as React.CSSProperties,
  tocLink: {
    display: "block",
    fontSize: "0.88rem",
    fontWeight: 500,
    color: "var(--t2)",
    textDecoration: "none",
    padding: "6px 0",
    transition: "color 0.2s",
  } as React.CSSProperties,
  sectionWrapper: {
    marginBottom: 48,
  } as React.CSSProperties,
  h2: {
    fontSize: "1.35rem",
    fontWeight: 750,
    color: "var(--t1)",
    letterSpacing: "-0.02em",
    marginBottom: 16,
    paddingTop: 8,
  } as React.CSSProperties,
  paragraph: {
    fontSize: "0.94rem",
    color: "var(--t2)",
    lineHeight: 1.8,
    marginBottom: 14,
  } as React.CSSProperties,
  list: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0 16px 0",
  } as React.CSSProperties,
  listItem: {
    fontSize: "0.91rem",
    color: "var(--t2)",
    lineHeight: 1.75,
    padding: "5px 0 5px 28px",
    position: "relative" as const,
  } as React.CSSProperties,
  checkmark: {
    position: "absolute" as const,
    left: 0,
    top: 9,
    width: 18,
    height: 18,
    borderRadius: 5,
    background: "rgba(0,194,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--accent)",
  } as React.CSSProperties,
  codeBlock: {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "20px 24px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.82rem",
    lineHeight: 1.7,
    color: "var(--t2)",
    overflowX: "auto" as const,
    marginBottom: 20,
    whiteSpace: "pre" as const,
  } as React.CSSProperties,
  tipBox: {
    background: "rgba(0,194,255,0.06)",
    border: "1px solid rgba(0,194,255,0.15)",
    borderRadius: 10,
    padding: "16px 20px",
    marginBottom: 20,
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  } as React.CSSProperties,
  tipLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap" as const,
    paddingTop: 2,
  } as React.CSSProperties,
  tipText: {
    fontSize: "0.88rem",
    color: "var(--t2)",
    lineHeight: 1.7,
  } as React.CSSProperties,
  chipRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    margin: "16px 0 20px 0",
  } as React.CSSProperties,
  chip: (color: string) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "14px 18px",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
  } as React.CSSProperties),
  chipDot: (color: string) => ({
    width: 36,
    height: 36,
    borderRadius: 9,
    background: `${color}20`,
    border: `2px solid ${color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  } as React.CSSProperties),
  chipDotInner: (color: string) => ({
    width: 12,
    height: 12,
    borderRadius: 4,
    background: color,
  } as React.CSSProperties),
  chipContent: {
    flex: 1,
  } as React.CSSProperties,
  chipName: (color: string) => ({
    fontSize: "0.9rem",
    fontWeight: 700,
    color: color,
    marginBottom: 4,
  } as React.CSSProperties),
  chipDesc: {
    fontSize: "0.84rem",
    color: "var(--t2)",
    lineHeight: 1.65,
  } as React.CSSProperties,
  feedbackBox: {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "32px 28px",
    textAlign: "center" as const,
    marginTop: 56,
    marginBottom: 48,
  } as React.CSSProperties,
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 14,
    marginBottom: 80,
  } as React.CSSProperties,
  relatedCard: {
    display: "block",
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "22px 20px",
    textDecoration: "none",
    transition: "all 0.25s var(--ease)",
  } as React.CSSProperties,
};

/* ---- COMPONENT ---- */
export default function GuideSlugPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const guide = slugToGuide(slug);

  const [scrolled, setScrolled] = useState(false);
  const [feedback, setFeedback] = useState<null | "yes" | "no">(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!guide) {
    return (
      <div className="lp-root">
        <div className="lp-bg">
          <div className="lp-orb lp-orb--1" />
          <div className="lp-orb lp-orb--2" />
        </div>
        <nav className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
          <div className="lp-nav-inner">
            <Link href="/" className="lp-nav-logo">
              <span className="lp-nav-logo-icon"><Logo size={20} /></span>
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
              <Link href="/auth/signup" className="lp-btn lp-btn--primary">Get Started <IconArrowRight size={14} /></Link>
            </div>
          </div>
        </nav>
        <div style={{ ...styles.pageWrapper, textAlign: "center", paddingTop: 180, paddingBottom: 180 }}>
          <h1 style={{ ...styles.h1, marginBottom: 16 }}>Guide not found</h1>
          <p style={styles.paragraph}>The guide you are looking for does not exist.</p>
          <Link href="/docs" className="lp-btn lp-btn--primary" style={{ marginTop: 24, display: "inline-flex" }}>
            Back to Docs <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedGuides(guide.relatedSlugs);

  return (
    <div className="lp-root">
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
            <span className="lp-nav-logo-icon"><Logo size={20} /></span>
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
            <Link href="/auth/signup" className="lp-btn lp-btn--primary">Get Started <IconArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      <div style={styles.pageWrapper}>
        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <Link href="/docs" style={styles.breadcrumbLink}>Docs</Link>
          <span style={{ color: "var(--t3)" }}>/</span>
          <span style={{ color: "var(--t2)" }}>{guide.title}</span>
        </div>

        {/* TITLE */}
        <Reveal>
          <div style={styles.titleRow}>
            <div style={styles.iconBox(guide.iconBg, guide.iconColor)}>
              {guide.icon}
            </div>
            <h1 style={styles.h1}>{guide.title}</h1>
          </div>
          <p style={styles.description}>{guide.description}</p>
        </Reveal>

        {/* TABLE OF CONTENTS */}
        <Reveal>
          <div style={styles.tocBox}>
            <div style={styles.tocTitle}>On this page</div>
            {guide.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={styles.tocLink}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--t2)"; }}
              >
                {s.title}
              </a>
            ))}
          </div>
        </Reveal>

        {/* SECTIONS */}
        {guide.sections.map((section) => (
          <Reveal key={section.id}>
            <div id={section.id} style={styles.sectionWrapper}>
              <h2 style={styles.h2}>{section.title}</h2>

              {section.paragraphs?.map((p, i) => (
                <p key={i} style={styles.paragraph}>{p}</p>
              ))}

              {section.nodeChips && (
                <div style={styles.chipRow}>
                  {section.nodeChips.map((chip) => (
                    <div key={chip.name} style={styles.chip(chip.color)}>
                      <div style={styles.chipDot(chip.color)}>
                        <div style={styles.chipDotInner(chip.color)} />
                      </div>
                      <div style={styles.chipContent}>
                        <div style={styles.chipName(chip.color)}>{chip.name}</div>
                        <div style={styles.chipDesc}>{chip.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.list && (
                <ul style={styles.list}>
                  {section.list.map((item, i) => (
                    <li key={i} style={styles.listItem}>
                      <span style={styles.checkmark}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 6.5l3 3 5-6" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {(section as any).paragraphs2?.map((p: string, i: number) => (
                <p key={`p2-${i}`} style={styles.paragraph}>{p}</p>
              ))}

              {section.code && (
                <div style={styles.codeBlock}>
                  {section.code.code}
                </div>
              )}

              {section.tip && (
                <div style={styles.tipBox}>
                  <span style={styles.tipLabel}>Tip</span>
                  <span style={styles.tipText}>{section.tip}</span>
                </div>
              )}
            </div>
          </Reveal>
        ))}

        {/* FEEDBACK */}
        <Reveal>
          <div style={styles.feedbackBox}>
            <p style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--t1)",
              marginBottom: 16,
            }}>
              Was this guide helpful?
            </p>
            {feedback === null ? (
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={() => setFeedback("yes")}
                  style={{
                    padding: "10px 28px",
                    borderRadius: 8,
                    border: "1px solid var(--border2)",
                    background: "var(--bg4)",
                    color: "var(--t1)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; (e.currentTarget as HTMLElement).style.color = "var(--t1)"; }}
                >
                  Yes, helpful
                </button>
                <button
                  onClick={() => setFeedback("no")}
                  style={{
                    padding: "10px 28px",
                    borderRadius: 8,
                    border: "1px solid var(--border2)",
                    background: "var(--bg4)",
                    color: "var(--t1)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; }}
                >
                  Not really
                </button>
              </div>
            ) : (
              <p style={{
                fontSize: "0.9rem",
                color: "var(--t2)",
              }}>
                {feedback === "yes"
                  ? "Glad this was helpful! Let us know if there is anything else we can improve."
                  : "Thanks for the feedback. We will work on making this guide better."}
              </p>
            )}
          </div>
        </Reveal>

        {/* RELATED GUIDES */}
        {related.length > 0 && (
          <Reveal>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--t3)",
                marginBottom: 18,
              }}>
                Related Guides
              </h3>
            </div>
            <div style={styles.relatedGrid}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/docs/${r.slug}`}
                  style={styles.relatedCard}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 9,
                    background: r.iconBg,
                    color: r.iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 14,
                  }}>
                    {r.icon}
                  </div>
                  <div style={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "var(--t1)",
                    marginBottom: 4,
                  }}>{r.title}</div>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "var(--t2)",
                    lineHeight: 1.55,
                  }}>{r.description.slice(0, 80)}...</div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-footer-brand-logo">
                <span className="lp-nav-logo-icon"><Logo size={20} /></span>
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
