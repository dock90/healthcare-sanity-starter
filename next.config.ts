import type { NextConfig } from "next";
import { createClient } from "@sanity/client";

/**
 * Redirects come from `redirect` documents in Sanity and are compiled into
 * the build. Publish a redirect → redeploy (or let the revalidation webhook's
 * deploy hook do it). No middleware, no runtime lookups.
 */
type Redirect = { source: string; destination: string; permanent: boolean };

async function sanityRedirects(): Promise<Redirect[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return [];
  const client = createClient({ projectId, dataset, apiVersion: "2026-08-01", useCdn: false, perspective: "published" });
  try {
    const rows = await client.fetch<Array<{ from: string; to: string; permanent: boolean | null }>>(
      `*[_type == "redirect" && defined(from) && defined(to)] { from, to, permanent }`,
    );
    return rows
      .filter((r) => r.from.startsWith("/") && r.from !== r.to)
      .map((r) => ({ source: r.from, destination: r.to, permanent: r.permanent ?? true }));
  } catch (err) {
    console.warn(`[redirects] could not load redirects from Sanity: ${err instanceof Error ? err.message : err}`);
    return [];
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  redirects: sanityRedirects,
};

export default nextConfig;
