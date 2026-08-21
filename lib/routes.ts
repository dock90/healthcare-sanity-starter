/**
 * Every URL the site produces comes from here. Change a path once.
 */
export type Audience = "patients" | "providers";

export const AUDIENCE_PREFIX: Record<Audience, string> = {
  patients: "",
  providers: "/for-providers",
};

export const HOME_SLUG = "home";

export function pagePath(audience: Audience, slug: string): string {
  const prefix = AUDIENCE_PREFIX[audience];
  if (slug === HOME_SLUG) return prefix || "/";
  return `${prefix}/${slug}`;
}

export const routes = {
  home: (audience: Audience = "patients") => pagePath(audience, HOME_SLUG),
  page: pagePath,
  providers: () => "/providers",
  provider: (slug: string) => `/providers/${slug}`,
  locations: () => "/locations",
  location: (slug: string) => `/locations/${slug}`,
  services: () => "/services",
  service: (slug: string) => `/services/${slug}`,
  blog: () => "/blog",
  post: (slug: string) => `/blog/${slug}`,
  legal: (slug: string) => `/legal/${slug}`,
} as const;

/** Paths owned by static routes. A `page` with one of these slugs would be shadowed. */
export const RESERVED_SLUGS = new Set(["providers", "locations", "services", "blog", "legal", "studio", "api", "for-providers"]);

export function telHref(display: string): string {
  return `tel:${display.replace(/[^+\d]/g, "")}`;
}

/** Anything Next's router shouldn't handle: other origins, tel:, mailto:. */
export function isExternal(href: string): boolean {
  return /^(https?:\/\/|tel:|mailto:)/.test(href);
}
