import { describe, expect, it } from "vitest";
import { mapAgentBriefing } from "@/components/dashboard/ChisMapCard";
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
