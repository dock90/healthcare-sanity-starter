import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

/**
 * Maps documents ↔ URLs for the Presentation tool (live preview in the Studio).
 * Keep in sync with lib/routes.ts.
 */
const pagePath = (audience?: string, slug?: string) => {
  const prefix = audience === "providers" ? "/for-providers" : "";
  if (!slug || slug === "home") return prefix || "/";
  return `${prefix}/${slug}`;
};

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/", filter: `_type == "page" && audience == "patients" && slug.current == "home"` },
    { route: "/for-providers", filter: `_type == "page" && audience == "providers" && slug.current == "home"` },
    { route: "/:slug", filter: `_type == "page" && audience == "patients" && slug.current == $slug` },
    { route: "/for-providers/:slug", filter: `_type == "page" && audience == "providers" && slug.current == $slug` },
    { route: "/providers/:slug", filter: `_type == "provider" && slug.current == $slug` },
    { route: "/locations/:slug", filter: `_type == "location" && slug.current == $slug` },
    { route: "/services/:slug", filter: `_type == "service" && slug.current == $slug` },
    { route: "/blog/:slug", filter: `_type == "post" && slug.current == $slug` },
    { route: "/legal/:slug", filter: `_type == "legalPage" && slug.current == $slug` },
  ]),
  locations: {
    page: defineLocations({
      select: { title: "title", slug: "slug.current", audience: "audience" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title ?? "Page", href: pagePath(doc?.audience, doc?.slug) }],
      }),
    }),
    provider: defineLocations({
      select: { title: "name", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? "Provider", href: `/providers/${doc?.slug}` },
          { title: "All providers", href: "/providers" },
        ],
      }),
    }),
    location: defineLocations({
      select: { title: "name", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? "Location", href: `/locations/${doc?.slug}` },
          { title: "All locations", href: "/locations" },
        ],
      }),
    }),
    service: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? "Service", href: `/services/${doc?.slug}` },
          { title: "All services", href: "/services" },
        ],
      }),
    }),
    post: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? "Post", href: `/blog/${doc?.slug}` },
          { title: "Health library", href: "/blog" },
        ],
      }),
    }),
    legalPage: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({ locations: [{ title: doc?.title ?? "Legal page", href: `/legal/${doc?.slug}` }] }),
    }),
    settings: defineLocations({
      message: "Settings affect every page.",
      tone: "caution",
      locations: [{ title: "Home", href: "/" }],
    }),
  },
};
