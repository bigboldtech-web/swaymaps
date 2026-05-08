/**
 * Role-based access control for SwayMaps.
 *
 * Workspace-scoped permissions live in the matrix below.
 * Folder-scoped checks combine workspace role + per-folder ACL
 * via resolveFolderPermission() in lib/folderPermissions.ts.
 */

import { WorkspaceRole, FolderPermission } from "@prisma/client";
import { prisma } from "./prisma";

export const WORKSPACE_ROLES: WorkspaceRole[] = [
  "OWNER",
  "ADMIN",
  "EDITOR",
  "VIEWER",
  "GUEST",
];

export const PERMISSIONS = {
  // Workspace lifecycle
  "workspace.delete":          ["OWNER"],
  "workspace.transfer":        ["OWNER"],
  "workspace.billing":         ["OWNER"],
  "workspace.settings.update": ["OWNER", "ADMIN"],

  // Member management
  "members.invite":            ["OWNER", "ADMIN"],
  "members.remove":            ["OWNER", "ADMIN"],
  "members.role.change":       ["OWNER", "ADMIN"],
  "members.read":              ["OWNER", "ADMIN", "EDITOR", "VIEWER"],

  // SSO / SCIM (Phase 3 surface)
  "sso.configure":             ["OWNER", "ADMIN"],
  "sso.read":                  ["OWNER", "ADMIN"],
  "scim.tokens.manage":        ["OWNER", "ADMIN"],

  // API keys & integrations
  "apikeys.manage":            ["OWNER", "ADMIN"],
  "integrations.manage":       ["OWNER", "ADMIN"],

  // Audit
  "audit.read":                ["OWNER", "ADMIN"],
  "audit.export":              ["OWNER", "ADMIN"],

  // Folders (workspace-level — per-folder ACL refines this)
  "folder.create":             ["OWNER", "ADMIN", "EDITOR"],
  "folder.delete":             ["OWNER", "ADMIN", "EDITOR"],
  "folder.rename":             ["OWNER", "ADMIN", "EDITOR"],
  "folder.move":               ["OWNER", "ADMIN", "EDITOR"],
  "folder.acl.manage":         ["OWNER", "ADMIN"],

  // Maps (workspace-level — per-folder ACL refines this)
  "map.create":                ["OWNER", "ADMIN", "EDITOR"],
  "map.delete":                ["OWNER", "ADMIN", "EDITOR"],
  "map.rename":                ["OWNER", "ADMIN", "EDITOR"],
  "map.move":                  ["OWNER", "ADMIN", "EDITOR"],
  "map.share":                 ["OWNER", "ADMIN", "EDITOR"],
  "map.read":                  ["OWNER", "ADMIN", "EDITOR", "VIEWER"],
  "map.edit":                  ["OWNER", "ADMIN", "EDITOR"],
} as const satisfies Record<string, WorkspaceRole[]>;

export type Permission = keyof typeof PERMISSIONS;

/** Pure, sync check — does role have permission? */
export function can(role: WorkspaceRole | null | undefined, perm: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[perm] as readonly WorkspaceRole[]).includes(role);
}

/**
 * Resolve a user's effective workspace role.
 * - Workspace owner is always OWNER, even if not in WorkspaceMember.
 * - Otherwise reads the WorkspaceMember row.
 * - Returns null if the user is neither owner nor member.
 */
export async function getWorkspaceRole(
  userId: string,
  workspaceId: string
): Promise<WorkspaceRole | null> {
  const ws = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { ownerId: true },
  });
  if (!ws) return null;
  if (ws.ownerId === userId) return "OWNER";
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    select: { role: true },
  });
  return member?.role ?? null;
}

/**
 * Throw a typed error if the user lacks the permission.
 * Use inside API routes after auth resolution.
 */
export class PermissionDeniedError extends Error {
  status = 403;
  constructor(public permission: Permission) {
    super(`Missing permission: ${permission}`);
  }
}

export async function requirePerm(
  userId: string,
  workspaceId: string,
  perm: Permission
): Promise<WorkspaceRole> {
  const role = await getWorkspaceRole(userId, workspaceId);
  if (!can(role, perm)) throw new PermissionDeniedError(perm);
  return role!;
}

/**
 * Map between FolderPermission strength.
 * ADMIN > EDIT > VIEW
 */
export const FOLDER_PERM_RANK: Record<FolderPermission, number> = {
  VIEW: 1,
  EDIT: 2,
  ADMIN: 3,
};

export function meetsFolderPerm(
  have: FolderPermission | null,
  needed: FolderPermission
): boolean {
  if (!have) return false;
  return FOLDER_PERM_RANK[have] >= FOLDER_PERM_RANK[needed];
}
