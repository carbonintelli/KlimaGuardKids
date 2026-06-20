import type {
  ClimateSnapshot,
  IndiaRegionalInsight,
  IndiaRegion,
  RiskLevel,
} from "../types";

const ZONE_CONTEXT: Record<
  IndiaRegion["climateZone"],
  { description: string; seasonalNotes: string[] }
> = {
  "semi-arid": {
    description:
      "Semi-arid plains with intense pre-monsoon heat and winter smog episodes affecting millions of children.",
    seasonalNotes: [
      "April–June: Pre-monsoon heatwaves peak; schools often shift timings",
      "October–November: Post-monsoon stubble burning elevates PM2.5 across NCR",
      "Monsoon brings dengue vector surge in urban pockets",
    ],
  },
  "coastal-tropical": {
    description:
      "Coastal tropical zones with high humidity, cyclone exposure, and urban flooding during monsoon.",
    seasonalNotes: [
      "June–September: Southwest monsoon drives flooding and waterborne disease",
      "Cyclone season requires anticipatory school closures and shelter planning",
      "Salt-air corrosion and drainage overflow affect safe drinking water",
    ],
  },
  "humid-subtropical": {
    description:
      "Humid subtropical Gangetic and eastern plains — flood-prone with high child diarrheal burden.",
    seasonalNotes: [
      "Monsoon flooding contaminates tube wells and hand pumps",
      "Post-flood malnutrition spikes in under-5 children",
      "Heat-humidity index stresses outdoor school activities",
    ],
  },
  "tropical-savanna": {
    description:
      "Tropical savanna with distinct wet/dry seasons; rapid urbanization increases heat island effects.",
    seasonalNotes: [
      "March–May: Dry-season heat before monsoon arrival",
      "Urban lake encroachment reduces natural cooling for children",
      "Dengue cycles align with early monsoon showers",
    ],
  },
  arid: {
    description:
      "Arid and semi-arid regions facing extreme heat, water scarcity, and dust-related respiratory stress.",
    seasonalNotes: [
      "May–June: Temperatures exceed 45°C; heat stroke admissions rise",
      "Water tanker dependency increases contamination risk for children",
      "Drought years correlate with child malnutrition in rural blocks",
    ],
  },
};

function currentMonth(): number {
  return new Date().getMonth() + 1;
}

function isMonsoonSeason(region: IndiaRegion, month: number): boolean {
  return region.monsoonMonths.includes(month);
}

function assessRegionalRisk(
  region: IndiaRegion,
  climate: ClimateSnapshot,
  month: number
): RiskLevel {
  const maxTemp = Math.max(
    ...climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
  );
  const aqi = climate.airQualityIndex ?? 50;
  let score = 0;

  if (maxTemp >= 42) score += 3;
  else if (maxTemp >= 38) score += 2;
  else if (maxTemp >= 35) score += 1;

  if (aqi >= 200) score += 3;
  else if (aqi >= 150) score += 2;
  else if (aqi >= 100) score += 1;

  if (isMonsoonSeason(region, month)) score += 1;

  if (region.primaryRisks.includes("extreme-heat") && maxTemp >= 40) score += 1;

  if (score >= 5) return "critical";
  if (score >= 3) return "high";
  if (score >= 1) return "moderate";
  return "low";
}

export function analyzeIndiaRegionalContext(
  region: IndiaRegion,
  climate: ClimateSnapshot
): IndiaRegionalInsight {
  const month = currentMonth();
  const zone = ZONE_CONTEXT[region.climateZone];
  const inMonsoon = isMonsoonSeason(region, month);
  const risk = assessRegionalRisk(region, climate, month);

  const activeRisks = region.primaryRisks.filter((riskId) => {
    const maxTemp = Math.max(
      ...climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
    );
    const rain = climate.forecastDays
      .slice(0, 5)
      .reduce((s, d) => s + d.precipitationMm, 0);
    const aqi = climate.airQualityIndex ?? 50;

    switch (riskId) {
      case "heatwave":
      case "extreme-heat":
      case "heat-humidity":
      case "heat-stroke":
        return maxTemp >= 35;
      case "air-pollution":
        return aqi >= 100;
      case "flooding":
        return rain > 60 || inMonsoon;
      case "dengue":
        return climate.humidity > 65 && climate.temperatureC > 22;
      case "water-stress":
      case "drought":
        return region.climateZone === "arid" && rain < 20;
      default:
        return true;
    }
  });

  const regionalActions = buildRegionalActions(region, activeRisks, inMonsoon);

  return {
    regionId: region.id,
    regionName: region.name,
    state: region.state,
    climateZone: region.climateZone,
    risk,
    childPopulationShare: region.childPopulationShare,
    inMonsoonSeason: inMonsoon,
    zoneDescription: zone.description,
    seasonalNotes: zone.seasonalNotes,
    activeRegionalRisks: activeRisks,
    regionalActions,
    contextSummary: buildContextSummary(region, climate, inMonsoon, activeRisks),
  };
}

function buildContextSummary(
  region: IndiaRegion,
  climate: ClimateSnapshot,
  inMonsoon: boolean,
  activeRisks: string[]
): string {
  const maxTemp = Math.max(
    ...climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
  );
  const parts = [
    `${region.name} (${region.state}) sits in a ${region.climateZone.replace("-", " ")} climate zone.`,
    `Approximately ${Math.round(region.childPopulationShare * 100)}% of the regional population are children under 18.`,
  ];

  if (inMonsoon) {
    parts.push("The region is currently in its monsoon window — elevated waterborne and vector disease pressure.");
  }
  if (maxTemp >= 38) {
    parts.push(`Forecast peak of ${maxTemp.toFixed(0)}°C exceeds IMD heatwave thresholds for child safety.`);
  }
  if (activeRisks.length > 0) {
    parts.push(`Active regional risk drivers: ${activeRisks.map(formatRiskLabel).join(", ")}.`);
  }

  return parts.join(" ");
}

function formatRiskLabel(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildRegionalActions(
  region: IndiaRegion,
  activeRisks: string[],
  inMonsoon: boolean
): string[] {
  const actions: string[] = [
    "Register with state IMD heatwave and flood alerts via UMANG or local disaster apps",
    "Coordinate with Anganwadi/ASHA workers for community child health outreach",
  ];

  if (activeRisks.includes("air-pollution")) {
    actions.push(
      "Follow CPCB/NCR AQI advisories; keep N95 masks for children during severe AQI days",
      "Use indoor air purifiers in classrooms when AQI exceeds 200"
    );
  }
  if (activeRisks.includes("heatwave") || activeRisks.includes("extreme-heat")) {
    actions.push(
      "Implement school timing shifts per state education department heat action plans",
      "Ensure ORS and cooling stations at Anganwadi centres"
    );
  }
  if (inMonsoon || activeRisks.includes("flooding")) {
    actions.push(
      "Pre-position chlorine tablets and ORS at panchayat health sub-centres",
      "Map flood-safe evacuation routes for schools in low-lying wards"
    );
  }
  if (activeRisks.includes("dengue")) {
    actions.push(
      "Launch weekly fogging and larval source reduction in school catchment areas",
      "Report fever cases to IDSP surveillance within 24 hours"
    );
  }
  if (region.climateZone === "arid") {
    actions.push(
      "Monitor mid-day meal hydration; increase water provision during heat alerts",
      "Track SAM/MAM indicators in drought-affected blocks via ICDS"
    );
  }

  return actions.slice(0, 8);
}
