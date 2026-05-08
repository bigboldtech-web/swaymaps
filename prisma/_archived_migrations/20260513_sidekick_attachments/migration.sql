-- ============================================================
-- Phase 6: Sidekick attachments (image / PDF) for multi-modal input
-- ============================================================

CREATE TYPE "SidekickAttachmentKind" AS ENUM ('IMAGE', 'PDF');

CREATE TABLE "SidekickAttachment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "kind" "SidekickAttachmentKind" NOT NULL,
    "filename" TEXT,
    "mediaType" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SidekickAttachment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SidekickAttachment_userId_mapId_createdAt_idx"
  ON "SidekickAttachment"("userId", "mapId", "createdAt");

ALTER TABLE "SidekickAttachment"
  ADD CONSTRAINT "SidekickAttachment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SidekickAttachment"
  ADD CONSTRAINT "SidekickAttachment_mapId_fkey"
  FOREIGN KEY ("mapId") REFERENCES "DecodeMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
