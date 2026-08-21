import { notFound } from "next/navigation";
import { PortableText } from "@/components/PortableText";
import { MedicalReview } from "@/components/content/MedicalReview";
import { PageHeader } from "@/components/content/PageHeader";
import { Container, SanityImage } from "@/components/ui";
import { routes } from "@/lib/routes";
import { JsonLd, articleSchema, buildMetadata } from "@/lib/seo";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/live";
import { POST_QUERY, POST_SLUGS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Props = PageProps<"/blog/[slug]">;

export async function generateStaticParams() {
  const rows = await client.fetch(POST_SLUGS_QUERY);
  return rows.filter((r) => r.slug).map((r) => ({ slug: r.slug as string }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [{ data: post }, { data: settings }] = await Promise.all([
    sanityFetch({ query: POST_QUERY, params: { slug }, stega: false, tags: ["post"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!post) return {};
  return buildMetadata({ title: post.title, description: post.excerpt, path: routes.post(slug), seo: post.seo, settings, image: post.image, type: "article" });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [{ data: post }, { data: settings }] = await Promise.all([
    sanityFetch({ query: POST_QUERY, params: { slug }, tags: ["post"] }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] }),
  ]);
  if (!post) notFound();

  return (
    <article>
      <PageHeader crumbs={[{ name: "Health library", path: routes.blog() }]} title={post.title ?? ""} lede={post.excerpt}>
        <div className="mt-5">
          <MedicalReview author={post.author} publishedAt={post.publishedAt} reviewedBy={post.reviewedBy} reviewedAt={post.reviewedAt} />
        </div>
      </PageHeader>
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-prose space-y-10">
          {post.image ? <SanityImage image={post.image} alt={post.image.alt ?? ""} width={768} height={432} priority sizes="(min-width: 768px) 768px, 100vw" className="w-full rounded-lg object-cover" /> : null}
          <PortableText value={post.body} />
        </div>
      </Container>
      <JsonLd data={articleSchema(post, settings)} />
    </article>
  );
}
