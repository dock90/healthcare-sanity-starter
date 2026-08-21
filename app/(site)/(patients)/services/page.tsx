import NextLink from "next/link";
import { PageHeader } from "@/components/content/PageHeader";
import { Container, Heading, SanityImage, Text } from "@/components/ui";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/live";
import { SERVICES_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export async function generateMetadata() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] });
  return buildMetadata({ title: "Services", description: `Conditions we treat and services we offer at ${settings?.orgName ?? "our practice"}.`, path: routes.services(), settings });
}

export default async function ServicesIndex() {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY, tags: ["service"] });
  return (
    <>
      <PageHeader crumbs={[]} title="Services" lede="What we treat, how we treat it, and who you'll see." />
      <Container className="py-12 lg:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) =>
            s.slug ? (
              <li key={s._id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-card">
                {s.image ? <SanityImage image={s.image} alt={s.image.alt ?? ""} width={480} height={270} sizes="(min-width: 640px) 400px, 100vw" className="rounded-lg object-cover" /> : null}
                <Heading level={2} size={4}>
                  <NextLink href={routes.service(s.slug)} className="hover:text-accent-ink underline-offset-4 hover:underline">{s.title}</NextLink>
                </Heading>
                {s.summary ? <Text muted>{s.summary}</Text> : null}
              </li>
            ) : null,
          )}
        </ul>
      </Container>
    </>
  );
}
