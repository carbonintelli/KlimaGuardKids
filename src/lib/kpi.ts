import { CITY_COUNT, CITY_TIER_COUNTS, COUNTRIES } from "./countries";
import { INDIA_REGIONS } from "./india-regions";
import { TRUSTED_SOURCES } from "./sources";

/**
 * Public investment / product KPI surface for UNICEF VF transparency.
 * Registry counts are always live from source modules.
 * Session counters are process-local (reset on cold start) — fine for demo
 * transparency stubs; replace with durable store for field pilots.
 */

type KpiCounters = {
  analyzeRequests: number;
  analyzeSuccess: number;
  analyzeErrors: number;
  cachedClimateHits: number;
  lastAnalyzeAt: string | null;
};

const counters: KpiCounters = {
  analyzeRequests: 0,
  analyzeSuccess: 0,
  analyzeErrors: 0,
  cachedClimateHits: 0,
  lastAnalyzeAt: null,
};

export function recordAnalyzeStart(): void {
  counters.analyzeRequests += 1;
}

export function recordAnalyzeSuccess(opts?: { usedCachedClimate?: boolean }): void {
  counters.analyzeSuccess += 1;
  counters.lastAnalyzeAt = new Date().toISOString();
  if (opts?.usedCachedClimate) counters.cachedClimateHits += 1;
}

export function recordAnalyzeError(): void {
  counters.analyzeErrors += 1;
}

export function getPublicKpis() {
  const indiaByTier = {
    1: INDIA_REGIONS.filter((r) => r.tier === 1).length,
    2: INDIA_REGIONS.filter((r) => r.tier === 2).length,
    3: INDIA_REGIONS.filter((r) => r.tier === 3).length,
  };

  return {
    product: "KlimaGuard Kids",
    version: "0.2.0",
    generatedAt: new Date().toISOString(),
    coverage: {
      countries: COUNTRIES.length,
      cities: CITY_COUNT,
      cityTiers: CITY_TIER_COUNTS,
      indiaRegions: INDIA_REGIONS.length,
      indiaTiers: indiaByTier,
      trustedSources: TRUSTED_SOURCES.length,
      agents: 8,
    },
    /** Placeholder series for VF “real-time investment data” — expand in pilots */
    investment: {
      currency: "USD",
      seedRequested: 100_000,
      pilotSitesCommitted: 0,
      guidedSessionsTarget: 500,
      languagesShipped: 1,
      languagesTarget: 3,
      note: "Pilot site and session counters start at 0 until field MoUs begin; registry KPIs are live.",
    },
    runtime: {
      ...counters,
      note: "Runtime counters are process-local and reset on redeploy/cold start.",
    },
    links: {
      demo: "https://klimaguardkids.sustainow.in/",
      repository: "https://github.com/carbonintelli/KlimaGuardKids",
      privacy: "/privacy",
      api: "/api/kpi",
    },
  };
}

export type PublicKpis = ReturnType<typeof getPublicKpis>;
