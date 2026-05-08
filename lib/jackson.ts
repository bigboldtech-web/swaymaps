/**
 * BoxyHQ Jackson singleton.
 *
 * Jackson handles SAML 2.0 + OIDC + SCIM 2.0 internally and exposes thin
 * controllers we mount under /api/sso/* and /api/scim/v2/*.
 *
 * We point Jackson at the same Postgres database via Prisma's connection URL.
 */

import jackson, {
  type IConnectionAPIController,
  type IOAuthController,
  type ISPSSOConfig,
  type IDirectorySyncController,
  type JacksonOption,
} from "@boxyhq/saml-jackson";

let cached: {
  apiController: IConnectionAPIController;
  oauthController: IOAuthController;
  spConfig: ISPSSOConfig;
  directorySyncController: IDirectorySyncController;
} | null = null;

export async function getJackson() {
  if (cached) return cached;

  const externalUrl =
    process.env.NEXTAUTH_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";

  const opts: JacksonOption = {
    externalUrl,
    samlPath: "/api/sso/acs",
    oidcPath: "/api/sso/oidc",
    samlAudience: process.env.SAML_AUDIENCE || "https://saml.swaymaps.com",
    db: {
      engine: "sql",
      type: "postgres",
      url: process.env.DATABASE_URL!,
      ttl: 300,
      cleanupLimit: 1000,
    } as any,
    openid: {
      jwsAlg: "RS256",
    },
    // We map signed-in users via NextAuth, so Jackson just needs to know the SP base.
    idpEnabled: true,
  };

  const ret = await jackson(opts);
  cached = {
    apiController: ret.apiController,
    oauthController: ret.oauthController,
    spConfig: ret.spConfig,
    directorySyncController: ret.directorySyncController,
  };
  return cached;
}
