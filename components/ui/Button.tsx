import NextLink from "next/link";
import { cx } from "@/lib/cx";
import { isExternal } from "@/lib/routes";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-target items-center justify-center gap-2 rounded px-5 py-2.5 text-base font-medium " +
  "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-ink-inverse hover:bg-accent-hover",
  secondary: "border-2 border-accent text-accent-ink hover:bg-accent-soft",
  ghost: "text-accent-ink underline underline-offset-4 hover:text-accent",
};

type Common = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type AsButton = Common & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

type AsLink = Common & {
  /** Internal path or external URL. External opens in the same tab, users can choose. */
  href: string;
};

type Props = AsButton | AsLink;

/**
 * One button. Renders `<a>` when given `href` so that navigation stays
 * navigation (works without JS, shows in the status bar, supports open-in-new-tab).
 */
export function Button(props: Props) {
  const { variant = "primary", className, children } = props;
  const classes = cx(base, variants[variant], className);

  if (props.href !== undefined) {
    const external = isExternal(props.href);
    return external ? (
      <a href={props.href} className={classes} rel="noopener">
        {children}
      </a>
    ) : (
      <NextLink href={props.href} className={classes}>
        {children}
      </NextLink>
    );
  }

  const { type = "button", disabled, onClick } = props;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
