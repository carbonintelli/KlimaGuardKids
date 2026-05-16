# KlimaGuard Kids

**Open-source, agentic AI platform for child-centric climate health preparedness — worldwide.**

## What it does

Five cooperating AI agents:

1. **Climate Data Agent** — fetches live weather & air quality from [Open-Meteo](https://open-meteo.com/)
2. **Health Risk Agent** — heat, respiratory, flood, vector stressors (WHO-aligned heuristics)
3. **Nutrition & Food Security Agent** — hydration, food safety, drought/flood nutrition impacts
4. **Disease Outlook Agent** — waterborne, vector-borne, heat illness preparedness
5. **Synthesis Agent** — cross-agent correlation + age-banded guidance (5–8, 9–12, 13–17)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — use **Dashboard** to run analysis for any supported country.

## API

- `GET /api/countries` — list countries with default cities
- `POST /api/analyze` — `{ "countryCode": "IN" }` — run full agent pipeline
- `GET /api/analyze` — service metadata

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- Live data: Open-Meteo Forecast + Air Quality APIs (no API key required for demo)

## License

MIT — Open Source.
