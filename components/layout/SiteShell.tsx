import { SkipLink } from "@/components/ui";
import { sanityFetch } from "@/sanity/live";
import { SETTINGS_QUERY } from "@/sanity/queries";
import type { Audience } from "@/lib/routes";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Header + main + footer for one audience. Used by both audience layouts and the 404. */
export async function SiteShell({ audience, children }: { audience: Audience; children: React.ReactNode }) {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] });
  return (
    <>
      <SkipLink />
      <Header settings={settings} audience={audience} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} audience={audience} />
    </>
  );
}
