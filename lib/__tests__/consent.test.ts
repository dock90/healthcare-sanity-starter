import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_STORAGE_KEY, CONSENT_VERSION, hasConsent, onConsentChange, readConsent, writeConsent } from "../consent";

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(k: string) { return this.map.get(k) ?? null; }
  setItem(k: string, v: string) { this.map.set(k, v); }
  removeItem(k: string) { this.map.delete(k); }
  clear() { this.map.clear(); }
}

beforeEach(() => {
  const listeners = new Map<string, Set<(e: Event) => void>>();
  vi.stubGlobal("window", {
    localStorage: new MemoryStorage(),
    addEventListener: (t: string, fn: (e: Event) => void) => listeners.set(t, (listeners.get(t) ?? new Set()).add(fn)),
    removeEventListener: (t: string, fn: (e: Event) => void) => listeners.get(t)?.delete(fn),
    dispatchEvent: (e: Event) => { listeners.get(e.type)?.forEach((fn) => fn(e)); return true; },
  });
  vi.stubGlobal("CustomEvent", class extends Event { detail: unknown; constructor(t: string, init?: { detail?: unknown }) { super(t); this.detail = init?.detail; } });
});

describe("consent", () => {
  it("defaults to no consent except necessary", () => {
    expect(readConsent()).toBeNull();
    expect(hasConsent("necessary")).toBe(true);
    expect(hasConsent("analytics")).toBe(false);
    expect(hasConsent("marketing")).toBe(false);
  });
  it("persists a decision and notifies listeners", () => {
    const seen: unknown[] = [];
    const off = onConsentChange((s) => seen.push(s));
    writeConsent({ analytics: true, marketing: false });
    expect(hasConsent("analytics")).toBe(true);
    expect(hasConsent("marketing")).toBe(false);
    expect(seen).toHaveLength(1);
    off();
    writeConsent({ analytics: false, marketing: false });
    expect(seen).toHaveLength(1);
  });
  it("ignores stored consent from an older version", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ analytics: true, version: CONSENT_VERSION - 1 }));
    expect(readConsent()).toBeNull();
  });
  it("survives corrupt storage", () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "{not json");
    expect(readConsent()).toBeNull();
  });
});
