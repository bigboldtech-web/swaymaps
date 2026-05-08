import { prisma } from "./prisma";
import crypto from "crypto";

/**
 * Validate a Bearer SCIM token. Returns the workspaceId + token row if valid.
 */
export async function authenticateSCIM(authHeader: string | null): Promise<
  | { workspaceId: string; tokenId: string; defaultRole: string }
  | null
> {
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const row = await prisma.sCIMToken.findUnique({ where: { tokenHash } });
  if (!row) return null;

  // Touch lastUsedAt asynchronously; don't block the request on it.
  prisma.sCIMToken
    .update({ where: { id: row.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});

  return {
    workspaceId: row.workspaceId,
    tokenId: row.id,
    defaultRole: row.defaultRole,
  };
}

export function generateSCIMToken(): { token: string; tokenHash: string; tokenPrefix: string } {
  const token = `scim_${crypto.randomBytes(24).toString("hex")}`;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const tokenPrefix = token.slice(0, 12);
  return { token, tokenHash, tokenPrefix };
}

/**
 * Standard SCIM error envelope.
 */
export function scimError(detail: string, status: number) {
  return new Response(
    JSON.stringify({
      schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"],
      detail,
      status: String(status),
    }),
    {
      status,
      headers: { "Content-Type": "application/scim+json" },
    }
  );
}

export function scimJson(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/scim+json" },
  });
}
