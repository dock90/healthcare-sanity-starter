import { notFound } from "next/navigation";
import { PortableText } from "@/components/PortableText";
import { FaqList } from "@/components/content/FaqList";
import { MedicalReview } from "@/components/content/MedicalReview";
import { PageHeader } from "@/components/content/PageHeader";
import { ProviderCard } from "@/components/content/ProviderCard";
import { Container, Heading, SanityImage } from "@/components/ui";
import { routes } from "@/lib/routes";
import { JsonLd, buildMetadata, faqPageSchema } from "@/lib/seo";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { SERVICE_QUERY, SERVICE_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Props = PageProps<"/services/[slug]">;

export async function generateStaticParams() {
  const rows = await client.fetch(SERVICE_SLUGS_QUERY);
  return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug as string }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [{ data: service }, { data: settings }] = await Promise.all([
    sanityFetch({ query: SERVICE_QUERY, params: { slug }, stega: false, tags: ["service"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!service) return {};
  return buildMetadata({ title: service.title, description: service.summary, path: routes.service(slug), seo: service.seo, settings, image: service.image });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const { data: service } = await sanityFetch({ query: SERVICE_QUERY, params: { slug }, tags: ["service"] });
  if (!service) notFound();
  const faqs = service.faqs ?? [];

  return (
    <article>
      <PageHeader crumbs={[{ name: "Services", path: routes.services() }]} title={service.title ?? ""} lede={service.summary}>
        {service.reviewedBy ? (
          <div className="mt-5"><MedicalReview reviewedBy={service.reviewedBy} reviewedAt={service.reviewedAt} /></div>
        ) : null}
      </PageHeader>
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-prose space-y-12">
          {service.image ? <SanityImage image={service.image} alt={service.image.alt ?? ""} width={768} height={432} priority sizes="(min-width: 768px) 768px, 100vw" className="w-full rounded-lg object-cover" /> : null}
          <PortableText value={service.body} />
          {faqs.length ? (
            <section aria-labelledby="service-faqs">
              <Heading level={2} size={3} id="service-faqs" className="mb-6">Common questions</Heading>
              <FaqList items={faqs} />
              <JsonLd data={faqPageSchema(faqs)} />
            </section>
          ) : null}
        </div>
        {service.providers?.length ? (
          <section aria-labelledby="service-providers" className="mt-16">
            <Heading level={2} size={3} id="service-providers" className="mb-6">Providers for this service</Heading>
            <ul className="grid gap-5 md:grid-cols-2">
              {service.providers.map((p) => <ProviderCard key={p._id} provider={p} />)}
            </ul>
          </section>
        ) : null}
      </Container>
    </article>
  );
}
