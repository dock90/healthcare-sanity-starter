import { Button, Heading, Text } from "@/components/ui";
import { Section } from "./Section";
import type { SectionOf } from "./types";

export function Cta({ section }: { section: SectionOf<"cta"> }) {
  const id = `cta-${section._key}`;
  return (
    <Section band labelledBy={id}>
      <div className="mx-auto max-w-prose text-center">
        <Heading level={2} id={id}>{section.heading}</Heading>
        {section.text ? <Text size="lg" muted className="mt-4">{section.text}</Text> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {section.buttons?.map((b, i) =>
            b.href && b.label ? (
              <Button key={b.href + i} href={b.href} variant={i === 0 ? "primary" : "secondary"}>{b.label}</Button>
            ) : null,
          )}
        </div>
      </div>
    </Section>
  );
}
