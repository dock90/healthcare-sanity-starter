import NextLink from "next/link";
import { PageHeader } from "@/components/content/PageHeader";
import { Container, Heading, SanityImage, Text } from "@/components/ui";
import { formatDate, personName } from "@/lib/format";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/live";
import { POSTS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export async function generateMetadata() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] });
  return buildMetadata({ title: "Health library", description: `Plain-language articles from the clinicians at ${settings?.orgName ?? "our practice"}, each reviewed for accuracy.`, path: routes.blog(), settings });
}

export default async function BlogIndex() {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY, tags: ["post"] });
  return (
    <>
      <PageHeader crumbs={[]} title="Health library" lede="Plain-language articles written by our team and reviewed by a clinician." />
      <Container className="py-12 lg:py-16">
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) =>
            p.slug ? (
              <li key={p._id} className="flex flex-col gap-3">
                {p.image ? <SanityImage image={p.image} alt={p.image.alt ?? ""} width={480} height={270} sizes="(min-width: 640px) 400px, 100vw" className="rounded-lg object-cover" /> : null}
                <Heading level={2} size={4}>
                  <NextLink href={routes.post(p.slug)} className="hover:text-accent-ink underline-offset-4 hover:underline">{p.title}</NextLink>
                </Heading>
                {p.excerpt ? <Text muted>{p.excerpt}</Text> : null}
                <Text size="sm" muted>
                  {formatDate(p.publishedAt)}
                  {p.reviewedBy ? <> · Reviewed by {personName(p.reviewedBy)}</> : null}
                </Text>
              </li>
            ) : null,
          )}
        </ul>
      </Container>
    </>
  );
}
