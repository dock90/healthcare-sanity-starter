import { describe, expect, it } from "vitest";
import { isExternal, pagePath, routes, telHref } from "../routes";

describe("routes", () => {
  it("maps home slugs to audience roots", () => {
    expect(pagePath("patients", "home")).toBe("/");
    expect(pagePath("providers", "home")).toBe("/for-providers");
  });
  it("prefixes provider-audience pages", () => {
    expect(pagePath("patients", "about")).toBe("/about");
    expect(pagePath("providers", "refer-a-patient")).toBe("/for-providers/refer-a-patient");
  });
  it("builds detail paths", () => {
    expect(routes.provider("desai")).toBe("/providers/desai");
    expect(routes.legal("privacy-policy")).toBe("/legal/privacy-policy");
  });
  it("derives dialable numbers", () => {
    expect(telHref("(555) 013-2200")).toBe("tel:5550132200");
    expect(telHref("+1 555 013 2200")).toBe("tel:+15550132200");
  });
  it("treats tel/mailto/https as external to the router", () => {
    expect(isExternal("/about")).toBe(false);
    expect(isExternal("https://example.com")).toBe(true);
    expect(isExternal("tel:+15550132200")).toBe(true);
    expect(isExternal("mailto:a@b.c")).toBe(true);
  });
});
