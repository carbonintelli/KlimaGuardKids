import { describe, expect, it } from "vitest";
import { mapAgentBriefing } from "@/components/dashboard/ChisMapCard";
import { INDIA_MAP } from "@/components/dashboard/maps/india-map";
import type { MapPoint } from "@/lib/dashboard-stats";

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
