import { Heading, Text } from "@/components/ui";
import { Section } from "./Section";
import type { SectionOf } from "./types";

/** Placeholder until the form server action lands (build step 7). */
export function Form({ section }: { section: SectionOf<"form"> }) {
  const id = `form-${section._key}`;
  return (
    <Section labelledBy={id}>
      <div className="mx-auto max-w-prose">
        <Heading level={2} id={id}>{section.heading}</Heading>
        {section.text ? <Text muted className="mt-3">{section.text}</Text> : null}
      </div>
    </Section>
  );
}
