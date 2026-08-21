/** Display helpers. Kept tiny on purpose. */

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(d);
}

export function personName(p: { name: string | null; credentials: string | null } | null | undefined): string {
  if (!p?.name) return "";
  return p.credentials ? `${p.name}, ${p.credentials}` : p.name;
}

/** "08:00" → "8:00 AM" */
export function formatTime(hhmm: string | null | undefined): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** ["Monday","Tuesday","Wednesday"] → "Monday–Wednesday"; non-contiguous → "Monday, Wednesday" */
export function formatDays(days: string[] | null | undefined): string {
  if (!days?.length) return "";
  const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sorted = [...days].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const idx = sorted.map((d) => order.indexOf(d));
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (contiguous && sorted.length > 2) return `${sorted[0]}–${sorted[sorted.length - 1]}`;
  return sorted.join(", ");
}
