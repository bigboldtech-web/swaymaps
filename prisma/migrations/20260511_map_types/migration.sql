-- ============================================================
-- Phase 4: Multi-format maps
-- ============================================================

CREATE TYPE "MapType" AS ENUM (
  'DEPENDENCY',
  'WHITEBOARD',
  'MINDMAP',
  'FLOWCHART',
  'KANBAN',
  'ORGCHART',
  'PRODUCTFLOW'
);

ALTER TABLE "DecodeMap" ADD COLUMN "mapType" "MapType" NOT NULL DEFAULT 'DEPENDENCY';
ALTER TABLE "DecodeMap" ADD COLUMN "canvasState" TEXT;

CREATE INDEX "DecodeMap_workspaceId_mapType_idx" ON "DecodeMap"("workspaceId", "mapType");
