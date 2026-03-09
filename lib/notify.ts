import { prisma } from "./prisma";

interface NotifyParams {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
}

/** Send a notification to a single user */
export async function notify(params: NotifyParams) {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        link: params.link ?? null,
      },
    });
  } catch {
    console.error("[notify] Failed to create notification:", params.type);
  }
}

/** Notify all workspace members except the actor */
export async function notifyWorkspaceMembers(
  workspaceId: string,
  excludeUserId: string,
  notification: Omit<NotifyParams, "userId">
) {
  try {
    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      select: { userId: true },
    });
    const targets = members.filter((m) => m.userId !== excludeUserId);
    if (targets.length === 0) return;

    await prisma.notification.createMany({
      data: targets.map((m) => ({
        userId: m.userId,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        link: notification.link ?? null,
      })),
    });
  } catch {
    console.error("[notify] Failed to notify workspace members:", notification.type);
  }
}
