import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Pages every build must render, and that axe must pass on. */
const PAGES = [
  { name: "home", path: "/", heading: /Care that knows your name/ },
  { name: "provider", path: "/providers/desai", heading: /Anika Desai, MD/ },
  { name: "contact", path: "/contact", heading: /Contact us/ },
] as const;

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations, JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), null, 2)).toEqual([]);
}

for (const p of PAGES) {
  test(`${p.name} renders and passes axe`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.heading);
    await expect(page.getByRole("dialog", { name: /cookies/i })).toBeVisible();
    await expectNoA11yViolations(page);
    // Skip link is the first focusable element.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  });
}

test("home has Organization JSON-LD and a canonical", async ({ page }) => {
  await page.goto("/");
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((s) => s.includes('"MedicalOrganization"'))).toBe(true);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
});

test("provider page has Physician JSON-LD", async ({ page }) => {
  await page.goto("/providers/desai");
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((s) => s.includes('"Physician"'))).toBe(true);
});

test("consent: nothing loads before accept, gtag after", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  expect(requests.some((u) => u.includes("googletagmanager.com"))).toBe(false);
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.getByRole("dialog", { name: /cookies/i })).toBeHidden();
  await page.reload();
  await expect(page.getByRole("dialog", { name: /cookies/i })).toBeHidden();
  expect(requests.some((u) => u.includes("googletagmanager.com"))).toBe(false);
});

test("contact form submits through Turnstile (test key) and shows success", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await page.getByLabel(/Your name/).fill("Test Person");
  await page.getByLabel(/Email/).fill("test@example.com");
  await page.getByLabel(/What is this about/).selectOption("Billing");
  await page.getByLabel(/Message/).fill("This is an automated smoke test. No health information here.");
  // Turnstile's always-pass test key renders a token without interaction.
  await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue("", { timeout: 20_000 });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText(/received your message/i, { timeout: 15_000 });
});

test("contact form reports missing required fields accessibly", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Necessary only" }).click();
  await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue("", { timeout: 20_000 });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert").filter({ hasText: /fix the highlighted fields/i })).toBeVisible();
  await expect(page.getByLabel(/Your name/)).toHaveAttribute("aria-invalid", "true");
});

test("unknown paths return the 404 page", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/find that page/);
});
