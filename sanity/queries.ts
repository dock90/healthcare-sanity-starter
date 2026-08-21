import { defineQuery } from "next-sanity";

/*
 * Every GROQ query in the site. Typegen derives result types from these,
 * so projections are explicit — no `...` spreads on documents.
 */

const IMAGE = /* groq */ `{ asset, hotspot, crop, alt }`;
const LINK = /* groq */ `{ label, href }`;
const SEO = /* groq */ `{ title, description, image ${IMAGE}, noIndex }`;
const PERSON = /* groq */ `{ _id, name, credentials, role, bio, headshot ${IMAGE} }`;

const PROVIDER_CARD = /* groq */ `{
  _id, name, credentials, title, "slug": slug.current, headshot ${IMAGE}, specialties, acceptingPatients
}`;

const LOCATION_CARD = /* groq */ `{
  _id, name, "slug": slug.current, image ${IMAGE}, address, phone, geo,
  hours[] { _key, days, opens, closes }
}`;

const SECTIONS = /* groq */ `sections[] {
  _key, _type,
  _type == "hero" => { eyebrow, heading, text, image ${IMAGE}, buttons[] ${LINK} },
  _type == "richText" => { body },
  _type == "cta" => { heading, text, buttons[] ${LINK} },
  _type == "cards" => { heading, intro, items[] { _key, title, text, image ${IMAGE}, link ${LINK} } },
  _type == "faqs" => { heading, items[]-> { _id, question, answer } },
  _type == "providers" => {
    heading,
    "items": select(
      count(items) > 0 => items[]-> ${PROVIDER_CARD},
      *[_type == "provider"] | order(name asc) ${PROVIDER_CARD}
    )
  },
  _type == "locations" => {
    heading,
    "items": select(
      count(items) > 0 => items[]-> ${LOCATION_CARD},
      *[_type == "location"] | order(name asc) ${LOCATION_CARD}
    )
  },
  _type == "form" => {
    heading, text, formId, submitLabel, successMessage,
    fields[] { _key, key, label, type, options, required }
  }
}`;

const NAV = /* groq */ `{ header[] ${LINK}, footer[] ${LINK}, cta ${LINK} }`;

export const SETTINGS_QUERY = defineQuery(`*[_type == "settings" && _id == "settings"][0] {
  orgName, tagline, logo ${IMAGE},
  contact { phone, email, primaryLocation-> ${LOCATION_CARD} },
  social[] ${LINK},
  patientsNav ${NAV},
  providersNav ${NAV},
  defaultSeo ${SEO},
  ga4Id,
  consent { title, description, policyLink ${LINK} }
}`);

export const PAGE_QUERY = defineQuery(`*[_type == "page" && audience == $audience && slug.current == $slug][0] {
  _id, _type, title, audience, "slug": slug.current, seo ${SEO}, ${SECTIONS}
}`);

export const PAGE_SLUGS_QUERY = defineQuery(`*[_type == "page" && defined(slug.current)] {
  audience, "slug": slug.current, _updatedAt
}`);

export const PROVIDER_QUERY = defineQuery(`*[_type == "provider" && slug.current == $slug][0] {
  _id, _type, _updatedAt, name, credentials, title, "slug": slug.current, headshot ${IMAGE},
  specialties, acceptingPatients, bio,
  locations[]-> ${LOCATION_CARD},
  "services": *[_type == "service" && references(^._id)] | order(title asc) { _id, title, "slug": slug.current, summary }
}`);

export const PROVIDERS_QUERY = defineQuery(`*[_type == "provider"] | order(name asc) ${PROVIDER_CARD}`);

export const PROVIDER_SLUGS_QUERY = defineQuery(`*[_type == "provider" && defined(slug.current)] { "slug": slug.current, _updatedAt }`);

export const LOCATION_QUERY = defineQuery(`*[_type == "location" && slug.current == $slug][0] {
  _id, _type, _updatedAt, name, "slug": slug.current, image ${IMAGE}, address, phone, geo,
  hours[] { _key, days, opens, closes },
  "providers": select(
    count(providers) > 0 => providers[]-> ${PROVIDER_CARD},
    *[_type == "provider" && references(^._id)] | order(name asc) ${PROVIDER_CARD}
  )
}`);

export const LOCATIONS_QUERY = defineQuery(`*[_type == "location"] | order(name asc) ${LOCATION_CARD}`);

export const LOCATION_SLUGS_QUERY = defineQuery(`*[_type == "location" && defined(slug.current)] { "slug": slug.current, _updatedAt }`);

export const SERVICE_QUERY = defineQuery(`*[_type == "service" && slug.current == $slug][0] {
  _id, _type, _updatedAt, title, "slug": slug.current, summary, image ${IMAGE}, body, seo ${SEO},
  reviewedBy-> ${PERSON}, reviewedAt,
  faqs[]-> { _id, question, answer },
  providers[]-> ${PROVIDER_CARD}
}`);

export const SERVICE_SLUGS_QUERY = defineQuery(`*[_type == "service" && defined(slug.current)] { "slug": slug.current, _updatedAt }`);

export const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(title asc) {
  _id, title, "slug": slug.current, summary, image ${IMAGE}
}`);

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id, _type, _updatedAt, title, "slug": slug.current, publishedAt, excerpt, image ${IMAGE}, body, seo ${SEO},
  author-> ${PERSON}, reviewedBy-> ${PERSON}, reviewedAt
}`);

export const POST_SLUGS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] { "slug": slug.current, _updatedAt }`);

export const POSTS_QUERY = defineQuery(`*[_type == "post"] | order(publishedAt desc) {
  _id, title, "slug": slug.current, publishedAt, excerpt, image ${IMAGE},
  author-> { name, credentials }, reviewedBy-> { name, credentials }
}`);

export const LEGAL_PAGE_QUERY = defineQuery(`*[_type == "legalPage" && slug.current == $slug][0] {
  _id, _type, _updatedAt, title, "slug": slug.current, effectiveDate, body
}`);

export const LEGAL_PAGE_SLUGS_QUERY = defineQuery(`*[_type == "legalPage" && defined(slug.current)] { "slug": slug.current, _updatedAt }`);

export const REDIRECTS_QUERY = defineQuery(`*[_type == "redirect" && defined(from) && defined(to)] { from, to, permanent }`);
