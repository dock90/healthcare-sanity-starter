import { hasConsent } from "./consent";

/**
 * Every analytics event the site can send. Closed union: adding an event means
 * adding it here, which is the point: nobody can `track("whatever", {email})`.
 * Props are things the *site* knows (form IDs, route names), never things the
 * *visitor* typed.
 */
export type AnalyticsEvent =
  | { name: "form_submit"; props: { formId: string; outcome: "success" | "error" } }
  | { name: "cta_click"; props: { href: string } }
  | { name: "phone_click"; props: { context: "header" | "footer" | "location" | "provider" } }
  | { name: "consent_update"; props: { analytics: boolean; marketing: boolean } };

export type EventName = AnalyticsEvent["name"];
export type EventProps<N extends EventName> = Extract<AnalyticsEvent, { name: N }>["props"];

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * Send an event to GA4, but only if the visitor has consented to analytics and
 * the tag has loaded. Otherwise it's a no-op. Never throws.
 */
export function track<N extends EventName>(name: N, props: EventProps<N>): void {
  if (typeof window === "undefined") return;
  if (!hasConsent("analytics")) return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", name, props);
  } catch {
    // Analytics must never break the page.
  }
}
