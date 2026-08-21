import NextLink from "next/link";
import { Heading, SanityImage, Text } from "@/components/ui";
import { isExternal } from "@/lib/routes";
import { Section } from "./Section";
import type { SectionOf } from "./types";

export function Cards({ section }: { section: SectionOf<"cards"> }) {
  const id = `cards-${section._key}`;
  return (
    <Section labelledBy={section.heading ? id : undefined}>
      {section.heading ? (
        <div className="mb-10 max-w-prose">
          <Heading level={2} id={id}>{section.heading}</Heading>
          {section.intro ? <Text size="lg" muted className="mt-3">{section.intro}</Text> : null}
        </div>
      ) : null}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {section.items?.map((card) => {
          const title = card.link?.href ? (
            isExternal(card.link.href) ? (
              <a href={card.link.href} rel="noopener" className="hover:text-accent-ink underline-offset-4 hover:underline">{card.title}</a>
            ) : (
              <NextLink href={card.link.href} className="hover:text-accent-ink underline-offset-4 hover:underline">{card.title}</NextLink>
            )
          ) : (
            card.title
          );
          return (
            <li key={card._key} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-card">
              {card.image ? (
                <SanityImage image={card.image} alt={card.image.alt ?? ""} width={480} height={270} sizes="(min-width: 640px) 400px, 100vw" className="rounded-lg object-cover" />
              ) : null}
              <Heading level={3} size={4}>{title}</Heading>
              {card.text ? <Text muted>{card.text}</Text> : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
