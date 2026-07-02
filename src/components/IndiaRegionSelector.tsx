"use client";

import { useId } from "react";
import type { IndiaRegion } from "@/lib/types";
import { INDIA_TIER_LABELS } from "@/lib/india-regions";

interface Props {
  regions: IndiaRegion[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

const TIERS: IndiaRegion["tier"][] = [1, 2, 3];

export function IndiaRegionSelector({
  regions,
  value,
  onChange,
  disabled,
}: Props) {
  const selectId = useId();
  const hintId = `${selectId}-hint`;

  return (
    <div className="block w-full">
      <label htmlFor={selectId} className="mb-2 block text-sm font-bold text-ink/70">
        Select Indian region
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-disabled={disabled}
        aria-describedby={disabled ? hintId : undefined}
        className="w-full rounded-2xl border-2 border-saffron/40 bg-white px-4 py-3 text-base font-semibold text-ink shadow-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:border-saffron/20 disabled:bg-sky-50 disabled:text-ink/50"
      >
        {TIERS.map((tier) => {
          const tierRegions = regions.filter((r) => r.tier === tier);
          if (!tierRegions.length) return null;
          return (
            <optgroup key={tier} label={INDIA_TIER_LABELS[tier]}>
              {tierRegions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.state}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
      <p className="mt-2 text-xs text-ink/60">
        {regions.length} regions across Tier 1–3 · child health impact measured per city
      </p>
      {disabled && (
        <p id={hintId} className="mt-1 text-xs text-ink/60">
          Region selection is locked while analysis is running.
        </p>
      )}
    </div>
  );
}
