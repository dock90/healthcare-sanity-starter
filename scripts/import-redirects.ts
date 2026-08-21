/**
 * CSV → `redirect` documents.
 *
 *   npx tsx scripts/import-redirects.ts redirects.csv [--dry-run]
 *
 * CSV columns (header row required, any order): from,to,permanent
 *   from       old path starting with /
 *   to         new path starting with / or an https:// URL
 *   permanent  true|false (default true)
 *
 * Documents get a deterministic _id from `from`, so re-running updates rather
 * than duplicates. Rows that fail validation are reported and skipped.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { writeClient } from "./lib/env";

type Row = { from: string; to: string; permanent: boolean };

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  if (!lines.length) return [];
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
        else quoted = !quoted;
      } else if (c === "," && !quoted) { out.push(cur); cur = ""; }
      else cur += c;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };
  const header = split(lines[0]).map((h) => h.toLowerCase());
  return lines.slice(1).map((line) => Object.fromEntries(split(line).map((v, i) => [header[i], v])));
}

function validate(raw: Record<string, string>, line: number): Row | string {
  const from = raw.from ?? "";
  const to = raw.to ?? "";
  if (!/^\/[^\s?#]*$/.test(from)) return `line ${line}: from must be a path starting with / (got "${from}")`;
  if (!(/^\/[^\s]*$/.test(to) || /^https:\/\/\S+$/.test(to))) return `line ${line}: to must be a path or https:// URL (got "${to}")`;
  if (from === to) return `line ${line}: from and to are identical`;
  const p = (raw.permanent ?? "true").toLowerCase();
  return { from, to, permanent: !["false", "0", "no"].includes(p) };
}

async function main() {
  const [file, ...flags] = process.argv.slice(2);
  if (!file) {
    console.error("Usage: npx tsx scripts/import-redirects.ts <file.csv> [--dry-run]");
    process.exit(1);
  }
  const dryRun = flags.includes("--dry-run");
  const rows = parseCsv(readFileSync(file, "utf8"));
  const valid: Row[] = [];
  const errors: string[] = [];
  rows.forEach((r, i) => {
    const result = validate(r, i + 2);
    if (typeof result === "string") errors.push(result);
    else valid.push(result);
  });

  errors.forEach((e) => console.warn(`skip  ${e}`));
  console.log(`${valid.length} valid redirect(s), ${errors.length} skipped`);
  if (dryRun || !valid.length) return;

  const client = writeClient();
  const tx = client.transaction();
  for (const r of valid) {
    const id = `redirect-${createHash("sha1").update(r.from).digest("hex").slice(0, 16)}`;
    tx.createOrReplace({ _id: id, _type: "redirect", ...r });
  }
  await tx.commit();
  console.log(`done. ${valid.length} redirect document(s) written. Redeploy to apply.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
