import { NextRequest, NextResponse } from "next/server";
import { runAgentPipeline } from "@/lib/agents/orchestrator";
import { analyzeBodySchema } from "@/lib/analyze-schema";
import {
  CITY_COUNT,
  CITY_TIER_COUNTS,
  COUNTRIES,
  getCityPreset,
} from "@/lib/countries";
import {
  findNearestIndiaRegion,
  getIndiaRegion,
  INDIA_REGIONS,
} from "@/lib/india-regions";
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
      country: countryNameOverride,
      cityId,
      lat,
      lon,
      city: cityOverride,
      regionId,
    } = parsed.data;
    const code = countryCode.toUpperCase();
    const registryCountry = COUNTRIES.find((c) => c.code === code);
    const preset = getCityPreset(code, cityId);
    const hasCustom =
      typeof lat === "number" &&
      typeof lon === "number" &&
      Boolean(cityOverride?.trim());

    if (!hasCustom && (!registryCountry || !preset)) {
      return NextResponse.json(
        {
          error: "Location not found",
          message:
            "Choose a curated city from the registry, or search any place (city + coordinates).",
        },
        { status: 404 }
      );
    }

    let resolvedCity = cityOverride ?? preset?.city;
    let resolvedLat = lat ?? preset?.lat;
    let resolvedLon = lon ?? preset?.lon;
    let resolvedRegionId = regionId;

    if (code === "IN") {
      if (resolvedRegionId && getIndiaRegion(resolvedRegionId)) {
        const region = getIndiaRegion(resolvedRegionId)!;
        if (!hasCustom) {
          resolvedCity = region.city;
          resolvedLat = region.lat;
          resolvedLon = region.lon;
        }
      } else if (hasCustom) {
        const nearest = findNearestIndiaRegion(lat!, lon!);
        resolvedRegionId = nearest?.id;
      } else if (preset) {
        const nearest = findNearestIndiaRegion(preset.lat, preset.lon);
        resolvedRegionId = nearest?.id;
      }
    }

    if (
      resolvedCity == null ||
      resolvedLat == null ||
      resolvedLon == null
    ) {
      return NextResponse.json(
        {
          error: "Location not found",
          message:
            "Choose a curated city/region, or search any place (city + coordinates).",
        },
        { status: 404 }
      );
    }

    if (resolvedRegionId && code === "IN" && !getIndiaRegion(resolvedRegionId)) {
      return NextResponse.json(
        { error: "Unknown India regionId" },
        { status: 404 }
      );
    }

    const report = await runAgentPipeline({
      country: countryNameOverride ?? registryCountry?.name ?? code,
      countryCode: code,
      city: resolvedCity,
      lat: resolvedLat,
      lon: resolvedLon,
      regionId: code === "IN" ? resolvedRegionId : undefined,
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
    version: "0.3.1",
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
    geocode: "/api/geocode?q=",
    customLocation:
      "POST /api/analyze with { countryCode, country?, city, lat, lon } for any place",
  });
}
