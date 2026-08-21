import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * Smoke tests run against a production build (`next start`) so what's tested
 * is what ships. A tiny webhook sink receives form posts.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: BASE, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : [
        { command: "node e2e/webhook-sink.mjs", port: 3999, reuseExistingServer: true },
        {
          command: `npm run start -- -p ${PORT}`,
          port: PORT,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: { FORM_WEBHOOK_URL: "http://localhost:3999/", NEXT_PUBLIC_SITE_URL: BASE },
        },
      ],
});
