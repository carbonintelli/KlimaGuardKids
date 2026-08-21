import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchPlaces } from "@/lib/geocode";

const querySchema = z.object({
  q: z.string().min(2).max(120),
  count: z.coerce.number().int().min(1).max(15).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = querySchema.safeParse(params);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Provide q= with at least 2 characters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const places = await searchPlaces(parsed.data.q, {
      count: parsed.data.count ?? 8,
    });

    return NextResponse.json({
      query: parsed.data.q,
      count: places.length,
      places,
    });
  } catch (e) {
    console.error("Geocode error:", e);
    return NextResponse.json(
      {
        error: "Geocode lookup failed",
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}
