import type { SlugRule, StringRule } from "sanity";

/**
 * Slug rule shared by every routed document. Lowercase, a–z 0–9 and single
 * hyphens only. No leading/trailing hyphen, no slashes — the route decides the prefix.
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugRule(rule: SlugRule) {
  return rule.required().custom((slug) => {
    const value = slug?.current;
    if (!value) return "Slug is required";
    if (!SLUG_PATTERN.test(value)) {
      return "Use lowercase letters, numbers and single hyphens only (e.g. knee-replacement)";
    }
    if (value.length > 96) return "Keep slugs under 96 characters";
    return true;
  });
}

/** Strip anything that isn't slug-safe when generating from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/**
 * Field keys that look like they're collecting Protected Health Information.
 * A marketing site has no business storing these, and the webhook the form
 * posts to is almost certainly not a HIPAA-covered system. Matching keys
 * produce a Studio *warning* (not an error): the editor can proceed, but has
 * been told why it's a bad idea. See docs/COMPLIANCE.md.
 */
export const PHI_KEY_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\b(dob|date[-_ ]?of[-_ ]?birth|birth[-_ ]?date|birthday)\b/i, label: "date of birth" },
  { pattern: /\b(ssn|social[-_ ]?security)\b/i, label: "Social Security number" },
  { pattern: /\b(mrn|medical[-_ ]?record)\b/i, label: "medical record number" },
  { pattern: /\b(diagnos[ie]s|dx)\b/i, label: "diagnosis" },
  { pattern: /\b(condition|conditions|symptom|symptoms)\b/i, label: "medical condition" },
  { pattern: /\b(medication|medications|prescription|rx)\b/i, label: "medication" },
  { pattern: /\b(insurance[-_ ]?(id|number|member)|member[-_ ]?id|policy[-_ ]?number)\b/i, label: "insurance ID" },
  { pattern: /\b(treatment|procedure)\b/i, label: "treatment details" },
];

export function phiWarning(key: string | undefined): string | true {
  if (!key) return true;
  const hit = PHI_KEY_PATTERNS.find(({ pattern }) => pattern.test(key));
  if (!hit) return true;
  return (
    `"${key}" looks like it collects ${hit.label}, which is Protected Health Information. ` +
    `This form posts to a generic webhook and the site is not a HIPAA-covered system. ` +
    `Collect only name and contact details here and move clinical questions to your patient portal or intake process. ` +
    `See docs/COMPLIANCE.md.`
  );
}

/** Reusable "must be a plain identifier" rule for form field keys. */
export function fieldKeyRule(rule: StringRule) {
  return rule
    .required()
    .regex(/^[a-z][a-zA-Z0-9]*$/, { name: "camelCase identifier" })
    .error("Use a camelCase key like firstName or phone");
}
