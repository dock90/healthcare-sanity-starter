import { Cards } from "./Cards";
import { Cta } from "./Cta";
import { Faqs } from "./Faqs";
import { Form } from "./Form";
import { Hero } from "./Hero";
import { Locations } from "./Locations";
import { Providers } from "./Providers";
import { RichText } from "./RichText";
import type { Section } from "./types";

/**
 * The one section renderer. Keyed by `_type`; the switch is exhaustive so a
 * new section type fails typecheck until it's handled here.
 */
export function Sections({ sections }: { sections: Section[] | null }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((section, index) => (
        <SectionSwitch key={section._key} section={section} isFirst={index === 0} />
      ))}
    </>
  );
}

function SectionSwitch({ section, isFirst }: { section: Section; isFirst: boolean }) {
  switch (section._type) {
    case "hero":
      return <Hero section={section} isFirst={isFirst} />;
    case "richText":
      return <RichText section={section} />;
    case "cta":
      return <Cta section={section} />;
    case "cards":
      return <Cards section={section} />;
    case "faqs":
      return <Faqs section={section} />;
    case "providers":
      return <Providers section={section} />;
    case "locations":
      return <Locations section={section} />;
    case "form":
      return <Form section={section} />;
    default: {
      const exhaustive: never = section;
      return exhaustive;
    }
  }
}
