import Link from "next/link";
import { getGlobalOverview } from "@/lib/dashboard-stats";
import { KpiCardGrid } from "@/components/dashboard/KpiCards";
import { ChisMapCard } from "@/components/dashboard/ChisMapCard";
import { RiskTableCard } from "@/components/dashboard/RiskTableCard";
import { AlertsDonutCard } from "@/components/dashboard/ChartCards";

export function GlobalOverviewPanel() {
  const data = getGlobalOverview();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 shadow-sm">
        <p className="text-sm text-ink/70">
          Registry coverage across <strong>{data.kpis[0].value}</strong>{" "}
          countries · <strong>{data.sources}</strong> trusted sources. Need a
          place-level agent run?
        </p>
        <Link
          href="/dashboard?view=analyze"
          className="rounded-full bg-ocean px-4 py-2 text-sm font-bold text-white hover:bg-sky-600"
        >
          Open Analyze
        </Link>
      </div>

      <KpiCardGrid items={data.kpis} />

      <ChisMapCard
        title="Global CHIS map"
        subtitle="Child Health Impact Score by monitored country hubs"
        points={data.mapPoints}
        mode="global"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <RiskTableCard
          id="high-risk"
          title="Top 5 high-risk regions"
          rows={data.highRisk}
          footerHref="/dashboard?view=analyze"
          footerLabel="Analyze a high-risk place →"
        />
        <AlertsDonutCard
          id="alerts"
          title="Global alerts summary"
          slices={data.alerts}
        />
      </div>
    </div>
  );
}
