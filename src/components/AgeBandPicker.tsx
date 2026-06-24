"use client";

import type { AgeBand } from "@/lib/types";

const BANDS: { value: AgeBand; label: string; description: string; emoji: string }[] = [
  {
    value: "5-8",
    label: "Ages 5–8",
    description: "Simple words & friendly tone",
    emoji: "🌈",
  },
  {
    value: "9-12",
    label: "Ages 9–12",
    description: "Clear facts & practical tips",
    emoji: "🛡️",
  },
  {
    value: "13-17",
    label: "Ages 13–17",
    description: "Detailed & community-focused",
    emoji: "🌍",
  },
];

interface AgeBandPickerProps {
  value: AgeBand;
  onChange: (band: AgeBand) => void;
  disabled?: boolean;
}

export function AgeBandPicker({ value, onChange, disabled }: AgeBandPickerProps) {
  return (
    <div>
      <p className="text-sm font-bold text-ink mb-2">Your age level</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {BANDS.map((band) => (
          <button
            key={band.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(band.value)}
            className={`rounded-2xl border p-3 text-left transition-colors ${
              value === band.value
                ? "border-ocean bg-ocean/10 ring-2 ring-ocean/30"
                : "border-sky-100 bg-white hover:border-sky-200"
            } disabled:opacity-60`}
          >
            <span className="text-xl">{band.emoji}</span>
            <p className="mt-1 font-bold text-ink text-sm">{band.label}</p>
            <p className="text-xs text-ink/60">{band.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
