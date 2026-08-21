import { PortableText as PT, type PortableTextComponents } from "@portabletext/react";
import type { StegaBranded } from "next-sanity";
import type { PortableText as PortableTextValue } from "@/sanity/types";
import { SanityImage } from "@/components/ui";
import { Link } from "@/components/ui";
import { cx } from "@/lib/cx";

/** The one Portable Text renderer. Styles come from `.prose-clinic` in globals.css. */
const components: PortableTextComponents = {
  types: {
    imageWithAlt: ({ value }) => (
      <figure className="my-8">
        <SanityImage image={value} alt={value.alt ?? ""} width={768} height={512} className="rounded-lg" sizes="(min-width: 768px) 768px, 100vw" />
      </figure>
    ),
  },
  marks: {
    link: ({ children, value }) => <Link href={value?.href ?? "#"}>{children}</Link>,
  },
};

export function PortableText({ value, className }: { value: PortableTextValue | StegaBranded<PortableTextValue> | null | undefined; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cx("prose-clinic", className)}>
      <PT value={value} components={components} />
    </div>
  );
}
