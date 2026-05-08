import { prisma } from "@/lib/prisma";
import { authenticateSCIM, scimError, scimJson } from "@/lib/scimAuth";

function toSCIMGroup(group: any) {
  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"],
    id: group.id,
    displayName: group.name,
    externalId: group.externalId ?? undefined,
    members: (group.members ?? []).map((u: any) => ({
      value: u.id,
      display: u.name,
    })),
    meta: {
      resourceType: "Group",
      created: group.createdAt.toISOString(),
      lastModified: group.updatedAt.toISOString(),
    },
  };
}

export async function GET(req: Request) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter") ?? undefined;
  const startIndex = parseInt(url.searchParams.get("startIndex") ?? "1", 10);
  const count = Math.min(parseInt(url.searchParams.get("count") ?? "100", 10), 500);

  const where: any = { workspaceId: auth.workspaceId };
  if (filter) {
    const m = filter.match(/displayName\s+eq\s+"([^"]+)"/i);
    if (m) where.name = m[1];
  }

  const [total, groups] = await Promise.all([
    prisma.group.count({ where }),
    prisma.group.findMany({
      where,
      include: { members: { select: { id: true, name: true, email: true } } },
      skip: Math.max(startIndex - 1, 0),
      take: count,
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return scimJson({
    schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    totalResults: total,
    startIndex,
    itemsPerPage: groups.length,
    Resources: groups.map(toSCIMGroup),
  });
}

export async function POST(req: Request) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body?.displayName) return scimError("displayName required", 400);

  const memberIds = (body.members ?? []).map((m: any) => m.value).filter(Boolean);

  const group = await prisma.group.create({
    data: {
      workspaceId: auth.workspaceId,
      name: body.displayName,
      externalId: body.externalId ?? null,
      members: memberIds.length > 0 ? { connect: memberIds.map((id: string) => ({ id })) } : undefined,
    },
    include: { members: { select: { id: true, name: true, email: true } } },
  });

  return scimJson(toSCIMGroup(group), 201);
}
