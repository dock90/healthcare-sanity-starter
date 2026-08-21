import { notFound } from "next/navigation";
import { PageHeader } from "@/components/content/PageHeader";
import { ProviderCard } from "@/components/content/ProviderCard";
import { Address, Hours } from "@/components/content/LocationCard";
import { Container, Heading, SanityImage, Text } from "@/components/ui";
import { routes, telHref } from "@/lib/routes";
import { JsonLd, buildMetadata, medicalClinicSchema } from "@/lib/seo";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { LOCATION_QUERY, LOCATION_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Props = PageProps<"/locations/[slug]">;

export async function generateStaticParams() {
  const rows = await client.fetch(LOCATION_SLUGS_QUERY);
  return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug as string }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [{ data: location }, { data: settings }] = await Promise.all([
    sanityFetch({ query: LOCATION_QUERY, params: { slug }, stega: false, tags: ["location"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!location) return {};
  const a = location.address;
  return buildMetadata({
    title: location.name,
    description: a ? `${location.name}: ${a.street}, ${a.city}, ${a.region}. Hours, phone and providers.` : location.name,
    path: routes.location(slug),
    settings,
    image: location.image,
  });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const [{ data: location }, { data: settings }] = await Promise.all([
    sanityFetch({ query: LOCATION_QUERY, params: { slug }, tags: ["location"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!location) notFound();
  const mapsHref = location.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address.street}, ${location.address.city}, ${location.address.region} ${location.address.postalCode}`)}`
    : null;

  return (
    <article>
      <PageHeader crumbs={[{ name: "Locations", path: routes.locations() }]} title={location.name ?? ""} />
      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <div className="space-y-10">
          <SanityImage image={location.image} alt={location.image?.alt ?? ""} width={800} height={450} priority sizes="(min-width: 1024px) 800px, 100vw" className="w-full rounded-lg object-cover" />
          {location.providers?.length ? (
            <section aria-labelledby="location-providers">
              <Heading level={2} size={3} id="location-providers" className="mb-4">Providers at this location</Heading>
              <ul className="grid gap-5 md:grid-cols-2">
                {location.providers.map((p) => <ProviderCard key={p._id} provider={p} />)}
              </ul>
            </section>
          ) : null}
        </div>
        <aside className="space-y-6 rounded-lg border border-border bg-surface p-5 shadow-card self-start">
          <section>
            <Heading level={2} size={4} className="mb-2">Address</Heading>
            <Text as="div"><Address address={location.address} /></Text>
            {mapsHref ? (
              <a href={mapsHref} rel="noopener" className="mt-2 inline-flex min-h-target items-center text-accent-ink underline underline-offset-4">Get directions</a>
            ) : null}
          </section>
          {location.phone ? (
            <section>
              <Heading level={2} size={4} className="mb-2">Phone</Heading>
              <a href={telHref(location.phone)} className="inline-flex min-h-target items-center text-accent-ink underline underline-offset-4">{location.phone}</a>
            </section>
          ) : null}
          {location.hours?.length ? (
            <section>
              <Heading level={2} size={4} className="mb-2">Hours</Heading>
              <Hours hours={location.hours} />
            </section>
          ) : null}
        </aside>
      </Container>
      <JsonLd data={medicalClinicSchema(location, settings)} />
    </article>
  );
}
