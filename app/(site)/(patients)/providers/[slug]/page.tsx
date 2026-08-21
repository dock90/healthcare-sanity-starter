import { notFound } from "next/navigation";
import { PortableText } from "@/components/PortableText";
import { PageHeader } from "@/components/content/PageHeader";
import { AcceptingBadge } from "@/components/content/ProviderCard";
import { Address, Hours } from "@/components/content/LocationCard";
import { Container, Heading, Link, SanityImage, Text } from "@/components/ui";
import { personName } from "@/lib/format";
import { routes, telHref } from "@/lib/routes";
import { JsonLd, buildMetadata, physicianSchema } from "@/lib/seo";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { PROVIDER_QUERY, PROVIDER_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Props = PageProps<"/providers/[slug]">;

export async function generateStaticParams() {
  const rows = await client.fetch(PROVIDER_SLUGS_QUERY);
  return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug as string }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [{ data: provider }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PROVIDER_QUERY, params: { slug }, stega: false, tags: ["provider"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!provider) return {};
  return buildMetadata({
    title: personName(provider),
    description: `${provider.title ?? ""}${provider.specialties?.length ? ` · ${provider.specialties.join(", ")}` : ""}`,
    path: routes.provider(slug),
    settings,
    image: provider.headshot,
  });
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const [{ data: provider }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PROVIDER_QUERY, params: { slug }, tags: ["provider"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!provider) notFound();
  const name = personName(provider);

  return (
    <article>
      <PageHeader crumbs={[{ name: "Providers", path: routes.providers() }]} title={name} lede={provider.title}>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <AcceptingBadge accepting={provider.acceptingPatients} />
          {provider.specialties?.length ? <Text size="sm" muted>{provider.specialties.join(" · ")}</Text> : null}
        </div>
      </PageHeader>
      <Container className="grid gap-12 py-12 lg:grid-cols-[18rem_1fr] lg:py-16">
        <aside className="space-y-8">
          <SanityImage image={provider.headshot} alt={provider.headshot?.alt ?? `Portrait of ${name}`} width={288} height={288} priority sizes="288px" className="w-full rounded-lg object-cover" />
          {provider.locations?.length ? (
            <section aria-labelledby="provider-locations">
              <Heading level={2} size={4} id="provider-locations" className="mb-3">Sees patients at</Heading>
              <ul className="space-y-5">
                {provider.locations.map((l) =>
                  l.slug ? (
                    <li key={l._id} className="space-y-2 text-sm">
                      <Link href={routes.location(l.slug)} className="font-medium">{l.name}</Link>
                      <Text size="sm" muted as="div"><Address address={l.address} /></Text>
                      {l.phone ? <a href={telHref(l.phone)} className="inline-flex min-h-target items-center text-accent-ink underline underline-offset-4">{l.phone}</a> : null}
                      <Hours hours={l.hours} />
                    </li>
                  ) : null,
                )}
              </ul>
            </section>
          ) : null}
        </aside>
        <div className="space-y-12">
          <section aria-labelledby="provider-about">
            <Heading level={2} size={3} id="provider-about" className="mb-4">About {provider.name}</Heading>
            <PortableText value={provider.bio} />
          </section>
          {provider.services?.length ? (
            <section aria-labelledby="provider-services">
              <Heading level={2} size={3} id="provider-services" className="mb-4">Services</Heading>
              <ul className="grid gap-4 sm:grid-cols-2">
                {provider.services.map((s) =>
                  s.slug ? (
                    <li key={s._id} className="rounded-lg border border-border bg-surface p-4">
                      <Link href={routes.service(s.slug)} className="font-medium">{s.title}</Link>
                      {s.summary ? <Text size="sm" muted className="mt-1">{s.summary}</Text> : null}
                    </li>
                  ) : null,
                )}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>
      <JsonLd data={physicianSchema(provider, settings)} />
    </article>
  );
}
