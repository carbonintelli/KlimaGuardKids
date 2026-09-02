import {
  chisBandColor,
  chisBandLabel,
  type ChisBand,
  type MapPoint,
} from "@/lib/dashboard-stats";

function project(
  lon: number,
  lat: number,
  bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number },
  width: number,
  height: number,
  pad = 24
) {
  const x =
    pad +
    ((lon - bounds.minLon) / Math.max(0.0001, bounds.maxLon - bounds.minLon)) *
      (width - pad * 2);
  const y =
    pad +
    ((bounds.maxLat - lat) / Math.max(0.0001, bounds.maxLat - bounds.minLat)) *
      (height - pad * 2);
  return { x, y };
}

const BANDS: ChisBand[] = [
  "excellent",
  "good",
  "moderate",
  "high",
  "critical",
];

export function ChisMapCard({
  title,
  subtitle,
  points,
  mode,
}: {
  title: string;
  subtitle: string;
  points: MapPoint[];
  mode: "global" | "india";
}) {
  const width = 920;
  const height = 420;
  const bounds =
    mode === "india"
      ? { minLon: 68, maxLon: 97, minLat: 6, maxLat: 36 }
      : { minLon: -170, maxLon: 190, minLat: -55, maxLat: 75 };

  return (
    <section
      id="chis-map"
      className="scroll-mt-24 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-ink">{title}</h2>
          <p className="text-sm text-ink/55">{subtitle}</p>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="CHIS score legend">
          {BANDS.map((band) => (
            <li
              key={band}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-ink/70"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: chisBandColor(band) }}
              />
              {chisBandLabel(band)}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-xl bg-gradient-to-b from-slate-100 to-sky-50 ring-1 ring-slate-200/70">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={title}
        >
          <defs>
            <pattern
              id="map-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.6"
                opacity="0.45"
              />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#map-grid)" />
          {mode === "global" ? (
            <g opacity="0.35" fill="#94a3b8">
              <ellipse cx="180" cy="160" rx="110" ry="70" />
              <ellipse cx="280" cy="250" rx="70" ry="100" />
              <ellipse cx="470" cy="150" rx="90" ry="55" />
              <ellipse cx="520" cy="230" rx="55" ry="80" />
              <ellipse cx="620" cy="180" rx="120" ry="75" />
              <ellipse cx="750" cy="280" rx="80" ry="50" />
              <ellipse cx="820" cy="320" rx="55" ry="35" />
            </g>
          ) : (
            <path
              d="M430 70 L510 90 L560 140 L580 210 L540 300 L480 350 L420 360 L360 320 L330 250 L350 170 L390 100 Z"
              fill="#94a3b8"
              opacity="0.28"
            />
          )}
          {points.map((p) => {
            const { x, y } = project(p.lon, p.lat, bounds, width, height);
            const color = chisBandColor(p.band);
            return (
              <g key={p.id}>
                <circle cx={x} cy={y} r="10" fill={color} opacity="0.2" />
                <circle
                  cx={x}
                  cy={y}
                  r="5.5"
                  fill={color}
                  stroke="#fff"
                  strokeWidth="1.5"
                >
                  <title>
                    {p.name}: CHIS {p.chis}
                  </title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-ink/45">
        Marker colors show relative Child Health Impact Score (CHIS) bands from
        the open registry model — open Analyze for live agent runs.
      </p>
    </section>
  );
}
