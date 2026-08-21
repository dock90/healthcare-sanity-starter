import NextLink from "next/link";
import type { StegaBranded } from "next-sanity";
import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";

type Settings = StegaBranded<SETTINGS_QUERY_RESULT>;
import { Container, SanityImage } from "@/components/ui";
import { routes, type Audience } from "@/lib/routes";
import { HeaderNav } from "./HeaderNav";

export function Header({ settings, audience }: { settings: Settings; audience: Audience }) {
  const nav = audience === "providers" ? settings?.providersNav : settings?.patientsNav;
  const other: Audience = audience === "providers" ? "patients" : "providers";
  return (
    <header className="border-b border-border bg-surface">
      <Container>
        <div className="flex items-center justify-end gap-4 py-1 text-xs">
          <span className="sr-only">Viewing the site for {audience}.</span>
          <NextLink href={routes.home(other)} className="inline-flex min-h-9 items-center text-ink-muted underline-offset-4 hover:text-accent-ink hover:underline">
            {other === "providers" ? "For referring providers" : "For patients"} →
          </NextLink>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-4">
          <NextLink href={routes.home(audience)} className="inline-flex min-h-target items-center gap-3 text-xl font-semibold">
            {settings?.logo ? (
              <SanityImage image={settings.logo} alt={settings.logo.alt ?? settings.orgName ?? ""} width={40} height={40} sizes="40px" className="h-10 w-10" />
            ) : null}
            <span>{settings?.orgName ?? "Site"}</span>
          </NextLink>
          <HeaderNav
            links={nav?.header ?? []}
            cta={nav?.cta ?? null}
            label={audience === "providers" ? "Provider navigation" : "Main navigation"}
          />
        </div>
      </Container>
    </header>
  );
}
