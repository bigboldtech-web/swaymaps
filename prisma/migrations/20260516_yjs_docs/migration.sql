-- ============================================================
-- Phase 8: Yjs CRDT — per-map document state for real-time collaboration
-- ============================================================

CREATE TABLE "MapYjsDoc" (
    "mapId" TEXT NOT NULL,
    "state" BYTEA NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MapYjsDoc_pkey" PRIMARY KEY ("mapId")
);

ALTER TABLE "MapYjsDoc"
  ADD CONSTRAINT "MapYjsDoc_mapId_fkey"
  FOREIGN KEY ("mapId") REFERENCES "DecodeMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
