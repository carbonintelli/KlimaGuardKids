"use client";

import { useId } from "react";
import type { CountryOption } from "@/lib/types";

interface Props {
  countries: CountryOption[];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export function CountrySelector({
  countries,
  value,
  onChange,
  disabled,
}: Props) {
  const selectId = useId();
  const hintId = `${selectId}-hint`;

  return (
    <div className="block w-full">
      <label htmlFor={selectId} className="mb-2 block text-sm font-bold text-ink/70">
        Select your country
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-disabled={disabled}
        aria-describedby={disabled ? hintId : undefined}
        className="w-full rounded-2xl border-2 border-sky-200 bg-white px-4 py-3 text-base font-semibold text-ink shadow-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:border-sky-100 disabled:bg-sky-50 disabled:text-ink/50"
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
      {disabled && (
        <p id={hintId} className="mt-2 text-xs text-ink/60">
          Country selection is locked while analysis is running.
        </p>
      )}
    </div>
  );
}
