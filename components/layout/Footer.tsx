import NextLink from "next/link";
import type { StegaBranded } from "next-sanity";
import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";

type Settings = StegaBranded<SETTINGS_QUERY_RESULT>;
import { Container, Link, Text } from "@/components/ui";
import { Address } from "@/components/content/LocationCard";
import { telHref, type Audience } from "@/lib/routes";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function Footer({ settings, audience }: { settings: Settings; audience: Audience }) {
  const nav = audience === "providers" ? settings?.providersNav : settings?.patientsNav;
  const loc = settings?.contact?.primaryLocation;
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-surface-muted py-12 text-sm">
      <Container className="grid gap-10 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-lg font-semibold">{settings?.orgName}</p>
          {settings?.tagline ? <Text size="sm" muted>{settings.tagline}</Text> : null}
          {loc?.address ? (
            <Text size="sm" muted as="div">
              <Address address={loc.address} />
            </Text>
          ) : null}
          {settings?.contact?.phone ? (
            <a href={telHref(settings.contact.phone)} className="inline-flex min-h-target items-center text-accent-ink underline underline-offset-4">
              {settings.contact.phone}
            </a>
          ) : null}
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-1 sm:grid-cols-2">
            {nav?.footer?.map((l) =>
              l.href && l.label ? (
                <li key={l.href}>
                  <Link href={l.href} kind="nav" className="px-0">{l.label}</Link>
                </li>
              ) : null,
            )}
            <li><CookieSettingsButton /></li>
          </ul>
        </nav>
        <div className="space-y-3">
          {settings?.social?.length ? (
            <ul className="flex flex-wrap gap-x-4">
              {settings.social.map((s) =>
                s.href && s.label ? (
                  <li key={s.href}>
                    <Link href={s.href} kind="nav" className="px-0">{s.label}</Link>
                  </li>
                ) : null,
              )}
            </ul>
          ) : null}
          <Text size="xs" muted as="p">
            © {year} {settings?.orgName}. If this is a medical emergency, call 911.
          </Text>
          {/* Remove this line if you like — it's how people find the starter. */}
          <Text size="xs" muted as="p">
            Built with the{" "}
            <NextLink href="https://github.com/dock90/healthcare-sanity-starter" className="underline underline-offset-4 hover:text-accent-ink">
              Healthcare Sanity Starter
            </NextLink>
          </Text>
        </div>
      </Container>
    </footer>
  );
}
