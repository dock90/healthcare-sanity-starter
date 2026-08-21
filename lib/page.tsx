import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sections } from "@/components/sections";
import { buildMetadata, JsonLd, organizationSchema } from "@/lib/seo";
import { HOME_SLUG, pagePath, type Audience } from "@/lib/routes";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { PAGE_QUERY, PAGE_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

/** `[[...slug]]` → a single slug. Pages are flat; nested paths are 404s. */
function resolveSlug(parts: string[] | undefined): string {
  if (!parts?.length) return HOME_SLUG;
  if (parts.length > 1) notFound();
  return parts[0];
}

export async function getPage(audience: Audience, parts: string[] | undefined) {
  const slug = resolveSlug(parts);
  const { data } = await sanityFetch({ query: PAGE_QUERY, params: { audience, slug }, tags: ["page"] });
  if (!data) notFound();
  return data;
}

export async function pageMetadata(audience: Audience, parts: string[] | undefined): Promise<Metadata> {
  const slug = resolveSlug(parts);
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY, params: { audience, slug }, stega: false, tags: ["page"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!page) return {};
  return buildMetadata({ title: page.title, path: pagePath(audience, slug), seo: page.seo, settings });
}

export async function pageStaticParams(audience: Audience) {
  const pages = await client.fetch(PAGE_SLUGS_QUERY);
  return pages
    .filter((p) => p.audience === audience && p.slug)
    .map((p) => ({ slug: p.slug === HOME_SLUG ? [] : [p.slug as string] }));
}

export async function PageView({ audience, parts }: { audience: Audience; parts: string[] | undefined }) {
  const page = await getPage(audience, parts);
  const isHome = page.slug === HOME_SLUG && audience === "patients";
  const { data: settings } = isHome ? await sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }) : { data: null };
  return (
    <>
      <Sections sections={page.sections} />
      {isHome ? <JsonLd data={organizationSchema(settings)} /> : null}
    </>
  );
}
