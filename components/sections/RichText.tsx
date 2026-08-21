import { PortableText } from "@/components/PortableText";
import { Section } from "./Section";
import type { SectionOf } from "./types";

export function RichText({ section }: { section: SectionOf<"richText"> }) {
  return (
    <Section className="py-10 sm:py-14">
      <PortableText value={section.body} className="mx-auto" />
    </Section>
  );
}
