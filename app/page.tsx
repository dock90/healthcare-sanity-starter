import { Button, Container, Heading, Link, SkipLink, Text } from "@/components/ui";

export default function Home() {
  return (
    <>
      <SkipLink />
      <main id="main" className="py-20">
        <Container width="prose" className="space-y-6">
          <Heading level={1}>Calm clinic</Heading>
          <Text size="lg" muted>
            Design-system preview. Warm ground, near-black text, one teal accent.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button href="/studio">Open Studio</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <Text>
            Body copy with an <Link href="/studio">inline link</Link> inside.
          </Text>
        </Container>
      </main>
    </>
  );
}
