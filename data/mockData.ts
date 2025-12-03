import {
  CompanyProcess,
  DecodeEdge,
  DecodeNodeData,
  Issue,
  Person,
  ProductFeature,
  SystemTool
} from "../types";

export const people: Person[] = [
  {
    id: "p1",
    type: "person",
    name: "Rabina Khadka",
    roleTitle: "Head of Vendor Operations",
    department: "Ops",
    reportsToId: "p2",
    coreOutcomes: [
      "Shorten vendor onboarding cycle",
      "Improve compliance completion",
      "Increase vendor activation rate"
    ],
    responsibilities: "Leads vendor onboarding, compliance readiness, and CX playbooks.",
    systemsOwnedIds: ["s1", "s4"],
    featureIds: ["f1", "f5"],
    processIds: ["pr1", "pr4"],
    status: "Full-time"
  },
  {
    id: "p2",
    type: "person",
    name: "Leo Martinez",
    roleTitle: "VP Operations & CX",
    department: "Ops",
    coreOutcomes: [
      "Operational reliability",
      "Budget discipline",
      "Customer satisfaction"
    ],
    responsibilities: "Exec sponsor for operations, finance cadence, and customer programs.",
    systemsOwnedIds: ["s3"],
    featureIds: ["f4"],
    processIds: ["pr3"],
    status: "Full-time"
  },
  {
    id: "p3",
    type: "person",
    name: "Jia Chen",
    roleTitle: "Lead Engineer",
    department: "Tech",
    reportsToId: "p6",
    coreOutcomes: [
      "Reduce platform downtime",
      "Improve deployment cadence",
      "Keep incident MTTR under 30m"
    ],
    responsibilities: "Owns platform stability, observability, and payment integrations.",
    systemsOwnedIds: ["s3", "s5"],
    featureIds: ["f1", "f2", "f4", "f5", "f6"],
    processIds: ["pr2", "pr6"],
    status: "Full-time"
  },
  {
    id: "p4",
    type: "person",
    name: "Maya Patel",
    roleTitle: "Product Manager",
    department: "Product",
    reportsToId: "p2",
    coreOutcomes: [
      "Ship customer-facing wins",
      "Clarify requirements",
      "Prioritize value over scope"
    ],
    responsibilities: "Owns roadmap, alignment, and launches for customer-facing features.",
    systemsOwnedIds: ["s6"],
    featureIds: ["f2", "f3", "f6"],
    processIds: ["pr2"],
    status: "Full-time"
  },
  {
    id: "p5",
    type: "person",
    name: "Alex Rivera",
    roleTitle: "Data Analyst",
    department: "Data",
    reportsToId: "p6",
    coreOutcomes: [
      "Trustworthy metrics",
      "Stable reporting pipelines",
      "Proactive data quality alerts"
    ],
    responsibilities: "Maintains the warehouse, analytics, and data quality signals.",
    systemsOwnedIds: ["s2"],
    featureIds: ["f3"],
    processIds: ["pr5"],
    status: "Full-time"
  },
  {
    id: "p6",
    type: "person",
    name: "Samir Nordin",
    roleTitle: "CTO",
    department: "Tech",
    coreOutcomes: [
      "Reliable platform",
      "Clear technical strategy",
      "Team velocity"
    ],
    responsibilities: "Sets technical direction and coaches engineering, data, and IT.",
    systemsOwnedIds: [],
    featureIds: [],
    processIds: [],
    status: "Full-time"
  }
];

export const features: ProductFeature[] = [
  {
    id: "f1",
    type: "feature",
    area: "Vendor App",
    name: "Vendor Onboarding Portal",
    businessOwnerId: "p1",
    techOwnerId: "p3",
    status: "In Progress",
    health: "Needs Improvement",
    description: "Guides vendors through onboarding, compliance uploads, and tasks.",
    relatedProcessIds: ["pr1"],
    priority: "Now"
  },
  {
    id: "f2",
    type: "feature",
    area: "Consumer App",
    name: "Customer Account Experience",
    businessOwnerId: "p4",
    techOwnerId: "p3",
    status: "Live",
    health: "Working",
    description: "Account area for customers to manage subscriptions and billing.",
    relatedProcessIds: ["pr4"],
    priority: "Now"
  },
  {
    id: "f3",
    type: "feature",
    area: "Admin Panel",
    name: "Analytics Workspace",
    businessOwnerId: "p4",
    techOwnerId: "p5",
    status: "Planned",
    health: "Unknown",
    description: "Self-serve analytics views and operational dashboards.",
    relatedProcessIds: ["pr5"],
    priority: "Next"
  },
  {
    id: "f4",
    type: "feature",
    area: "Website",
    name: "Payment Reliability",
    businessOwnerId: "p2",
    techOwnerId: "p3",
    status: "In Progress",
    health: "Needs Improvement",
    description: "Improves payment flows, retries, and error handling across channels.",
    relatedProcessIds: ["pr2", "pr3"],
    priority: "Now"
  },
  {
    id: "f5",
    type: "feature",
    area: "Website",
    name: "Vendor Status Page",
    businessOwnerId: "p1",
    techOwnerId: "p3",
    status: "In Progress",
    health: "Broken",
    description: "Surface real-time onboarding and SLA status to vendors.",
    relatedProcessIds: ["pr2"],
    priority: "Next"
  },
  {
    id: "f6",
    type: "feature",
    area: "Other",
    name: "Knowledge Center",
    businessOwnerId: "p4",
    techOwnerId: "p3",
    status: "Live",
    health: "Working",
    description: "Centralized help content and SOPs for customers and vendors.",
    relatedProcessIds: ["pr4"],
    priority: "Later"
  }
];

export const processes: CompanyProcess[] = [
  {
    id: "pr1",
    type: "process",
    name: "Vendor Intake",
    category: "Vendor",
    trigger: "New vendor applies",
    primaryOwnerId: "p1",
    sla: "Within 48 hours",
    health: "Working",
    toolsUsedIds: ["s1", "s4"],
    sopLink: "https://example.com/sop/vendor-intake"
  },
  {
    id: "pr2",
    type: "process",
    name: "Incident Response",
    category: "Tech",
    trigger: "Monitor alert or downtime",
    primaryOwnerId: "p3",
    sla: "Acknowledge within 15 minutes",
    health: "Messy",
    toolsUsedIds: ["s5", "s3"],
    sopLink: "https://example.com/sop/incident-response"
  },
  {
    id: "pr3",
    type: "process",
    name: "Monthly Billing Reconciliation",
    category: "Finance",
    trigger: "Month end billing cycle",
    primaryOwnerId: "p2",
    sla: "Complete within 3 business days",
    health: "Working",
    toolsUsedIds: ["s3", "s2"]
  },
  {
    id: "pr4",
    type: "process",
    name: "Customer Support Triage",
    category: "Customer Journey",
    trigger: "Ticket created",
    primaryOwnerId: "p1",
    sla: "First response within 4 hours",
    health: "Messy",
    toolsUsedIds: ["s4", "s6"]
  },
  {
    id: "pr5",
    type: "process",
    name: "Data Quality Checks",
    category: "Data",
    trigger: "Daily 9am run",
    primaryOwnerId: "p5",
    sla: "Daily monitoring",
    health: "Broken",
    toolsUsedIds: ["s2", "s5"],
    sopLink: "https://example.com/sop/data-quality"
  },
  {
    id: "pr6",
    type: "process",
    name: "Release Management",
    category: "Tech",
    trigger: "New release ready",
    primaryOwnerId: "p3",
    sla: "Twice weekly train",
    health: "Working",
    toolsUsedIds: ["s5"]
  }
];

export const systems: SystemTool[] = [
  {
    id: "s1",
    type: "system",
    name: "Vendor Ops Console",
    systemType: "Internal",
    usedFor: "Track onboarding steps, tasks, and compliance state.",
    businessOwnerId: "p1",
    technicalOwnerId: "p3",
    criticality: "High",
    whoHasAccess: ["Ops", "Tech"],
    notes: "Key source of truth for vendor stage."
  },
  {
    id: "s2",
    type: "system",
    name: "Snowflake Warehouse",
    systemType: "External",
    usedFor: "Analytics, reporting, and financial extracts.",
    businessOwnerId: "p5",
    technicalOwnerId: "p3",
    criticality: "High",
    whoHasAccess: ["Data", "Tech", "Finance"],
    notes: "Feeds dashboards and billing audits."
  },
  {
    id: "s3",
    type: "system",
    name: "Stripe",
    systemType: "External",
    usedFor: "Payments, payouts, and billing reconciliation.",
    businessOwnerId: "p2",
    technicalOwnerId: "p3",
    criticality: "High",
    whoHasAccess: ["Finance", "Ops", "Tech"],
    notes: "Critical for revenue recognition."
  },
  {
    id: "s4",
    type: "system",
    name: "HubSpot CRM",
    systemType: "External",
    usedFor: "Customer and vendor communications.",
    businessOwnerId: "p1",
    technicalOwnerId: "p3",
    criticality: "Medium",
    whoHasAccess: ["Ops", "CX", "Marketing"]
  },
  {
    id: "s5",
    type: "system",
    name: "Grafana & Alerts",
    systemType: "Internal",
    usedFor: "Observability, alerts, and incident timelines.",
    businessOwnerId: "p3",
    technicalOwnerId: "p3",
    criticality: "High",
    whoHasAccess: ["Tech", "Data"],
    notes: "Primary incident signal source."
  },
  {
    id: "s6",
    type: "system",
    name: "Help Center CMS",
    systemType: "External",
    usedFor: "Serve documentation and SOP content.",
    businessOwnerId: "p4",
    technicalOwnerId: "p3",
    criticality: "Medium",
    whoHasAccess: ["Ops", "CX", "Marketing"]
  }
];

export const issues: Issue[] = [
  {
    id: "i1",
    type: "issue",
    title: "Vendors missing compliance docs",
    area: "Process",
    ownerId: "p1",
    relatedFeatureIds: ["f1"],
    relatedProcessIds: ["pr1"],
    relatedSystemIds: ["s1"],
    severity: "Medium",
    status: "In Progress",
    rootCause: "Process",
    notes: "Docs not requested early enough; add guardrails and reminders."
  },
  {
    id: "i2",
    type: "issue",
    title: "Checkout errors spike at 9pm",
    area: "Product",
    ownerId: "p3",
    relatedFeatureIds: ["f2", "f4"],
    relatedProcessIds: ["pr2"],
    relatedSystemIds: ["s3", "s5"],
    severity: "High",
    status: "Open",
    rootCause: "Tech",
    notes: "Likely tied to nightly job contention; need deeper logs."
  },
  {
    id: "i3",
    type: "issue",
    title: "Data freshness gaps",
    area: "System",
    ownerId: "p5",
    relatedFeatureIds: ["f3"],
    relatedProcessIds: ["pr5"],
    relatedSystemIds: ["s2"],
    severity: "Medium",
    status: "Open",
    rootCause: "Data",
    notes: "Warehouse lagging; monitor SLAs and optimize ingestion."
  },
  {
    id: "i4",
    type: "issue",
    title: "Support backlog growing",
    area: "People",
    ownerId: "p2",
    relatedFeatureIds: ["f2", "f6"],
    relatedProcessIds: ["pr4"],
    relatedSystemIds: ["s4", "s6"],
    severity: "Medium",
    status: "In Progress",
    rootCause: "People",
    notes: "Need better triage and self-serve coverage."
  },
  {
    id: "i5",
    type: "issue",
    title: "Payment settlement delays",
    area: "Process",
    ownerId: "p2",
    relatedFeatureIds: ["f4"],
    relatedProcessIds: ["pr3", "pr2"],
    relatedSystemIds: ["s3"],
    severity: "High",
    status: "In Progress",
    rootCause: "Process",
    notes: "Reconciliation steps are manual; retry logic missing."
  },
  {
    id: "i6",
    type: "issue",
    title: "Status page outdated",
    area: "Product",
    ownerId: "p4",
    relatedFeatureIds: ["f5", "f6"],
    relatedProcessIds: ["pr2"],
    relatedSystemIds: ["s6"],
    severity: "Low",
    status: "Open",
    rootCause: "Process",
    notes: "No automation after incidents; hook alerts into CMS."
  }
];

export const decodeEdges: DecodeEdge[] = [
  { id: "e1", sourceId: "p1", targetId: "p2", relationType: "reports_to", label: "Reports to" },
  { id: "e2", sourceId: "p3", targetId: "p6", relationType: "reports_to", label: "Reports to" },
  { id: "e3", sourceId: "p4", targetId: "p2", relationType: "reports_to", label: "Reports to" },
  { id: "e4", sourceId: "p5", targetId: "p6", relationType: "reports_to", label: "Reports to" },

  { id: "e5", sourceId: "p1", targetId: "f1", relationType: "owns", label: "Business owner" },
  { id: "e6", sourceId: "p3", targetId: "f1", relationType: "owns", label: "Tech owner" },
  { id: "e7", sourceId: "f1", targetId: "pr1", relationType: "depends_on", label: "Runs through" },
  { id: "e8", sourceId: "pr1", targetId: "s1", relationType: "uses", label: "Uses" },
  { id: "e9", sourceId: "f1", targetId: "s1", relationType: "uses", label: "Data source" },

  { id: "e10", sourceId: "p4", targetId: "f2", relationType: "owns", label: "Product owner" },
  { id: "e11", sourceId: "p3", targetId: "f2", relationType: "owns", label: "Tech owner" },
  { id: "e12", sourceId: "f2", targetId: "pr4", relationType: "depends_on", label: "Support" },
  { id: "e13", sourceId: "f2", targetId: "s4", relationType: "uses", label: "CRM" },

  { id: "e14", sourceId: "p4", targetId: "f3", relationType: "owns", label: "Product owner" },
  { id: "e15", sourceId: "p5", targetId: "f3", relationType: "owns", label: "Data lead" },
  { id: "e16", sourceId: "f3", targetId: "pr5", relationType: "depends_on", label: "Data pipeline" },
  { id: "e17", sourceId: "f3", targetId: "s2", relationType: "uses", label: "Warehouse" },

  { id: "e18", sourceId: "p2", targetId: "f4", relationType: "owns", label: "Business owner" },
  { id: "e19", sourceId: "p3", targetId: "f4", relationType: "owns", label: "Tech owner" },
  { id: "e20", sourceId: "f4", targetId: "pr2", relationType: "depends_on", label: "Incident flow" },
  { id: "e21", sourceId: "f4", targetId: "pr3", relationType: "depends_on", label: "Billing" },
  { id: "e22", sourceId: "f4", targetId: "s3", relationType: "uses", label: "Payments" },
  { id: "e23", sourceId: "f4", targetId: "s5", relationType: "uses", label: "Monitoring" },

  { id: "e24", sourceId: "p1", targetId: "f5", relationType: "owns", label: "Business owner" },
  { id: "e25", sourceId: "p3", targetId: "f5", relationType: "owns", label: "Tech owner" },
  { id: "e26", sourceId: "f5", targetId: "pr2", relationType: "depends_on", label: "Incident feed" },
  { id: "e27", sourceId: "f5", targetId: "s6", relationType: "uses", label: "CMS" },

  { id: "e28", sourceId: "p4", targetId: "f6", relationType: "owns", label: "Business owner" },
  { id: "e29", sourceId: "p3", targetId: "f6", relationType: "owns", label: "Tech owner" },
  { id: "e30", sourceId: "f6", targetId: "pr4", relationType: "depends_on", label: "Support content" },
  { id: "e31", sourceId: "f6", targetId: "s6", relationType: "uses", label: "CMS" },

  { id: "e32", sourceId: "p1", targetId: "pr1", relationType: "owns", label: "Owns process" },
  { id: "e33", sourceId: "p1", targetId: "pr4", relationType: "owns", label: "Owns process" },
  { id: "e34", sourceId: "p3", targetId: "pr2", relationType: "owns", label: "Owns process" },
  { id: "e35", sourceId: "p3", targetId: "pr6", relationType: "owns", label: "Owns process" },
  { id: "e36", sourceId: "p5", targetId: "pr5", relationType: "owns", label: "Owns process" },
  { id: "e37", sourceId: "p2", targetId: "pr3", relationType: "owns", label: "Owns process" },

  { id: "e38", sourceId: "p1", targetId: "s1", relationType: "owns", label: "System owner" },
  { id: "e39", sourceId: "p3", targetId: "s1", relationType: "owns", label: "Tech owner" },
  { id: "e40", sourceId: "p5", targetId: "s2", relationType: "owns", label: "Data owner" },
  { id: "e41", sourceId: "p3", targetId: "s2", relationType: "owns", label: "Tech owner" },
  { id: "e42", sourceId: "p2", targetId: "s3", relationType: "owns", label: "Business owner" },
  { id: "e43", sourceId: "p3", targetId: "s3", relationType: "owns", label: "Tech owner" },
  { id: "e44", sourceId: "p1", targetId: "s4", relationType: "owns", label: "Owner" },
  { id: "e45", sourceId: "p3", targetId: "s4", relationType: "owns", label: "Tech partner" },
  { id: "e46", sourceId: "p3", targetId: "s5", relationType: "owns", label: "Maintains" },
  { id: "e47", sourceId: "p4", targetId: "s6", relationType: "owns", label: "Content owner" },
  { id: "e48", sourceId: "p3", targetId: "s6", relationType: "owns", label: "Tech owner" },

  { id: "e49", sourceId: "pr2", targetId: "s5", relationType: "uses", label: "Monitoring" },
  { id: "e50", sourceId: "pr2", targetId: "s3", relationType: "uses", label: "Payments" },
  { id: "e51", sourceId: "pr3", targetId: "s3", relationType: "uses", label: "Billing" },
  { id: "e52", sourceId: "pr3", targetId: "s2", relationType: "uses", label: "Exports" },
  { id: "e53", sourceId: "pr4", targetId: "s4", relationType: "uses", label: "CRM" },
  { id: "e54", sourceId: "pr4", targetId: "s6", relationType: "uses", label: "Knowledge" },
  { id: "e55", sourceId: "pr5", targetId: "s2", relationType: "uses", label: "Warehouse" },
  { id: "e56", sourceId: "pr5", targetId: "s5", relationType: "uses", label: "Monitoring" },
  { id: "e57", sourceId: "pr6", targetId: "s5", relationType: "uses", label: "Release metrics" },

  { id: "e58", sourceId: "i1", targetId: "f1", relationType: "related_to", label: "Impacts" },
  { id: "e59", sourceId: "i1", targetId: "pr1", relationType: "related_to", label: "Rooted in process" },
  { id: "e60", sourceId: "i1", targetId: "s1", relationType: "related_to", label: "Data gaps" },

  { id: "e61", sourceId: "i2", targetId: "f4", relationType: "related_to", label: "Impacts" },
  { id: "e62", sourceId: "i2", targetId: "f2", relationType: "related_to", label: "Impacts" },
  { id: "e63", sourceId: "i2", targetId: "pr2", relationType: "related_to", label: "Incident" },
  { id: "e64", sourceId: "i2", targetId: "s3", relationType: "related_to", label: "Payments" },
  { id: "e65", sourceId: "i2", targetId: "s5", relationType: "related_to", label: "Monitoring" },

  { id: "e66", sourceId: "i3", targetId: "f3", relationType: "related_to", label: "Impacts" },
  { id: "e67", sourceId: "i3", targetId: "pr5", relationType: "related_to", label: "Root cause" },
  { id: "e68", sourceId: "i3", targetId: "s2", relationType: "related_to", label: "Warehouse" },

  { id: "e69", sourceId: "i4", targetId: "f2", relationType: "related_to", label: "Customer backlog" },
  { id: "e70", sourceId: "i4", targetId: "f6", relationType: "related_to", label: "Self-serve gap" },
  { id: "e71", sourceId: "i4", targetId: "pr4", relationType: "related_to", label: "Triage" },
  { id: "e72", sourceId: "i4", targetId: "s4", relationType: "related_to", label: "CRM" },
  { id: "e73", sourceId: "i4", targetId: "s6", relationType: "related_to", label: "Content" },

  { id: "e74", sourceId: "i5", targetId: "f4", relationType: "related_to", label: "Impacts" },
  { id: "e75", sourceId: "i5", targetId: "pr3", relationType: "related_to", label: "Billing ops" },
  { id: "e76", sourceId: "i5", targetId: "pr2", relationType: "related_to", label: "Incidents" },
  { id: "e77", sourceId: "i5", targetId: "s3", relationType: "related_to", label: "Payments" },

  { id: "e78", sourceId: "i6", targetId: "f5", relationType: "related_to", label: "Status page" },
  { id: "e79", sourceId: "i6", targetId: "f6", relationType: "related_to", label: "Content" },
  { id: "e80", sourceId: "i6", targetId: "pr2", relationType: "related_to", label: "Incident linkage" },
  { id: "e81", sourceId: "i6", targetId: "s6", relationType: "related_to", label: "CMS" }
];

export const decodeNodes: DecodeNodeData[] = [
  ...people,
  ...features,
  ...processes,
  ...systems,
  ...issues
];
