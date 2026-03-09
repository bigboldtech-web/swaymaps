import { prisma } from "./prisma";

export type ActivityAction =
  | "map.created"
  | "map.updated"
  | "map.deleted"
  | "map.shared"
  | "map.unshared"
  | "member.joined"
  | "member.removed"
  | "member.role_changed"
  | "invite.sent"
  | "invite.accepted"
  | "comment.added"
  | "version.created"
  | "version.restored";

export async function logActivity(params: {
  workspaceId: string;
  userId: string;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.activity.create({
      data: {
        workspaceId: params.workspaceId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch {
    // Non-critical — don't let logging failures break the main flow
    console.error("[activity-log] Failed to log activity:", params.action);
  }
}
