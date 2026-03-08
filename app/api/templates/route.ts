import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      where: { isPublic: true },
      orderBy: { usageCount: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        thumbnail: true,
        mapData: true,
        usageCount: true,
      },
    });
    return NextResponse.json(templates);
  } catch {
    // Return built-in templates as fallback
    return NextResponse.json(BUILTIN_TEMPLATES);
  }
}

const BUILTIN_TEMPLATES = [
  {
    id: "tpl-microservice",
    name: "Microservice Architecture",
    description: "Map your services, databases, APIs, and message queues. See blast radius before deploying.",
    category: "architecture",
    thumbnail: null,
    usageCount: 0,
    mapData: JSON.stringify({
      nodes: [
        { id: "n1", kind: "system", kindLabel: "API Gateway", title: "API Gateway", tags: ["entry-point", "routing"], noteId: "", color: "#0ea5e9", position: { x: 400, y: 60 } },
        { id: "n2", kind: "system", kindLabel: "Service", title: "User Service", tags: ["auth", "users"], noteId: "", color: "#22c55e", position: { x: 200, y: 200 } },
        { id: "n3", kind: "system", kindLabel: "Service", title: "Order Service", tags: ["orders", "payments"], noteId: "", color: "#22c55e", position: { x: 400, y: 200 } },
        { id: "n4", kind: "system", kindLabel: "Service", title: "Notification Service", tags: ["email", "sms"], noteId: "", color: "#22c55e", position: { x: 600, y: 200 } },
        { id: "n5", kind: "generic", kindLabel: "Database", title: "Users DB (PostgreSQL)", tags: ["database", "pii"], noteId: "", color: "#6366f1", position: { x: 150, y: 380 } },
        { id: "n6", kind: "generic", kindLabel: "Database", title: "Orders DB (PostgreSQL)", tags: ["database"], noteId: "", color: "#6366f1", position: { x: 400, y: 380 } },
        { id: "n7", kind: "generic", kindLabel: "Queue", title: "Message Queue (RabbitMQ)", tags: ["async", "queue"], noteId: "", color: "#f59e0b", position: { x: 600, y: 380 } },
        { id: "n8", kind: "generic", kindLabel: "Cache", title: "Redis Cache", tags: ["cache", "sessions"], noteId: "", color: "#ef4444", position: { x: 250, y: 380 } },
      ],
      edges: [
        { id: "e1", sourceId: "n1", targetId: "n2", sourceHandle: null, targetHandle: null, label: "REST" },
        { id: "e2", sourceId: "n1", targetId: "n3", sourceHandle: null, targetHandle: null, label: "REST" },
        { id: "e3", sourceId: "n1", targetId: "n4", sourceHandle: null, targetHandle: null, label: "REST" },
        { id: "e4", sourceId: "n2", targetId: "n5", sourceHandle: null, targetHandle: null, label: "reads/writes" },
        { id: "e5", sourceId: "n3", targetId: "n6", sourceHandle: null, targetHandle: null, label: "reads/writes" },
        { id: "e6", sourceId: "n3", targetId: "n7", sourceHandle: null, targetHandle: null, label: "publishes" },
        { id: "e7", sourceId: "n7", targetId: "n4", sourceHandle: null, targetHandle: null, label: "consumes" },
        { id: "e8", sourceId: "n2", targetId: "n8", sourceHandle: null, targetHandle: null, label: "cache" },
      ],
      notes: [],
    }),
  },
  {
    id: "tpl-orgchart",
    name: "Team Org Chart",
    description: "Map team ownership, responsibilities, and reporting lines. Great for onboarding.",
    category: "org",
    thumbnail: null,
    usageCount: 0,
    mapData: JSON.stringify({
      nodes: [
        { id: "n1", kind: "person", kindLabel: "CTO", title: "CTO", tags: ["leadership"], noteId: "", color: "#0ea5e9", position: { x: 400, y: 60 } },
        { id: "n2", kind: "person", kindLabel: "VP Eng", title: "VP Engineering", tags: ["leadership"], noteId: "", color: "#38bdf8", position: { x: 200, y: 200 } },
        { id: "n3", kind: "person", kindLabel: "VP Product", title: "VP Product", tags: ["leadership"], noteId: "", color: "#38bdf8", position: { x: 600, y: 200 } },
        { id: "n4", kind: "person", kindLabel: "EM", title: "Platform Team Lead", tags: ["platform", "infra"], noteId: "", color: "#22c55e", position: { x: 100, y: 360 } },
        { id: "n5", kind: "person", kindLabel: "EM", title: "Product Team Lead", tags: ["product", "frontend"], noteId: "", color: "#22c55e", position: { x: 300, y: 360 } },
        { id: "n6", kind: "person", kindLabel: "PM", title: "Senior PM", tags: ["product"], noteId: "", color: "#f59e0b", position: { x: 500, y: 360 } },
        { id: "n7", kind: "person", kindLabel: "Designer", title: "Lead Designer", tags: ["design", "ux"], noteId: "", color: "#f59e0b", position: { x: 700, y: 360 } },
      ],
      edges: [
        { id: "e1", sourceId: "n1", targetId: "n2", sourceHandle: null, targetHandle: null, label: "reports to" },
        { id: "e2", sourceId: "n1", targetId: "n3", sourceHandle: null, targetHandle: null, label: "reports to" },
        { id: "e3", sourceId: "n2", targetId: "n4", sourceHandle: null, targetHandle: null, label: "manages" },
        { id: "e4", sourceId: "n2", targetId: "n5", sourceHandle: null, targetHandle: null, label: "manages" },
        { id: "e5", sourceId: "n3", targetId: "n6", sourceHandle: null, targetHandle: null, label: "manages" },
        { id: "e6", sourceId: "n3", targetId: "n7", sourceHandle: null, targetHandle: null, label: "manages" },
      ],
      notes: [],
    }),
  },
  {
    id: "tpl-dataflow",
    name: "Data Flow Diagram",
    description: "Track where PII and sensitive data flows. Essential for SOC2, GDPR, and HIPAA compliance.",
    category: "compliance",
    thumbnail: null,
    usageCount: 0,
    mapData: JSON.stringify({
      nodes: [
        { id: "n1", kind: "person", kindLabel: "User", title: "End User", tags: ["pii-source"], noteId: "", color: "#38bdf8", position: { x: 100, y: 200 } },
        { id: "n2", kind: "system", kindLabel: "Frontend", title: "Web App", tags: ["frontend"], noteId: "", color: "#22c55e", position: { x: 300, y: 200 } },
        { id: "n3", kind: "system", kindLabel: "API", title: "Backend API", tags: ["pii-processor"], noteId: "", color: "#22c55e", position: { x: 500, y: 200 } },
        { id: "n4", kind: "generic", kindLabel: "Database", title: "Primary DB", tags: ["pii-store", "encrypted"], noteId: "", color: "#6366f1", position: { x: 500, y: 380 } },
        { id: "n5", kind: "system", kindLabel: "Service", title: "Payment Processor (Stripe)", tags: ["pci", "external"], noteId: "", color: "#f59e0b", position: { x: 700, y: 200 } },
        { id: "n6", kind: "system", kindLabel: "Service", title: "Email Service (SendGrid)", tags: ["pii-processor", "external"], noteId: "", color: "#f59e0b", position: { x: 700, y: 380 } },
        { id: "n7", kind: "system", kindLabel: "Analytics", title: "Analytics (anonymized)", tags: ["analytics"], noteId: "", color: "#94a3b8", position: { x: 300, y: 380 } },
      ],
      edges: [
        { id: "e1", sourceId: "n1", targetId: "n2", sourceHandle: null, targetHandle: null, label: "PII input" },
        { id: "e2", sourceId: "n2", targetId: "n3", sourceHandle: null, targetHandle: null, label: "HTTPS (encrypted)" },
        { id: "e3", sourceId: "n3", targetId: "n4", sourceHandle: null, targetHandle: null, label: "stores PII" },
        { id: "e4", sourceId: "n3", targetId: "n5", sourceHandle: null, targetHandle: null, label: "payment data" },
        { id: "e5", sourceId: "n3", targetId: "n6", sourceHandle: null, targetHandle: null, label: "email + name" },
        { id: "e6", sourceId: "n2", targetId: "n7", sourceHandle: null, targetHandle: null, label: "anonymized events" },
      ],
      notes: [],
    }),
  },
  {
    id: "tpl-cicd",
    name: "CI/CD Pipeline",
    description: "Map your build, test, and deployment pipeline from commit to production.",
    category: "devops",
    thumbnail: null,
    usageCount: 0,
    mapData: JSON.stringify({
      nodes: [
        { id: "n1", kind: "process", kindLabel: "Trigger", title: "Git Push / PR", tags: ["trigger"], noteId: "", color: "#f59e0b", position: { x: 100, y: 200 } },
        { id: "n2", kind: "process", kindLabel: "CI", title: "Run Tests", tags: ["ci", "testing"], noteId: "", color: "#22c55e", position: { x: 300, y: 200 } },
        { id: "n3", kind: "process", kindLabel: "CI", title: "Build & Lint", tags: ["ci", "build"], noteId: "", color: "#22c55e", position: { x: 500, y: 200 } },
        { id: "n4", kind: "process", kindLabel: "CD", title: "Deploy to Staging", tags: ["staging", "deploy"], noteId: "", color: "#0ea5e9", position: { x: 700, y: 200 } },
        { id: "n5", kind: "process", kindLabel: "Gate", title: "Manual Approval", tags: ["gate", "review"], noteId: "", color: "#ef4444", position: { x: 700, y: 340 } },
        { id: "n6", kind: "process", kindLabel: "CD", title: "Deploy to Production", tags: ["production", "deploy"], noteId: "", color: "#6366f1", position: { x: 500, y: 340 } },
        { id: "n7", kind: "system", kindLabel: "Monitoring", title: "Health Checks & Alerts", tags: ["monitoring", "observability"], noteId: "", color: "#94a3b8", position: { x: 300, y: 340 } },
      ],
      edges: [
        { id: "e1", sourceId: "n1", targetId: "n2", sourceHandle: null, targetHandle: null, label: "triggers" },
        { id: "e2", sourceId: "n2", targetId: "n3", sourceHandle: null, targetHandle: null, label: "on pass" },
        { id: "e3", sourceId: "n3", targetId: "n4", sourceHandle: null, targetHandle: null, label: "on pass" },
        { id: "e4", sourceId: "n4", targetId: "n5", sourceHandle: null, targetHandle: null, label: "needs approval" },
        { id: "e5", sourceId: "n5", targetId: "n6", sourceHandle: null, targetHandle: null, label: "approved" },
        { id: "e6", sourceId: "n6", targetId: "n7", sourceHandle: null, targetHandle: null, label: "monitors" },
      ],
      notes: [],
    }),
  },
  {
    id: "tpl-vendor",
    name: "Vendor Dependency Map",
    description: "Map your third-party vendor dependencies and assess risk exposure.",
    category: "risk",
    thumbnail: null,
    usageCount: 0,
    mapData: JSON.stringify({
      nodes: [
        { id: "n1", kind: "system", kindLabel: "Your Product", title: "Your Application", tags: ["core"], noteId: "", color: "#0ea5e9", position: { x: 400, y: 60 } },
        { id: "n2", kind: "generic", kindLabel: "Vendor", title: "AWS", tags: ["cloud", "critical"], noteId: "", color: "#f59e0b", position: { x: 150, y: 220 } },
        { id: "n3", kind: "generic", kindLabel: "Vendor", title: "Stripe", tags: ["payments", "critical"], noteId: "", color: "#6366f1", position: { x: 350, y: 220 } },
        { id: "n4", kind: "generic", kindLabel: "Vendor", title: "Auth0", tags: ["auth", "critical"], noteId: "", color: "#ef4444", position: { x: 550, y: 220 } },
        { id: "n5", kind: "generic", kindLabel: "Vendor", title: "SendGrid", tags: ["email", "medium"], noteId: "", color: "#22c55e", position: { x: 200, y: 380 } },
        { id: "n6", kind: "generic", kindLabel: "Vendor", title: "Datadog", tags: ["monitoring", "medium"], noteId: "", color: "#22c55e", position: { x: 400, y: 380 } },
        { id: "n7", kind: "generic", kindLabel: "Vendor", title: "GitHub", tags: ["source-code", "critical"], noteId: "", color: "#ef4444", position: { x: 600, y: 380 } },
      ],
      edges: [
        { id: "e1", sourceId: "n1", targetId: "n2", sourceHandle: null, targetHandle: null, label: "hosted on" },
        { id: "e2", sourceId: "n1", targetId: "n3", sourceHandle: null, targetHandle: null, label: "payments" },
        { id: "e3", sourceId: "n1", targetId: "n4", sourceHandle: null, targetHandle: null, label: "authentication" },
        { id: "e4", sourceId: "n1", targetId: "n5", sourceHandle: null, targetHandle: null, label: "transactional email" },
        { id: "e5", sourceId: "n1", targetId: "n6", sourceHandle: null, targetHandle: null, label: "monitoring" },
        { id: "e6", sourceId: "n1", targetId: "n7", sourceHandle: null, targetHandle: null, label: "source code" },
      ],
      notes: [],
    }),
  },
];
