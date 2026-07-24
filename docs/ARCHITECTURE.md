# KlimaGuard Kids — Design & Architecture

Brief technical overview of how the product is designed and how the system fits together.

## Design goals

1. **Child-first preparedness** — outputs are age-banded (5–8, 9–12, 13–17), not clinical diagnosis.
2. **Transparent agents** — each “agent” is a pure TypeScript module with clear inputs/outputs and cited sources (not opaque LLM calls in the demo pipeline).
3. **Live climate, heuristic health** — weather/AQ come from Open-Meteo; health/nutrition/disease layers apply documented heuristics aligned with public guidance.
4. **Global reach, India depth** — any supported city runs the global pipeline; India adds regional context and a measurable Child Health Impact Score (CHIS).
5. **Low friction for kids** — play-mode progress stays in the browser (`localStorage`); no child accounts required for the demo.

## High-level architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Next.js App Router (React UI)                              │
│  /dashboard  /india  /play  /pitch                          │
└───────────────────────────┬─────────────────────────────────┘
                            │ fetch JSON
┌───────────────────────────▼─────────────────────────────────┐
│  Route Handlers                                             │
│  POST /api/analyze   GET /api/countries   GET /api/india/…  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Orchestrator  (src/lib/agents/orchestrator.ts)             │
│                                                             │
│  Climate ──► Health / Nutrition / Disease (parallel)        │
│         ──► Natural Medicine                                │
│         ──► [IN] Regional + CHIS Impact                     │
│         ──► Synthesis (correlations + child guidance)       │
└───────────────────────────┬─────────────────────────────────┘
                            │ SynthesisReport
┌───────────────────────────▼─────────────────────────────────┐
│  ReportView / IndiaImpactPanel / KidsPlayHub                │
└─────────────────────────────────────────────────────────────┘
```

## Stack

| Layer | Choice |
|--------|--------|
| App | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| API validation | Zod |
| Live climate | Open-Meteo Forecast + Air Quality (no API key) |
| Agents | Pure TS functions under `src/lib/agents/` |
| Registries | `countries.ts` (global cities), `india-regions.ts` (37 zones) |
| Play progress | Browser `localStorage` only |

## Repository layout

```text
src/
├── app/                 # Pages + API route handlers
│   ├── dashboard/       # Global country/city analysis UI
│   ├── india/           # India CHIS dashboard
│   ├── play/            # Age-based missions / badges
│   └── api/             # analyze, countries, india/regions
├── components/          # Client UI (selectors, ReportView, play hub)
└── lib/
    ├── agents/          # Orchestrator + domain agents
    ├── countries.ts     # Vulnerable countries & city presets
    ├── india-regions.ts # India tier/zone metadata
    ├── gamification.ts  # Age profiles, missions, badges
    ├── sources.ts       # Provenance labels
    └── types.ts         # Shared contracts (SynthesisReport, etc.)
```

## Analyze request flow

1. UI posts `{ countryCode, cityId? }` or `{ countryCode: "IN", regionId }`.
2. `/api/analyze` validates with Zod, resolves lat/lon from the city or India region registry.
3. `runAgentPipeline()`:
   - Fetches climate (network; failure fails the request).
   - Runs health, nutrition, and disease heuristics in parallel.
   - Runs natural-medicine matching.
   - If India: regional context → CHIS dimensions/composite.
   - Synthesis builds correlations and three age-band guidance cards.
4. UI renders `SynthesisReport` (and play mode can turn guidance into missions).

## Agent model

| Agent | Scope | Role |
|--------|--------|------|
| Climate | Global | Live weather, heat index, precipitation, AQI |
| Health | Global | Heat / respiratory / flood / vector stressors |
| Nutrition | Global | Hydration, food safety, scarcity notes |
| Disease | Global | Transmission, precautions, illness profiles |
| Natural medicine | Global | Supportive remedies with caregiver cautions |
| India regional | India | Monsoon, climate zone, regional child risks |
| India impact | India | CHIS (CHVI, CRBS, WDPI, VBDP, CNSI) 0–100 |
| Synthesis | Global | Cross-agent correlations + age-banded cards |

India agents activate only when `countryCode === "IN"`. Formulas for CHIS live in `src/lib/agents/india-impact-agent.ts`.

## Data & registries

- **Countries / cities** — `CITIES_BY_COUNTRY` holds multi-city presets with `primaryRisks` tags; `getCityPreset(code, cityId)` resolves coordinates for analyze.
- **India regions** — separate from the global city list; dashboard shows `IndiaRegionSelector` for India.
- **Trusted sources** — `sources.ts` attaches provenance to agent status (Open-Meteo, WHO, IMD, NFHS, etc.).

## Client vs server

| Runs on server | Runs in the browser |
|----------------|---------------------|
| `/api/*` route handlers | Dashboard, India, Play pages |
| All agent modules | Selectors, `ReportView`, `KidsPlayHub` |
| Registry lookups for analyze | Gamification XP / badges / streaks |

Outbound network from the demo pipeline is Open-Meteo (climate agent). Analysis is always requested via `fetch("/api/analyze")` so agent logic stays server-side.

## UI surfaces

| Route | Purpose |
|--------|---------|
| `/` | Product entry, CTAs |
| `/dashboard` | Country + city → full agent report |
| `/india` | Region → CHIS + India panels |
| `/play` | Age-tiered missions powered by guidance (optional climate unlock) |
| `/pitch` | Narrative / stakeholder overview |

## Design notes for contributors

- Prefer **deterministic, documented heuristics** over hidden model calls for core health scoring.
- Keep child copy **age-appropriate**; synthesis already splits tone by band.
- When adding geography, update registries only — orchestrator and selectors pick them up automatically (see [CONTRIBUTING.md](../CONTRIBUTING.md)).
- Play mode must remain **privacy-light** (device-local progress, no required child accounts).

## Related docs

- [README.md](../README.md) — product overview, quick start, API table  
- [CONTRIBUTING.md](../CONTRIBUTING.md) — how to add countries, cities, regions, agents  
- `Training/` — longer narrative and diagram assets for presentations  
