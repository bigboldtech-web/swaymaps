import { NextResponse } from "next/server";
import { getJackson } from "@/lib/jackson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Initiates SP-initiated SSO. NextAuth's OAuth flow lands here with
 * standard OAuth params; we forward to Jackson's authorize controller
 * which redirects to the configured IdP.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  try {
    const { oauthController } = await getJackson();
    const { redirect_url, authorize_form } = await oauthController.authorize(params as any);
    if (redirect_url) return NextResponse.redirect(redirect_url);
    if (authorize_form) {
      return new Response(authorize_form, {
        headers: { "Content-Type": "text/html" },
      });
    }
    return NextResponse.json({ error: "Could not initiate SSO" }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "SSO authorize failed" },
      { status: e?.statusCode ?? 500 }
    );
  }
}
