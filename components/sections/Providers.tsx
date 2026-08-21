import { Heading } from "@/components/ui";
import { ProviderCard } from "@/components/content/ProviderCard";
import { Section } from "./Section";
import type { SectionOf } from "./types";

export function Providers({ section }: { section: SectionOf<"providers"> }) {
  const id = `providers-${section._key}`;
  return (
    <Section labelledBy={id}>
      <Heading level={2} id={id} className="mb-8">{section.heading ?? "Our providers"}</Heading>
      <ul className="grid gap-5 md:grid-cols-2">
        {section.items?.map((p) => <ProviderCard key={p._id} provider={p} />)}
      </ul>
    </Section>
  );
}
