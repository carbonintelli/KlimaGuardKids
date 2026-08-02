import { NextResponse } from "next/server";
import { getPublicKpis } from "@/lib/kpi";

/** Public investment / product KPI feed for transparency and VF reporting. */
export async function GET() {
  return NextResponse.json(getPublicKpis(), {
    headers: {
      "Cache-Control": "public, max-age=30",
    },
  });
}
