/**
 * Old sitemap vs. new host.
 *
 *   npx tsx scripts/check-url-parity.ts --old https://www.oldclinic.com --new https://starter.dock90.io
 *   npx tsx scripts/check-url-parity.ts --sitemap https://www.oldclinic.com/sitemap.xml --new https://preview.vercel.app
 *
 * Reads every URL from the old sitemap (sitemap indexes are followed), swaps
 * the origin for the new host, sends a HEAD request without following
 * redirects, and reports anything that is not 200 or a 301/308. Exit code 1
 * if any URL fails, so it can gate a launch in CI.
 */

type Result = { path: string; status: number | "error"; location?: string };

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function fetchSitemapUrls(sitemapUrl: string, seen = new Set<string>()): Promise<string[]> {
  if (seen.has(sitemapUrl)) return [];
  seen.add(sitemapUrl);
  const res = await fetch(sitemapUrl, { headers: { "user-agent": "check-url-parity" } });
  if (!res.ok) throw new Error(`Could not fetch ${sitemapUrl}: ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (/<sitemapindex/i.test(xml)) {
    const nested = await Promise.all(locs.map((l) => fetchSitemapUrls(l, seen)));
    return nested.flat();
  }
  return locs;
}

async function head(url: string): Promise<Result> {
  const path = new URL(url).pathname + new URL(url).search;
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "manual", headers: { "user-agent": "check-url-parity" } });
    return { path, status: res.status, location: res.headers.get("location") ?? undefined };
  } catch {
    return { path, status: "error" };
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

async function main() {
  const oldOrigin = arg("old");
  const sitemap = arg("sitemap") ?? (oldOrigin ? `${oldOrigin.replace(/\/$/, "")}/sitemap.xml` : undefined);
  const newOrigin = arg("new")?.replace(/\/$/, "");
  const concurrency = Number(arg("concurrency") ?? 8);
  if (!sitemap || !newOrigin) {
    console.error("Usage: --old <https://old-host> | --sitemap <url>   --new <https://new-host>   [--concurrency 8]");
    process.exit(1);
  }

  const urls = await fetchSitemapUrls(sitemap);
  console.log(`${urls.length} URL(s) in ${sitemap}\n`);

  const results = await mapLimit(urls, concurrency, (u) => {
    const old = new URL(u);
    return head(`${newOrigin}${old.pathname}${old.search}`);
  });

  const ok = results.filter((r) => r.status === 200);
  const redirected = results.filter((r) => r.status === 301 || r.status === 308);
  const bad = results.filter((r) => !ok.includes(r) && !redirected.includes(r));

  for (const r of bad) console.log(`FAIL  ${String(r.status).padEnd(5)} ${r.path}`);
  for (const r of redirected) console.log(`redir ${r.status}   ${r.path} → ${r.location ?? "?"}`);

  console.log(`\n${ok.length} ok · ${redirected.length} redirected · ${bad.length} failing`);
  if (bad.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
