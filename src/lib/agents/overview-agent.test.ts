import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SynthesisReport } from "../types";

vi.mock("./orchestrator", () => ({
  runAgentPipeline: vi.fn(),
}));

import { runAgentPipeline } from "./orchestrator";
import {
  burdenToWellbeing,
  clearOverviewAgentCache,
  listGlobalOverviewHubs,
  listIndiaOverviewHubs,
  runGlobalOverviewAgent,
  runIndiaOverviewAgent,
} from "./overview-agent";

const mockedPipeline = vi.mocked(runAgentPipeline);

function fakeReport(
  overrides: Partial<SynthesisReport> & {
    overallRisk: SynthesisReport["overallRisk"];
  }
): SynthesisReport {
  return {
    location: {
      country: "Test",
      countryCode: "XX",
      city: "Test City",
      lat: 0,
      lon: 0,
    },
    generatedAt: new Date().toISOString(),
    disruptionWindow: "7 days",
    agents: [],
    climate: {
      temperatureC: 32,
      humidity: 60,
      precipitationMm: 2,
      windSpeedKmh: 10,
      heatIndex: 34,
      forecastDays: [],
      dataQuality: "live",
      fetchedAt: new Date().toISOString(),
    },
    health: [
      {
        id: "heat",
        title: "Heat",
        description: "Hot",
        risk: "high",
        ageBands: ["0-5"],
        actions: [],
      },
    ],
    nutrition: {
      title: "Nutrition",
      risk: "moderate",
      summary: "ok",
      signals: [],
      actions: [],
    },
    disease: {
      risk: "moderate",
      profiles: [],
      transmissionSummary: [],
      actions: [],
    },
    naturalMedicine: { remedies: [], disclaimer: "" },
    childGuidance: [],
    correlations: [],
    caregiverChecklist: [],
    sources: [],
    ...overrides,
  } as SynthesisReport;
}

describe("burdenToWellbeing", () => {
  it("inverts burden so high burden becomes low wellbeing", () => {
    expect(burdenToWellbeing(80)).toBe(20);
    expect(burdenToWellbeing(0)).toBe(100);
    expect(burdenToWellbeing(100)).toBe(0);
  });
});

describe("overview hub lists", () => {
  it("lists curated global hubs with coordinates", () => {
    const hubs = listGlobalOverviewHubs();
    expect(hubs.length).toBeGreaterThanOrEqual(20);
    expect(hubs.every((h) => Number.isFinite(h.lat) && Number.isFinite(h.lon))).toBe(
      true
    );
    const india = hubs.find((h) => h.countryCode === "IN");
    expect(india?.regionId).toBeTruthy();
    expect(india?.city.toLowerCase()).toContain("delhi");
  });

  it("lists India tier-1 metros only", () => {
    const hubs = listIndiaOverviewHubs();
    expect(hubs.length).toBeGreaterThanOrEqual(6);
    expect(hubs.every((h) => h.countryCode === "IN" && h.regionId)).toBe(true);
  });
});

describe("overview agents", () => {
  beforeEach(() => {
    clearOverviewAgentCache();
    mockedPipeline.mockReset();
  });

  it("builds global overview from live pipeline probes", async () => {
    mockedPipeline.mockImplementation(async (params) =>
      fakeReport({
        overallRisk: "high",
        location: {
          country: params.country,
          countryCode: params.countryCode,
          city: params.city,
          lat: params.lat,
          lon: params.lon,
        },
        indiaImpact:
          params.countryCode === "IN"
            ? {
                risk: "high",
                compositeScore: 70,
                compositeLabel: "Elevated",
                dimensions: [
                  {
                    id: "heat-vulnerability",
                    name: "Heat",
                    score: 72,
                    unit: "pts",
                    trend: "rising",
                    methodology: "test",
                    childSpecificNote: "test",
                  },
                ],
                projectedBurden: [],
                measurementNotes: [],
                recommendations: [],
                comparedToNationalBaseline: "",
                healthAgentAlignment: "",
              }
            : undefined,
      })
    );

    const overview = await runGlobalOverviewAgent();
    expect(overview.mode).toBe("live");
    expect(overview.probed).toBeGreaterThan(0);
    expect(overview.mapPoints.length).toBe(overview.probed);
    expect(overview.highRisk.length).toBeLessThanOrEqual(5);
    expect(overview.alerts.length).toBe(3);
    expect(mockedPipeline).toHaveBeenCalled();

    // Second call hits TTL cache (no extra pipeline calls beyond first batch).
    const calls = mockedPipeline.mock.calls.length;
    const cached = await runGlobalOverviewAgent();
    expect(cached.probed).toBe(overview.probed);
    expect(mockedPipeline.mock.calls.length).toBe(calls);
  });

  it("builds India overview with wellbeing CHIS and dimensions", async () => {
    mockedPipeline.mockImplementation(async (params) =>
      fakeReport({
        overallRisk: "moderate",
        location: {
          country: params.country,
          countryCode: params.countryCode,
          city: params.city,
          lat: params.lat,
          lon: params.lon,
        },
        indiaImpact: {
          risk: "high",
          compositeScore: 60,
          compositeLabel: "Elevated",
          dimensions: [
            {
              id: "heat-vulnerability",
              name: "Heat",
              score: 60,
              unit: "pts",
              trend: "rising",
              methodology: "test",
              childSpecificNote: "test",
            },
            {
              id: "air-quality-burden",
              name: "Air",
              score: 50,
              unit: "pts",
              trend: "stable",
              methodology: "test",
              childSpecificNote: "test",
            },
          ],
          projectedBurden: [],
          measurementNotes: [],
          recommendations: [],
          comparedToNationalBaseline: "",
          healthAgentAlignment: "",
        },
      })
    );

    const overview = await runIndiaOverviewAgent();
    expect(overview.mode).toBe("live");
    expect(overview.probed).toBeGreaterThan(0);
    // burden 60 → wellbeing 40
    expect(overview.avgChis).toBe(40);
    expect(overview.dimensions.some((d) => d.id === "heat-vulnerability")).toBe(
      true
    );
    expect(overview.topStates[0]?.chis).toBe(40);
  });
});
