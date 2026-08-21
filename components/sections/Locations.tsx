import { Heading } from "@/components/ui";
import { LocationCard } from "@/components/content/LocationCard";
import { Section } from "./Section";
import type { SectionOf } from "./types";

export function Locations({ section }: { section: SectionOf<"locations"> }) {
  const id = `locations-${section._key}`;
  return (
    <Section band labelledBy={id}>
      <Heading level={2} id={id} className="mb-8">{section.heading ?? "Locations"}</Heading>
      <ul className="grid gap-6 md:grid-cols-2">
        {section.items?.map((l) => <LocationCard key={l._id} location={l} />)}
      </ul>
    </Section>
  );
}
