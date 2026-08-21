/**
 * Consent state. Three categories, persisted in localStorage, no third party.
 * `necessary` is always true and not user-toggleable (it's what makes the site work).
 */
export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO timestamp of the last decision. */
  updatedAt: string;
  /** Bump to re-ask everyone (e.g. when the policy changes). */
  version: number;
};

export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = "consent";
/** Fired on `window` whenever consent changes or the dialog is requested. */
export const CONSENT_CHANGE_EVENT = "consent:change";
export const CONSENT_OPEN_EVENT = "consent:open";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
      version: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function writeConsent(choice: Pick<ConsentState, "analytics" | "marketing">): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked (private mode, policy). Consent still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: state }));
  return state;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  return readConsent()?.[category] ?? false;
}

/** Ask the consent dialog to open (e.g. from a "Cookie settings" footer link). */
export function openConsentDialog(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

export function onConsentChange(handler: (state: ConsentState) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<ConsentState>).detail);
  window.addEventListener(CONSENT_CHANGE_EVENT, listener);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
}
