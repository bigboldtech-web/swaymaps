import { DecodeMap, MapEdgeMeta, MapNodeMeta, Note, User, Workspace } from "../types/map";

const now = () => new Date().toISOString();

const vendorNodes: MapNodeMeta[] = [
  {
    id: "node-1",
    kind: "person",
    kindLabel: "Person",
    title: "Rabina Khadka",
    tags: ["ops", "lead"],
    noteId: "note-person-1",
    color: "#dbeafe",
    position: { x: 40, y: 40 }
  },
  {
    id: "node-2",
    kind: "system",
    kindLabel: "System",
    title: "Vendor App",
    tags: ["system"],
    noteId: "note-system-1",
    color: "#dcfce7",
    position: { x: 260, y: 80 }
  },
  {
    id: "node-3",
    kind: "process",
    kindLabel: "Process",
    title: "Customer Journey",
    tags: ["process"],
    noteId: "note-process-1",
    color: "#fef9c3",
    position: { x: 480, y: 120 }
  },
  {
    id: "node-4",
    kind: "generic",
    kindLabel: "Generic",
    title: "Analytics Workspace",
    tags: ["analytics"],
    noteId: "note-generic-1",
    color: "#f3f4f6",
    position: { x: 720, y: 160 }
  }
];

const vendorNotes: Note[] = [
  {
    id: "note-person-1",
    title: "Rabina Khadka",
    tags: ["ops", "owner"],
    content:
      "Leads vendor onboarding.\n\nimg:https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400\n\nKey focus: shorten onboarding cycle, improve compliance.",
    createdAt: now(),
    updatedAt: now()
  },
  {
    id: "note-system-1",
    title: "Vendor App",
    tags: ["system", "vendor"],
    content:
      "Customer-facing portal for vendors. Docs: https://example.com/vendor-app\n\n![Status](https://dummyimage.com/300x80/0ea5e9/ffffff&text=Healthy)",
    createdAt: now(),
    updatedAt: now()
  },
  {
    id: "note-process-1",
    title: "Customer Journey",
    tags: ["process", "journey"],
    content:
      "Maps the onboarding to activation journey. Steps:\n- Intake\n- Verification\n- Activation",
    createdAt: now(),
    updatedAt: now()
  },
  {
    id: "note-generic-1",
    title: "Analytics Workspace",
    tags: ["generic", "analytics"],
    content: "Central place to review KPIs.\n\nDashboard mock: https://example.com/dashboard.png",
    createdAt: now(),
    updatedAt: now()
  }
];

const vendorEdges: MapEdgeMeta[] = [
  { id: "edge-1", sourceId: "node-1", targetId: "node-2", label: "owns" },
  { id: "edge-2", sourceId: "node-2", targetId: "node-3", label: "supports" },
  { id: "edge-3", sourceId: "node-3", targetId: "node-4", label: "feeds" }
];

const supportNodes: MapNodeMeta[] = [
  {
    id: "s-node-1",
    kind: "person",
    kindLabel: "Agent",
    title: "CX Agent",
    tags: ["cx"],
    noteId: "s-note-1",
    color: "#dbeafe",
    position: { x: 40, y: 40 }
  },
  {
    id: "s-node-2",
    kind: "system",
    kindLabel: "System",
    title: "Help Center",
    tags: ["docs"],
    noteId: "s-note-2",
    color: "#dcfce7",
    position: { x: 260, y: 60 }
  },
  {
    id: "s-node-3",
    kind: "process",
    kindLabel: "Workflow",
    title: "Ticket Triage",
    tags: ["triage", "sla"],
    noteId: "s-note-3",
    color: "#fef9c3",
    position: { x: 520, y: 120 }
  }
];

const supportNotes: Note[] = [
  {
    id: "s-note-1",
    title: "CX Agent",
    tags: ["shift-a"],
    content: "Handles inbound tickets for vendors.",
    createdAt: now(),
    updatedAt: now()
  },
  {
    id: "s-note-2",
    title: "Help Center",
    tags: ["docs", "self-serve"],
    content: "Self-serve knowledge base. img:https://dummyimage.com/400x120/f1f5f9/0f172a&text=Docs",
    createdAt: now(),
    updatedAt: now()
  },
  {
    id: "s-note-3",
    title: "Ticket Triage",
    tags: ["sla"],
    content: "First response within 4 hours. See SOP: https://example.com/triage-sop",
    createdAt: now(),
    updatedAt: now()
  }
];

const supportEdges: MapEdgeMeta[] = [
  { id: "s-edge-1", sourceId: "s-node-1", targetId: "s-node-2", label: "uses" },
  { id: "s-edge-2", sourceId: "s-node-1", targetId: "s-node-3", label: "runs" },
  { id: "s-edge-3", sourceId: "s-node-2", targetId: "s-node-3", label: "documents" }
];

export const initialUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Rivera",
    email: "alex@demo.com",
    color: "#0ea5e9",
    plan: "free"
  },
  {
    id: "user-2",
    name: "Maya Patel",
    email: "maya@demo.com",
    color: "#f59e0b",
    plan: "pro"
  }
];

export const initialWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Ops Team",
    ownerUserId: "user-1",
    members: [
      { userId: "user-1", role: "owner" },
      { userId: "user-2", role: "editor" }
    ]
  }
];

export const initialMaps: DecodeMap[] = [
  {
    id: "map-1",
    name: "Vendor Onboarding",
    description: "Vendors, systems, and onboarding flows",
    ownerUserId: "user-1",
    sharedUserIds: ["user-2"],
    workspaceId: "ws-1",
    createdAt: now(),
    updatedAt: now(),
    nodes: vendorNodes,
    edges: vendorEdges,
    notes: vendorNotes
  },
  {
    id: "map-2",
    name: "Support Flow",
    description: "CX support and docs",
    ownerUserId: "user-2",
    sharedUserIds: ["user-1"],
    workspaceId: "ws-1",
    createdAt: now(),
    updatedAt: now(),
    nodes: supportNodes,
    edges: supportEdges,
    notes: supportNotes
  }
];
