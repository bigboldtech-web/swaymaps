import { NextResponse } from "next/server";
import { getJackson } from "@/lib/jackson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * OAuth token endpoint. NextAuth POSTs here with the code from /acs.
 * Jackson exchanges the code for an access_token (which represents the
 * authenticated SAML profile).
 */
export async function POST(req: Request) {
  try {
    const ctype = req.headers.get("content-type") ?? "";
    let params: Record<string, any> = {};
    if (ctype.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      form.forEach((v, k) => {
        if (typeof v === "string") params[k] = v;
      });
    } else {
      params = await req.json().catch(() => ({}));
    }

    const { oauthController } = await getJackson();
    const tokenResponse = await oauthController.token(params as any);
    return NextResponse.json(tokenResponse);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Token exchange failed" },
      { status: e?.statusCode ?? 500 }
    );
  }
}
