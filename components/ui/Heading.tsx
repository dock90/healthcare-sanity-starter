import { cx } from "@/lib/cx";

type Level = 1 | 2 | 3 | 4;

const sizes: Record<Level, string> = {
  1: "text-4xl sm:text-5xl font-semibold",
  2: "text-3xl sm:text-4xl font-semibold",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
};

type Props = {
  /** Semantic level. Determines the tag. */
  level: Level;
  /** Visual size, when it should differ from the semantic level. */
  size?: Level;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

/**
 * Headings are always semantic. Use `level` for document outline and `size`
 * when a section heading needs to look smaller — never skip levels to get a size.
 */
export function Heading({ level, size, children, className, id }: Props) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={cx(sizes[size ?? level], className)}>
      {children}
    </Tag>
  );
}
