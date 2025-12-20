import { NodeKind } from "./map";

export type AiMode = "new-board" | "expand-board";

export interface AiNodeIdea {
  title: string;
  kind?: NodeKind;
  tags?: string[];
  note?: string;
  summary?: string;
  importance?: "core" | "supporting";
}

export interface AiEdgeIdea {
  source: string;
  target: string;
  label?: string;
  rationale?: string;
}

export interface AiBrainstormPlan {
  title?: string;
  summary?: string;
  focusAreas?: string[];
  nodes: AiNodeIdea[];
  edges: AiEdgeIdea[];
}

export interface AiMapContext {
  title?: string;
  description?: string;
  nodes: {
    title: string;
    kind?: NodeKind;
    tags?: string[];
    note?: string;
  }[];
  edges: {
    source: string;
    target: string;
    label?: string;
  }[];
}

export interface AiBrainstormRequest {
  prompt: string;
  mode?: AiMode;
  mapContext?: AiMapContext;
  apiKey?: string;
}
