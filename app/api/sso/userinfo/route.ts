import { NextResponse } from "next/server";
import { getJackson } from "@/lib/jackson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Returns the SAML profile attached to the access_token.
 * Bearer Authorization: <access_token>
 */
export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization") ?? "";
    const token = auth.toLowerCase().startsWith("bearer ")
      ? auth.slice(7).trim()
      : "";
    if (!token) {
      return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
    }
    const { oauthController } = await getJackson();
    const profile = await oauthController.userInfo(token);
    return NextResponse.json(profile);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Userinfo failed" },
      { status: e?.statusCode ?? 401 }
    );
  }
}
