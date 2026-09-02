import { NextRequest, NextResponse } from "next/server";
import {
  runGlobalOverviewAgent,
  runIndiaOverviewAgent,
} from "@/lib/agents/overview-agent";
import { getGlobalOverview, getIndiaOverview } from "@/lib/dashboard-stats";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Scope = "global" | "india";

function seedPayload(scope: Scope) {
  if (scope === "india") {
    return {
      ...getIndiaOverview(),
      mode: "seed" as const,
      probed: 0,
      failed: 0,
    };
  }
  return {
    ...getGlobalOverview(),
    mode: "seed" as const,
    probed: 0,
    failed: 0,
  };
}

/**
 * Live Overview Agent feed.
 * Runs curated hub probes through `runAgentPipeline` and returns console KPIs / CHIS.
 * Falls back to deterministic seed stats if all probes fail.
 */
export async function GET(req: NextRequest) {
  const scopeParam = req.nextUrl.searchParams.get("scope")?.toLowerCase();
  const scope: Scope = scopeParam === "india" ? "india" : "global";

  try {
    const live =
      scope === "india"
        ? await runIndiaOverviewAgent()
        : await runGlobalOverviewAgent();

    if (live.probed === 0) {
      return NextResponse.json(seedPayload(scope), {
        headers: {
          "Cache-Control": "no-store",
          "X-Overview-Mode": "seed",
        },
      });
    }

    return NextResponse.json(live, {
      headers: {
        "Cache-Control": "private, max-age=60",
        "X-Overview-Mode": "live",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Overview agent failed";
    return NextResponse.json(
      { ...seedPayload(scope), error: message },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-Overview-Mode": "seed",
        },
      }
    );
  }
}
