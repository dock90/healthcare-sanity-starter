import { PageView, pageMetadata, pageStaticParams } from "@/lib/page";

type Props = PageProps<"/for-providers/[[...slug]]">;

export async function generateStaticParams() {
  return pageStaticParams("providers");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata("providers", slug);
}

export default async function ProviderAudiencePage({ params }: Props) {
  const { slug } = await params;
  return <PageView audience="providers" parts={slug} />;
}
