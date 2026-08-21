import { PageHeader } from "@/components/content/PageHeader";
import { LocationCard } from "@/components/content/LocationCard";
import { Container } from "@/components/ui";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/live";
import { LOCATIONS_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

export async function generateMetadata() {
  const { data: settings } = await sanityFetch({ query: SETTINGS_QUERY, stega: false, tags: ["settings"] });
  return buildMetadata({ title: "Locations", description: `${settings?.orgName ?? "Our"} clinic locations, hours and phone numbers.`, path: routes.locations(), settings });
}

export default async function LocationsIndex() {
  const { data: locations } = await sanityFetch({ query: LOCATIONS_QUERY, tags: ["location"] });
  return (
    <>
      <PageHeader crumbs={[]} title="Locations" lede="Addresses, hours and direct phone numbers for every clinic." />
      <Container className="py-12 lg:py-16">
        <ul className="grid gap-6 md:grid-cols-2">
          {locations.map((l) => <LocationCard key={l._id} location={l} />)}
        </ul>
      </Container>
    </>
  );
}
