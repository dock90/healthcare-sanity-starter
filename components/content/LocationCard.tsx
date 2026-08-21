import NextLink from "next/link";
import type { StegaBranded } from "next-sanity";
import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { SanityImage, Text } from "@/components/ui";
import { formatDays, formatTime } from "@/lib/format";
import { routes, telHref } from "@/lib/routes";

export type LocationCardData = StegaBranded<NonNullable<NonNullable<NonNullable<SETTINGS_QUERY_RESULT>["contact"]>["primaryLocation"]>>;

export function Address({ address, oneLine }: { address: LocationCardData["address"]; oneLine?: boolean }) {
  if (!address) return null;
  return oneLine ? (
    <span>{`${address.street}, ${address.city}, ${address.region} ${address.postalCode}`}</span>
  ) : (
    <address className="not-italic">
      {address.street}
      <br />
      {address.city}, {address.region} {address.postalCode}
    </address>
  );
}

export function Hours({ hours }: { hours: LocationCardData["hours"] }) {
  if (!hours?.length) return null;
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      {hours.map((h) => (
        <div key={h._key} className="contents">
          <dt className="font-medium">{formatDays(h.days)}</dt>
          <dd className="text-ink-muted">
            {formatTime(h.opens)}–{formatTime(h.closes)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function LocationCard({ location }: { location: LocationCardData }) {
  if (!location.slug) return null;
  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-card">
      <SanityImage
        image={location.image}
        alt={location.image?.alt ?? ""}
        width={480}
        height={280}
        sizes="(min-width: 640px) 480px, 100vw"
        className="rounded-lg object-cover"
      />
      <h3 className="text-xl font-semibold">
        <NextLink href={routes.location(location.slug)} className="hover:text-accent-ink underline-offset-4 hover:underline">
          {location.name}
        </NextLink>
      </h3>
      <Text size="sm" muted as="div">
        <Address address={location.address} />
      </Text>
      {location.phone ? (
        <a href={telHref(location.phone)} className="inline-flex min-h-target items-center text-accent-ink underline underline-offset-4">
          {location.phone}
        </a>
      ) : null}
      <Hours hours={location.hours} />
    </li>
  );
}
