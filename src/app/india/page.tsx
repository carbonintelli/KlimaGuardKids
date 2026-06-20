"use client";

import { useCallback, useState } from "react";
import type { SynthesisReport } from "@/lib/types";
import { INDIA_REGIONS } from "@/lib/india-regions";
import { IndiaRegionSelector } from "@/components/IndiaRegionSelector";
import { ReportView } from "@/components/ReportView";
import { Loader2, MapPin, Sparkles } from "lucide-react";

export default function IndiaDashboardPage() {
  const [regionId, setRegionId] = useState("delhi-ncr");
  const [report, setReport] = useState<SynthesisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: "IN", regionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Analysis failed");
      setReport(data as SynthesisReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-saffron/10 px-4 py-1 text-sm font-bold text-saffron">
          <Sparkles className="h-4 w-4" />
          India Climate-Health Intelligence
        </p>
        <h1 className="mt-4 text-3xl font-extrabold text-ink flex items-center gap-3">
          <MapPin className="h-8 w-8 text-saffron" />
          Child health impact across Indian regions
        </h1>
        <p className="mt-2 text-ink/70 max-w-3xl">
          Eight specialized AI agents analyze live climate data for 12 Indian
          regions — measuring the Child Health Impact Score (CHIS) across heat,
          air quality, waterborne disease, vectors, and nutrition dimensions.
          Built on open-source, transparent heuristics aligned with IMD, CPCB,
          NFHS-5, and NVBDCP references.
        </p>
      </div>

      <div className="rounded-3xl border border-saffron/20 bg-white p-6 shadow-lg max-w-xl">
        <IndiaRegionSelector
          regions={INDIA_REGIONS}
          value={regionId}
          onChange={setRegionId}
          disabled={loading}
        />
        <button
          type="button"
          onClick={runAnalysis}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-saffron to-ocean py-4 font-extrabold text-white shadow-md hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              India agents measuring impact…
            </>
          ) : (
            "Run India child health impact analysis"
          )}
        </button>
        {error && (
          <p className="mt-3 text-sm font-medium text-coral">{error}</p>
        )}
      </div>

      {report && (
        <div className="mt-10">
          <ReportView report={report} showIndiaPanel />
        </div>
      )}

      <section className="mt-16 rounded-3xl border border-sky-100 bg-white/80 p-8">
        <h2 className="text-xl font-extrabold text-ink text-center">
          India-specific AI agents
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              name: "India Regional Context Agent",
              desc: "Interprets monsoon cycles, climate zones, and state-level child vulnerability profiles across 12 regions.",
            },
            {
              name: "India Child Health Impact Agent",
              desc: "Computes CHIS composite score (0–100) across five dimensions with transparent, open-source formulas.",
            },
          ].map((agent) => (
            <div
              key={agent.name}
              className="rounded-2xl bg-sky-50 p-5 border border-sky-100"
            >
              <h3 className="font-bold text-ocean">{agent.name}</h3>
              <p className="mt-2 text-sm text-ink/70">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
