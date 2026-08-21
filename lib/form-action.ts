"use server";

import { client } from "@/sanity/client";
import { FORM_SPEC_QUERY } from "@/sanity/queries";

/**
 * The one form handler.
 *
 *  1. Honeypot: a filled "website" field means a bot; pretend it worked.
 *  2. Turnstile: token verified server-side with Cloudflare.
 *  3. Spec: the form's field list is loaded from Sanity by `formId`, so only
 *     declared keys are accepted, validated and forwarded.
 *  4. Forward: one POST to FORM_WEBHOOK_URL. Nothing is stored here, and the
 *     body is never logged. See docs/COMPLIANCE.md.
 */

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const MAX_SHORT = 200;
const MAX_LONG = 2000;
const WEBHOOK_TIMEOUT_MS = 8000;
const GENERIC_ERROR = "Something went wrong sending your message. Please try again, or call us.";

export async function submitForm(_prev: FormState, formData: FormData): Promise<FormState> {
  // 1. Honeypot
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success" };
  }

  const formId = String(formData.get("formId") ?? "");
  if (!/^[a-z][a-zA-Z0-9]*$/.test(formId)) {
    return { status: "error", message: GENERIC_ERROR };
  }

  // 2. Turnstile
  const turnstileOk = await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""));
  if (!turnstileOk) {
    return { status: "error", message: "We couldn't confirm you're not a robot. Please try again." };
  }

  // 3. Spec + validation
  const spec = await client.fetch(FORM_SPEC_QUERY, { formId });
  if (!spec?.fields?.length) {
    return { status: "error", message: GENERIC_ERROR };
  }

  const values: Record<string, string> = {};
  const fieldErrors: Record<string, string> = {};
  for (const field of spec.fields) {
    if (!field.key) continue;
    const raw = String(formData.get(field.key) ?? "").trim();
    const max = field.type === "textarea" ? MAX_LONG : MAX_SHORT;
    if (field.required && !raw) {
      fieldErrors[field.key] = `${field.label ?? "This field"} is required.`;
      continue;
    }
    if (raw.length > max) {
      fieldErrors[field.key] = `Please keep this under ${max} characters.`;
      continue;
    }
    if (raw && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
      fieldErrors[field.key] = "Please enter a valid email address.";
      continue;
    }
    if (raw && field.type === "tel" && raw.replace(/\D/g, "").length < 7) {
      fieldErrors[field.key] = "Please enter a valid phone number.";
      continue;
    }
    if (raw && field.type === "select" && field.options && !field.options.includes(raw)) {
      fieldErrors[field.key] = "Please choose one of the listed options.";
      continue;
    }
    values[field.key] = raw;
  }
  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  // 4. Forward
  const webhook = process.env.FORM_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[form] FORM_WEBHOOK_URL is not set; submission dropped");
      return { status: "error", message: GENERIC_ERROR };
    }
    // Development: accept and discard so the form is testable without a receiver.
    return { status: "success" };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ formId, submittedAt: new Date().toISOString(), fields: values }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[form] webhook responded ${res.status} for form ${formId}`);
      return { status: "error", message: GENERIC_ERROR };
    }
    return { status: "success" };
  } catch (err) {
    console.warn(`[form] webhook request failed for form ${formId}: ${err instanceof Error ? err.name : "unknown"}`);
    return { status: "error", message: GENERIC_ERROR };
  }
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[form] TURNSTILE_SECRET_KEY is not set");
    return false;
  }
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      cache: "no-store",
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
