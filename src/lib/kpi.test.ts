import { describe, expect, it } from "vitest";
import { getPublicKpis } from "./kpi";

describe("getPublicKpis", () => {
  it("exposes live registry coverage counts", () => {
    const kpi = getPublicKpis();
    expect(kpi.coverage.countries).toBeGreaterThan(100);
    expect(kpi.coverage.cities).toBeGreaterThan(400);
    expect(kpi.coverage.indiaRegions).toBeGreaterThan(50);
    expect(kpi.coverage.trustedSources).toBeGreaterThan(20);
    expect(kpi.coverage.agents).toBe(8);
    expect(kpi.investment.seedRequested).toBe(100_000);
  });
});
