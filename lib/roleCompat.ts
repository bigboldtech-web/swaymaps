import { WorkspaceRole } from "@prisma/client";

/**
 * UI uses lowercase role strings ("owner", "admin", etc.) for backwards
 * compatibility with the existing components. Prisma now uses an uppercase
 * enum. These helpers translate between the two at API boundaries.
 */

const TO_LOWER: Record<WorkspaceRole, string> = {
  OWNER: "owner",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
  GUEST: "guest",
};

const TO_UPPER: Record<string, WorkspaceRole> = {
  owner: "OWNER",
  admin: "ADMIN",
  editor: "EDITOR",
  member: "EDITOR",
  viewer: "VIEWER",
  guest: "GUEST",
};

export function roleToUi(role: WorkspaceRole): string {
  return TO_LOWER[role];
}

export function roleFromUi(role: string): WorkspaceRole {
  const key = role.toLowerCase();
  return TO_UPPER[key] ?? "EDITOR";
}
