# Migrating a site onto the starter

Most healthcare sites that land on this starter are replacing something: a WordPress install nobody dares update, an agency-built Drupal site, a page builder. The risk in a migration isn't the new site, it's losing the rankings, links and bookmarks the old one earned. This kit is about not losing them.

## The kit

| Piece | What it does |
|---|---|
| `redirect` documents | Editors manage old → new paths in the Studio (Site → Redirects). Compiled into `next.config.ts` at build time as 308/307s. |
| `npm run import-redirects -- file.csv` | Bulk-loads a CSV of `from,to,permanent` into `redirect` documents. Deterministic IDs, so re-running updates instead of duplicating. `--dry-run` validates without writing. |
| `npm run check-url-parity -- --old https://old-host --new https://new-host` | Reads the old site's sitemap, requests every path on the new host, reports anything that isn't a 200 or a 301/308. Exit code 1 on failures so it can gate a launch. |

Redirects are **exact-match paths**, on purpose. Wildcard and regex redirects are where migrations go wrong (`/services/*` → `/` is how a site loses half its rankings). If you have a pattern, expand it into rows in the CSV.

## Launch checklist

### Four weeks out: inventory
- [ ] Export the old site's sitemap (or crawl it: `npx sitemap-generator-cli`, Screaming Frog, etc.). Save the URL list; this is your contract.
- [ ] Pull the last 12 months of Search Console "Pages" and "Links" reports. Anything with impressions or backlinks **must** have a destination.
- [ ] Decide the fate of every old URL: keep (same path), move (redirect), or retire (410 is honest; a redirect to the homepage is not).
- [ ] Build `redirects.csv`. One row per moved URL.

### Two weeks out: content
- [ ] Seed real content into Sanity. Every provider, every location, every service that had a page before.
- [ ] Legal pages: privacy policy, terms, accessibility statement, notice of privacy practices. The seeded placeholders have a "replace before launch" banner for a reason.
- [ ] Check `reviewedBy` / `reviewedAt` on every service and post that makes a clinical claim.
- [ ] Run `npm run import-redirects -- redirects.csv --dry-run`, fix what it rejects, then run it for real.
- [ ] Deploy a preview and run `npm run check-url-parity -- --old https://www.oldsite.com --new https://<preview>.vercel.app`. Work until it exits 0.

### Launch week: configuration
- [ ] `NEXT_PUBLIC_SITE_URL` set to the final domain in Vercel (production env). Canonicals, sitemap and JSON-LD all derive from it.
- [ ] `FORM_WEBHOOK_URL` pointed at the real receiver. Send a test submission and confirm it lands. Confirm the receiver is covered by a BAA if it will ever see PHI, see `docs/COMPLIANCE.md`.
- [ ] Real Turnstile keys (not the `1x000…` test keys) in Vercel.
- [ ] GA4 measurement ID in Site settings, and confirm nothing loads before consent (Network tab, fresh profile).
- [ ] Sanity CORS origin added for the production domain.
- [ ] Sanity webhook for revalidation pointing at `https://<domain>/api/revalidate` with `SANITY_REVALIDATE_SECRET`.
- [ ] `robots.txt` and `/sitemap.xml` render on the preview domain and list the right URLs.

### Launch day
- [ ] Point DNS. Wait for the certificate.
- [ ] Run `check-url-parity` one more time against the live domain.
- [ ] Submit the new sitemap in Search Console. Keep the old property; you'll want its data for comparison.
- [ ] Spot-check Rich Results Test on one provider page, one location page, one FAQ page, one post.
- [ ] Submit a test form from a phone.

### Week after
- [ ] Search Console → Coverage: watch for 404s. Each one is a row for `redirects.csv`.
- [ ] Compare impressions week-over-week. A dip of 10–20% for two weeks is normal; a cliff is a redirect problem.
- [ ] Retire the old host only after 30 days of clean reports. Keep its redirects alive longer than you think.

## What this kit does not do
- Content migration. Getting posts out of WordPress is project-specific; write a one-off script against `scripts/lib/env.ts`'s `writeClient()` and keep it in the project, not the starter.
- Query-string redirects. `?p=123` style URLs are exact-matched as paths only. Expand them from your analytics data.
- Hosting the old site's assets. If PDFs or images were linked from outside, move them under `public/` at the same path or redirect each one.
