-- ============================================================
-- Phase 7: MCP server connections + Sidekick scope expansion
-- ============================================================

-- Allow workspace + node-scoped Sidekick conversations
ALTER TABLE "SidekickConversation" ALTER COLUMN "mapId" DROP NOT NULL;
ALTER TABLE "SidekickConversation" ADD COLUMN "workspaceId" TEXT;
ALTER TABLE "SidekickConversation" ADD COLUMN "scopeKind" TEXT NOT NULL DEFAULT 'MAP';
ALTER TABLE "SidekickConversation" ADD COLUMN "focusNodeId" TEXT;

CREATE INDEX "SidekickConversation_workspaceId_userId_updatedAt_idx"
  ON "SidekickConversation"("workspaceId", "userId", "updatedAt");

ALTER TABLE "SidekickConversation"
  ADD CONSTRAINT "SidekickConversation_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "McpServer" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "authToken" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "McpServer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "McpServer_workspaceId_name_key" ON "McpServer"("workspaceId", "name");
CREATE INDEX "McpServer_workspaceId_enabled_idx" ON "McpServer"("workspaceId", "enabled");

ALTER TABLE "McpServer"
  ADD CONSTRAINT "McpServer_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
