import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "./env";

/**
 * `sanityFetch` — the only way the site reads content.
 *  - Published perspective, CDN, cached with Sanity sync tags.
 *  - In Draft Mode (opened from the Studio's Presentation tool) it switches to
 *    drafts, disables the cache and enables stega overlays.
 * `SanityLive` — mounted once in the root layout; revalidates tagged caches
 *  when content changes, so publishes appear without a redeploy.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
});
