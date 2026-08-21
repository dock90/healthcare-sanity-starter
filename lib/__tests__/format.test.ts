import { describe, expect, it } from "vitest";
import { formatDate, formatDays, formatTime, personName } from "../format";

describe("format", () => {
  it("formats dates without timezone drift", () => {
    expect(formatDate("2026-05-12")).toBe("May 12, 2026");
    expect(formatDate(null)).toBe("");
  });
  it("formats 24h times", () => {
    expect(formatTime("07:30")).toBe("7:30 AM");
    expect(formatTime("17:00")).toBe("5:00 PM");
    expect(formatTime("00:15")).toBe("12:15 AM");
  });
  it("collapses contiguous day ranges", () => {
    expect(formatDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])).toBe("Monday–Friday");
    expect(formatDays(["Monday", "Wednesday"])).toBe("Monday, Wednesday");
    expect(formatDays(["Saturday"])).toBe("Saturday");
  });
  it("joins name and credentials", () => {
    expect(personName({ name: "Anika Desai", credentials: "MD" })).toBe("Anika Desai, MD");
    expect(personName({ name: "Jordan Pike", credentials: null })).toBe("Jordan Pike");
    expect(personName(null)).toBe("");
  });
});
