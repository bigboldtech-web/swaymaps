import { NextResponse } from "next/server";
import { getJackson } from "@/lib/jackson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Assertion Consumer Service. The IdP POSTs the SAML response here.
 * Jackson validates the assertion and returns a redirect URL with a code,
 * which NextAuth exchanges via /api/sso/token.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((v, k) => {
      if (typeof v === "string") params[k] = v;
    });

    const { oauthController } = await getJackson();
    const { redirect_url } = await oauthController.samlResponse(params as any);
    if (!redirect_url) {
      return NextResponse.json({ error: "Invalid SAML response" }, { status: 400 });
    }
    return NextResponse.redirect(redirect_url, 302);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "ACS failed" },
      { status: e?.statusCode ?? 500 }
    );
  }
}
