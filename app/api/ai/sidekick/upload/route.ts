import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireMapPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per file
const ALLOWED_IMAGE = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
const ALLOWED_PDF = ["application/pdf"];

/**
 * POST /api/ai/sidekick/upload
 *
 * multipart/form-data:
 *   - mapId: string
 *   - file:  binary (image/* or application/pdf)
 *
 * Returns the attachment id; the client passes it on the next sidekick
 * message. Server reads the bytes back when invoking Claude — never trusts
 * client-provided base64.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Multipart body required" }, { status: 400 });

  const mapId = form.get("mapId");
  const fileEntry = form.get("file");
  if (typeof mapId !== "string" || !(fileEntry instanceof File)) {
    return NextResponse.json({ error: "mapId and file required" }, { status: 400 });
  }

  try {
    await requireMapPerm(userId, mapId, "VIEW");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    throw e;
  }

  const mediaType = fileEntry.type || "application/octet-stream";
  const isImage = ALLOWED_IMAGE.includes(mediaType.toLowerCase());
  const isPdf = ALLOWED_PDF.includes(mediaType.toLowerCase());
  if (!isImage && !isPdf) {
    return NextResponse.json(
      { error: `Unsupported file type: ${mediaType}. Use PNG, JPEG, GIF, WebP, or PDF.` },
      { status: 400 }
    );
  }

  if (fileEntry.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (fileEntry.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${Math.round(fileEntry.size / 1024)} KB). Max 5 MB.` },
      { status: 413 }
    );
  }

  const arrayBuffer = await fileEntry.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const created = await prisma.sidekickAttachment.create({
    data: {
      userId,
      mapId,
      kind: isPdf ? "PDF" : "IMAGE",
      filename: fileEntry.name || null,
      mediaType,
      data: base64,
      sizeBytes: fileEntry.size,
    },
    select: {
      id: true,
      kind: true,
      filename: true,
      mediaType: true,
      sizeBytes: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ attachment: created });
}
