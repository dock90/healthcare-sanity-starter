import { Container } from "@/components/ui";
import { cx } from "@/lib/cx";

/** Shared vertical rhythm + optional band. Every section wraps in this. */
export function Section({ children, band, labelledBy, className }: {
  children: React.ReactNode;
  band?: boolean;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={cx("py-16 sm:py-24", band && "bg-surface-muted", className)}>
      <Container>{children}</Container>
    </section>
  );
}
