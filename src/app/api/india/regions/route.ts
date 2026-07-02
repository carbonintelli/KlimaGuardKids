import { NextResponse } from "next/server";
import { INDIA_REGIONS } from "@/lib/india-regions";

export async function GET() {
  return NextResponse.json(
    INDIA_REGIONS.map((r) => ({
      id: r.id,
      name: r.name,
      state: r.state,
      city: r.city,
      lat: r.lat,
      lon: r.lon,
      climateZone: r.climateZone,
      tier: r.tier,
      primaryRisks: r.primaryRisks,
    }))
  );
}
