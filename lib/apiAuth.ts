import { prisma } from "./prisma";
import crypto from "crypto";

export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const key = `sm_${crypto.randomBytes(32).toString("hex")}`;
  const prefix = key.slice(0, 10);
  const hash = hashApiKey(key);
  return { key, prefix, hash };
}

export async function authenticateApiKey(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const key = authHeader.slice(7);
  const keyHash = hashApiKey(key);

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: { user: true, workspace: true },
  });

  if (!apiKey) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    userId: apiKey.userId,
    workspaceId: apiKey.workspaceId,
    permissions: apiKey.permissions,
    user: apiKey.user,
  };
}
