export type Department =
  | "Ops"
  | "Marketing"
  | "Tech"
  | "Data"
  | "HR"
  | "Finance"
  | "CX"
  | string;

export type EntityType =
  | "person"
  | "feature"
  | "process"
  | "system"
  | "issue";

export interface Person {
  id: string;
  type: "person";
  name: string;
  roleTitle: string;
  department: Department;
  reportsToId?: string;
  coreOutcomes: string[];
  responsibilities: string;
  systemsOwnedIds: string[];
  featureIds: string[];
  processIds: string[];
  status: "Full-time" | "Part-time" | "Vendor" | "External";
}

export interface ProductFeature {
  id: string;
  type: "feature";
  area: "Website" | "Consumer App" | "Vendor App" | "Admin Panel" | "Other";
  name: string;
  businessOwnerId?: string;
  techOwnerId?: string;
  status: "Idea" | "Planned" | "In Progress" | "Live" | "Deprecated" | "On Hold";
  health: "Working" | "Needs Improvement" | "Broken" | "Unknown";
  description: string;
  relatedProcessIds: string[];
  priority: "Now" | "Next" | "Later";
}

export interface CompanyProcess {
  id: string;
  type: "process";
  name: string;
  category:
    | "Customer Journey"
    | "Vendor"
    | "Internal"
    | "HR"
    | "Finance"
    | "Tech"
    | string;
  trigger: string;
  primaryOwnerId?: string;
  sla: string;
  health: "Working" | "Messy" | "Broken" | "Unknown";
  toolsUsedIds: string[];
  sopLink?: string;
}

export interface SystemTool {
  id: string;
  type: "system";
  name: string;
  systemType: "Internal" | "External";
  usedFor: string;
  businessOwnerId?: string;
  technicalOwnerId?: string;
  criticality: "High" | "Medium" | "Low";
  whoHasAccess: string[];
  notes?: string;
}

export interface Issue {
  id: string;
  type: "issue";
  title: string;
  area: "People" | "Product" | "Process" | "System" | "Other";
  ownerId?: string;
  relatedFeatureIds: string[];
  relatedProcessIds: string[];
  relatedSystemIds: string[];
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved";
  rootCause: "People" | "Process" | "Tech" | "Data" | "Unknown";
  notes?: string;
}

export type DecodeNodeData =
  | Person
  | ProductFeature
  | CompanyProcess
  | SystemTool
  | Issue;

export type RelationType =
  | "owns"
  | "depends_on"
  | "uses"
  | "related_to"
  | "reports_to"
  | "impacted_by"
  | "blocks"
  | string;

export interface DecodeEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: RelationType;
  label?: string;
}

export interface EdgeWithEntities extends DecodeEdge {
  sourceEntity?: DecodeNodeData;
  targetEntity?: DecodeNodeData;
}
