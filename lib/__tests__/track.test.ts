import { beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "../track";
import { CONSENT_STORAGE_KEY, CONSENT_VERSION } from "../consent";

const gtag = vi.fn();

beforeEach(() => {
  gtag.mockReset();
  const store = new Map<string, string>();
  vi.stubGlobal("window", {
    gtag,
    localStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) },
  });
});

describe("track", () => {
  it("is a no-op without analytics consent", () => {
    track("cta_click", { href: "/contact" });
    expect(gtag).not.toHaveBeenCalled();
  });
  it("sends the event once analytics consent exists", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ analytics: true, marketing: false, version: CONSENT_VERSION, updatedAt: "" }));
    track("form_submit", { formId: "contact", outcome: "success" });
    expect(gtag).toHaveBeenCalledWith("event", "form_submit", { formId: "contact", outcome: "success" });
  });
  it("never throws when gtag misbehaves", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ analytics: true, marketing: false, version: CONSENT_VERSION, updatedAt: "" }));
    gtag.mockImplementation(() => { throw new Error("boom"); });
    expect(() => track("phone_click", { context: "footer" })).not.toThrow();
  });
  it("rejects unknown events at the type level", () => {
    // @ts-expect-error, free-form event names are not allowed
    track("pageview", {});
    // @ts-expect-error, props must match the event
    track("cta_click", { email: "x" });
  });
});
