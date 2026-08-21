import { describe, expect, it } from "vitest";
import type {
  ClimateSnapshot,
  DiseaseInsight,
  HealthInsight,
  IndiaRegion,
  IndiaRegionalInsight,
  NutritionInsight,
} from "../types";
import { getIndiaRegion } from "../india-regions";
import { measureIndiaChildHealthImpact } from "./india-impact-agent";

function baseClimate(overrides: Partial<ClimateSnapshot> = {}): ClimateSnapshot {
  return {
    temperatureC: 36,
    humidity: 55,
    precipitationMm: 0,
    windSpeedKmh: 8,
    heatIndex: 40,
    airQualityIndex: 160,
    forecastDays: Array.from({ length: 7 }, (_, i) => ({
      date: `2026-08-0${i + 1}`,
      tempMaxC: 39 + (i % 3),
      tempMinC: 28,
      precipitationMm: i === 3 ? 20 : 0,
      weatherCode: 1,
    })),
    dataQuality: "live",
    fetchedAt: "2026-08-02T00:00:00.000Z",
    ...overrides,
  };
}

const health: HealthInsight[] = [
  {
    category: "heat",
    risk: "high",
    title: "Heat stress",
    description: "test",
    actions: ["Shade"],
  },
];

const nutrition: NutritionInsight = {
  risk: "moderate",
  title: "Hydration",
  description: "test",
  foodSecurityNote: "ok",
  hydrationLiters: 2.5,
  recommendedFoods: ["ORS"],
  avoid: ["Sugary drinks"],
};

const disease: DiseaseInsight = {
  risk: "moderate",
  conditions: ["Dengue"],
  symptoms: ["Fever"],
  prevention: ["Mosquito nets"],
  profiles: [],
  transmissionSummary: ["Mosquitoes"],
  precautionarySteps: ["Seek care if fever persists"],
};

function regionalFor(region: IndiaRegion): IndiaRegionalInsight {
  return {
    regionId: region.id,
    regionName: region.name,
    state: region.state,
    climateZone: region.climateZone,
    risk: "high",
    childPopulationShare: region.childPopulationShare,
    inMonsoonSeason: false,
    zoneDescription: "test",
    seasonalNotes: [],
    activeRegionalRisks: region.primaryRisks,
    regionalActions: [],
    contextSummary: "test",
  };
}

describe("measureIndiaChildHealthImpact", () => {
  it("returns a composite CHIS between 0 and 100 with five dimensions", () => {
    const region = getIndiaRegion("delhi-ncr");
    expect(region).toBeDefined();
    const impact = measureIndiaChildHealthImpact({
      region: region!,
      climate: baseClimate(),
      regional: regionalFor(region!),
      health,
      nutrition,
      disease,
    });

    expect(impact.dimensions).toHaveLength(5);
    expect(impact.compositeScore).toBeGreaterThanOrEqual(0);
    expect(impact.compositeScore).toBeLessThanOrEqual(100);
    expect(impact.compositeLabel.length).toBeGreaterThan(0);
  });

  it("scores hotter/dirtier conditions higher than mild conditions", () => {
    const region = getIndiaRegion("ahmedabad")!;
    const high = measureIndiaChildHealthImpact({
      region,
      climate: baseClimate({
        temperatureC: 44,
        heatIndex: 48,
        airQualityIndex: 280,
        forecastDays: Array.from({ length: 7 }, (_, i) => ({
          date: `2026-08-0${i + 1}`,
          tempMaxC: 44,
          tempMinC: 32,
          precipitationMm: 0,
          weatherCode: 0,
        })),
      }),
      regional: regionalFor(region),
      health,
      nutrition,
      disease,
    });
    const mild = measureIndiaChildHealthImpact({
      region,
      climate: baseClimate({
        temperatureC: 24,
        heatIndex: 24,
        airQualityIndex: 40,
        forecastDays: Array.from({ length: 7 }, (_, i) => ({
          date: `2026-08-0${i + 1}`,
          tempMaxC: 26,
          tempMinC: 18,
          precipitationMm: 2,
          weatherCode: 1,
        })),
      }),
      regional: regionalFor(region),
      health,
      nutrition,
      disease,
    });
    expect(high.compositeScore).toBeGreaterThan(mild.compositeScore);
  });
});
