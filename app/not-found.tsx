import { SiteShell } from "@/components/layout/SiteShell";
import { Button, Container, Heading, Text } from "@/components/ui";
import { routes } from "@/lib/routes";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <SiteShell audience="patients">
      <Container width="prose" className="py-24 text-center">
        <Text size="sm" className="mb-3 font-medium uppercase tracking-wide text-accent-ink">404</Text>
        <Heading level={1}>We couldn&apos;t find that page</Heading>
        <Text size="lg" muted className="mt-5">
          The address may have changed, or the page may have been removed. If you followed a link from another site, let us know so we can fix it.
        </Text>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={routes.home()}>Go to the homepage</Button>
          <Button href={routes.locations()} variant="secondary">Find a location</Button>
        </div>
      </Container>
    </SiteShell>
  );
}
