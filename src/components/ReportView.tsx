"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import type { SynthesisReport } from "@/lib/types";
import { AGE_PROFILES } from "@/lib/gamification";
import { RiskBadge } from "./RiskBadge";
import { AgentPanel } from "./AgentPanel";
import { IndiaImpactPanel } from "./IndiaImpactPanel";
import { ShareReportButton } from "./ShareReportButton";
import {
  Droplets,
  Thermometer,
  Wind,
  Heart,
  Apple,
  Bug,
  Link2,
  Leaf,
  Shield,
  Gamepad2,
  LayoutDashboard,
  MapPinned,
  Bot,
  Stethoscope,
  Users,
} from "lucide-react";

type ReportTabId = "overview" | "india" | "agents" | "care" | "guidance";

type TabDef = {
  id: ReportTabId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function ReportView({
  report,
  showIndiaPanel = false,
}: {
  report: SynthesisReport;
  showIndiaPanel?: boolean;
}) {
  const showIndia =
    Boolean(showIndiaPanel || report.indiaImpact) &&
    Boolean(report.indiaRegional && report.indiaImpact);

  const tabs: TabDef[] = [
    {
      id: "overview",
      label: "Overview",
      shortLabel: "Overview",
      icon: LayoutDashboard,
    },
    ...(showIndia
      ? [
          {
            id: "india" as const,
            label: "India impact",
            shortLabel: "India",
            icon: MapPinned,
          },
        ]
      : []),
    {
      id: "agents",
      label: "Agent details",
      shortLabel: "Agents",
      icon: Bot,
    },
    {
      id: "care",
      label: "Care tips",
      shortLabel: "Care",
      icon: Stethoscope,
    },
    {
      id: "guidance",
      label: "Child guidance",
      shortLabel: "Kids",
      icon: Users,
    },
  ];

  const [activeTab, setActiveTab] = useState<ReportTabId>("overview");
  const tablistId = useId();

  useEffect(() => {
    setActiveTab("overview");
  }, [report.generatedAt, report.location.city, report.location.country]);

  useEffect(() => {
    if (!showIndia && activeTab === "india") {
      setActiveTab("overview");
    }
  }, [showIndia, activeTab]);

  const topActions = report.correlations.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Sticky context — always visible */}
      <section className="rounded-3xl border border-sky-100 bg-white p-6 shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ocean uppercase tracking-wide">
              {report.location.city}, {report.location.country}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">
              Climate disruption outlook
            </h2>
            <p className="mt-2 text-ink/70">
              Window: <strong>{report.disruptionWindow}</strong> · Updated{" "}
              {new Date(report.generatedAt).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-ink/50">
              {report.location.lat.toFixed(2)}°, {report.location.lon.toFixed(2)}°
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <RiskBadge
              level={report.overallRisk}
              label={`${report.overallRisk} risk`}
            />
            <ShareReportButton report={report} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat
            icon={Thermometer}
            label="Now"
            value={`${report.climate.temperatureC}°C`}
          />
          <Stat
            icon={Droplets}
            label="Humidity"
            value={`${report.climate.humidity}%`}
          />
          <Stat
            icon={Wind}
            label="Wind"
            value={`${report.climate.windSpeedKmh} km/h`}
          />
          <Stat
            icon={Thermometer}
            label="Heat index"
            value={`${report.climate.heatIndex ?? "—"}°C`}
          />
        </div>
        {report.climate.airQualityIndex != null && (
          <p className="mt-4 text-sm text-ink/70">
            Air quality index (US AQI):{" "}
            <strong>{report.climate.airQualityIndex}</strong>
          </p>
        )}
        {topActions.length > 0 && (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
              Top signals
            </p>
            <ul className="mt-2 space-y-2 text-sm text-ink/80">
              {topActions.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-4 text-xs text-ink/50">
          Preparedness guidance only — not a medical diagnosis. Seek a clinician
          for urgent symptoms.
        </p>
      </section>

      {/* Tabs */}
      <div className="rounded-3xl border border-sky-100 bg-white/90 p-2 shadow-md sm:p-3">
        <div
          role="tablist"
          aria-label="Report sections"
          id={tablistId}
          className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${tablistId}-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${tablistId}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors sm:px-4 ${
                  selected
                    ? "bg-ocean text-white shadow-sm"
                    : "bg-transparent text-ink/65 hover:bg-sky-50 hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${tablistId}-panel-${activeTab}`}
        aria-labelledby={`${tablistId}-${activeTab}`}
        className="min-h-[12rem] space-y-8"
      >
        {activeTab === "overview" && <OverviewTab report={report} />}
        {activeTab === "india" &&
          showIndia &&
          report.indiaRegional &&
          report.indiaImpact && (
            <IndiaImpactPanel
              regional={report.indiaRegional}
              impact={report.indiaImpact}
            />
          )}
        {activeTab === "agents" && <AgentsTab report={report} />}
        {activeTab === "care" && <CareTab report={report} />}
        {activeTab === "guidance" && <GuidanceTab report={report} />}
      </div>

      <section className="text-xs text-ink/50">
        <p className="mb-2 font-bold text-ink/60">Data provenance</p>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {report.dataProvenance.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean hover:underline"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function OverviewTab({ report }: { report: SynthesisReport }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
          <Link2 className="h-5 w-5 text-ocean" />
          Cross-agent correlations
        </h3>
        <ul className="mt-4 space-y-3">
          {report.correlations.map((c, i) => (
            <li
              key={i}
              className="rounded-xl border border-amber-100 bg-white/80 px-4 py-3 text-sm text-ink/80"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightCard
          icon={Heart}
          title="Health"
          items={report.health.map((h) => ({
            title: h.title,
            risk: h.risk,
            body: h.description,
            list: h.actions,
          }))}
        />
        <InsightCard
          icon={Apple}
          title="Food & nutrition"
          items={[
            {
              title: report.nutrition.title,
              risk: report.nutrition.risk,
              body: report.nutrition.description,
              list: [
                ...report.nutrition.recommendedFoods.map((f) => `Eat: ${f}`),
                ...report.nutrition.avoid.map((a) => `Avoid: ${a}`),
                `Hydration target: ~${report.nutrition.hydrationLiters}L/day`,
              ],
            },
          ]}
        />
      </div>

      <p className="rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm text-ink/70">
        Use the tabs above for India CHIS scores, full agent pipeline details,
        disease/care tips, and age-banded child guidance.
      </p>
    </div>
  );
}

function AgentsTab({ report }: { report: SynthesisReport }) {
  return (
    <section>
      <h3 className="mb-4 text-lg font-extrabold text-ink">
        Agentic AI pipeline
      </h3>
      <AgentPanel agents={report.agents} />
    </section>
  );
}

function CareTab({ report }: { report: SynthesisReport }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <InsightCard
          icon={Bug}
          title="Disease preparedness"
          items={[
            {
              title: "Outlook",
              risk: report.disease.risk,
              body: report.disease.conditions.join(", "),
              list: report.disease.prevention,
            },
          ]}
        />
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-extrabold text-ink">
            <Shield className="h-5 w-5 text-ocean" />
            How diseases spread
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-ink/80">
            {report.disease.transmissionSummary.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          <h4 className="mt-4 text-xs font-bold uppercase text-ink/50">
            Precautionary steps
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink/80">
            {report.disease.precautionarySteps.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
          {report.disease.symptoms.length > 0 && (
            <>
              <h4 className="mt-4 text-xs font-bold uppercase text-ink/50">
                Watch for symptoms
              </h4>
              <p className="mt-1 text-sm text-ink/70">
                {report.disease.symptoms.join(" · ")}
              </p>
            </>
          )}
        </div>
      </div>

      {report.disease.profiles.length > 0 && (
        <section className="rounded-3xl border border-rose-100 bg-rose-50/30 p-6">
          <h3 className="text-lg font-extrabold text-ink">
            Disease profiles — spread, signs & when to seek care
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {report.disease.profiles.map((profile) => (
              <article
                key={profile.name}
                className="rounded-2xl border border-rose-100 bg-white p-4"
              >
                <h4 className="font-bold text-ink">{profile.name}</h4>
                <p className="mt-2 text-xs font-bold uppercase text-ink/50">
                  How it spreads
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-ink/80">
                  {profile.howItSpreads.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-bold uppercase text-ink/50">
                  Early symptoms
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-ink/80">
                  {profile.earlySymptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-bold uppercase text-ink/50">
                  Precautions
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-ink/80">
                  {profile.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <p className="mt-3 rounded-xl bg-rose-50 p-2 text-xs text-ink/80">
                  <strong>See a clinician:</strong> {profile.whenToSeeDoctor}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-ink">
          <Leaf className="h-5 w-5 text-leaf" />
          Natural medicines & home support
          <RiskBadge level={report.naturalMedicine.risk} />
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          Matched by the Natural Medicine Agent from disease conditions — always
          under adult supervision; not a substitute for vaccines or prescribed
          treatment.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-ink/70">
          {report.naturalMedicine.generalCautions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {report.naturalMedicine.remedies.map((r) => (
            <article
              key={r.remedy}
              className="rounded-2xl border border-emerald-100 bg-white p-4"
            >
              <p className="text-xs font-bold text-ocean">{r.forCondition}</p>
              <h4 className="mt-1 font-bold text-ink">{r.remedy}</h4>
              <p className="mt-2 text-sm text-ink/75">{r.howItHelps}</p>
              <p className="mt-2 text-xs text-ink/70">
                <strong>Adult supervision:</strong> {r.adultSupervision}
              </p>
              {r.cautions.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-coral/90">
                  {r.cautions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs italic text-ink/50">{r.evidenceNote}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function GuidanceTab({ report }: { report: SynthesisReport }) {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-ink">
            Guidance for children (by age)
          </h3>
          <p className="mt-1 text-sm text-ink/60">
            Turn these tips into age-matched quests, badges, and streaks.
          </p>
        </div>
        <Link
          href="/play"
          className="inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          <Gamepad2 className="h-4 w-4" />
          Open kids play
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {report.childGuidance.map((g) => {
          const profile = AGE_PROFILES[g.ageBand];
          return (
            <article
              key={g.ageBand}
              className="rounded-3xl border-2 border-sky-100 bg-white p-5 shadow-md"
            >
              <span className="text-3xl">{g.emoji}</span>
              <p className="mt-2 text-xs font-bold text-ocean">
                Ages {g.ageBand} · {profile.label}
              </p>
              <h4 className="mt-1 font-extrabold text-ink">{g.headline}</h4>
              <p className="mt-2 text-sm text-ink/75">{g.simpleExplanation}</p>
              <p className="mt-2 text-xs font-semibold text-ink/50">
                Earn {profile.currencyEmoji} {profile.currencyName} in play mode
              </p>

              <div className="mt-4 rounded-xl bg-sky-50/80 p-3">
                <p className="text-xs font-bold uppercase text-ocean">
                  How climate affects you
                </p>
                <p className="mt-1 text-sm text-ink/80">
                  {g.howClimateAffectsYou}
                </p>
              </div>

              <GuidanceList
                title="Beating the disruption"
                items={g.beatingTheDisruption}
              />
              <GuidanceList
                title="Stay healthy from germs"
                items={g.stayHealthyFromGerms}
              />
              <GuidanceList
                title="Natural help at home (with an adult)"
                items={g.naturalHelpFromHome}
              />
              <GuidanceList title="Prepare today" items={g.prepareToday} />
              <GuidanceList title="Ask a caring adult" items={g.askAdultFor} />

              {g.funFact && (
                <p className="mt-3 rounded-xl bg-sky-50 p-3 text-xs font-medium text-ocean">
                  💡 {g.funFact}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GuidanceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-bold uppercase text-ink/50">{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-ink/80">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-sky-50 p-3 text-center">
      <Icon className="mx-auto h-5 w-5 text-ocean" />
      <p className="mt-1 text-xs text-ink/50">{label}</p>
      <p className="font-bold text-ink">{value}</p>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: {
    title: string;
    risk: import("@/lib/types").RiskLevel;
    body: string;
    list: string[];
  }[];
}) {
  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 font-extrabold text-ink">
        <Icon className="h-5 w-5 text-ocean" />
        {title}
      </h3>
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold">{item.title}</p>
              <RiskBadge level={item.risk} />
            </div>
            <p className="mt-1 text-sm text-ink/70">{item.body}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink/75">
              {item.list.slice(0, 8).map((l, j) => (
                <li key={j}>{l}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
