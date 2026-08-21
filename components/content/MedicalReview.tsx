import { Text } from "@/components/ui";
import { formatDate, personName } from "@/lib/format";

type Person = { name: string | null; credentials: string | null; role: string | null } | null;

/**
 * The E-E-A-T byline. Rendered wherever `reviewedBy` is set; the same data
 * goes into Article JSON-LD via lib/seo.
 */
export function MedicalReview({ author, reviewedBy, reviewedAt, publishedAt }: {
  author?: Person;
  reviewedBy: Person;
  reviewedAt: string | null;
  publishedAt?: string | null;
}) {
  if (!author && !reviewedBy) return null;
  return (
    <Text size="sm" muted as="div" className="flex flex-wrap gap-x-4 gap-y-1 border-l-2 border-accent pl-3">
      {author ? (
        <span>
          Written by <span className="font-medium text-ink">{personName(author)}</span>
          {publishedAt ? <> · {formatDate(publishedAt)}</> : null}
        </span>
      ) : null}
      {reviewedBy ? (
        <span>
          Medically reviewed by <span className="font-medium text-ink">{personName(reviewedBy)}</span>
          {reviewedAt ? <> · {formatDate(reviewedAt)}</> : null}
        </span>
      ) : null}
    </Text>
  );
}
