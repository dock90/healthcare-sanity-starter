import NextLink from "next/link";
import { cx } from "@/lib/cx";
import { isExternal } from "@/lib/routes";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Set on the current nav item. */
  current?: boolean;
  /** Force inline (underlined text link) vs nav (padded, 44px target). */
  kind?: "inline" | "nav";
};

const kinds = {
  inline:
    "text-accent-ink underline underline-offset-4 decoration-[1.5px] hover:text-accent rounded-sm",
  nav: "inline-flex min-h-target items-center rounded px-3 py-2 font-medium text-ink hover:text-accent-ink hover:bg-accent-soft",
};

/** One link. Internal hrefs get client navigation; external get `rel="noopener"`. */
export function Link({ href, children, className, current, kind = "inline" }: Props) {
  const classes = cx(kinds[kind], current && "text-accent-ink underline underline-offset-8", className);
  const external = isExternal(href);
  if (external) {
    return (
      <a href={href} className={classes} rel="noopener">
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} className={classes} aria-current={current ? "page" : undefined}>
      {children}
    </NextLink>
  );
}
