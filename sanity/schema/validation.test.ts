import { describe, expect, it } from "vitest";
import { PHI_KEY_PATTERNS, SLUG_PATTERN, phiWarning, slugify } from "./validation";

describe("slug", () => {
  it("accepts lowercase kebab-case", () => {
    expect(SLUG_PATTERN.test("knee-replacement")).toBe(true);
    expect(SLUG_PATTERN.test("home")).toBe(true);
  });
  it("rejects slashes, uppercase, and edge hyphens", () => {
    for (const bad of ["Knee", "knee/replacement", "-knee", "knee-", "knee--replacement", "knee replacement", ""]) {
      expect(SLUG_PATTERN.test(bad)).toBe(false);
    }
  });
  it("slugifies titles", () => {
    expect(slugify("Orthopedics & Sports Medicine")).toBe("orthopedics-sports-medicine");
    expect(slugify("  Café Résumé ")).toBe("cafe-resume");
  });
});

describe("PHI field-key warning", () => {
  it.each(["dob", "dateOfBirth", "date_of_birth", "ssn", "socialSecurity", "mrn", "medicalRecordNumber", "diagnosis", "condition", "symptoms", "medications", "insuranceId", "memberId", "treatment"])(
    "warns on %s",
    (key) => {
      const result = phiWarning(key);
      expect(typeof result).toBe("string");
      expect(result).toContain("Protected Health Information");
      expect(result).toContain("docs/COMPLIANCE.md");
    },
  );
  it.each(["name", "firstName", "email", "phone", "message", "practice", "topic", "urgency", "referrerName"])("allows %s", (key) => {
    expect(phiWarning(key)).toBe(true);
  });
  it("allows empty keys (required() handles those)", () => {
    expect(phiWarning(undefined)).toBe(true);
  });
  it("names the category it matched", () => {
    expect(phiWarning("dob")).toContain("date of birth");
    expect(PHI_KEY_PATTERNS.length).toBeGreaterThan(5);
  });
});
