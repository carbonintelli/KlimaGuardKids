import { NextResponse } from "next/server";
import {
  CITY_COUNT,
  CITY_TIER_COUNTS,
  COUNTRIES,
  CITIES_BY_COUNTRY,
  getCityPreset,
} from "@/lib/countries";
import { TRUSTED_SOURCES } from "@/lib/sources";

export async function GET() {
  return NextResponse.json({
    count: {
      countries: COUNTRIES.length,
      cities: CITY_COUNT,
      byTier: CITY_TIER_COUNTS,
      trustedSources: TRUSTED_SOURCES.length,
    },
    countries: COUNTRIES.map((c) => {
      const cities = CITIES_BY_COUNTRY[c.code] ?? [];
      const defaultCity = getCityPreset(c.code);
      return {
        ...c,
        defaultCity: defaultCity?.city,
        lat: defaultCity?.lat,
        lon: defaultCity?.lon,
        cities,
      };
    }),
  });
}
