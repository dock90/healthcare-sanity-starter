/**
 * Sanity environment. Read once, validated once. Everything else imports from here.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const projectId = required(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
export const dataset = required(
  "NEXT_PUBLIC_SANITY_DATASET",
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-01";

/** Server-only. Undefined in the browser and when preview is not configured. */
export const readToken = process.env.SANITY_API_READ_TOKEN;
