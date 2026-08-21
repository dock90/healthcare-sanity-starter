import { Button, Container, Heading, SanityImage, Text } from "@/components/ui";
import type { SectionOf } from "./types";

export function Hero({ section, isFirst }: { section: SectionOf<"hero">; isFirst: boolean }) {
  const { eyebrow, heading, text, image, buttons } = section;
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="max-w-prose">
          {eyebrow ? <Text size="sm" className="mb-3 font-medium uppercase tracking-wide text-accent-ink">{eyebrow}</Text> : null}
          {/* The first section of a page owns the h1. */}
          <Heading level={isFirst ? 1 : 2} size={1}>{heading}</Heading>
          {text ? <Text size="lg" muted className="mt-5">{text}</Text> : null}
          {buttons?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {buttons.map((b, i) =>
                b.href && b.label ? (
                  <Button key={b.href + i} href={b.href} variant={i === 0 ? "primary" : "secondary"}>
                    {b.label}
                  </Button>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
        {image ? (
          <SanityImage
            image={image}
            alt={image.alt ?? ""}
            width={640}
            height={480}
            priority={isFirst}
            sizes="(min-width: 1024px) 640px, 100vw"
            className="w-full rounded-lg object-cover"
          />
        ) : null}
      </Container>
    </section>
  );
}
