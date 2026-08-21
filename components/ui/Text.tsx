import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  size?: "sm" | "base" | "lg";
  muted?: boolean;
  className?: string;
  as?: "p" | "span" | "div";
};

export function Text({ children, size = "base", muted, className, as: Tag = "p" }: Props) {
  return (
    <Tag
      className={cx(
        size === "sm" && "text-sm",
        size === "base" && "text-base",
        size === "lg" && "text-lg",
        muted && "text-ink-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
