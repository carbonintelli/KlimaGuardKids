"use client";

import type { IndiaRegion } from "@/lib/types";

interface Props {
  regions: IndiaRegion[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function IndiaRegionSelector({
  regions,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <label className="block w-full">
      <span className="mb-2 block text-sm font-bold text-ink/70">
        Select Indian region
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border-2 border-saffron/40 bg-white px-4 py-3 text-base font-semibold text-ink shadow-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:opacity-60"
      >
        {regions.map((r) => (
          <option key={r.id} value={r.id}>
            🇮🇳 {r.name} — {r.state}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-ink/60">
        12 climate zones across India · child health impact measured per region
      </p>
    </label>
  );
}
