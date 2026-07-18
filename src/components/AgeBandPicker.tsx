"use client";

import type { AgeBand } from "@/lib/types";
import { AGE_PROFILES } from "@/lib/gamification";

const BANDS: AgeBand[] = ["5-8", "9-12", "13-17"];

interface AgeBandPickerProps {
  value: AgeBand | null;
  onChange: (band: AgeBand) => void;
  disabled?: boolean;
}

export function AgeBandPicker({ value, onChange, disabled }: AgeBandPickerProps) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-3"
      role="radiogroup"
      aria-label="Choose your age group"
    >
      {BANDS.map((band) => {
        const profile = AGE_PROFILES[band];
        const selected = value === band;
        return (
          <button
            key={band}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(band)}
            className={`rounded-2xl border-2 px-4 py-4 text-left transition-all ${
              selected
                ? "border-ocean bg-ocean/10 shadow-md scale-[1.02]"
                : "border-sky-100 bg-white hover:border-ocean/40 hover:bg-sky-50/60"
            } disabled:opacity-50`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-ocean">
              Ages {band}
            </p>
            <p className="mt-1 font-extrabold text-ink">{profile.label}</p>
            <p className="mt-1 text-sm text-ink/65">{profile.tagline}</p>
            <p className="mt-3 text-xs font-semibold text-ink/50">
              Earn {profile.currencyEmoji} {profile.currencyName}
            </p>
          </button>
        );
      })}
    </div>
  );
}
