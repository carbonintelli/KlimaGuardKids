import { NextResponse } from "next/server";
import {
  CITY_COUNT,
  COUNTRIES,
  CITIES_BY_COUNTRY,
  getCityPreset,
} from "@/lib/countries";

export async function GET() {
  return NextResponse.json({
    count: {
      countries: COUNTRIES.length,
      cities: CITY_COUNT,
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
