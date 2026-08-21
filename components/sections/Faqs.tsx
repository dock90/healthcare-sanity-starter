import { Heading } from "@/components/ui";
import { FaqList } from "@/components/content/FaqList";
import { JsonLd, faqPageSchema } from "@/lib/seo";
import { Section } from "./Section";
import type { SectionOf } from "./types";

export function Faqs({ section }: { section: SectionOf<"faqs"> }) {
  const id = `faqs-${section._key}`;
  const items = section.items ?? [];
  return (
    <Section labelledBy={id}>
      <div className="mx-auto max-w-prose">
        <Heading level={2} id={id} className="mb-8">{section.heading ?? "Frequently asked questions"}</Heading>
        <FaqList items={items} />
      </div>
      <JsonLd data={faqPageSchema(items)} />
    </Section>
  );
}
