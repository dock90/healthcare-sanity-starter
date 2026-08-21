import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Build a Sanity CDN URL. Always pass through `auto('format')` for AVIF/WebP. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
