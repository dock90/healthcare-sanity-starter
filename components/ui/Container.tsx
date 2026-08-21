import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  /** `site` (72rem) for layout, `prose` (42rem) for reading. */
  width?: "site" | "prose";
  className?: string;
  as?: "div" | "section" | "nav" | "header" | "footer";
};

export function Container({ children, width = "site", className, as: Tag = "div" }: Props) {
  return (
    <Tag
      className={cx(
        "mx-auto w-full px-5 sm:px-8",
        width === "site" ? "max-w-site" : "max-w-prose",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
