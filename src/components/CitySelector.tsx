"use client";

import { useId } from "react";
import type { CityPreset, UrbanTier } from "@/lib/types";
import { CITY_TIER_LABELS } from "@/lib/countries";

interface Props {
  cities: CityPreset[];
  value: string;
  onChange: (cityId: string) => void;
  disabled?: boolean;
}

const TIERS: UrbanTier[] = [1, 2, 3];

export function CitySelector({ cities, value, onChange, disabled }: Props) {
  const selectId = useId();
  const hintId = `${selectId}-hint`;

  if (cities.length === 0) return null;

  const hasTiers = cities.some((c) => c.tier != null);

  return (
    <div className="block w-full">
      <label htmlFor={selectId} className="mb-2 block text-sm font-bold text-ink/70">
        Select vulnerable city
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-disabled={disabled}
        aria-describedby={disabled ? hintId : undefined}
        className="w-full rounded-2xl border-2 border-leaf/40 bg-white px-4 py-3 text-base font-semibold text-ink shadow-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:border-sky-100 disabled:bg-sky-50 disabled:text-ink/50"
      >
        {hasTiers
          ? TIERS.map((tier) => {
              const tierCities = cities.filter((c) => c.tier === tier);
              if (!tierCities.length) return null;
              return (
                <optgroup key={tier} label={CITY_TIER_LABELS[tier]}>
                  {tierCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.city}
                      {city.primaryRisks?.length
                        ? ` — ${city.primaryRisks.slice(0, 3).join(", ")}`
                        : ""}
                    </option>
                  ))}
                </optgroup>
              );
            })
          : cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.city}
                {city.primaryRisks?.length
                  ? ` — ${city.primaryRisks.slice(0, 3).join(", ")}`
                  : ""}
              </option>
            ))}
      </select>
      <p className="mt-2 text-xs text-ink/60">
        {cities.length} cities across Tier 1–3 · climate-vulnerable presets
      </p>
      {disabled && (
        <p id={hintId} className="mt-1 text-xs text-ink/60">
          City selection is locked while analysis is running.
        </p>
      )}
    </div>
  );
}
