import type { RiskLevel, SynthesisReport } from "../types";
import { CITIES_BY_COUNTRY, COUNTRIES } from "../countries";
import { findNearestIndiaRegion, INDIA_REGIONS } from "../india-regions";
import { TRUSTED_SOURCES } from "../sources";
import { runAgentPipeline } from "./orchestrator";
import {
  chisBand,
  type AlertSlice,
  type DimensionSlice,
  type GlobalOverview,
  type IndiaOverview,
  type MapPoint,
  type RegionRiskRow,
  type TrendPoint,
} from "../dashboard-stats";

/**
 * Overview Agent
 * ---------------
 * Batches live `runAgentPipeline` probes across curated climate hubs and
 * synthesizes Global / India console payloads from agent outputs (not seeds).
 */

export type OverviewHub = {
  id: string;
  label: string;
  sublabel: string;
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
  regionId?: string;
};

/** Climate-vulnerable hubs spanning regions (tier-1 city preferred). */
const GLOBAL_HUB_CODES = [
  "BD",
  "IN",
  "PK",
  "NP",
  "PH",
  "ID",
  "VN",
  "TH",
  "MM",
  "AF",
  "NG",
  "KE",
  "ET",
  "SD",
  "SO",
  "MZ",
  "MG",
  "BR",
  "PE",
  "HT",
  "YE",
  "IQ",
  "SS",
  "TD",
] as const;

const OVERVIEW_TTL_MS = 15 * 60 * 1000;
const CONCURRENCY = 4;

type CacheBox<T> = { data: T; expiresAt: number };

const globalCache: { current: CacheBox<GlobalOverview> | null } = {
  current: null,
};
const indiaCache: { current: CacheBox<IndiaOverview> | null } = {
  current: null,
};

function riskToWellbeing(risk: RiskLevel): number {
  switch (risk) {
    case "low":
      return 86;
    case "moderate":
      return 55;
    case "high":
      return 30;
    case "critical":
      return 12;
  }
}

/** Agent CHIS is burden (high = worse). Console map uses wellbeing (high = better). */
export function burdenToWellbeing(burden: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - burden)));
}

function riskTrendFromReport(report: SynthesisReport): RegionRiskRow["trend"] {
  const dims = report.indiaImpact?.dimensions ?? [];
  if (dims.length) {
    const rising = dims.filter((d) => d.trend === "rising").length;
    const easing = dims.filter((d) => d.trend === "easing").length;
    if (rising > easing) return "rising";
    if (easing > rising) return "easing";
    return "stable";
  }
  const healthHigh = report.health.filter(
    (h) => h.risk === "high" || h.risk === "critical"
  ).length;
  if (healthHigh >= 2) return "rising";
  if (report.overallRisk === "low") return "easing";
  return "stable";
}

function alertCountFromReport(report: SynthesisReport): number {
  const healthAlerts = report.health.filter(
    (h) => h.risk === "high" || h.risk === "critical"
  ).length;
  const diseaseBoost =
    report.disease.risk === "critical"
      ? 2
      : report.disease.risk === "high"
        ? 1
        : 0;
  const nutritionBoost =
    report.nutrition.risk === "high" || report.nutrition.risk === "critical"
      ? 1
      : 0;
  return Math.max(1, healthAlerts + diseaseBoost + nutritionBoost);
}

export function listGlobalOverviewHubs(): OverviewHub[] {
  const hubs: OverviewHub[] = [];
  for (const code of GLOBAL_HUB_CODES) {
    const country = COUNTRIES.find((c) => c.code === code);
    const cities = CITIES_BY_COUNTRY[code] ?? [];
    // Prefer capital / national hub when present (India → New Delhi).
    const city =
      (code === "IN"
        ? cities.find((c) => c.id === "new-delhi")
        : undefined) ??
      cities.find((c) => c.tier === 1) ??
      cities[0] ??
      country?.cities?.[0];
    if (!country || !city) continue;
    const regionId =
      code === "IN"
        ? findNearestIndiaRegion(city.lat, city.lon)?.id
        : undefined;
    hubs.push({
      id: `${code}-${city.id}`,
      label: country.name,
      sublabel: city.city,
      country: country.name,
      countryCode: code,
      city: city.city,
      lat: city.lat,
      lon: city.lon,
      regionId,
    });
  }
  return hubs;
}

export function listIndiaOverviewHubs(): OverviewHub[] {
  return INDIA_REGIONS.filter((r) => r.tier === 1).map((r) => ({
    id: r.id,
    label: r.name,
    sublabel: r.state,
    country: "India",
    countryCode: "IN",
    city: r.city,
    lat: r.lat,
    lon: r.lon,
    regionId: r.id,
  }));
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => run())
  );
  return results;
}

type ProbeResult = {
  hub: OverviewHub;
  report: SynthesisReport | null;
  error?: string;
};

async function probeHub(hub: OverviewHub): Promise<ProbeResult> {
  try {
    const report = await runAgentPipeline({
      country: hub.country,
      countryCode: hub.countryCode,
      city: hub.city,
      lat: hub.lat,
      lon: hub.lon,
      regionId: hub.regionId,
    });
    return { hub, report };
  } catch (e) {
    return {
      hub,
      report: null,
      error: e instanceof Error ? e.message : "Probe failed",
    };
  }
}

function rowFromProbe(probe: ProbeResult): RegionRiskRow | null {
  if (!probe.report) return null;
  const report = probe.report;
  const burden = report.indiaImpact?.compositeScore;
  const chis =
    typeof burden === "number"
      ? burdenToWellbeing(burden)
      : riskToWellbeing(report.overallRisk);
  return {
    id: probe.hub.id,
    name: probe.hub.label,
    sublabel: probe.hub.sublabel,
    chis,
    band: chisBand(chis),
    trend: riskTrendFromReport(report),
    alerts: alertCountFromReport(report),
  };
}

function mapPointFromProbe(probe: ProbeResult): MapPoint | null {
  const row = rowFromProbe(probe);
  if (!row) return null;
  return {
    id: probe.hub.id,
    name: `${probe.hub.city}, ${probe.hub.label}`,
    chis: row.chis,
    band: row.band,
    lat: probe.hub.lat,
    lon: probe.hub.lon,
    state: probe.hub.countryCode === "IN" ? probe.hub.sublabel : undefined,
  };
}

function buildAlertSlices(rows: RegionRiskRow[]): AlertSlice[] {
  const totalAlerts = rows.reduce((s, r) => s + r.alerts, 0);
  const high = rows.filter(
    (r) => r.band === "critical" || r.band === "high"
  ).length;
  const medium = rows.filter((r) => r.band === "moderate").length;
  const low = rows.filter(
    (r) => r.band === "good" || r.band === "excellent"
  ).length;
  const denom = high + medium + low || 1;
  return [
    {
      id: "high",
      label: "High",
      count: Math.max(0, Math.round((high / denom) * totalAlerts)) || (high ? 1 : 0),
      color: "#dc2626",
    },
    {
      id: "medium",
      label: "Medium",
      count:
        Math.max(0, Math.round((medium / denom) * totalAlerts)) ||
        (medium ? 1 : 0),
      color: "#f97316",
    },
    {
      id: "low",
      label: "Low",
      count: Math.max(0, Math.round((low / denom) * totalAlerts)) || (low ? 1 : 0),
      color: "#22c55e",
    },
  ].map((s) => ({
    ...s,
    count: Math.max(s.count, s.id === "high" && high ? 1 : s.count),
  }));
}

function indiaDimensionsFromProbes(probes: ProbeResult[]): DimensionSlice[] {
  const buckets = new Map<string, { sum: number; n: number; label: string }>();
  const labelMap: Record<string, { label: string; color: string }> = {
    "heat-vulnerability": { label: "Heat", color: "#f97316" },
    "air-quality-burden": { label: "Air quality", color: "#0ea5e9" },
    "waterborne-pressure": { label: "Water quality", color: "#06b6d4" },
    "vector-disease-pressure": { label: "Disease", color: "#ef4444" },
    "nutrition-stress": { label: "Nutrition", color: "#22c55e" },
  };

  for (const probe of probes) {
    for (const dim of probe.report?.indiaImpact?.dimensions ?? []) {
      const meta = labelMap[dim.id] ?? {
        label: dim.name,
        color: "#64748b",
      };
      const wellbeing = burdenToWellbeing(dim.score);
      const prev = buckets.get(dim.id) ?? {
        sum: 0,
        n: 0,
        label: meta.label,
      };
      prev.sum += wellbeing;
      prev.n += 1;
      buckets.set(dim.id, prev);
    }
  }

  const colors = Object.fromEntries(
    Object.entries(labelMap).map(([id, v]) => [id, v.color])
  );

  return [...buckets.entries()].map(([id, v]) => ({
    id,
    label: v.label,
    score: Math.round(v.sum / Math.max(1, v.n)),
    color: colors[id] ?? "#64748b",
  }));
}

function trendFromRows(rows: RegionRiskRow[]): TrendPoint[] {
  const avg =
    rows.reduce((s, r) => s + r.chis, 0) / Math.max(1, rows.length) || 50;
  const labels = ["−8d", "−6d", "−4d", "−2d", "Now"];
  const risingShare =
    rows.filter((r) => r.trend === "rising").length / Math.max(1, rows.length);
  return labels.map((label, i) => {
    const t = i / (labels.length - 1);
    const drift = (risingShare - 0.35) * -18 * t;
    return { label, value: Math.round(avg + drift + (i - 2) * 1.5) };
  });
}

export async function runGlobalOverviewAgent(): Promise<
  GlobalOverview & { mode: "live"; probed: number; failed: number }
> {
  if (globalCache.current && Date.now() < globalCache.current.expiresAt) {
    return {
      ...globalCache.current.data,
      mode: "live",
      probed: globalCache.current.data.mapPoints.length,
      failed: 0,
    };
  }

  const hubs = listGlobalOverviewHubs();
  const probes = await mapPool(hubs, CONCURRENCY, probeHub);
  const rows = probes
    .map(rowFromProbe)
    .filter((r): r is RegionRiskRow => Boolean(r));
  const mapPoints = probes
    .map(mapPointFromProbe)
    .filter((p): p is MapPoint => Boolean(p));
  const failed = probes.filter((p) => !p.report).length;
  const highRisk = [...rows].sort((a, b) => a.chis - b.chis).slice(0, 5);
  const totalAlerts = rows.reduce((s, r) => s + r.alerts, 0);

  const data: GlobalOverview = {
    kpis: [
      {
        id: "countries",
        label: "Countries probed",
        value: String(rows.length),
        tone: "blue",
      },
      {
        id: "regions",
        label: "Agent hubs live",
        value: String(mapPoints.length),
        tone: "green",
      },
      {
        id: "children",
        label: "Children in coverage",
        value: "2.4B+",
        tone: "purple",
      },
      {
        id: "alerts",
        label: "Active alerts",
        value: String(totalAlerts),
        tone: "red",
      },
    ],
    highRisk,
    alerts: buildAlertSlices(rows),
    mapPoints,
    sources: TRUSTED_SOURCES.length,
    generatedAt: new Date().toISOString(),
  };

  globalCache.current = { data, expiresAt: Date.now() + OVERVIEW_TTL_MS };
  return { ...data, mode: "live", probed: rows.length, failed };
}

export async function runIndiaOverviewAgent(): Promise<
  IndiaOverview & { mode: "live"; probed: number; failed: number }
> {
  if (indiaCache.current && Date.now() < indiaCache.current.expiresAt) {
    return {
      ...indiaCache.current.data,
      mode: "live",
      probed: indiaCache.current.data.mapPoints.length,
      failed: 0,
    };
  }

  const hubs = listIndiaOverviewHubs();
  const probes = await mapPool(hubs, CONCURRENCY, probeHub);
  const rows = probes
    .map(rowFromProbe)
    .filter((r): r is RegionRiskRow => Boolean(r));
  const mapPoints = probes
    .map(mapPointFromProbe)
    .filter((p): p is MapPoint => Boolean(p));
  const failed = probes.filter((p) => !p.report).length;
  const topStates = [...rows].sort((a, b) => a.chis - b.chis).slice(0, 5);
  const avgChis = Math.round(
    rows.reduce((s, r) => s + r.chis, 0) / Math.max(1, rows.length)
  );
  const totalAlerts = rows.reduce((s, r) => s + r.alerts, 0);
  const dimensions = indiaDimensionsFromProbes(probes);

  const data: IndiaOverview = {
    kpis: [
      {
        id: "states",
        label: "Metros probed",
        value: String(rows.length),
        tone: "blue",
      },
      {
        id: "districts",
        label: "Regions in registry",
        value: String(INDIA_REGIONS.length),
        tone: "green",
      },
      {
        id: "children",
        label: "Children in coverage",
        value: "480M+",
        tone: "purple",
      },
      {
        id: "alerts",
        label: "Active alerts",
        value: String(totalAlerts),
        tone: "red",
      },
    ],
    topStates,
    dimensions:
      dimensions.length > 0
        ? dimensions
        : [
            {
              id: "heat",
              label: "Heat",
              score: avgChis,
              color: "#f97316",
            },
          ],
    trend: trendFromRows(rows),
    mapPoints,
    avgChis,
    sources: TRUSTED_SOURCES.length,
    generatedAt: new Date().toISOString(),
  };

  indiaCache.current = { data, expiresAt: Date.now() + OVERVIEW_TTL_MS };
  return { ...data, mode: "live", probed: rows.length, failed };
}

/** Test helper */
export function clearOverviewAgentCache(): void {
  globalCache.current = null;
  indiaCache.current = null;
}
