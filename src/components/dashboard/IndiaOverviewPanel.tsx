"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getIndiaOverview,
  type IndiaOverview,
} from "@/lib/dashboard-stats";
import { KpiCardGrid } from "@/components/dashboard/KpiCards";
import { ChisMapCard } from "@/components/dashboard/ChisMapCard";
import { RiskTableCard } from "@/components/dashboard/RiskTableCard";
import {
  DimensionsDonutCard,
  TrendLineCard,
} from "@/components/dashboard/ChartCards";

type LiveIndia = IndiaOverview & {
  mode?: "live" | "seed";
  probed?: number;
  failed?: number;
  error?: string;
};

export function IndiaOverviewPanel() {
  const [data, setData] = useState<LiveIndia>(() => ({
    ...getIndiaOverview(),
    mode: "seed",
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/overview?scope=india");
        if (!res.ok) throw new Error(`Overview HTTP ${res.status}`);
        const json = (await res.json()) as LiveIndia;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          setData({ ...getIndiaOverview(), mode: "seed" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const live = data.mode === "live";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white/80 px-4 py-3 shadow-sm">
        <p className="text-sm text-ink/70">
          {loading ? (
            <>Running India Overview Agent across metro hubs…</>
          ) : live ? (
            <>
              Live agent CHIS average <strong>{data.avgChis}</strong> ·{" "}
              <strong>{data.probed ?? data.mapPoints.length}</strong> metros ·{" "}
              <strong>{data.sources}</strong> sources
              {typeof data.failed === "number" && data.failed > 0
                ? ` · ${data.failed} hub(s) failed`
                : ""}
              .
            </>
          ) : (
            <>
              Seeded India CHIS average <strong>{data.avgChis}</strong> · live
              Overview Agent unavailable. Run a region analysis for agents.
            </>
          )}
        </p>
        <Link
          href="/india?view=analyze"
          className="rounded-full bg-gradient-to-r from-saffron to-ocean px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          Analyze a region
        </Link>
      </div>

      <KpiCardGrid items={data.kpis} />

      <ChisMapCard
        title="India CHIS map"
        subtitle={
          live
            ? "India outline · metro hubs from live Overview Agent"
            : "India outline · state and metro hubs by Child Health Impact Score"
        }
        points={data.mapPoints}
        mode="india"
        live={live}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <RiskTableCard
          id="top-states"
          title="Top 5 states by CHIS risk"
          rows={data.topStates}
          footerHref="/india?view=analyze"
          footerLabel="View all regions →"
        />
        <TrendLineCard
          id="trend"
          title="CHIS score trend (India)"
          points={data.trend}
        />
        <DimensionsDonutCard
          id="dimensions"
          title="Dimension overview (India)"
          slices={data.dimensions}
        />
      </div>
    </div>
  );
}
