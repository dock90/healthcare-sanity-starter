import { PageHeader } from "@/components/content/PageHeader";
import { ProviderCard } from "@/components/content/ProviderCard";
import { Container } from "@/components/ui";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/live";
import { PROVIDERS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export async function generateMetadata() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] });
  return buildMetadata({ title: "Providers", description: `Meet the clinicians at ${settings?.orgName ?? "our practice"}.`, path: routes.providers(), settings });
}

export default async function ProvidersIndex() {
  const { data: providers } = await sanityFetch({ query: PROVIDERS_QUERY, tags: ["provider"] });
  return (
    <>
      <PageHeader crumbs={[]} title="Providers" lede="Every clinician on our team, with where they see patients and whether they're accepting new ones." />
      <Container className="py-12 lg:py-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {providers.map((p) => <ProviderCard key={p._id} provider={p} />)}
        </ul>
      </Container>
    </>
  );
}
