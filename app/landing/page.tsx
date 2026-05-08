import { redirect } from "next/navigation";

/**
 * Legacy /landing route — the modern home page lives at /.
 * Permanent redirect preserves SEO and any external links.
 */
export default function LegacyLandingPage(): never {
  redirect("/");
}
