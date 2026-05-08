/**
 * BoxyHQ Jackson singleton.
 *
 * Jackson handles SAML 2.0 + OIDC + SCIM 2.0 internally and exposes thin
 * controllers we mount under /api/sso/* and /api/scim/v2/*.
 *
 * We point Jackson at the same Postgres database via Prisma's connection URL.
 *
 * Common deploy failure: Jackson creates a `jackson_store` table on first call.
 * If the DATABASE_URL user lacks CREATE on the public schema this throws with
 * `permission denied for schema public`. We catch that specifically and surface
 * a JacksonNotConfiguredError so route handlers can return a helpful 503
 * instead of a generic 500.
 */

import jackson, {
  type IConnectionAPIController,
  type IOAuthController,
  type ISPSSOConfig,
  type IDirectorySyncController,
  type JacksonOption,
} from "@boxyhq/saml-jackson";

export class JacksonNotConfiguredError extends Error {
  status = 503;
  constructor(public reason: "permission" | "init" | "missing_url", message: string) {
    super(message);
  }
}

let cached: {
  apiController: IConnectionAPIController;
  oauthController: IOAuthController;
  spConfig: ISPSSOConfig;
  directorySyncController: IDirectorySyncController;
} | null = null;

export async function getJackson() {
  if (cached) return cached;

  if (!process.env.DATABASE_URL) {
    throw new JacksonNotConfiguredError(
      "missing_url",
      "DATABASE_URL is not set. SSO/SCIM cannot initialize without it."
    );
  }

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
      url: process.env.DATABASE_URL,
      ttl: 300,
      cleanupLimit: 1000,
    } as any,
    openid: {
      jwsAlg: "RS256",
    },
    idpEnabled: true,
  };

  try {
    const ret = await jackson(opts);
    cached = {
      apiController: ret.apiController,
      oauthController: ret.oauthController,
      spConfig: ret.spConfig,
      directorySyncController: ret.directorySyncController,
    };
    return cached;
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    if (/permission denied for schema/i.test(msg)) {
      throw new JacksonNotConfiguredError(
        "permission",
        "SSO/SCIM is not initialized: the database user lacks CREATE permission on the public schema. " +
          "As the DB owner, run: GRANT CREATE, USAGE ON SCHEMA public TO <app_user>; then restart the app."
      );
    }
    throw new JacksonNotConfiguredError("init", `Jackson initialization failed: ${msg}`);
  }
}
