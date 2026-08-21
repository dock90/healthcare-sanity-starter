import { loadEnvConfig } from "@next/env";
import { createClient } from "@sanity/client";

loadEnvConfig(process.cwd());

export function env(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Set it in .env.local (see .env.example).`);
    process.exit(1);
  }
  return value;
}

/** Write client for scripts. Needs SANITY_API_WRITE_TOKEN (Editor role). */
export function writeClient() {
  return createClient({
    projectId: env("NEXT_PUBLIC_SANITY_PROJECT_ID"),
    dataset: env("NEXT_PUBLIC_SANITY_DATASET"),
    apiVersion: "2026-08-01",
    token: env("SANITY_API_WRITE_TOKEN"),
    useCdn: false,
  });
}
