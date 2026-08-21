import { PageView, pageMetadata, pageStaticParams } from "@/lib/page";

type Props = PageProps<"/[[...slug]]">;

export async function generateStaticParams() {
  return pageStaticParams("patients");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata("patients", slug);
}

export default async function PatientPage({ params }: Props) {
  const { slug } = await params;
  return <PageView audience="patients" parts={slug} />;
}
