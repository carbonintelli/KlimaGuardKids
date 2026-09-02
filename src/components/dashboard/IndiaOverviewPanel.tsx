import Link from "next/link";
import { getIndiaOverview } from "@/lib/dashboard-stats";
import { KpiCardGrid } from "@/components/dashboard/KpiCards";
import { ChisMapCard } from "@/components/dashboard/ChisMapCard";
import { RiskTableCard } from "@/components/dashboard/RiskTableCard";
import {
  DimensionsDonutCard,
  TrendLineCard,
} from "@/components/dashboard/ChartCards";

export function IndiaOverviewPanel() {
  const data = getIndiaOverview();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white/80 px-4 py-3 shadow-sm">
        <p className="text-sm text-ink/70">
          India CHIS average <strong>{data.avgChis}</strong> ·{" "}
          <strong>{data.kpis[1].value}</strong> regions ·{" "}
          <strong>{data.sources}</strong> sources. Run a region analysis for
          live agents.
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
        subtitle="State and metro hubs colored by Child Health Impact Score"
        points={data.mapPoints}
        mode="india"
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
