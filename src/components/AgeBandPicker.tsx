"use client";

import Image from "next/image";
import type { AgeBand } from "@/lib/types";
import { AGE_PROFILES } from "@/lib/gamification";
import { AGE_BAND_VISUALS } from "@/lib/age-band-visuals";

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
        const visual = AGE_BAND_VISUALS[band];
        const selected = value === band;
        return (
          <button
            key={band}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(band)}
            className={`overflow-hidden rounded-2xl border-2 text-left transition-all ${
              selected
                ? "border-ocean bg-ocean/10 shadow-md scale-[1.02]"
                : "border-sky-100 bg-white hover:border-ocean/40 hover:bg-sky-50/60"
            } disabled:opacity-50`}
          >
            <div className={`relative aspect-[4/3] bg-gradient-to-br ${visual.accentClass}`}>
              <Image
                src={visual.imageSrc}
                alt={visual.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, 220px"
                className="object-cover object-center"
              />
            </div>
            <div className="px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-ocean">
                Ages {band}
              </p>
              <p className="mt-1 font-extrabold text-ink">{profile.label}</p>
              <p className="mt-1 text-sm text-ink/65">{profile.tagline}</p>
              <p className="mt-3 text-xs font-semibold text-ink/50">
                Earn {profile.currencyEmoji} {profile.currencyName}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
