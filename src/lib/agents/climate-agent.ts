import type { ClimateSnapshot, ForecastDay } from "../types";

interface OpenMeteoCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  wind_speed_10m: number;
}

interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

const FETCH_TIMEOUT_MS = 8_000;
const MAX_ATTEMPTS = 2;
const CACHE_TTL_MS = 30 * 60 * 1000;

type CacheEntry = {
  snapshot: ClimateSnapshot;
  expiresAt: number;
};

const climateCache = new Map<string, CacheEntry>();

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function getCached(lat: number, lon: number): ClimateSnapshot | undefined {
  const entry = climateCache.get(cacheKey(lat, lon));
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    climateCache.delete(cacheKey(lat, lon));
    return undefined;
  }
  return entry.snapshot;
}

function setCache(lat: number, lon: number, snapshot: ClimateSnapshot): void {
  climateCache.set(cacheKey(lat, lon), {
    snapshot: { ...snapshot, dataQuality: "live" },
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/** Exposed for tests / cache inspection in local demos */
export function clearClimateCache(): void {
  climateCache.clear();
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { next?: { revalidate: number } } = {}
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchForecastRaw(lat: number, lon: number): Promise<{
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily;
}> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
    timezone: "auto",
    forecast_days: "7",
  });

  let lastError: Error | undefined;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetchWithTimeout(
        `https://api.open-meteo.com/v1/forecast?${params}`,
        { next: { revalidate: 1800 } }
      );
      if (!res.ok) {
        throw new Error(`Climate API error: ${res.status}`);
      }
      return (await res.json()) as {
        current: OpenMeteoCurrent;
        daily: OpenMeteoDaily;
      };
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
  }
  throw lastError ?? new Error("Climate fetch failed");
}

async function fetchOptionalAqi(lat: number, lon: number): Promise<number | undefined> {
  try {
    const aqParams = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "us_aqi",
    });
    const aqRes = await fetchWithTimeout(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${aqParams}`,
      { next: { revalidate: 3600 } }
    );
    if (!aqRes.ok) return undefined;
    const aqData = (await aqRes.json()) as {
      current?: { us_aqi?: number };
    };
    return aqData.current?.us_aqi;
  } catch {
    return undefined;
  }
}

export async function fetchClimateData(
  lat: number,
  lon: number
): Promise<ClimateSnapshot> {
  // Prefer TTL cache so overview batch probes and analyze share climate reads.
  const fresh = getCached(lat, lon);
  if (fresh) {
    return {
      ...fresh,
      dataQuality: "cached",
      fetchedAt: fresh.fetchedAt ?? new Date().toISOString(),
    };
  }

  try {
    const data = await fetchForecastRaw(lat, lon);
    const forecastDays: ForecastDay[] = data.daily.time.map((date, i) => ({
      date,
      tempMaxC: data.daily.temperature_2m_max[i],
      tempMinC: data.daily.temperature_2m_min[i],
      precipitationMm: data.daily.precipitation_sum[i] ?? 0,
      weatherCode: data.daily.weathercode[i],
    }));

    const temp = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;
    const aqi = await fetchOptionalAqi(lat, lon);
    const fetchedAt = new Date().toISOString();

    const snapshot: ClimateSnapshot = {
      temperatureC: temp,
      humidity,
      precipitationMm: data.current.precipitation,
      windSpeedKmh: data.current.wind_speed_10m,
      heatIndex: computeHeatIndex(temp, humidity),
      airQualityIndex: aqi,
      forecastDays,
      dataQuality: "live",
      fetchedAt,
    };
    setCache(lat, lon, snapshot);
    return snapshot;
  } catch (error) {
    const cached = getCached(lat, lon);
    if (cached) {
      return {
        ...cached,
        dataQuality: "cached",
        fetchedAt: cached.fetchedAt ?? new Date().toISOString(),
      };
    }
    throw error instanceof Error
      ? error
      : new Error("Climate fetch failed and no cached snapshot is available");
  }
}

/** NOAA Rothfusz regression; returns °C. Exported for unit tests. */
export function computeHeatIndex(tempC: number, humidity: number): number {
  const tempF = (tempC * 9) / 5 + 32;
  if (tempF < 80) return tempC;
  const hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * humidity -
    0.22475541 * tempF * humidity -
    0.00683783 * tempF * tempF -
    0.05481717 * humidity * humidity +
    0.00122874 * tempF * tempF * humidity +
    0.00085282 * tempF * humidity * humidity -
    0.00000199 * tempF * tempF * humidity * humidity;
  return Math.round((((hi - 32) * 5) / 9) * 10) / 10;
}
