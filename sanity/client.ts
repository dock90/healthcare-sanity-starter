import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/**
 * The one Sanity client. Read-only, CDN on, published perspective.
 * Draft Mode and tokens are layered on by `sanity/live.ts`; scripts that
 * write use their own client with SANITY_API_WRITE_TOKEN.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: { studioUrl: "/studio" },
});
