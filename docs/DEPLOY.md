# Deploying

One supported target: **Vercel**, with Sanity's hosted content lake. Other hosts work (it's a Next.js app) but you're on your own for ISR and preview.

## 1. Sanity project

```bash
npx sanity@latest init --env   # or: create at sanity.io/manage
```

- Dataset: `production`. Make it **public** only if the content is genuinely public (the demo is). A real clinic site is fine with public too, it's marketing content, but make that a decision, not a default.
- **Tokens** (sanity.io/manage → API → Tokens):
  - `SANITY_API_READ_TOKEN`: role *Viewer*. Used for Draft Mode / live preview. Goes in Vercel.
  - `SANITY_API_WRITE_TOKEN`: role *Editor*. Used only by `scripts/seed.ts` and `scripts/import-redirects.ts`. **Local only. Never in Vercel.**
- **CORS origins** (API → CORS): add `http://localhost:3000`, your Vercel preview domain pattern (or the specific URLs), and the production domain. Tick "allow credentials", the embedded Studio needs it.
- **Webhook** (API → Webhooks): name `revalidate`, URL `https://<domain>/api/revalidate`, trigger on create/update/delete, projection `{ _type }`, secret = `SANITY_REVALIDATE_SECRET`. Optionally add a second webhook to a Vercel Deploy Hook, filtered to `_type == "redirect"`, so redirect changes rebuild the site.

## 2. Vercel project

```bash
npx vercel link          # pick / create the project
npx vercel env add …     # or set in the dashboard
```

Environment variables (Production + Preview):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | from sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-08-01` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain` (production) / leave unset on preview so canonicals fall back |
| `SANITY_API_READ_TOKEN` | Viewer token |
| `SANITY_REVALIDATE_SECRET` | `openssl rand -hex 32` |
| `FORM_WEBHOOK_URL` | your receiver (see `docs/COMPLIANCE.md`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | from dash.cloudflare.com → Turnstile; the `1x000…` test keys always pass and must not ship |

Build settings: framework Next.js, defaults. Node 24. No `vercel.json` needed.

Deploy:

```bash
npx vercel --prod
```

## 3. Domain

```bash
npx vercel domains add www.yourclinic.com
```

Vercel prints the DNS record. For a subdomain it's a CNAME to `cname.vercel-dns.com`; for an apex it's an A record to `76.76.21.21`. Set it at your DNS provider and wait for the certificate. Then set `NEXT_PUBLIC_SITE_URL` to the final URL and redeploy, sitemap, canonicals and JSON-LD all derive from it.

## 4. After the first deploy

- Open `/studio` on the production URL and log in. If it fails with a CORS error, you missed step 1.
- Open a page in the Presentation tool (Studio → Presentation). If the preview is blank, check `SANITY_API_READ_TOKEN`.
- Publish a change; confirm it appears without a redeploy (the Live Content API) and that the webhook returns 200 in Sanity's webhook log.
- Submit the contact form. Confirm the receiver got it and nothing about it appears in Vercel's logs.
- Run `npm run check-url-parity` if this is a migration.

## Preview deployments

Every PR gets a preview URL. Previews use the same dataset (there is one), so editors see the same content. Draft Mode works on previews too, but the Studio's Presentation tool opens the origin it's embedded in, open `/studio` on the preview URL to preview there.

## Rollback

`npx vercel rollback` or the dashboard. Content lives in Sanity, so rolling back code never loses content.
