import type { Metadata } from "next";
import { toPlainText } from "@portabletext/react";
import { stegaClean, type StegaBranded } from "next-sanity";
import type { PortableText as PortableTextValue, SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";
import { telHref } from "./routes";

type Settings = NonNullable<SETTINGS_QUERY_RESULT>;
type Seo = { title?: string | null; description?: string | null; image?: SanityImageSource | null; noIndex?: boolean | null } | null;

/** Canonical origin, no trailing slash. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The one metadata helper. Call from `generateMetadata` with the document's
 * own title/summary and its `seo` overrides; falls back to settings.defaultSeo.
 */
export function buildMetadata({ title, description, path, seo, settings, image, type = "website" }: {
  title: string | null | undefined;
  description?: string | null;
  path: string;
  seo?: Seo;
  settings: Settings | null;
  image?: SanityImageSource | null;
  type?: "website" | "article";
}): Metadata {
  const org = settings?.orgName ?? "";
  const metaTitle = seo?.title ?? title ?? org;
  const fullTitle = metaTitle && org && !metaTitle.includes(org) ? `${metaTitle} | ${org}` : metaTitle || org;
  const metaDescription = seo?.description ?? description ?? settings?.defaultSeo?.description ?? undefined;
  const ogImage = seo?.image ?? image ?? settings?.defaultSeo?.image ?? null;
  const ogImageUrl = ogImage ? urlFor(ogImage).width(1200).height(630).url() : undefined;
  const noIndex = Boolean(seo?.noIndex);

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: { canonical: absoluteUrl(path) },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title: metaTitle || undefined,
      description: metaDescription,
      url: absoluteUrl(path),
      siteName: org || undefined,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: ogImageUrl ? "summary_large_image" : "summary" },
  };
}

/* ───────────────────────── JSON-LD ───────────────────────── */

type JsonLdValue = Record<string, unknown>;

/** Renders structured data. `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: JsonLdValue | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(stegaClean(data)).replace(/</g, "\\u003c") }}
    />
  );
}

function compact<T extends JsonLdValue>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")) as T;
}

type Address = { street?: string | null; city?: string | null; region?: string | null; postalCode?: string | null; country?: string | null } | null;

function postalAddress(address: Address) {
  if (!address) return undefined;
  return compact({
    "@type": "PostalAddress",
    streetAddress: address.street,
    addressLocality: address.city,
    addressRegion: address.region,
    postalCode: address.postalCode,
    addressCountry: address.country,
  });
}

type Hours = Array<{ days?: string[] | null; opens?: string | null; closes?: string | null }> | null;

function openingHours(hours: Hours) {
  if (!hours?.length) return undefined;
  return hours.map((h) =>
    compact({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days?.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    }),
  );
}

export function organizationSchema(settings: Settings | null): JsonLdValue | null {
  if (!settings?.orgName) return null;
  const loc = settings.contact?.primaryLocation;
  return compact({
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": `${siteUrl()}/#organization`,
    name: settings.orgName,
    url: siteUrl(),
    logo: settings.logo ? urlFor(settings.logo).width(512).url() : undefined,
    telephone: settings.contact?.phone ?? undefined,
    email: settings.contact?.email ?? undefined,
    address: postalAddress(loc?.address ?? null),
    sameAs: settings.social?.map((s) => s.href).filter(Boolean),
  });
}

type LocationLike = {
  name: string | null;
  slug: string | null;
  address: Address;
  phone: string | null;
  geo: { lat?: number; lng?: number } | null;
  hours: Hours;
  image?: SanityImageSource | null;
};

export function medicalClinicSchema(location: LocationLike, settings: Settings | null): JsonLdValue {
  return compact({
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": absoluteUrl(`/locations/${location.slug}#clinic`),
    name: location.name,
    url: absoluteUrl(`/locations/${location.slug}`),
    telephone: location.phone,
    address: postalAddress(location.address),
    geo: location.geo?.lat && location.geo?.lng ? { "@type": "GeoCoordinates", latitude: location.geo.lat, longitude: location.geo.lng } : undefined,
    openingHoursSpecification: openingHours(location.hours),
    image: location.image ? urlFor(location.image).width(1200).url() : undefined,
    parentOrganization: settings?.orgName ? { "@id": `${siteUrl()}/#organization` } : undefined,
  });
}

type ProviderLike = {
  name: string | null;
  credentials: string | null;
  title: string | null;
  slug: string | null;
  specialties: string[] | null;
  acceptingPatients: boolean | null;
  headshot: SanityImageSource | null;
  locations: Array<LocationLike> | null;
};

export function physicianSchema(provider: ProviderLike, settings: Settings | null): JsonLdValue {
  return compact({
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": absoluteUrl(`/providers/${provider.slug}#physician`),
    name: provider.name,
    honorificSuffix: provider.credentials,
    jobTitle: provider.title,
    url: absoluteUrl(`/providers/${provider.slug}`),
    image: provider.headshot ? urlFor(provider.headshot).width(600).url() : undefined,
    medicalSpecialty: provider.specialties,
    isAcceptingNewPatients: provider.acceptingPatients ?? undefined,
    memberOf: settings?.orgName ? { "@id": `${siteUrl()}/#organization` } : undefined,
    hospitalAffiliation: provider.locations?.map((l) => ({ "@id": absoluteUrl(`/locations/${l.slug}#clinic`) })),
  });
}

type FaqLike = { question: string | null; answer: PortableTextValue | null };

export function faqPageSchema(items: Array<FaqLike | StegaBranded<FaqLike>>): JsonLdValue | null {
  const entities = items
    .filter((f) => f.question && f.answer)
    .map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: toPlainText(stegaClean(f.answer) ?? []) },
    }));
  if (!entities.length) return null;
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entities };
}

type PersonLike = { name: string | null; credentials: string | null; role: string | null } | null;

function personEntity(p: PersonLike) {
  if (!p?.name) return undefined;
  return compact({ "@type": "Person", name: p.name, honorificSuffix: p.credentials, jobTitle: p.role });
}

export function articleSchema(post: {
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  _updatedAt: string;
  image: SanityImageSource | null;
  author: PersonLike;
  reviewedBy: PersonLike;
  reviewedAt: string | null;
}, settings: Settings | null): JsonLdValue {
  return compact({
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": absoluteUrl(`/blog/${post.slug}`),
    url: absoluteUrl(`/blog/${post.slug}`),
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    image: post.image ? urlFor(post.image).width(1200).url() : undefined,
    author: personEntity(post.author),
    reviewedBy: personEntity(post.reviewedBy),
    lastReviewed: post.reviewedAt ?? undefined,
    publisher: settings?.orgName ? { "@id": `${siteUrl()}/#organization` } : undefined,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  });
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export { telHref };
