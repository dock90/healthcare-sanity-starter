// Regenerate docs/screenshot.png from a running site: node scripts/dev/screenshot.mjs [baseUrl]
import { chromium } from "@playwright/test";
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Necessary only" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "docs/screenshot.png", clip: { x: 0, y: 0, width: 1280, height: 800 } });
await browser.close();
console.log("wrote docs/screenshot.png");
