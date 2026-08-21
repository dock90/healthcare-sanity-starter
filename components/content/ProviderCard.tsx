import NextLink from "next/link";
import type { StegaBranded } from "next-sanity";
import type { LOCATION_QUERY_RESULT } from "@/sanity/types";
import { SanityImage, Text } from "@/components/ui";
import { personName } from "@/lib/format";
import { routes } from "@/lib/routes";

export type ProviderCardData = StegaBranded<NonNullable<NonNullable<LOCATION_QUERY_RESULT>["providers"]>[number]>;

export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  if (!provider.slug) return null;
  const name = personName(provider);
  return (
    <li className="flex gap-4 rounded-lg border border-border bg-surface p-4 shadow-card">
      <SanityImage
        image={provider.headshot}
        alt=""
        width={96}
        height={96}
        sizes="96px"
        className="h-24 w-24 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0">
        <h3 className="text-xl font-semibold">
          <NextLink href={routes.provider(provider.slug)} className="hover:text-accent-ink underline-offset-4 hover:underline">
            {name}
          </NextLink>
        </h3>
        <Text size="sm" muted>{provider.title}</Text>
        {provider.specialties?.length ? (
          <Text size="sm" muted className="mt-1">{provider.specialties.join(" · ")}</Text>
        ) : null}
        <AcceptingBadge accepting={provider.acceptingPatients} />
      </div>
    </li>
  );
}

export function AcceptingBadge({ accepting }: { accepting: boolean | null }) {
  if (accepting === null) return null;
  return (
    <p className="mt-2 inline-flex items-center gap-1.5 rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-ink">
      <span aria-hidden="true" className={accepting ? "text-success" : "text-ink-muted"}>●</span>
      {accepting ? "Accepting new patients" : "Not accepting new patients"}
    </p>
  );
}
