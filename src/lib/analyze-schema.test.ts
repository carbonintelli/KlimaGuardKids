import { describe, expect, it } from "vitest";
import { analyzeBodySchema } from "./analyze-schema";

describe("analyzeBodySchema", () => {
  it("accepts a valid country + city request", () => {
    const parsed = analyzeBodySchema.safeParse({
      countryCode: "BD",
      cityId: "dhaka",
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts India regionId", () => {
    const parsed = analyzeBodySchema.safeParse({
      countryCode: "IN",
      regionId: "mumbai",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid country codes", () => {
    const parsed = analyzeBodySchema.safeParse({ countryCode: "IND" });
    expect(parsed.success).toBe(false);
  });
});
