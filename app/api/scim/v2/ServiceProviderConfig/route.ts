import { scimJson } from "@/lib/scimAuth";

/** SCIM 2.0 service provider config. Static — describes our capabilities. */
export async function GET() {
  return scimJson({
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig"],
    documentationUri: "https://swaymaps.com/docs/scim",
    patch: { supported: true },
    bulk: { supported: false, maxOperations: 0, maxPayloadSize: 0 },
    filter: { supported: true, maxResults: 500 },
    changePassword: { supported: false },
    sort: { supported: false },
    etag: { supported: false },
    authenticationSchemes: [
      {
        name: "OAuth Bearer Token",
        description: "Authentication via SCIM bearer token issued in workspace settings.",
        specUri: "https://datatracker.ietf.org/doc/html/rfc6750",
        type: "oauthbearertoken",
        primary: true,
      },
    ],
  });
}
