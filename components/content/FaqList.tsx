import type { StegaBranded } from "next-sanity";
import type { PortableText as PortableTextValue } from "@/sanity/types";
import { PortableText } from "@/components/PortableText";

export type FaqItem = StegaBranded<{ _id: string; question: string | null; answer: PortableTextValue | null }>;

/**
 * Native <details>/<summary>: keyboard accessible, no JS, announced as a
 * disclosure by screen readers. FAQPage JSON-LD is emitted by the section.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((faq) => (
        <details key={faq._id} className="group py-2">
          <summary className="flex min-h-target cursor-pointer list-none items-center justify-between gap-4 py-2 text-lg font-medium marker:content-none [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span aria-hidden="true" className="shrink-0 text-accent transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="pb-4">
            <PortableText value={faq.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}
