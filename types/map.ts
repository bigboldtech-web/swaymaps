export type NodeKind = "person" | "system" | "process" | "generic" | "database" | "api" | "queue" | "cache" | "cloud" | "team" | "vendor";

export type NodeStatus = "active" | "degraded" | "down" | "deprecated" | "planned" | "maintenance";
export type NodePriority = "critical" | "high" | "medium" | "low";

export interface MapNodeMeta {
  id: string;
  kind: NodeKind; // drives visuals/colors
  kindLabel: string; // editable pill label
  title: string;
  tags: string[];
  noteId: string;
  color?: string;
  position?: { x: number; y: number };
  // Extended metadata
  status?: NodeStatus;
  priority?: NodePriority;
  owner?: string;           // person/team responsible
  url?: string;             // link to external system/docs
  description?: string;     // short description (shown on hover)
  version?: string;         // version number (for systems/APIs)
  sla?: string;             // SLA tier (e.g. "99.99%", "P1 - 4h")
}

export interface Note {
  id: string;
  title: string;
  tags: string[];
  content: string;
  comments?: {
    id: string;
    author?: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type EdgeLineStyle = "solid" | "dashed" | "dotted";
export type EdgeRelationType =
  | "depends_on" | "calls" | "triggers" | "reads_from" | "writes_to"
  | "subscribes" | "publishes" | "authenticates" | "monitors"
  | "deploys_to" | "inherits" | "contains" | "proxies" | "custom";
export type EdgeDirection = "one-way" | "bidirectional";

export interface MapEdgeMeta {
  id: string;
  sourceId: string; // node id
  sourceHandle: string | null;
  targetId: string; // node id
  targetHandle: string | null;
  label?: string;
  noteId?: string | null;
  edgeType?: "default" | "smoothstep" | "straight" | "step";
  // Extended edge properties
  lineStyle?: EdgeLineStyle;
  color?: string;             // custom edge color
  animated?: boolean;         // show flow animation
  relationType?: EdgeRelationType;
  direction?: EdgeDirection;
  weight?: number;            // 1-5 thickness scale
  protocol?: string;          // e.g. "REST", "gRPC", "WebSocket", "Kafka"
  latency?: string;           // e.g. "< 50ms", "200-500ms"
  dataFlow?: string;          // e.g. "JSON", "Protobuf", "Events"
}

export interface DecodeMap {
  id: string;
  name: string;
  description?: string;
  ownerUserId?: string;
  sharedUserIds: string[];
  publicShareId?: string | null;
  workspaceId?: string;
  createdAt: string;
  updatedAt: string;
  nodes: MapNodeMeta[];
  edges: MapEdgeMeta[];
  notes: Note[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  color?: string;
  plan?: "free" | "pro" | "team";
}

export type WorkspaceRole = "owner" | "admin" | "editor" | "viewer";

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
}

export interface Workspace {
  id: string;
  name: string;
  ownerUserId: string;
  members: WorkspaceMember[];
}
