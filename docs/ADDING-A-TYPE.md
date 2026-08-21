# Adding a document type in 20 minutes

The starter ships 10 document types. Real projects add one or two. This walkthrough adds **`insurer`** (an accepted insurance plan) end to end: schema → Studio → types → query → route → sitemap → seed. Follow the same shape for anything else.

Rule from the spec: a type gets into the *starter* only after two real projects needed it. In *your* project, add whatever the client needs.

## 0. Decide the shape (2 min)

```
insurer
  name         string, required
  slug         slug, required        → /insurance/[slug]
  logo         imageWithAlt
  plans        string[]              ("HMO", "PPO", "Medicare Advantage")
  notes        portableText          (what patients need to know)
  services     reference[] → service (which services accept it)
```

## 1. Schema (5 min)

`sanity/schema/documents/insurer.ts`

```ts
import { defineArrayMember, defineField, defineType } from "sanity";
import { CreditCardIcon } from "@sanity/icons/CreditCard";
import { slugRule, slugify } from "../validation";

export const insurer = defineType({
  name: "insurer",
  title: "Insurer",
  type: "document",
  icon: CreditCardIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "slug", type: "slug", options: { source: "name", slugify }, validation: slugRule }),
    defineField({ name: "logo", type: "imageWithAlt" }),
    defineField({ name: "plans", type: "array", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "notes", type: "portableText" }),
    defineField({
      name: "services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});
```

Register it in `sanity/schema/documents/index.ts`:

```ts
import { insurer } from "./insurer";
export const documentTypes = [/* …existing… */, insurer];
```

Reuse `imageWithAlt`, `portableText`, `slugRule`. Don't invent a second image type or a second rich-text config.

## 2. Studio structure (1 min)

`sanity/structure.ts`: add to the group that fits. Insurers are administrative, so **Site**:

```ts
S.documentTypeListItem("insurer").title("Insurers"),
```

## 3. Query + types (3 min)

`sanity/queries.ts`:

```ts
export const INSURER_QUERY = defineQuery(`*[_type == "insurer" && slug.current == $slug][0] {
  _id, _type, _updatedAt, name, "slug": slug.current, logo ${IMAGE}, plans, notes,
  services[]-> { _id, title, "slug": slug.current, summary }
}`);

export const INSURER_SLUGS_QUERY = defineQuery(`*[_type == "insurer" && defined(slug.current)] { "slug": slug.current, _updatedAt }`);

export const INSURERS_QUERY = defineQuery(`*[_type == "insurer"] | order(name asc) { _id, name, "slug": slug.current, logo ${IMAGE}, plans }`);
```

Then:

```bash
npm run typegen
```

`sanity/types.ts` now has `INSURER_QUERY_RESULT` etc. Commit it.

## 4. Route (5 min)

`app/(site)/(patients)/insurance/[slug]/page.tsx`: copy `services/[slug]/page.tsx` and trim:

```tsx
import { notFound } from "next/navigation";
import { PortableText } from "@/components/PortableText";
import { PageHeader } from "@/components/content/PageHeader";
import { Container, Heading, Link, SanityImage } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { INSURER_QUERY, INSURER_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Props = PageProps<"/insurance/[slug]">;

export async function generateStaticParams() {
  const rows = await client.fetch(INSURER_SLUGS_QUERY);
  return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug as string }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [{ data }, { data: settings }] = await Promise.all([
    sanityFetch({ query: INSURER_QUERY, params: { slug }, stega: false, tags: ["insurer"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!data) return {};
  return buildMetadata({ title: data.name, description: `Plans accepted from ${data.name}.`, path: `/insurance/${slug}`, settings });
}

export default async function InsurerPage({ params }: Props) {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: INSURER_QUERY, params: { slug }, tags: ["insurer"] });
  if (!data) notFound();
  return (
    <article>
      <PageHeader crumbs={[{ name: "Insurance", path: "/insurance" }]} title={data.name ?? ""} lede={data.plans?.join(" · ")} />
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-prose space-y-10">
          <SanityImage image={data.logo} alt={data.logo?.alt ?? ""} width={240} height={120} />
          <PortableText value={data.notes} />
          {data.services?.length ? (
            <section>
              <Heading level={2} size={3} className="mb-4">Accepted for</Heading>
              <ul className="space-y-2">
                {data.services.map((s) => s.slug ? <li key={s._id}><Link href={`/services/${s.slug}`}>{s.title}</Link></li> : null)}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
```

Add an `insurance/page.tsx` index the same way as `services/page.tsx`. Run `npx next typegen` so `PageProps<"/insurance/[slug]">` exists. Add `insurance` to `RESERVED_SLUGS` in `lib/routes.ts` and a helper `insurer: (slug) => \`/insurance/${slug}\``.

## 5. Sitemap + preview + revalidation (2 min)

- `app/sitemap.ts`: fetch `INSURER_SLUGS_QUERY`, add `entries(insurers, routes.insurer)`.
- `sanity/presentation.ts`: add a `mainDocuments` route and a `locations.insurer` resolver so the Presentation tool can open it.
- Revalidation needs nothing: the webhook revalidates by `_type`, and you tagged the fetch `"insurer"`.

## 6. Seed (2 min)

Add two insurers to `scripts/seed.ts` so the demo isn't empty and so Playwright has something to hit. Every addition ships with seed content or it doesn't ship.

## 7. Check

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

Add `/insurance/<slug>` to `PAGES` in `e2e/smoke.spec.ts` if it's a page patients will rely on.

## What you did not have to do
Touch the section renderer, the design system, consent, forms, SEO helpers, or the Studio config. That's the point of the structure: a type is a schema file, a query, a route, and a line in three lists.
