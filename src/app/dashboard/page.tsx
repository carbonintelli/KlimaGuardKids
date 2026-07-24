"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CityPreset, CountryOption, SynthesisReport } from "@/lib/types";
import { INDIA_REGIONS } from "@/lib/india-regions";
import { CountrySelector } from "@/components/CountrySelector";
import { CitySelector } from "@/components/CitySelector";
import { IndiaRegionSelector } from "@/components/IndiaRegionSelector";
import { Logo } from "@/components/Logo";
import { ReportView } from "@/components/ReportView";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type CountriesResponse = {
  count?: { countries: number; cities: number };
  countries: CountryOption[];
};

export default function DashboardPage() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [registryCounts, setRegistryCounts] = useState({
    countries: 0,
    cities: 0,
  });
  const [countryCode, setCountryCode] = useState("BD");
  const [cityId, setCityId] = useState("dhaka");
  const [regionId, setRegionId] = useState("delhi-ncr");
  const [report, setReport] = useState<SynthesisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIndia = countryCode === "IN";

  const citiesForCountry: CityPreset[] = useMemo(() => {
    const match = countries.find((c) => c.code === countryCode);
    return match?.cities ?? [];
  }, [countries, countryCode]);

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((data: CountriesResponse | CountryOption[]) => {
        const list = Array.isArray(data) ? data : data.countries;
        const counts = Array.isArray(data)
          ? { countries: list.length, cities: 0 }
          : data.count ?? { countries: list.length, cities: 0 };
        setCountries(list);
        setRegistryCounts(counts);
        if (list.length && !list.find((c) => c.code === countryCode)) {
          setCountryCode(list[0].code);
        }
      })
      .catch(() => setError("Could not load countries"));
  }, [countryCode]);

  useEffect(() => {
    if (isIndia) return;
    if (!citiesForCountry.length) return;
    if (!citiesForCountry.find((c) => c.id === cityId)) {
      setCityId(citiesForCountry[0].id);
    }
  }, [citiesForCountry, cityId, isIndia]);

  const onCountryChange = (code: string) => {
    setCountryCode(code);
    setReport(null);
    const next = countries.find((c) => c.code === code);
    if (code !== "IN" && next?.cities?.length) {
      setCityId(next.cities[0].id);
    }
  };

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const body: {
        countryCode: string;
        regionId?: string;
        cityId?: string;
      } = { countryCode };
      if (isIndia) body.regionId = regionId;
      else body.cityId = cityId;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Analysis failed");
      setReport(data as SynthesisReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [countryCode, isIndia, regionId, cityId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
          <Logo size={56} />
          Global climate-health dashboard
        </h1>
        <p className="mt-2 text-ink/70 max-w-2xl">
          Choose a climate-vulnerable country and city
          {registryCounts.countries
            ? ` from ${registryCounts.countries} countries and ${registryCounts.cities} cities`
            : ""}
          . Six pipeline agents fetch live climate data and generate child-ready
          guidance; for India, two additional regional agents measure CHIS impact
          across {INDIA_REGIONS.length} zones.
        </p>
        {isIndia && (
          <Link
            href="/india"
            className="mt-3 inline-block text-sm font-bold text-saffron hover:underline"
          >
            → Open dedicated India dashboard with full impact panel
          </Link>
        )}
      </div>

      <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-lg max-w-xl">
        <CountrySelector
          countries={
            countries.length ? countries : [{ code: "BD", name: "Bangladesh", flag: "🇧🇩" }]
          }
          value={countryCode}
          onChange={onCountryChange}
          disabled={loading}
        />
        {isIndia ? (
          <div className="mt-4">
            <IndiaRegionSelector
              regions={INDIA_REGIONS}
              value={regionId}
              onChange={setRegionId}
              disabled={loading}
            />
          </div>
        ) : (
          <div className="mt-4">
            <CitySelector
              cities={citiesForCountry}
              value={cityId}
              onChange={setCityId}
              disabled={loading}
            />
          </div>
        )}
        <button
          type="button"
          onClick={runAnalysis}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-ocean py-4 font-extrabold text-white shadow-md hover:bg-sky-600 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Agents working…
            </>
          ) : (
            "Run agentic analysis"
          )}
        </button>
        {error && (
          <p className="mt-3 text-sm font-medium text-coral">{error}</p>
        )}
      </div>

      {report && (
        <div className="mt-10">
          <ReportView report={report} showIndiaPanel={isIndia} />
        </div>
      )}
    </div>
  );
}
