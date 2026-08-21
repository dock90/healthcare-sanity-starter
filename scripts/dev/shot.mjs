// usage: node shot.mjs <url> <out.png> [waitMs] [width]
import { chromium } from "@playwright/test";
const [url, out, waitMs = "4000", width = "1280"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 400)); });
page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 400)));
await page.goto(url, { waitUntil: "networkidle", timeout: 120000 }).catch((e) => errors.push("NAV " + e.message));
await page.waitForTimeout(Number(waitMs));
await page.screenshot({ path: out, fullPage: true });
console.log(JSON.stringify({ title: await page.title(), errors }, null, 2));
await browser.close();
