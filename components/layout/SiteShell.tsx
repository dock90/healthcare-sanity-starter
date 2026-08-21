import { stegaClean } from "next-sanity";
import { SkipLink } from "@/components/ui";
import { sanityFetch } from "@/sanity/live";
import { SETTINGS_QUERY } from "@/sanity/queries";
import type { Audience } from "@/lib/routes";
import { Analytics } from "./Analytics";
import { ConsentGate } from "./ConsentGate";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Header + main + footer for one audience. Used by both audience layouts and the 404. */
export async function SiteShell({ audience, children }: { audience: Audience; children: React.ReactNode }) {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY, tags: ["settings"] });
  return (
    <>
      <SkipLink />
      <ConsentGate
        copy={{
          title: settings?.consent?.title ?? "Cookies on this site",
          description: settings?.consent?.description ?? "We use necessary cookies to make the site work and, with your permission, analytics cookies to understand how it's used.",
          policyHref: settings?.consent?.policyLink?.href ?? null,
          policyLabel: settings?.consent?.policyLink?.label ?? null,
        }}
      />
      <Header settings={settings} audience={audience} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} audience={audience} />
      <Analytics ga4Id={stegaClean(settings?.ga4Id) ?? null} />
    </>
  );
}
