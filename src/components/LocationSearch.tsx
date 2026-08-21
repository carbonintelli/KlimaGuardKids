"use client";

import { useEffect, useId, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

export type PlaceSelection = {
  name: string;
  label: string;
  countryCode: string;
  country: string;
  lat: number;
  lon: number;
  admin1?: string;
};

type GeocodePlace = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  country: string;
  admin1?: string;
  label: string;
};

interface Props {
  disabled?: boolean;
  selected?: PlaceSelection | null;
  onSelect: (place: PlaceSelection) => void;
}

export function LocationSearch({ disabled, selected, onSelect }: Props) {
  const inputId = useId();
  const listId = `${inputId}-results`;
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeocodePlace[]>([]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const handle = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(q)}&count=8`
        );
        const data = (await res.json()) as {
          places?: GeocodePlace[];
          error?: string;
          message?: string;
        };
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Search failed");
        }
        setResults(data.places ?? []);
        if (!(data.places ?? []).length) {
          setError("No places found. Try another city or country name.");
        }
      } catch (e) {
        setResults([]);
        setError(e instanceof Error ? e.message : "Search failed");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(handle);
  }, [query]);

  return (
    <div className="block w-full">
      <label htmlFor={inputId} className="mb-2 block text-sm font-bold text-ink/70">
        Search any city or country
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder="e.g. Nairobi, Lisbon, Chennai, Brazil…"
          autoComplete="off"
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full rounded-2xl border-2 border-sky-200 bg-white py-3 pl-10 pr-10 text-base font-semibold text-ink shadow-sm focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/30 disabled:cursor-not-allowed disabled:bg-sky-50 disabled:text-ink/50"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ocean" />
        )}
      </div>

      {selected && (
        <p className="mt-2 flex items-start gap-2 text-sm text-ink/70">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
          <span>
            Selected: <strong>{selected.label}</strong>
            <span className="text-ink/50">
              {" "}
              ({selected.lat.toFixed(2)}, {selected.lon.toFixed(2)})
            </span>
          </span>
        </p>
      )}

      {error && <p className="mt-2 text-sm font-medium text-coral">{error}</p>}

      {results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="mt-2 max-h-56 overflow-auto rounded-2xl border border-sky-100 bg-white shadow-md"
        >
          {results.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                role="option"
                aria-selected={
                  selected?.lat === place.latitude &&
                  selected?.lon === place.longitude &&
                  selected?.name === place.name
                }
                disabled={disabled}
                onClick={() => {
                  onSelect({
                    name: place.name,
                    label: place.label,
                    countryCode: place.countryCode,
                    country: place.country,
                    lat: place.latitude,
                    lon: place.longitude,
                    admin1: place.admin1,
                  });
                  setQuery(place.label);
                  setResults([]);
                }}
                className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm hover:bg-sky-50 disabled:opacity-50"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
                <span>
                  <span className="font-bold text-ink">{place.name}</span>
                  <span className="block text-ink/60">{place.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
