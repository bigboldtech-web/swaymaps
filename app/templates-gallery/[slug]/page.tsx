"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import "../../landing/landing.css";

/* ---- SVG ICONS ---- */
function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

function IconArrowLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 8h-9M7.5 4l-4 4 4 4" />
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
interface TemplateNode {
  id: string;
  label: string;
  type: string;
  color: string;
  x: number;
  y: number;
  status?: "healthy" | "warning" | "critical";
}

interface TemplateEdge {
  from: string;
  to: string;
  color: string;
}

interface Template {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  categoryColor: string;
  nodes: TemplateNode[];
  edges: TemplateEdge[];
  useCases: string[];
  bestFor: string;
}

/* ---- COLOR MAP ---- */
const typeColors: Record<string, string> = {
  Person: "var(--node-person)",
  System: "var(--node-system)",
  API: "var(--node-api)",
  Database: "var(--node-db)",
  Queue: "var(--node-queue)",
  Cache: "var(--node-cache)",
  Process: "var(--node-process)",
  Cloud: "var(--node-cloud)",
  Vendor: "var(--node-vendor)",
  Team: "var(--node-team)",
  Generic: "#14b8a6",
};

const statusColors: Record<string, string> = {
  healthy: "var(--status-healthy)",
  warning: "var(--status-warning)",
  critical: "var(--status-critical)",
};

/* ---- TEMPLATE DATA ---- */
const templates: Template[] = [
  {
    slug: "microservices-architecture",
    name: "Microservices Architecture",
    description: "Map service dependencies across your distributed system",
    longDescription: "Visualize how your microservices communicate, share data, and depend on each other. This template covers API gateways, service-to-service calls, databases, caches, and message queues in a typical distributed architecture. Ideal for onboarding new engineers or planning system changes.",
    category: "Architecture",
    categoryColor: "#3b82f6",
    bestFor: "Engineering Teams",
    useCases: [
      "Onboard new engineers to your service topology",
      "Plan service decomposition and ownership boundaries",
      "Identify single points of failure in your architecture",
      "Document inter-service communication patterns",
    ],
    nodes: [
      { id: "gw", label: "API Gateway", type: "API", color: "cyan", x: 50, y: 8 },
      { id: "auth", label: "Auth Service", type: "Process", color: "green", x: 15, y: 30 },
      { id: "user", label: "User Service", type: "System", color: "blue", x: 38, y: 30 },
      { id: "order", label: "Order Service", type: "System", color: "blue", x: 62, y: 30 },
      { id: "payment", label: "Payment Service", type: "API", color: "cyan", x: 85, y: 30 },
      { id: "userdb", label: "User DB", type: "Database", color: "purple", x: 15, y: 58 },
      { id: "redis", label: "Redis Cache", type: "Cache", color: "red", x: 38, y: 58 },
      { id: "orderdb", label: "Order DB", type: "Database", color: "purple", x: 62, y: 58 },
      { id: "stripe", label: "Stripe", type: "Vendor", color: "yellow", x: 85, y: 58 },
      { id: "mq", label: "Message Queue", type: "Queue", color: "blue", x: 50, y: 80 },
      { id: "notif", label: "Notification Service", type: "Process", color: "green", x: 75, y: 80 },
      { id: "mon", label: "Monitoring", type: "Cloud", color: "indigo", x: 25, y: 80 },
    ],
    edges: [
      { from: "gw", to: "auth", color: "#06b6d4" },
      { from: "gw", to: "user", color: "#06b6d4" },
      { from: "gw", to: "order", color: "#06b6d4" },
      { from: "gw", to: "payment", color: "#06b6d4" },
      { from: "auth", to: "userdb", color: "#22c55e" },
      { from: "user", to: "userdb", color: "#3b82f6" },
      { from: "user", to: "redis", color: "#3b82f6" },
      { from: "order", to: "orderdb", color: "#3b82f6" },
      { from: "payment", to: "stripe", color: "#06b6d4" },
      { from: "order", to: "mq", color: "#3b82f6" },
      { from: "mq", to: "notif", color: "#2563eb" },
      { from: "auth", to: "mon", color: "#6366f1" },
      { from: "user", to: "mon", color: "#6366f1" },
      { from: "order", to: "mon", color: "#6366f1" },
    ],
  },
  {
    slug: "monolith-to-microservices",
    name: "Monolith to Microservices Migration",
    description: "Plan your migration from monolith to distributed services",
    longDescription: "Chart your migration path from a monolithic application to a microservices architecture. This template shows the legacy system alongside new services, shared databases versus dedicated stores, and migration dependencies. Use it to coordinate phased rollouts and track progress.",
    category: "Architecture",
    categoryColor: "#3b82f6",
    bestFor: "Engineering Teams",
    useCases: [
      "Plan phased migration from monolith to services",
      "Identify shared database dependencies to decouple",
      "Track which services have been fully migrated",
      "Communicate migration progress to stakeholders",
    ],
    nodes: [
      { id: "mono", label: "Legacy Monolith", type: "System", color: "blue", x: 20, y: 15 },
      { id: "gw", label: "API Gateway", type: "API", color: "cyan", x: 50, y: 15 },
      { id: "auth-ms", label: "Auth Microservice", type: "Process", color: "green", x: 15, y: 45 },
      { id: "user-ms", label: "User Microservice", type: "System", color: "blue", x: 40, y: 45 },
      { id: "order-ms", label: "Order Microservice", type: "System", color: "blue", x: 65, y: 45 },
      { id: "pay-ms", label: "Payment Microservice", type: "API", color: "cyan", x: 90, y: 45 },
      { id: "shareddb", label: "Shared Database", type: "Database", color: "purple", x: 20, y: 75, status: "warning" },
      { id: "newuserdb", label: "New User DB", type: "Database", color: "purple", x: 50, y: 75, status: "healthy" },
      { id: "neworderdb", label: "New Order DB", type: "Database", color: "purple", x: 80, y: 75, status: "healthy" },
    ],
    edges: [
      { from: "mono", to: "gw", color: "#3b82f6" },
      { from: "mono", to: "shareddb", color: "#ef4444" },
      { from: "gw", to: "auth-ms", color: "#06b6d4" },
      { from: "gw", to: "user-ms", color: "#06b6d4" },
      { from: "gw", to: "order-ms", color: "#06b6d4" },
      { from: "gw", to: "pay-ms", color: "#06b6d4" },
      { from: "auth-ms", to: "shareddb", color: "#f59e0b" },
      { from: "user-ms", to: "newuserdb", color: "#22c55e" },
      { from: "order-ms", to: "neworderdb", color: "#22c55e" },
      { from: "pay-ms", to: "neworderdb", color: "#8b5cf6" },
    ],
  },
  {
    slug: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "Visualize your build, test, and deployment workflow",
    longDescription: "Map your entire continuous integration and deployment pipeline from code commit to production. This template covers source control, build, test, containerization, staging, production, and monitoring stages. Great for documenting deployment processes and identifying bottlenecks.",
    category: "DevOps",
    categoryColor: "#22c55e",
    bestFor: "DevOps Teams",
    useCases: [
      "Document your full deployment pipeline end-to-end",
      "Identify slow or flaky stages in the pipeline",
      "Plan rollback procedures and monitoring hooks",
      "Onboard new DevOps engineers to the workflow",
    ],
    nodes: [
      { id: "repo", label: "GitHub Repo", type: "Vendor", color: "yellow", x: 10, y: 50 },
      { id: "build", label: "Build Server", type: "System", color: "blue", x: 28, y: 30 },
      { id: "test", label: "Test Runner", type: "Process", color: "green", x: 28, y: 70 },
      { id: "docker", label: "Docker Registry", type: "Cloud", color: "indigo", x: 46, y: 50 },
      { id: "staging", label: "Staging", type: "System", color: "blue", x: 64, y: 30 },
      { id: "prod", label: "Production", type: "System", color: "blue", x: 64, y: 70, status: "healthy" },
      { id: "monitor", label: "Monitoring", type: "Cloud", color: "indigo", x: 82, y: 50 },
      { id: "rollback", label: "Rollback", type: "Process", color: "green", x: 82, y: 80, status: "warning" },
    ],
    edges: [
      { from: "repo", to: "build", color: "#f59e0b" },
      { from: "repo", to: "test", color: "#f59e0b" },
      { from: "build", to: "docker", color: "#3b82f6" },
      { from: "test", to: "docker", color: "#22c55e" },
      { from: "docker", to: "staging", color: "#6366f1" },
      { from: "staging", to: "prod", color: "#3b82f6" },
      { from: "prod", to: "monitor", color: "#3b82f6" },
      { from: "monitor", to: "rollback", color: "#f59e0b" },
      { from: "rollback", to: "staging", color: "#22c55e" },
    ],
  },
  {
    slug: "data-flow-diagram",
    name: "Data Flow Diagram",
    description: "Trace how data moves through your systems",
    longDescription: "Follow data from user input through API layers, validation, storage, transformation, and analytics. This template helps you understand data lineage, spot processing bottlenecks, and ensure data integrity across your pipeline. Essential for data governance and debugging.",
    category: "Data Flow",
    categoryColor: "#06b6d4",
    bestFor: "Data & Engineering Teams",
    useCases: [
      "Map data lineage from ingestion to analytics",
      "Identify data transformation bottlenecks",
      "Document ETL pipelines for compliance audits",
      "Debug data quality issues across the pipeline",
    ],
    nodes: [
      { id: "input", label: "User Input", type: "Person", color: "pink", x: 10, y: 50 },
      { id: "api", label: "API Layer", type: "API", color: "cyan", x: 30, y: 30 },
      { id: "valid", label: "Validation", type: "Process", color: "green", x: 30, y: 70 },
      { id: "db", label: "Database", type: "Database", color: "purple", x: 50, y: 50 },
      { id: "etl", label: "ETL Pipeline", type: "Process", color: "green", x: 70, y: 30 },
      { id: "dw", label: "Data Warehouse", type: "Database", color: "purple", x: 70, y: 70 },
      { id: "dash", label: "Analytics Dashboard", type: "System", color: "blue", x: 90, y: 50 },
    ],
    edges: [
      { from: "input", to: "api", color: "#ec4899" },
      { from: "input", to: "valid", color: "#ec4899" },
      { from: "api", to: "db", color: "#06b6d4" },
      { from: "valid", to: "db", color: "#22c55e" },
      { from: "db", to: "etl", color: "#8b5cf6" },
      { from: "etl", to: "dw", color: "#22c55e" },
      { from: "dw", to: "dash", color: "#8b5cf6" },
    ],
  },
  {
    slug: "soc2-compliance-map",
    name: "SOC2 Compliance Map",
    description: "Map controls and evidence for SOC2 audit readiness",
    longDescription: "Visualize your SOC2 compliance posture by mapping data entry points, encryption layers, access controls, audit logs, and monitoring systems. This template helps security teams prepare for audits by showing how controls connect to the trust service criteria. Keep it updated as your infrastructure evolves.",
    category: "Compliance",
    categoryColor: "#8b5cf6",
    bestFor: "Security & Compliance Teams",
    useCases: [
      "Prepare evidence maps for SOC2 Type II audits",
      "Show auditors how controls connect across systems",
      "Identify gaps in your compliance posture",
      "Track remediation progress for audit findings",
    ],
    nodes: [
      { id: "entry", label: "User Data Entry", type: "Person", color: "pink", x: 10, y: 20 },
      { id: "gw", label: "API Gateway", type: "API", color: "cyan", x: 30, y: 20 },
      { id: "enc", label: "Auth & Encryption", type: "Process", color: "green", x: 50, y: 20 },
      { id: "appdb", label: "Application DB", type: "Database", color: "purple", x: 10, y: 50 },
      { id: "audit", label: "Audit Log", type: "Process", color: "green", x: 30, y: 50 },
      { id: "acl", label: "Access Control", type: "System", color: "blue", x: 50, y: 50 },
      { id: "backup", label: "Backup System", type: "Cloud", color: "indigo", x: 70, y: 50 },
      { id: "monitor", label: "Monitoring", type: "Cloud", color: "indigo", x: 90, y: 50 },
      { id: "dash", label: "Compliance Dashboard", type: "System", color: "blue", x: 50, y: 80 },
    ],
    edges: [
      { from: "entry", to: "gw", color: "#ec4899" },
      { from: "gw", to: "enc", color: "#06b6d4" },
      { from: "enc", to: "appdb", color: "#22c55e" },
      { from: "enc", to: "acl", color: "#22c55e" },
      { from: "appdb", to: "audit", color: "#8b5cf6" },
      { from: "acl", to: "audit", color: "#3b82f6" },
      { from: "appdb", to: "backup", color: "#8b5cf6" },
      { from: "audit", to: "dash", color: "#22c55e" },
      { from: "acl", to: "dash", color: "#3b82f6" },
      { from: "monitor", to: "dash", color: "#6366f1" },
      { from: "backup", to: "monitor", color: "#6366f1" },
    ],
  },
  {
    slug: "gdpr-data-flow",
    name: "GDPR Data Flow",
    description: "Track personal data processing across your organization",
    longDescription: "Map how personal data flows from EU users through consent management, processing, storage, and analytics. This template highlights consent gates, encryption boundaries, anonymization steps, and right-to-delete pathways required for GDPR compliance. Essential for Data Protection Officers and legal teams.",
    category: "Compliance",
    categoryColor: "#8b5cf6",
    bestFor: "Legal & Compliance Teams",
    useCases: [
      "Document lawful basis for each data processing step",
      "Map right-to-delete and data portability pathways",
      "Show regulators your data flow for DPIA assessments",
      "Identify where personal data is stored or processed",
    ],
    nodes: [
      { id: "user", label: "EU User", type: "Person", color: "pink", x: 10, y: 30 },
      { id: "consent", label: "Consent Manager", type: "Process", color: "green", x: 30, y: 30 },
      { id: "api", label: "API Layer", type: "API", color: "cyan", x: 50, y: 15 },
      { id: "store", label: "Encrypted Storage", type: "Database", color: "purple", x: 50, y: 50 },
      { id: "proc", label: "Data Processor", type: "System", color: "blue", x: 70, y: 30 },
      { id: "delete", label: "Right to Delete", type: "Process", color: "green", x: 70, y: 60 },
      { id: "analytics", label: "Analytics", type: "System", color: "blue", x: 90, y: 30 },
      { id: "anon", label: "Anonymizer", type: "Process", color: "green", x: 90, y: 60 },
    ],
    edges: [
      { from: "user", to: "consent", color: "#ec4899" },
      { from: "consent", to: "api", color: "#22c55e" },
      { from: "api", to: "store", color: "#06b6d4" },
      { from: "store", to: "proc", color: "#8b5cf6" },
      { from: "proc", to: "analytics", color: "#3b82f6" },
      { from: "store", to: "delete", color: "#8b5cf6" },
      { from: "analytics", to: "anon", color: "#3b82f6" },
      { from: "delete", to: "anon", color: "#22c55e" },
    ],
  },
  {
    slug: "hipaa-system-map",
    name: "HIPAA System Map",
    description: "Visualize PHI data flows and access controls",
    longDescription: "Map Protected Health Information (PHI) flows through your healthcare system, from patient portals to EHR systems, encrypted databases, and provider access. This template highlights encryption boundaries, audit trails, and backup systems required for HIPAA compliance.",
    category: "Compliance",
    categoryColor: "#8b5cf6",
    bestFor: "Healthcare IT & Compliance Teams",
    useCases: [
      "Document PHI data flows for HIPAA audits",
      "Map access controls and encryption boundaries",
      "Identify audit trail coverage gaps",
      "Plan secure backup and disaster recovery",
    ],
    nodes: [
      { id: "patient", label: "Patient Portal", type: "Person", color: "pink", x: 10, y: 30 },
      { id: "auth", label: "Auth Layer", type: "Process", color: "green", x: 30, y: 15 },
      { id: "ehr", label: "EHR System", type: "System", color: "blue", x: 50, y: 30 },
      { id: "encdb", label: "Encrypted DB", type: "Database", color: "purple", x: 30, y: 60 },
      { id: "audittrail", label: "Audit Trail", type: "Process", color: "green", x: 50, y: 60 },
      { id: "provider", label: "Provider Access", type: "Person", color: "pink", x: 70, y: 30 },
      { id: "backup", label: "Backup", type: "Cloud", color: "indigo", x: 70, y: 60 },
      { id: "comply", label: "Compliance Monitor", type: "System", color: "blue", x: 90, y: 45 },
    ],
    edges: [
      { from: "patient", to: "auth", color: "#ec4899" },
      { from: "auth", to: "ehr", color: "#22c55e" },
      { from: "ehr", to: "encdb", color: "#3b82f6" },
      { from: "ehr", to: "audittrail", color: "#3b82f6" },
      { from: "provider", to: "ehr", color: "#ec4899" },
      { from: "encdb", to: "backup", color: "#8b5cf6" },
      { from: "audittrail", to: "comply", color: "#22c55e" },
      { from: "backup", to: "comply", color: "#6366f1" },
    ],
  },
  {
    slug: "organization-chart",
    name: "Organization Chart",
    description: "Map team structure, reporting lines, and responsibilities",
    longDescription: "Visualize your company hierarchy from C-suite to individual teams. This template maps reporting lines, cross-functional relationships, and team boundaries. Use it for org planning, new hire orientation, or restructuring discussions.",
    category: "Organization",
    categoryColor: "#f97316",
    bestFor: "All Teams",
    useCases: [
      "Onboard new hires with a clear org overview",
      "Plan restructuring and team changes",
      "Identify reporting line bottlenecks",
      "Document cross-functional relationships",
    ],
    nodes: [
      { id: "ceo", label: "CEO", type: "Person", color: "pink", x: 50, y: 8 },
      { id: "cto", label: "CTO", type: "Person", color: "pink", x: 25, y: 30 },
      { id: "cpo", label: "CPO", type: "Person", color: "pink", x: 50, y: 30 },
      { id: "coo", label: "COO", type: "Person", color: "pink", x: 75, y: 30 },
      { id: "eng", label: "Engineering", type: "Team", color: "orange", x: 15, y: 55 },
      { id: "plat", label: "Platform", type: "Team", color: "orange", x: 35, y: 55 },
      { id: "prod", label: "Product", type: "Team", color: "orange", x: 50, y: 55 },
      { id: "design", label: "Design", type: "Team", color: "orange", x: 65, y: 55 },
      { id: "ops", label: "Operations", type: "Team", color: "orange", x: 85, y: 55 },
    ],
    edges: [
      { from: "ceo", to: "cto", color: "#ec4899" },
      { from: "ceo", to: "cpo", color: "#ec4899" },
      { from: "ceo", to: "coo", color: "#ec4899" },
      { from: "cto", to: "eng", color: "#ec4899" },
      { from: "cto", to: "plat", color: "#ec4899" },
      { from: "cpo", to: "prod", color: "#ec4899" },
      { from: "cpo", to: "design", color: "#ec4899" },
      { from: "coo", to: "ops", color: "#ec4899" },
    ],
  },
  {
    slug: "team-knowledge-map",
    name: "Team Knowledge Map",
    description: "Identify expertise distribution and knowledge gaps",
    longDescription: "Map which teams own which technologies and where knowledge gaps exist. This template connects teams to their core competencies, shared tools, and documentation. Use it to plan cross-training, identify bus-factor risks, and guide hiring decisions.",
    category: "Organization",
    categoryColor: "#f97316",
    bestFor: "Engineering Managers",
    useCases: [
      "Identify single-person knowledge dependencies (bus factor)",
      "Plan cross-training initiatives across teams",
      "Guide hiring based on expertise gaps",
      "Document technology ownership and expertise",
    ],
    nodes: [
      { id: "onboard", label: "Onboarding", type: "Process", color: "green", x: 50, y: 8 },
      { id: "fe", label: "Frontend", type: "Team", color: "orange", x: 20, y: 30 },
      { id: "be", label: "Backend", type: "Team", color: "orange", x: 50, y: 30 },
      { id: "devops", label: "DevOps", type: "Team", color: "orange", x: 80, y: 30 },
      { id: "react", label: "React", type: "Generic", color: "teal", x: 10, y: 60 },
      { id: "node", label: "Node.js", type: "Generic", color: "teal", x: 40, y: 60 },
      { id: "k8s", label: "Kubernetes", type: "Generic", color: "teal", x: 70, y: 60 },
      { id: "aws", label: "AWS", type: "Cloud", color: "indigo", x: 90, y: 60 },
      { id: "docs", label: "Documentation", type: "System", color: "blue", x: 50, y: 85 },
    ],
    edges: [
      { from: "onboard", to: "fe", color: "#22c55e" },
      { from: "onboard", to: "be", color: "#22c55e" },
      { from: "onboard", to: "devops", color: "#22c55e" },
      { from: "fe", to: "react", color: "#f97316" },
      { from: "be", to: "node", color: "#f97316" },
      { from: "devops", to: "k8s", color: "#f97316" },
      { from: "devops", to: "aws", color: "#f97316" },
      { from: "react", to: "docs", color: "#14b8a6" },
      { from: "node", to: "docs", color: "#14b8a6" },
      { from: "k8s", to: "docs", color: "#14b8a6" },
    ],
  },
  {
    slug: "vendor-dependency-map",
    name: "Vendor Dependency Map",
    description: "Track third-party vendors and their service dependencies",
    longDescription: "Map every external vendor your platform depends on, along with the specific services and infrastructure they provide. This template helps you assess vendor risk, plan for outages, and negotiate contracts by understanding the full dependency chain.",
    category: "Vendor",
    categoryColor: "#f59e0b",
    bestFor: "Engineering & Procurement Teams",
    useCases: [
      "Assess vendor concentration risk",
      "Plan for vendor outage scenarios",
      "Support contract renewal negotiations",
      "Document vendor dependencies for audits",
    ],
    nodes: [
      { id: "platform", label: "Our Platform", type: "System", color: "blue", x: 50, y: 15 },
      { id: "aws", label: "AWS", type: "Cloud", color: "indigo", x: 15, y: 40 },
      { id: "stripe", label: "Stripe", type: "Vendor", color: "yellow", x: 35, y: 40 },
      { id: "twilio", label: "Twilio", type: "Vendor", color: "yellow", x: 55, y: 40 },
      { id: "datadog", label: "Datadog", type: "Vendor", color: "yellow", x: 75, y: 40 },
      { id: "github", label: "GitHub", type: "Vendor", color: "yellow", x: 95, y: 40 },
      { id: "s3", label: "S3", type: "Database", color: "purple", x: 15, y: 70 },
      { id: "paydb", label: "Payment DB", type: "Database", color: "purple", x: 35, y: 70 },
      { id: "smsq", label: "SMS Queue", type: "Queue", color: "blue", x: 55, y: 70 },
      { id: "metrics", label: "Metrics", type: "System", color: "blue", x: 75, y: 70 },
    ],
    edges: [
      { from: "platform", to: "aws", color: "#3b82f6" },
      { from: "platform", to: "stripe", color: "#3b82f6" },
      { from: "platform", to: "twilio", color: "#3b82f6" },
      { from: "platform", to: "datadog", color: "#3b82f6" },
      { from: "platform", to: "github", color: "#3b82f6" },
      { from: "aws", to: "s3", color: "#6366f1" },
      { from: "stripe", to: "paydb", color: "#f59e0b" },
      { from: "twilio", to: "smsq", color: "#f59e0b" },
      { from: "datadog", to: "metrics", color: "#f59e0b" },
    ],
  },
  {
    slug: "supply-chain-risk-map",
    name: "Supply Chain Risk Map",
    description: "Assess risk across your supply chain dependencies",
    longDescription: "Visualize your supply chain from primary vendors to tier-2 suppliers, logistics, warehousing, and quality checkpoints. Status indicators highlight healthy, at-risk, and critical dependencies so you can prioritize mitigation efforts before disruptions hit.",
    category: "Vendor",
    categoryColor: "#f59e0b",
    bestFor: "Operations & Procurement Teams",
    useCases: [
      "Identify critical single-source dependencies",
      "Assess tier-2 supplier risk exposure",
      "Plan alternative sourcing strategies",
      "Monitor supply chain health in real time",
    ],
    nodes: [
      { id: "product", label: "Product", type: "System", color: "blue", x: 50, y: 10 },
      { id: "v1", label: "Primary Vendor", type: "Vendor", color: "yellow", x: 20, y: 35, status: "healthy" },
      { id: "v2", label: "Secondary Vendor", type: "Vendor", color: "yellow", x: 50, y: 35, status: "warning" },
      { id: "v3", label: "Tier 2 Supplier", type: "Vendor", color: "yellow", x: 80, y: 35, status: "critical" },
      { id: "logistics", label: "Logistics", type: "Process", color: "green", x: 20, y: 65 },
      { id: "warehouse", label: "Warehouse", type: "System", color: "blue", x: 50, y: 65 },
      { id: "qa", label: "Quality Check", type: "Process", color: "green", x: 80, y: 65 },
      { id: "customer", label: "End Customer", type: "Person", color: "pink", x: 50, y: 90 },
    ],
    edges: [
      { from: "product", to: "v1", color: "#3b82f6" },
      { from: "product", to: "v2", color: "#3b82f6" },
      { from: "product", to: "v3", color: "#3b82f6" },
      { from: "v1", to: "logistics", color: "#22c55e" },
      { from: "v2", to: "warehouse", color: "#f59e0b" },
      { from: "v3", to: "qa", color: "#ef4444" },
      { from: "logistics", to: "warehouse", color: "#22c55e" },
      { from: "warehouse", to: "qa", color: "#3b82f6" },
      { from: "qa", to: "customer", color: "#22c55e" },
      { from: "warehouse", to: "customer", color: "#3b82f6" },
    ],
  },
  {
    slug: "api-gateway-architecture",
    name: "API Gateway Architecture",
    description: "Map API routes, gateways, and backend services",
    longDescription: "Detail your API gateway setup including rate limiting, authentication, routing to backend APIs, and database connections. This template is perfect for documenting how external requests flow through your gateway to individual microservices and their data stores.",
    category: "Architecture",
    categoryColor: "#3b82f6",
    bestFor: "Backend Engineering Teams",
    useCases: [
      "Document API routing and rate limiting policies",
      "Plan gateway migration or consolidation",
      "Onboard backend engineers to the API layer",
      "Identify missing authentication or rate limit coverage",
    ],
    nodes: [
      { id: "client", label: "Client App", type: "System", color: "blue", x: 50, y: 8 },
      { id: "rate", label: "Rate Limiter", type: "Process", color: "green", x: 50, y: 25 },
      { id: "gw", label: "API Gateway", type: "API", color: "cyan", x: 50, y: 42 },
      { id: "auth", label: "Auth", type: "Process", color: "green", x: 20, y: 60 },
      { id: "users", label: "Users API", type: "API", color: "cyan", x: 40, y: 60 },
      { id: "orders", label: "Orders API", type: "API", color: "cyan", x: 60, y: 60 },
      { id: "products", label: "Products API", type: "API", color: "cyan", x: 80, y: 60 },
      { id: "userdb", label: "User DB", type: "Database", color: "purple", x: 30, y: 82 },
      { id: "orderdb", label: "Order DB", type: "Database", color: "purple", x: 60, y: 82 },
      { id: "productdb", label: "Product DB", type: "Database", color: "purple", x: 85, y: 82 },
    ],
    edges: [
      { from: "client", to: "rate", color: "#3b82f6" },
      { from: "rate", to: "gw", color: "#22c55e" },
      { from: "gw", to: "auth", color: "#06b6d4" },
      { from: "gw", to: "users", color: "#06b6d4" },
      { from: "gw", to: "orders", color: "#06b6d4" },
      { from: "gw", to: "products", color: "#06b6d4" },
      { from: "users", to: "userdb", color: "#06b6d4" },
      { from: "orders", to: "orderdb", color: "#06b6d4" },
      { from: "products", to: "productdb", color: "#06b6d4" },
      { from: "auth", to: "userdb", color: "#22c55e" },
    ],
  },
  {
    slug: "event-driven-architecture",
    name: "Event-Driven Architecture",
    description: "Visualize event producers, consumers, and message flows",
    longDescription: "Map your event-driven system showing producers, the central event bus, consumers, dead letter queues, and event stores. This template helps teams understand asynchronous message flows, retry mechanisms, and event sourcing patterns in their architecture.",
    category: "Architecture",
    categoryColor: "#3b82f6",
    bestFor: "Backend Engineering Teams",
    useCases: [
      "Document event schemas and routing rules",
      "Identify consumer lag and dead letter queue issues",
      "Plan event sourcing and CQRS patterns",
      "Onboard engineers to async message flows",
    ],
    nodes: [
      { id: "pa", label: "Producer A", type: "System", color: "blue", x: 10, y: 25 },
      { id: "pb", label: "Producer B", type: "System", color: "blue", x: 10, y: 60 },
      { id: "bus", label: "Event Bus", type: "Queue", color: "blue", x: 40, y: 42 },
      { id: "c1", label: "Consumer 1", type: "Process", color: "green", x: 70, y: 15 },
      { id: "c2", label: "Consumer 2", type: "Process", color: "green", x: 70, y: 42 },
      { id: "c3", label: "Consumer 3", type: "Process", color: "green", x: 70, y: 70 },
      { id: "dlq", label: "Dead Letter Queue", type: "Queue", color: "blue", x: 95, y: 42, status: "warning" },
      { id: "store", label: "Event Store", type: "Database", color: "purple", x: 40, y: 80 },
    ],
    edges: [
      { from: "pa", to: "bus", color: "#3b82f6" },
      { from: "pb", to: "bus", color: "#3b82f6" },
      { from: "bus", to: "c1", color: "#2563eb" },
      { from: "bus", to: "c2", color: "#2563eb" },
      { from: "bus", to: "c3", color: "#2563eb" },
      { from: "c1", to: "dlq", color: "#f59e0b" },
      { from: "c2", to: "dlq", color: "#f59e0b" },
      { from: "bus", to: "store", color: "#8b5cf6" },
    ],
  },
  {
    slug: "database-schema-dependencies",
    name: "Database Schema Dependencies",
    description: "Map table relationships, foreign keys, and data models",
    longDescription: "Visualize how your database tables relate through foreign keys, joins, and derived views. This template maps core entities like Users, Orders, Products, and Payments along with their downstream analytics views and reports. Essential for schema migration planning.",
    category: "Data Flow",
    categoryColor: "#06b6d4",
    bestFor: "Backend & Data Teams",
    useCases: [
      "Plan schema migrations with full dependency visibility",
      "Document foreign key relationships for new engineers",
      "Identify tables with high fan-out or coupling",
      "Map analytics views back to source tables",
    ],
    nodes: [
      { id: "users", label: "Users", type: "Database", color: "purple", x: 20, y: 20 },
      { id: "orders", label: "Orders", type: "Database", color: "purple", x: 50, y: 20 },
      { id: "products", label: "Products", type: "Database", color: "purple", x: 80, y: 20 },
      { id: "payments", label: "Payments", type: "Database", color: "purple", x: 20, y: 55 },
      { id: "reviews", label: "Reviews", type: "Database", color: "purple", x: 50, y: 55 },
      { id: "inventory", label: "Inventory", type: "Database", color: "purple", x: 80, y: 55 },
      { id: "views", label: "Analytics Views", type: "System", color: "blue", x: 35, y: 85 },
      { id: "reports", label: "Reports", type: "System", color: "blue", x: 65, y: 85 },
    ],
    edges: [
      { from: "users", to: "orders", color: "#8b5cf6" },
      { from: "users", to: "reviews", color: "#8b5cf6" },
      { from: "users", to: "payments", color: "#8b5cf6" },
      { from: "orders", to: "products", color: "#8b5cf6" },
      { from: "orders", to: "payments", color: "#8b5cf6" },
      { from: "products", to: "reviews", color: "#8b5cf6" },
      { from: "products", to: "inventory", color: "#8b5cf6" },
      { from: "payments", to: "views", color: "#3b82f6" },
      { from: "reviews", to: "views", color: "#3b82f6" },
      { from: "inventory", to: "reports", color: "#3b82f6" },
      { from: "orders", to: "reports", color: "#3b82f6" },
    ],
  },
  {
    slug: "cloud-infrastructure-map",
    name: "Cloud Infrastructure Map",
    description: "Map VPCs, subnets, load balancers, and cloud resources",
    longDescription: "Visualize your AWS (or any cloud) infrastructure from DNS and CDN through load balancers, compute clusters, serverless functions, databases, caches, and monitoring. This template helps DevOps teams document their cloud topology and plan infrastructure changes safely.",
    category: "DevOps",
    categoryColor: "#22c55e",
    bestFor: "DevOps & Platform Teams",
    useCases: [
      "Document cloud architecture for new team members",
      "Plan infrastructure scaling or migration",
      "Identify cost optimization opportunities",
      "Support disaster recovery planning",
    ],
    nodes: [
      { id: "dns", label: "Route 53", type: "Cloud", color: "indigo", x: 50, y: 8 },
      { id: "cdn", label: "CloudFront", type: "Cloud", color: "indigo", x: 50, y: 25 },
      { id: "alb", label: "ALB", type: "System", color: "blue", x: 50, y: 42 },
      { id: "ecs", label: "ECS Cluster", type: "Cloud", color: "indigo", x: 25, y: 60 },
      { id: "lambda", label: "Lambda", type: "Process", color: "green", x: 50, y: 60 },
      { id: "rds", label: "RDS", type: "Database", color: "purple", x: 75, y: 60 },
      { id: "s3", label: "S3", type: "Database", color: "purple", x: 25, y: 80 },
      { id: "elasticache", label: "ElastiCache", type: "Cache", color: "red", x: 50, y: 80 },
      { id: "cw", label: "CloudWatch", type: "Cloud", color: "indigo", x: 75, y: 80 },
    ],
    edges: [
      { from: "dns", to: "cdn", color: "#6366f1" },
      { from: "cdn", to: "alb", color: "#6366f1" },
      { from: "alb", to: "ecs", color: "#3b82f6" },
      { from: "alb", to: "lambda", color: "#3b82f6" },
      { from: "ecs", to: "rds", color: "#6366f1" },
      { from: "lambda", to: "rds", color: "#22c55e" },
      { from: "ecs", to: "s3", color: "#6366f1" },
      { from: "ecs", to: "elasticache", color: "#6366f1" },
      { from: "lambda", to: "cw", color: "#22c55e" },
      { from: "ecs", to: "cw", color: "#6366f1" },
    ],
  },
  {
    slug: "incident-response-runbook",
    name: "Incident Response Runbook",
    description: "Map escalation paths and response procedures",
    longDescription: "Visualize your incident response process from alert to post-mortem. This template maps triage decisions, priority-based routing (P1/P2/P3), escalation paths, mitigation steps, and monitoring feedback loops. Use it to train on-call engineers and reduce mean time to resolution.",
    category: "DevOps",
    categoryColor: "#22c55e",
    bestFor: "SRE & On-Call Teams",
    useCases: [
      "Train new on-call engineers on response procedures",
      "Reduce MTTR with clear escalation paths",
      "Document priority classification criteria",
      "Improve post-mortem process and feedback loops",
    ],
    nodes: [
      { id: "alert", label: "Alert Triggered", type: "System", color: "blue", x: 50, y: 8, status: "critical" },
      { id: "triage", label: "Triage", type: "Process", color: "green", x: 50, y: 25 },
      { id: "p1", label: "P1 Critical", type: "Process", color: "green", x: 20, y: 45, status: "critical" },
      { id: "p2", label: "P2 High", type: "Process", color: "green", x: 50, y: 45, status: "warning" },
      { id: "p3", label: "P3 Medium", type: "Process", color: "green", x: 80, y: 45, status: "healthy" },
      { id: "escalate", label: "Escalate", type: "Person", color: "pink", x: 20, y: 70 },
      { id: "mitigate", label: "Mitigate", type: "Process", color: "green", x: 50, y: 70 },
      { id: "monitor2", label: "Monitor", type: "Cloud", color: "indigo", x: 80, y: 70 },
      { id: "postmortem", label: "Post-Mortem", type: "Generic", color: "teal", x: 50, y: 90 },
    ],
    edges: [
      { from: "alert", to: "triage", color: "#ef4444" },
      { from: "triage", to: "p1", color: "#ef4444" },
      { from: "triage", to: "p2", color: "#f59e0b" },
      { from: "triage", to: "p3", color: "#22c55e" },
      { from: "p1", to: "escalate", color: "#ef4444" },
      { from: "p2", to: "mitigate", color: "#f59e0b" },
      { from: "p3", to: "monitor2", color: "#22c55e" },
      { from: "escalate", to: "mitigate", color: "#ec4899" },
      { from: "mitigate", to: "postmortem", color: "#22c55e" },
      { from: "monitor2", to: "postmortem", color: "#6366f1" },
    ],
  },
  {
    slug: "onboarding-knowledge-graph",
    name: "Onboarding Knowledge Graph",
    description: "Guide new hires through systems, tools, and processes",
    longDescription: "Map the complete onboarding journey from day one to independence. This template connects company overview, tech stack orientation, team introductions, codebase tours, dev environment setup, first PR, and mentor relationships. Helps managers ensure consistent, thorough onboarding.",
    category: "Organization",
    categoryColor: "#f97316",
    bestFor: "Engineering Managers & HR",
    useCases: [
      "Standardize onboarding across teams",
      "Track new hire progress through milestones",
      "Identify gaps in onboarding documentation",
      "Reduce time-to-productivity for new engineers",
    ],
    nodes: [
      { id: "newhire", label: "New Hire", type: "Person", color: "pink", x: 50, y: 8 },
      { id: "company", label: "Company Overview", type: "Generic", color: "teal", x: 20, y: 28 },
      { id: "tech", label: "Tech Stack", type: "System", color: "blue", x: 50, y: 28 },
      { id: "team", label: "Team Intro", type: "Team", color: "orange", x: 80, y: 28 },
      { id: "code", label: "Codebase Tour", type: "Process", color: "green", x: 15, y: 55 },
      { id: "devenv", label: "Dev Environment", type: "System", color: "blue", x: 40, y: 55 },
      { id: "firstpr", label: "First PR", type: "Process", color: "green", x: 65, y: 55 },
      { id: "mentor", label: "Mentor", type: "Person", color: "pink", x: 90, y: 55 },
      { id: "independent", label: "Independent", type: "Generic", color: "teal", x: 50, y: 82 },
    ],
    edges: [
      { from: "newhire", to: "company", color: "#ec4899" },
      { from: "newhire", to: "tech", color: "#ec4899" },
      { from: "newhire", to: "team", color: "#ec4899" },
      { from: "company", to: "code", color: "#14b8a6" },
      { from: "tech", to: "devenv", color: "#3b82f6" },
      { from: "team", to: "mentor", color: "#f97316" },
      { from: "code", to: "firstpr", color: "#22c55e" },
      { from: "devenv", to: "firstpr", color: "#3b82f6" },
      { from: "mentor", to: "firstpr", color: "#ec4899" },
      { from: "firstpr", to: "independent", color: "#22c55e" },
    ],
  },
  {
    slug: "third-party-integration-map",
    name: "Third-Party Integration Map",
    description: "Track external APIs, webhooks, and integration points",
    longDescription: "Map every third-party API your application integrates with, along with the internal flows they power. This template shows payment processing, authentication, email delivery, SMS notifications, and cloud storage integrations side by side for a complete picture of external dependencies.",
    category: "Vendor",
    categoryColor: "#f59e0b",
    bestFor: "Full-Stack Engineering Teams",
    useCases: [
      "Audit all external API dependencies in one view",
      "Plan for third-party service outages",
      "Document webhook endpoints and data flows",
      "Evaluate vendor lock-in across integrations",
    ],
    nodes: [
      { id: "app", label: "Our App", type: "System", color: "blue", x: 50, y: 15 },
      { id: "stripe", label: "Stripe API", type: "Vendor", color: "yellow", x: 15, y: 40 },
      { id: "google", label: "Google Auth", type: "Vendor", color: "yellow", x: 35, y: 40 },
      { id: "sendgrid", label: "SendGrid", type: "Vendor", color: "yellow", x: 55, y: 40 },
      { id: "twilio", label: "Twilio", type: "Vendor", color: "yellow", x: 75, y: 40 },
      { id: "s3", label: "AWS S3", type: "Cloud", color: "indigo", x: 95, y: 40 },
      { id: "payflow", label: "Payment Flow", type: "Process", color: "green", x: 15, y: 70 },
      { id: "authflow", label: "Auth Flow", type: "Process", color: "green", x: 35, y: 70 },
      { id: "emailflow", label: "Email Flow", type: "Process", color: "green", x: 55, y: 70 },
      { id: "smsflow", label: "SMS Flow", type: "Process", color: "green", x: 75, y: 70 },
    ],
    edges: [
      { from: "app", to: "stripe", color: "#3b82f6" },
      { from: "app", to: "google", color: "#3b82f6" },
      { from: "app", to: "sendgrid", color: "#3b82f6" },
      { from: "app", to: "twilio", color: "#3b82f6" },
      { from: "app", to: "s3", color: "#3b82f6" },
      { from: "stripe", to: "payflow", color: "#f59e0b" },
      { from: "google", to: "authflow", color: "#f59e0b" },
      { from: "sendgrid", to: "emailflow", color: "#f59e0b" },
      { from: "twilio", to: "smsflow", color: "#f59e0b" },
    ],
  },
];

/* ---- SLUG MAP ---- */
const slugToTemplate = new Map(templates.map((t) => [t.slug, t]));

/* ---- NODE ICON ---- */
function nodeIcon(type: string): string {
  switch (type) {
    case "Person": return "\u{1F464}";
    case "System": return "\u2B21";
    case "API": return "\u21C4";
    case "Database": return "\u{1F5C4}";
    case "Queue": return "\u2261";
    case "Cache": return "\u26A1";
    case "Process": return "\u2699";
    case "Cloud": return "\u2601";
    case "Vendor": return "\u{1F517}";
    case "Team": return "\u{1F465}";
    case "Generic": return "\u25CE";
    default: return "\u25CB";
  }
}

/* ============================================================
   TEMPLATE PREVIEW PAGE
   ============================================================ */
export default function TemplatePreviewPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const template = slugToTemplate.get(slug);

  const [scrolled, setScrolled] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Build a quick lookup for node positions */
  const nodeMap = new Map(template?.nodes.map((n) => [n.id, n]));

  /* Related templates: same category, excluding self, max 3 */
  const related = template
    ? templates.filter((t) => t.category === template.category && t.slug !== template.slug).slice(0, 3)
    : [];

  /* If not enough related from same category, fill from other categories */
  if (related.length < 3 && template) {
    const others = templates.filter(
      (t) => t.slug !== template.slug && !related.some((r) => r.slug === t.slug)
    );
    while (related.length < 3 && others.length > 0) {
      related.push(others.shift()!);
    }
  }

  /* ---- NOT FOUND ---- */
  if (!template) {
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
              <Link href="/auth/signup" className="lp-btn lp-btn--primary">
                Get Started <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </nav>

        <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 64, opacity: 0.3 }}>404</div>
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>Template not found</h1>
          <p style={{ color: "var(--t2)", fontSize: 16 }}>
            The template &quot;{slug}&quot; doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/templates-gallery"
            className="lp-btn lp-btn--primary"
            style={{ marginTop: 8 }}
          >
            <IconArrowLeft size={14} /> Browse All Templates
          </Link>
        </section>
      </div>
    );
  }

  /* ---- MAIN RENDER ---- */
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
            <Link href="/auth/signup" className="lp-btn lp-btn--primary">
              Get Started <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 40, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Link
            href="/templates-gallery"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--t2)",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              marginBottom: 24,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t2)")}
          >
            <IconArrowLeft size={14} /> All Templates
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 6,
              background: `${template.categoryColor}15`,
              color: template.categoryColor,
              border: `1px solid ${template.categoryColor}30`,
            }}>
              {template.category}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--t3)",
              fontFamily: "var(--font-mono)",
            }}>
              {template.nodes.length} nodes &middot; {template.edges.length} edges
            </span>
          </div>

          <h1 style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            marginBottom: 12,
          }}>
            {template.name}
          </h1>
          <p style={{
            fontSize: 18,
            color: "var(--t2)",
            lineHeight: 1.6,
            maxWidth: 640,
          }}>
            {template.description}
          </p>
        </div>
      </section>

      {/* FULL PREVIEW */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: 48 }}>
        <div className="lp-container">
          <div style={{
            background: "var(--bg4)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
            position: "relative",
            height: 500,
          }}>
            {/* Dot grid background */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.5,
            }} />

            {/* SVG Edges */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none",
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {template.edges.map((edge, i) => {
                const from = nodeMap.get(edge.from);
                const to = nodeMap.get(edge.to);
                if (!from || !to) return null;
                const isHighlighted =
                  hoveredNode === edge.from || hoveredNode === edge.to;
                return (
                  <line
                    key={i}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={edge.color}
                    strokeWidth={isHighlighted ? "0.5" : "0.3"}
                    opacity={hoveredNode ? (isHighlighted ? 0.9 : 0.15) : 0.5}
                    vectorEffect="non-scaling-stroke"
                    style={{ transition: "opacity 0.2s, stroke-width 0.2s" }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {template.nodes.map((node) => {
              const color = typeColors[node.type] || "var(--t3)";
              const isHovered = hoveredNode === node.id;
              const isConnected =
                hoveredNode !== null &&
                template.edges.some(
                  (e) =>
                    (e.from === hoveredNode && e.to === node.id) ||
                    (e.to === hoveredNode && e.from === node.id)
                );
              const dimmed = hoveredNode !== null && !isHovered && !isConnected;

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    position: "absolute",
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: isHovered ? 10 : 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    cursor: "default",
                    opacity: dimmed ? 0.25 : 1,
                    transition: "opacity 0.2s, transform 0.2s",
                    ...(isHovered ? { transform: "translate(-50%, -50%) scale(1.1)" } : {}),
                  }}
                >
                  {/* Node badge */}
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `color-mix(in srgb, ${color} 15%, transparent)`,
                    border: `1.5px solid color-mix(in srgb, ${color} 40%, transparent)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    position: "relative",
                    boxShadow: isHovered ? `0 0 20px color-mix(in srgb, ${color} 30%, transparent)` : "none",
                    transition: "box-shadow 0.2s",
                  }}>
                    <span style={{ lineHeight: 1 }}>{nodeIcon(node.type)}</span>

                    {/* Status dot */}
                    {node.status && (
                      <div style={{
                        position: "absolute",
                        top: -3,
                        right: -3,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: statusColors[node.status],
                        border: "2px solid var(--bg4)",
                        boxShadow: `0 0 6px ${statusColors[node.status]}`,
                      }} />
                    )}
                  </div>

                  {/* Label */}
                  <div style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "var(--t1)",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "-0.01em",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}>
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DETAILS SECTION */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: 80 }}>
        <div className="lp-container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}>
            {/* Left: Long description */}
            <Reveal>
              <div style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 32,
              }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
                  About This Template
                </h2>
                <p style={{
                  fontSize: 15,
                  color: "var(--t2)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}>
                  {template.longDescription}
                </p>

                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: `${template.categoryColor}10`,
                  border: `1px solid ${template.categoryColor}25`,
                }}>
                  <span style={{ fontSize: 12, color: "var(--t3)", fontWeight: 500 }}>Best for:</span>
                  <span style={{ fontSize: 13, color: template.categoryColor, fontWeight: 600 }}>
                    {template.bestFor}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Right: Use cases */}
            <Reveal>
              <div style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 32,
              }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
                  Use Cases
                </h2>
                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}>
                  {template.useCases.map((uc, i) => (
                    <li key={i} style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14,
                      color: "var(--t2)",
                      lineHeight: 1.5,
                    }}>
                      <span style={{
                        marginTop: 2,
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: "rgba(0,194,255,0.1)",
                        border: "1px solid rgba(0,194,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 6.5l3 3 5-6" />
                        </svg>
                      </span>
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Node Legend */}
          <Reveal>
            <div style={{
              marginTop: 32,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "24px 32px",
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--t3)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Node Types in This Template
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {Array.from(new Set(template.nodes.map((n) => n.type))).map((type) => (
                  <div key={type} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "var(--bg4)",
                    border: "1px solid var(--border)",
                  }}>
                    <span style={{ fontSize: 14 }}>{nodeIcon(type)}</span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: typeColors[type] || "var(--t2)",
                      fontFamily: "var(--font-mono)",
                    }}>
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: 80 }}>
        <div className="lp-container" style={{ textAlign: "center" }}>
          <Reveal>
            <div style={{
              background: "linear-gradient(135deg, rgba(0,194,255,0.08), rgba(99,102,241,0.08))",
              border: "1px solid var(--border2)",
              borderRadius: 20,
              padding: "48px 40px",
            }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
                Start with {template.name}
              </h2>
              <p style={{ fontSize: 16, color: "var(--t2)", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
                Get a pre-built map with {template.nodes.length} nodes and {template.edges.length} connections. Customize everything to match your actual architecture.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-btn--lg">
                  Use This Template <IconArrowRight size={16} />
                </Link>
                <Link href="/templates-gallery" className="lp-btn lp-btn--outline-lg">
                  Browse More Templates
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RELATED TEMPLATES */}
      {related.length > 0 && (
        <section style={{ position: "relative", zIndex: 1, paddingBottom: 100 }}>
          <div className="lp-container">
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
              Related Templates
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}>
              {related.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/templates-gallery/${rt.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      overflow: "hidden",
                      transition: "border-color 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor = "var(--border2)";
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Mini preview */}
                    <div style={{
                      height: 120,
                      background: "var(--bg4)",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        opacity: 0.4,
                      }} />
                      <svg
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {rt.edges.slice(0, 8).map((edge, ei) => {
                          const fn = rt.nodes.find((n) => n.id === edge.from);
                          const tn = rt.nodes.find((n) => n.id === edge.to);
                          if (!fn || !tn) return null;
                          return (
                            <line
                              key={ei}
                              x1={fn.x} y1={fn.y} x2={tn.x} y2={tn.y}
                              stroke={edge.color}
                              strokeWidth="0.3"
                              opacity="0.4"
                              vectorEffect="non-scaling-stroke"
                            />
                          );
                        })}
                      </svg>
                      {rt.nodes.slice(0, 8).map((node) => (
                        <div
                          key={node.id}
                          style={{
                            position: "absolute",
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: typeColors[node.type] || "var(--t3)",
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                            boxShadow: `0 0 6px ${typeColors[node.type] || "var(--t3)"}44`,
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ padding: "16px 20px 20px" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>
                        {rt.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.5 }}>
                        {rt.description}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
