import {
  Workflow,
  PenTool,
  Network,
  GitFork,
  KanbanSquare,
  Users,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export type MapTypeId =
  | "DEPENDENCY"
  | "WHITEBOARD"
  | "MINDMAP"
  | "FLOWCHART"
  | "KANBAN"
  | "ORGCHART"
  | "PRODUCTFLOW";

export interface MapTypeDef {
  id: MapTypeId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  blurb: string;
  description: string;
  examples: string[];
}

export const MAP_TYPES: MapTypeDef[] = [
  {
    id: "DEPENDENCY",
    label: "Dependency map",
    shortLabel: "Dependency",
    icon: Workflow,
    blurb: "Strongly-typed graphs of systems, services, and ownership.",
    description:
      "The flagship SwayMaps format. Connect systems, teams, and processes with strongly-typed relationships. Trace upstream and downstream impact in seconds.",
    examples: ["Service architecture", "Data lineage", "Vendor map", "Compliance flow"],
  },
  {
    id: "WHITEBOARD",
    label: "Whiteboard",
    shortLabel: "Whiteboard",
    icon: PenTool,
    blurb: "Infinite canvas with sticky notes, freehand, shapes, and text.",
    description:
      "An infinite, free-form canvas. Drop sticky notes, draw shapes, sketch ideas. The right format for brainstorming, retros, and workshops.",
    examples: ["Sprint retro", "Brainstorm", "Workshop", "Sticky-note storm"],
  },
  {
    id: "MINDMAP",
    label: "Mind map",
    shortLabel: "Mind map",
    icon: Network,
    blurb: "Radial node tree from a central topic, auto-laid out.",
    description:
      "A central topic with branches that fan out. Great for ideation, knowledge organization, and breaking down complex subjects.",
    examples: ["Strategic planning", "Knowledge tree", "Concept map", "Outline"],
  },
  {
    id: "FLOWCHART",
    label: "Flowchart",
    shortLabel: "Flowchart",
    icon: GitFork,
    blurb: "Process flows with start, decision, and action shapes.",
    description:
      "Standard flowchart shapes — start/end, decision, action, input/output. The right format for documenting business logic and procedures.",
    examples: ["Business process", "Decision logic", "Approval flow", "Algorithm"],
  },
  {
    id: "KANBAN",
    label: "Kanban board",
    shortLabel: "Kanban",
    icon: KanbanSquare,
    blurb: "Columns and cards for work-in-progress and planning.",
    description:
      "Drag cards across columns. The right format for sprint planning, retros, intake triage, or any backlog-driven workflow.",
    examples: ["Sprint board", "Roadmap", "Retro", "Intake queue"],
  },
  {
    id: "ORGCHART",
    label: "Org chart",
    shortLabel: "Org chart",
    icon: Users,
    blurb: "Hierarchical people tree with reporting lines.",
    description:
      "A clean reporting hierarchy. Click anyone to see their team, role, and ownership. Auto-laid out so the chart stays readable as the org grows.",
    examples: ["Reporting structure", "Team responsibilities", "Squad map"],
  },
  {
    id: "PRODUCTFLOW",
    label: "Product flow map",
    shortLabel: "Product flow",
    icon: Smartphone,
    blurb: "Document every screen, action, and state of an app or website.",
    description:
      "Map your product the way Instagram or Slack would internally — every screen as a card, every button as an action, every state transition explicit. The format for product, design, and support knowledge.",
    examples: ["App flow", "Onboarding journey", "Customer journey", "Support knowledge"],
  },
];

export const MAP_TYPE_BY_ID: Record<MapTypeId, MapTypeDef> = MAP_TYPES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<MapTypeId, MapTypeDef>
);

export function isGraphType(id: MapTypeId): boolean {
  return ["DEPENDENCY", "MINDMAP", "FLOWCHART", "ORGCHART", "PRODUCTFLOW"].includes(id);
}
