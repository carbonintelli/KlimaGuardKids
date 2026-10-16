import { describe, expect, it } from "vitest";
import { mapAgentBriefing } from "@/components/dashboard/ChisMapCard";
import { INDIA_MAP } from "@/components/dashboard/maps/india-map";
import { WORLD_MAP } from "@/components/dashboard/maps/world-map";
import type { MapPoint } from "@/lib/dashboard-stats";

function pathPointBounds(d: string) {
  const nums = [...d.matchAll(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)].map(
    (m) => +m[0]
  );
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let maxJump = 0;
  let prevX: number | null = null;
  for (let i = 0; i < nums.length; i += 2) {
    const x = nums[i];
    const y = nums[i + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    if (prevX != null) maxJump = Math.max(maxJump, Math.abs(x - prevX));
    prevX = x;
  }
  return {
    w: maxX - minX,
    h: maxY - minY,
    maxJump,
  };
}

const sample: MapPoint[] = [
  {
    id: "bd-dhaka",
    name: "Dhaka, Bangladesh",
    chis: 28,
    band: "high",
    lat: 23.8,
    lon: 90.4,
  },
  {
    id: "ke-nairobi",
    name: "Nairobi, Kenya",
    chis: 55,
    band: "moderate",
    lat: -1.3,
    lon: 36.8,
  },
  {
    id: "pe-lima",
    name: "Lima, Peru",
    chis: 72,
    band: "good",
    lat: -12.0,
    lon: -77.0,
  },
];

describe("mapAgentBriefing", () => {
  it("summarizes hub counts and extremes", () => {
    const text = mapAgentBriefing(sample, "global");
    expect(text).toContain("3 country hubs");
    expect(text).toContain("Dhaka");
    expect(text).toContain("Lima");
    expect(text).toContain("avg CHIS 52");
  });

  it("handles empty india hubs", () => {
    expect(mapAgentBriefing([], "india")).toMatch(/no India hubs/i);
  });
});

describe("INDIA_MAP Survey of India boundary", () => {
  it("credits Survey of India and covers full national extent", () => {
    expect(INDIA_MAP.source.name).toMatch(/Survey of India/i);
    expect(INDIA_MAP.source.attribution).toMatch(/Government of India/i);
    // SoI external boundary includes northern Ladakh / Aksai Chin (~37°N)
    // and eastern Arunachal (~97°E).
    expect(INDIA_MAP.bounds.maxLat).toBeGreaterThanOrEqual(37);
    expect(INDIA_MAP.bounds.maxLon).toBeGreaterThanOrEqual(97);
    expect(INDIA_MAP.paths.length).toBeGreaterThan(0);
  });
});

describe("WORLD_MAP antimeridian hygiene", () => {
  it("has land paths without full-width wrap strips", () => {
    expect(WORLD_MAP.paths.length).toBeGreaterThan(50);
    for (const d of WORLD_MAP.paths) {
      const { w, h, maxJump } = pathPointBounds(d);
      // Thin bands that span nearly the full canvas are date-line artifacts.
      expect(w > 800 && h < 8).toBe(false);
      // Consecutive vertices should not leap across the map.
      expect(maxJump).toBeLessThan(400);
    }
  });
});
