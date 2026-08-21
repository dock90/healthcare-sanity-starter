import NextImage from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";
import { cx } from "@/lib/cx";

type Props = {
  image: SanityImageSource | null | undefined;
  /**
   * Required on purpose. Pass `""` only for images that are purely decorative
   * and whose meaning is already in adjacent text.
   */
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Sanity image → next/image with explicit dimensions (no layout shift) and
 * the CDN's auto format. Renders nothing if the image is missing.
 */
export function SanityImage({ image, alt, width, height, priority, sizes, className }: Props) {
  if (!image) return null;
  const src = urlFor(image).width(width * 2).height(height * 2).url();
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className={cx("h-auto max-w-full", className)}
    />
  );
}
