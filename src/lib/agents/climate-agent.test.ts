import { describe, expect, it } from "vitest";
import { computeHeatIndex } from "./climate-agent";

describe("computeHeatIndex", () => {
  it("returns ambient temperature when below heat-index threshold", () => {
    expect(computeHeatIndex(22, 50)).toBe(22);
  });

  it("increases above ambient under hot humid conditions", () => {
    const hi = computeHeatIndex(35, 70);
    expect(hi).toBeGreaterThan(35);
    expect(hi).toBeLessThan(55);
  });

  it("is finite for extreme humidity", () => {
    const hi = computeHeatIndex(40, 95);
    expect(Number.isFinite(hi)).toBe(true);
  });
});
