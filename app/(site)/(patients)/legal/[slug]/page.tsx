import { notFound } from "next/navigation";
import { PortableText } from "@/components/PortableText";
import { PageHeader } from "@/components/content/PageHeader";
import { Container, Text } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { LEGAL_PAGE_QUERY, LEGAL_PAGE_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Props = PageProps<"/legal/[slug]">;

export async function generateStaticParams() {
  const rows = await client.fetch(LEGAL_PAGE_SLUGS_QUERY);
  return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug as string }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [{ data: page }, { data: settings }] = await Promise.all([
    sanityFetch({ query: LEGAL_PAGE_QUERY, params: { slug }, stega: false, tags: ["legalPage"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!page) return {};
  return buildMetadata({ title: page.title, description: `${page.title} for ${settings?.orgName ?? "this site"}, effective ${formatDate(page.effectiveDate)}.`, path: routes.legal(slug), settings });
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const { data: page } = await sanityFetch({ query: LEGAL_PAGE_QUERY, params: { slug }, tags: ["legalPage"] });
  if (!page) notFound();

  return (
    <article>
      <PageHeader crumbs={[]} title={page.title ?? ""}>
        <Text size="sm" muted className="mt-3">Effective {formatDate(page.effectiveDate)}</Text>
      </PageHeader>
      <Container className="py-12 lg:py-16">
        <PortableText value={page.body} className="mx-auto" />
      </Container>
    </article>
  );
}
