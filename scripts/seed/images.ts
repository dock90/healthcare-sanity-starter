/**
 * Placeholder imagery for the demo, generated at seed time with sharp so the
 * repo carries no binaries. Calm, abstract, on-palette. Replace with real
 * photography on a real site (and write real alt text).
 */
import sharp from "sharp";

const PALETTE = ["#0b5f5c", "#137f7a", "#e2efee", "#f1ede7", "#c9ddd9", "#8fbcb7"];

function svg(width: number, height: number, seed: number): string {
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const shapes = Array.from({ length: 6 }, () => {
    const r = Math.round((0.25 + rand() * 0.5) * Math.min(width, height));
    return `<circle cx="${Math.round(rand() * width)}" cy="${Math.round(rand() * height)}" r="${r}" fill="${PALETTE[Math.floor(rand() * PALETTE.length)]}" opacity="${(0.35 + rand() * 0.4).toFixed(2)}"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#f1ede7"/>${shapes}
  </svg>`;
}

/** Abstract scene (hero, location, service, post). */
export async function scene(seed: number, width = 1600, height = 1000): Promise<Buffer> {
  return sharp(Buffer.from(svg(width, height, seed))).blur(40).jpeg({ quality: 82 }).toBuffer();
}

/** Neutral portrait placeholder: soft background + initials. */
export async function portrait(initials: string, seed: number): Promise<Buffer> {
  const size = 800;
  const bg = PALETTE[seed % 2 === 0 ? 0 : 1];
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bg}"/>
    <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.17}" fill="#ffffff" opacity="0.92"/>
    <ellipse cx="${size / 2}" cy="${size * 0.92}" rx="${size * 0.36}" ry="${size * 0.3}" fill="#ffffff" opacity="0.92"/>
    <text x="50%" y="${size * 0.41}" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial, sans-serif" font-size="${size * 0.11}" font-weight="600" fill="${bg}">${initials}</text>
  </svg>`;
  return sharp(Buffer.from(image)).jpeg({ quality: 85 }).toBuffer();
}

/** Simple wordmark logo. */
export async function logo(): Promise<Buffer> {
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="256" height="256" rx="48" fill="#0b5f5c"/>
    <path d="M64 140 L104 100 L128 124 L152 100 L192 140" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`;
  return sharp(Buffer.from(image)).png().toBuffer();
}
