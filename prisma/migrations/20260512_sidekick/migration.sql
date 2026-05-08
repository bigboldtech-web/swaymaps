-- ============================================================
-- Phase 5: AI Sidekick — graph-aware agent for dependency maps
-- ============================================================

CREATE TYPE "SidekickRole" AS ENUM ('USER', 'ASSISTANT');

CREATE TABLE "SidekickConversation" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SidekickConversation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SidekickConversation_mapId_userId_updatedAt_idx"
  ON "SidekickConversation"("mapId", "userId", "updatedAt");

ALTER TABLE "SidekickConversation"
  ADD CONSTRAINT "SidekickConversation_mapId_fkey"
  FOREIGN KEY ("mapId") REFERENCES "DecodeMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SidekickConversation"
  ADD CONSTRAINT "SidekickConversation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "SidekickMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "SidekickRole" NOT NULL,
    "content" TEXT NOT NULL,
    "usage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SidekickMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SidekickMessage_conversationId_createdAt_idx"
  ON "SidekickMessage"("conversationId", "createdAt");

ALTER TABLE "SidekickMessage"
  ADD CONSTRAINT "SidekickMessage_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "SidekickConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
