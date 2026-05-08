import { NextResponse } from "next/server";
import { getJackson } from "@/lib/jackson";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * SP metadata XML. Hand this to your IdP when configuring SwayMaps as a
 * SAML application.
 */
export async function GET() {
  try {
    const { spConfig } = await getJackson();
    const xml = await spConfig.toXMLMetadata();
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": 'inline; filename="swaymaps-sp-metadata.xml"',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Metadata failed" },
      { status: 500 }
    );
  }
}
