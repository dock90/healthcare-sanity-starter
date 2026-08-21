"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Link } from "@/components/ui";
import { cx } from "@/lib/cx";

type NavLink = { label: string | null; href: string | null };

/**
 * Primary navigation. Inline on ≥768px; behind a toggle below that.
 * The toggle is a real button with aria-expanded / aria-controls, and the
 * nav is a <nav> with an accessible name either way.
 */
export function HeaderNav({ links, cta, label }: { links: NavLink[]; cta: NavLink | null; label: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const pathname = usePathname();
  const items = links.filter((l): l is { label: string; href: string } => Boolean(l.label && l.href));

  return (
    <>
      <button
        type="button"
        className="inline-flex min-h-target min-w-target items-center justify-center rounded border border-border-strong px-3 font-medium md:hidden"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id={id}
        aria-label={label}
        className={cx(
          "basis-full md:flex md:basis-auto md:items-center md:gap-1",
          open ? "mt-3 flex flex-col gap-1 border-t border-border pt-3" : "hidden",
        )}
      >
        {items.map((l) => (
          <Link key={l.href} href={l.href} kind="nav" current={pathname === l.href}>
            {l.label}
          </Link>
        ))}
        {cta?.href && cta.label ? (
          <Button href={cta.href} className="mt-2 md:ml-3 md:mt-0">{cta.label}</Button>
        ) : null}
      </nav>
    </>
  );
}
