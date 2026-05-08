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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const group = await prisma.group.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
    include: { members: { select: { id: true, name: true, email: true } } },
  });
  if (!group) return scimError("Not found", 404);
  return scimJson(toSCIMGroup(group));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  if (!body) return scimError("Invalid body", 400);

  const memberIds: string[] = (body.members ?? [])
    .map((m: any) => m.value)
    .filter(Boolean);

  const group = await prisma.group.update({
    where: { id: params.id },
    data: {
      name: body.displayName,
      externalId: body.externalId ?? null,
      members: { set: memberIds.map((id) => ({ id })) },
    },
    include: { members: { select: { id: true, name: true, email: true } } },
  });
  return scimJson(toSCIMGroup(group));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const body = await req.json().catch(() => null);
  const ops: any[] = body?.Operations ?? [];

  for (const op of ops) {
    const operation = op.op?.toLowerCase();
    const path = op.path?.toLowerCase();
    if (operation === "add" && path === "members") {
      const ids = (op.value ?? []).map((m: any) => m.value).filter(Boolean);
      if (ids.length)
        await prisma.group.update({
          where: { id: params.id },
          data: { members: { connect: ids.map((id: string) => ({ id })) } },
        });
    } else if (operation === "remove" && path === "members") {
      // Path-based remove: members[value eq "user-id"]
      const m = op.path.match(/members\[value\s+eq\s+"([^"]+)"\]/i);
      if (m) {
        await prisma.group.update({
          where: { id: params.id },
          data: { members: { disconnect: { id: m[1] } } },
        });
      } else {
        const ids = (op.value ?? []).map((mm: any) => mm.value).filter(Boolean);
        if (ids.length)
          await prisma.group.update({
            where: { id: params.id },
            data: { members: { disconnect: ids.map((id: string) => ({ id })) } },
          });
      }
    } else if (operation === "replace" && (path === "displayname" || !path)) {
      const newName = op.value?.displayName ?? op.value;
      if (typeof newName === "string") {
        await prisma.group.update({ where: { id: params.id }, data: { name: newName } });
      }
    }
  }

  const fresh = await prisma.group.findUnique({
    where: { id: params.id },
    include: { members: { select: { id: true, name: true, email: true } } },
  });
  if (!fresh) return scimError("Not found", 404);
  return scimJson(toSCIMGroup(fresh));
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateSCIM(req.headers.get("authorization"));
  if (!auth) return scimError("Unauthorized", 401);

  const group = await prisma.group.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });
  if (!group) return scimError("Not found", 404);
  await prisma.group.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
