export interface FolderNode {
  id: string;
  name: string;
  parentId: string | null;
  position: string;
  icon?: string | null;
  color?: string | null;
}

export type TreeRowType = "folder" | "map";

export interface TreeRow {
  type: TreeRowType;
  id: string;
  parentId: string | null;
  name: string;
  depth: number;
  hasChildren?: boolean;
  isOpen?: boolean;
  meta?: {
    nodeCount?: number;
    edgeCount?: number;
    updatedAt?: string;
    isShared?: boolean;
    mapType?: string;
  };
}
