import Link from "next/link";
import { BarChart3, Globe2, HeartHandshake, Layers } from "lucide-react";
import { getPublicKpis } from "@/lib/kpi";
import { Abbr } from "@/components/Abbr";
import { AcronymGlossary } from "@/components/AcronymGlossary";

export const metadata = {
  title: "Impact & investment KPIs — KlimaGuard Kids",
  description:
    "Public coverage and investment transparency metrics for KlimaGuard Kids.",
};

export default function ImpactPage() {
  const kpi = getPublicKpis();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="inline-flex items-center gap-2 rounded-full bg-leaf/10 px-3 py-1 text-sm font-bold text-leaf">
        <BarChart3 className="h-4 w-4" />
        Public impact <Abbr of="KPI" />s
      </p>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">
        Coverage & investment transparency
      </h1>
      <p className="mt-3 max-w-2xl text-ink/70">
        Live registry metrics and investment placeholders for UNICEF Venture
        Fund–style reporting. Machine-readable feed:{" "}
        <Link
          href="/api/kpi"
          className="font-semibold text-ocean hover:underline"
        >
          GET /api/kpi
        </Link>
        .
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Countries"
          value={String(kpi.coverage.countries)}
          icon={<Globe2 className="h-5 w-5" />}
        />
        <Stat
          label="Tiered cities"
          value={String(kpi.coverage.cities)}
          icon={<Layers className="h-5 w-5" />}
        />
        <Stat
          label="India regions"
          value={String(kpi.coverage.indiaRegions)}
          icon={<HeartHandshake className="h-5 w-5" />}
        />
        <Stat
          label="Trusted sources"
          value={String(kpi.coverage.trustedSources)}
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Card title="City tiers">
          <ul className="space-y-2 text-sm text-ink/80">
            <li>Tier 1 metros: {kpi.coverage.cityTiers[1]}</li>
            <li>Tier 2 emerging: {kpi.coverage.cityTiers[2]}</li>
            <li>Tier 3 regional: {kpi.coverage.cityTiers[3]}</li>
          </ul>
        </Card>
        <Card
          title={
            <>
              India <Abbr of="CHIS" /> tiers
            </>
          }
        >
          <p className="mb-3 text-xs text-ink/55">
            Regions scored with the <Abbr of="CHIS" showExpansion />.
          </p>
          <ul className="space-y-2 text-sm text-ink/80">
            <li>Tier 1: {kpi.coverage.indiaTiers[1]}</li>
            <li>Tier 2: {kpi.coverage.indiaTiers[2]}</li>
            <li>Tier 3: {kpi.coverage.indiaTiers[3]}</li>
          </ul>
        </Card>
        <Card title="Investment placeholders">
          <ul className="space-y-2 text-sm text-ink/80">
            <li>
              Seed requested: $
              {kpi.investment.seedRequested.toLocaleString()}{" "}
              {kpi.investment.currency}
            </li>
            <li>Pilot sites committed: {kpi.investment.pilotSitesCommitted}</li>
            <li>
              Guided sessions target: {kpi.investment.guidedSessionsTarget}
            </li>
            <li>
              Languages shipped / target: {kpi.investment.languagesShipped} /{" "}
              {kpi.investment.languagesTarget}
            </li>
          </ul>
          <p className="mt-3 text-xs text-ink/55">{kpi.investment.note}</p>
        </Card>
        <Card title="Runtime (this process)">
          <ul className="space-y-2 text-sm text-ink/80">
            <li>Analyze requests: {kpi.runtime.analyzeRequests}</li>
            <li>Successes: {kpi.runtime.analyzeSuccess}</li>
            <li>Errors: {kpi.runtime.analyzeErrors}</li>
            <li>Cached climate uses: {kpi.runtime.cachedClimateHits}</li>
            <li>Last analyze: {kpi.runtime.lastAnalyzeAt ?? "—"}</li>
          </ul>
          <p className="mt-3 text-xs text-ink/55">{kpi.runtime.note}</p>
        </Card>
      </section>

      <div className="mt-10">
        <AcronymGlossary
          groups={["score", "governance", "data"]}
          defaultOpen
          title="Acronyms on this page"
        />
      </div>

      <p className="mt-10 text-sm text-ink/60">
        Generated {new Date(kpi.generatedAt).toUTCString()} · v{kpi.version} ·{" "}
        <Link href="/privacy" className="text-ocean hover:underline">
          Privacy
        </Link>
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-ocean">{icon}</div>
      <p className="mt-3 text-3xl font-extrabold text-ink">{value}</p>
      <p className="text-sm font-semibold text-ink/60">{label}</p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
