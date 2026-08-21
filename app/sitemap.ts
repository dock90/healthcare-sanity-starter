import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import {
  LEGAL_PAGE_SLUGS_QUERY,
  LOCATION_SLUGS_QUERY,
  PAGE_SLUGS_QUERY,
  POST_SLUGS_QUERY,
  PROVIDER_SLUGS_QUERY,
  SERVICE_SLUGS_QUERY,
} from "@/sanity/queries";
import { absoluteUrl } from "@/lib/seo";
import { pagePath, routes, type Audience } from "@/lib/routes";

export const revalidate = 3600;

type Row = { slug: string | null; _updatedAt: string };

function entries(rows: Row[], toPath: (slug: string) => string): MetadataRoute.Sitemap {
  return rows
    .filter((r): r is Row & { slug: string } => Boolean(r.slug))
    .map((r) => ({ url: absoluteUrl(toPath(r.slug)), lastModified: r._updatedAt }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, providers, locations, services, posts, legal] = await Promise.all([
    client.fetch(PAGE_SLUGS_QUERY),
    client.fetch(PROVIDER_SLUGS_QUERY),
    client.fetch(LOCATION_SLUGS_QUERY),
    client.fetch(SERVICE_SLUGS_QUERY),
    client.fetch(POST_SLUGS_QUERY),
    client.fetch(LEGAL_PAGE_SLUGS_QUERY),
  ]);

  const now = new Date().toISOString();
  const indexes: MetadataRoute.Sitemap = [routes.providers(), routes.locations(), routes.services(), routes.blog()].map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
  }));

  return [
    ...pages
      .filter((p) => p.slug && p.audience)
      .map((p) => ({ url: absoluteUrl(pagePath(p.audience as Audience, p.slug as string)), lastModified: p._updatedAt })),
    ...indexes,
    ...entries(providers, routes.provider),
    ...entries(locations, routes.location),
    ...entries(services, routes.service),
    ...entries(posts, routes.post),
    ...entries(legal, routes.legal),
  ];
}
