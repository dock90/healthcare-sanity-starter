import NextLink from "next/link";
import { Container, Heading, Text } from "@/components/ui";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

type Crumb = { name: string; path: string };

/** Title block + breadcrumb for detail routes (provider, location, service, post, legal). */
export function PageHeader({ crumbs, title, lede, children }: {
  crumbs: Crumb[];
  title: string;
  lede?: string | null;
  children?: React.ReactNode;
}) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs, { name: title, path: crumbs.length ? `${crumbs[crumbs.length - 1].path}#` : "/" }];
  return (
    <div className="border-b border-border bg-surface py-10 sm:py-14">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-muted">
          <ol className="flex flex-wrap items-center gap-x-2">
            {all.slice(0, -1).map((c) => (
              <li key={c.path} className="flex items-center gap-x-2">
                <NextLink href={c.path} className="inline-flex min-h-9 items-center underline-offset-4 hover:text-accent-ink hover:underline">{c.name}</NextLink>
                <span aria-hidden="true">/</span>
              </li>
            ))}
            <li aria-current="page" className="text-ink">{title}</li>
          </ol>
        </nav>
        <Heading level={1} size={2}>{title}</Heading>
        {lede ? <Text size="lg" muted className="mt-4 max-w-prose">{lede}</Text> : null}
        {children}
      </Container>
      <JsonLd data={breadcrumbSchema(all.slice(0, -1).concat({ name: title, path: all[all.length - 1].path.replace(/#$/, "") }))} />
    </div>
  );
}
