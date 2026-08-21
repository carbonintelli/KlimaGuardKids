/** Open-Meteo geocoding helpers (public API, no key). */

export type GeocodeHit = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  country: string;
  admin1?: string;
  featureCode?: string;
  label: string;
};

type OpenMeteoGeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  country?: string;
  admin1?: string;
  feature_code?: string;
};

type OpenMeteoGeocodeResponse = {
  results?: OpenMeteoGeocodeResult[];
};

export async function searchPlaces(
  query: string,
  opts?: { count?: number; language?: string }
): Promise<GeocodeHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q);
  url.searchParams.set("count", String(opts?.count ?? 8));
  url.searchParams.set("language", opts?.language ?? "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Geocoding failed (${res.status})`);
  }

  const data = (await res.json()) as OpenMeteoGeocodeResponse;
  const results = data.results ?? [];

  return results
    .filter((r) => r.country_code && Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
    .map((r) => {
      const countryCode = r.country_code!.toUpperCase();
      const country = r.country ?? countryCode;
      const parts = [r.name, r.admin1, country].filter(Boolean);
      return {
        id: r.id,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        countryCode,
        country,
        admin1: r.admin1,
        featureCode: r.feature_code,
        label: parts.join(", "),
      } satisfies GeocodeHit;
    });
}
