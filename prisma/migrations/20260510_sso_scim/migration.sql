-- ============================================================
-- Phase 3: SSO connections + SCIM tokens
-- ============================================================

CREATE TABLE "SSOConnection" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jacksonTenant" TEXT NOT NULL,
    "jacksonProduct" TEXT NOT NULL DEFAULT 'swaymaps',
    "metadata" TEXT,
    "defaultRole" "WorkspaceRole" NOT NULL DEFAULT 'EDITOR',
    "enforced" BOOLEAN NOT NULL DEFAULT false,
    "domains" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SSOConnection_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SSOConnection_workspaceId_idx" ON "SSOConnection"("workspaceId");
CREATE INDEX "SSOConnection_jacksonTenant_idx" ON "SSOConnection"("jacksonTenant");
ALTER TABLE "SSOConnection" ADD CONSTRAINT "SSOConnection_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "SCIMToken" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenPrefix" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultRole" "WorkspaceRole" NOT NULL DEFAULT 'EDITOR',
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SCIMToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SCIMToken_tokenHash_key" ON "SCIMToken"("tokenHash");
CREATE INDEX "SCIMToken_workspaceId_idx" ON "SCIMToken"("workspaceId");
ALTER TABLE "SCIMToken" ADD CONSTRAINT "SCIMToken_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
