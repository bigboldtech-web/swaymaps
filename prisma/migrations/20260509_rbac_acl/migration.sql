-- ============================================================
-- Phase 2: RBAC enum + Folder ACL + Groups
-- ============================================================

-- ─── Enums ────────────────────────────────────────────────
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER', 'GUEST');
CREATE TYPE "FolderPermission" AS ENUM ('VIEW', 'EDIT', 'ADMIN');

-- ─── Migrate WorkspaceMember.role from String → Enum ─────
ALTER TABLE "WorkspaceMember" ADD COLUMN "role_new" "WorkspaceRole" NOT NULL DEFAULT 'EDITOR';
UPDATE "WorkspaceMember" SET "role_new" = CASE
  WHEN LOWER("role") = 'owner'  THEN 'OWNER'::"WorkspaceRole"
  WHEN LOWER("role") = 'admin'  THEN 'ADMIN'::"WorkspaceRole"
  WHEN LOWER("role") = 'editor' THEN 'EDITOR'::"WorkspaceRole"
  WHEN LOWER("role") = 'member' THEN 'EDITOR'::"WorkspaceRole"
  WHEN LOWER("role") = 'viewer' THEN 'VIEWER'::"WorkspaceRole"
  WHEN LOWER("role") = 'guest'  THEN 'GUEST'::"WorkspaceRole"
  ELSE 'EDITOR'::"WorkspaceRole"
END;
ALTER TABLE "WorkspaceMember" DROP COLUMN "role";
ALTER TABLE "WorkspaceMember" RENAME COLUMN "role_new" TO "role";

-- ─── Migrate WorkspaceInvite.role from String → Enum ─────
ALTER TABLE "WorkspaceInvite" ADD COLUMN "role_new" "WorkspaceRole" NOT NULL DEFAULT 'EDITOR';
UPDATE "WorkspaceInvite" SET "role_new" = CASE
  WHEN LOWER("role") = 'owner'  THEN 'OWNER'::"WorkspaceRole"
  WHEN LOWER("role") = 'admin'  THEN 'ADMIN'::"WorkspaceRole"
  WHEN LOWER("role") = 'editor' THEN 'EDITOR'::"WorkspaceRole"
  WHEN LOWER("role") = 'member' THEN 'EDITOR'::"WorkspaceRole"
  WHEN LOWER("role") = 'viewer' THEN 'VIEWER'::"WorkspaceRole"
  WHEN LOWER("role") = 'guest'  THEN 'GUEST'::"WorkspaceRole"
  ELSE 'EDITOR'::"WorkspaceRole"
END;
ALTER TABLE "WorkspaceInvite" DROP COLUMN "role";
ALTER TABLE "WorkspaceInvite" RENAME COLUMN "role_new" TO "role";

-- ─── Group ────────────────────────────────────────────────
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Group_workspaceId_idx" ON "Group"("workspaceId");
CREATE UNIQUE INDEX "Group_workspaceId_externalId_key" ON "Group"("workspaceId", "externalId");
ALTER TABLE "Group" ADD CONSTRAINT "Group_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── _GroupMembers (implicit M2M) ─────────────────────────
CREATE TABLE "_GroupMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);
CREATE UNIQUE INDEX "_GroupMembers_AB_unique" ON "_GroupMembers"("A", "B");
CREATE INDEX "_GroupMembers_B_index" ON "_GroupMembers"("B");
ALTER TABLE "_GroupMembers" ADD CONSTRAINT "_GroupMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_GroupMembers" ADD CONSTRAINT "_GroupMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── FolderACL ────────────────────────────────────────────
CREATE TABLE "FolderACL" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "userId" TEXT,
    "groupId" TEXT,
    "permission" "FolderPermission" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FolderACL_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FolderACL_folderId_idx" ON "FolderACL"("folderId");
CREATE UNIQUE INDEX "FolderACL_folderId_userId_key" ON "FolderACL"("folderId", "userId");
CREATE UNIQUE INDEX "FolderACL_folderId_groupId_key" ON "FolderACL"("folderId", "groupId");
ALTER TABLE "FolderACL" ADD CONSTRAINT "FolderACL_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FolderACL" ADD CONSTRAINT "FolderACL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FolderACL" ADD CONSTRAINT "FolderACL_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
