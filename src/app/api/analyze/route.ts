import { NextRequest, NextResponse } from "next/server";
import { runAgentPipeline } from "@/lib/agents/orchestrator";
import { analyzeBodySchema } from "@/lib/analyze-schema";
import {
  CITY_COUNT,
  CITY_TIER_COUNTS,
  COUNTRIES,
  getCityPreset,
} from "@/lib/countries";
import { INDIA_REGIONS } from "@/lib/india-regions";
import {
  recordAnalyzeError,
  recordAnalyzeStart,
  recordAnalyzeSuccess,
} from "@/lib/kpi";
import { TRUSTED_SOURCES } from "@/lib/sources";

export async function POST(req: NextRequest) {
  recordAnalyzeStart();
  try {
    const json = await req.json();
    const parsed = analyzeBodySchema.safeParse(json);
    if (!parsed.success) {
      recordAnalyzeError();
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      countryCode,
      cityId,
      lat,
      lon,
      city: cityOverride,
      regionId,
    } = parsed.data;
    const code = countryCode.toUpperCase();
    const country = COUNTRIES.find((c) => c.code === code);
    const preset = getCityPreset(code, cityId);

    if (!country || !preset) {
      recordAnalyzeError();
      return NextResponse.json(
        { error: "Country not supported in demo registry" },
        { status: 404 }
      );
    }

    const report = await runAgentPipeline({
      country: country.name,
      countryCode: code,
      city: cityOverride ?? preset.city,
      lat: lat ?? preset.lat,
      lon: lon ?? preset.lon,
      regionId,
    });

    recordAnalyzeSuccess({
      usedCachedClimate: report.climate.dataQuality === "cached",
    });

    return NextResponse.json(report);
  } catch (e) {
    recordAnalyzeError();
    console.error("Analyze error:", e);
    return NextResponse.json(
      {
        error: "Agent pipeline failed",
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "KlimaGuard Kids Agent API",
    version: "0.3.0",
    agents: [
      "climate",
      "health",
      "nutrition",
      "disease",
      "natural-medicine",
      "india-regional",
      "india-impact",
      "synthesis",
    ],
    indiaRegions: INDIA_REGIONS.length,
    countries: COUNTRIES.length,
    cities: CITY_COUNT,
    cityTiers: CITY_TIER_COUNTS,
    trustedSources: TRUSTED_SOURCES.length,
    kpi: "/api/kpi",
  });
}
