# Contributing to KlimaGuard Kids

Thank you for helping protect children from climate-health risks! This project is open source under the MIT License.

## Getting started

1. Fork the repository and clone your fork
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint
npm start        # Run production server
```

## Project structure

```
src/
├── app/              # Next.js pages and API routes
├── components/       # React UI components
└── lib/
    ├── agents/       # AI agent modules (add new agents here)
    ├── india-regions.ts
    ├── countries.ts  # Global countries + Tier 1–3 city presets
    ├── sources.ts    # Validated / trusted data provenance catalogue
    ├── gamification.ts
    └── types.ts
docs/
├── ARCHITECTURE.md                   # Design goals, pipeline, registries
├── DATA_SOURCES_AND_GEOGRAPHY.md     # Tiers, coverage counts, trusted sources
├── KGK_Technical_Commendation.pdf    # Rich-text technical commendation (published)
├── KGK_Technical_Commendation.source.md  # Editable source for the PDF
├── generate_kgk_technical_commendation.py
├── generate_architecture_diagrams.py
└── images/                           # Technical diagrams
```

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for design goals, the analyze pipeline, diagrams, and client/server boundaries before larger changes. For registry counts, tiers, and provenance, see [docs/DATA_SOURCES_AND_GEOGRAPHY.md](docs/DATA_SOURCES_AND_GEOGRAPHY.md). For the full capability statement, see [docs/KGK_Technical_Commendation.pdf](docs/KGK_Technical_Commendation.pdf) (regenerate after source edits with `python3 docs/generate_kgk_technical_commendation.py`).

## Adding a new Indian region

1. Add an entry to `src/lib/india-regions.ts` with lat/lon, climate zone, urban tier (`1` = metro, `2` = emerging hub, `3` = regional centre), and primary risks
2. The India Regional Context Agent and Impact Agent will automatically include it
3. Test via `/india` dashboard or `POST /api/analyze` with `regionId`

## Adding a new country or city

1. Add the country to `COUNTRIES` in `src/lib/countries.ts` (ISO code, name, flag)
2. Add one or more city presets under `CITIES_BY_COUNTRY` with `id`, coordinates, `tier` (`1` metro / `2` emerging / `3` regional), and `primaryRisks`
3. If you add a validated reference feed, register it in `src/lib/sources.ts` and wire the agent in `orchestrator.ts`
4. Test via `/dashboard` (country + city selectors) or `POST /api/analyze` with `countryCode` and optional `cityId`
5. If coverage counts change materially, update `README.md`, `docs/DATA_SOURCES_AND_GEOGRAPHY.md`, and `docs/KGK_Technical_Commendation.source.md`, then regenerate the PDF with `python3 docs/generate_kgk_technical_commendation.py`

## Adding a validated data source

1. Add a `DataSource` entry to `TRUSTED_SOURCES` in `src/lib/sources.ts` (`id`, `name`, `url`, `authenticated`)
2. Prefer citing it from the matching agent in `src/lib/agents/orchestrator.ts` via `getTrustedSource(id)`
3. Keep the distinction clear: **live fetch** (Open-Meteo today) vs **reference/provenance** (WHO, FAO, IMD, etc.)
4. Document the family in `docs/DATA_SOURCES_AND_GEOGRAPHY.md` when adding a new source category

## Adding or modifying agents

Agents are pure TypeScript functions in `src/lib/agents/`. To add a new agent:

1. Create `src/lib/agents/your-agent.ts`
2. Add the agent ID to `AgentId` in `src/lib/types.ts`
3. Register it in `src/lib/agents/orchestrator.ts`
4. Update the synthesis agent if cross-correlations are needed

## Coding standards

- TypeScript strict mode — no `any` unless unavoidable
- Match existing naming and file structure
- Keep agent logic transparent and document measurement formulas
- Run `npm run lint` and `npm run build` before submitting

## Pull requests

1. Describe what changed and why
2. Link related issues if applicable
3. Ensure CI passes (build + lint)
4. One focused change per PR when possible

## Code of conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Be respectful and inclusive.

## Questions

Open a GitHub issue for bugs, feature requests, or questions about the agent pipeline.
