# Data sources & geography

Reference for KlimaGuard Kids coverage: urban tiers, country/city registries, India deep zones, and validated provenance sources. Counts below match the demo registry in source control; prefer reading the TypeScript modules or API if you need the live list.

| Registry | Module | Approx. count |
|----------|--------|--------------:|
| Countries | `src/lib/countries.ts` → `COUNTRIES` | **159** |
| Global cities (Tier 1–3) | `CITIES_BY_COUNTRY` | **482** (≈168 / 163 / 151) |
| India regions (Tier 1–3) | `src/lib/india-regions.ts` | **77** (8 / 33 / 36) |
| Trusted sources | `src/lib/sources.ts` | **50** |

Machine-readable:

- `GET /api/countries` — countries, nested cities (with `tier`), `count.byTier`, `count.trustedSources`
- `GET /api/india/regions` — India zones with tier, climate zone, monsoon months, risks
- `GET /api/analyze` — service metadata including country/city/region/source counts

## Urban tiers

The same 1–3 tier model is used for **global cities** and **India regions**:

| Tier | Meaning | Typical use |
|------|---------|-------------|
| **1** | Metro / national hub | Dense urban heat islands, multi-hazard capitals |
| **2** | Emerging secondary city | State/provincial hubs, coastal growth centres |
| **3** | District / coastal / frontier centre | Underserved or high-exposure local centres |

UI: `CitySelector` and `IndiaRegionSelector` group options under tier labels (`CITY_TIER_LABELS` / `INDIA_TIER_LABELS`).

## Global geography

- Curated **climate-vulnerable** presets (not an exhaustive world gazetteer).
- Each city has `id`, `city`, `lat`, `lon`, `tier`, and optional `primaryRisks` tags (heat, flood, cyclone, drought, air, vector, sea-level, etc.).
- Helpers: `getCitiesForCountry`, `getCitiesByTier`, `getCityPreset`, `CITY_COUNT`, `CITY_TIER_COUNTS`.
- India also appears in the global city list for dashboard use; deeper CHIS analysis uses `INDIA_REGIONS` via `/india` or `regionId` on analyze.

## India deep coverage (CHIS)

India keeps a separate regional model for monsoon/climate-zone context and the Child Health Impact Score:

| Tier | Count | Focus |
|------|------:|-------|
| 1 — Metros | 8 | Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad, Pune |
| 2 — Emerging hubs | 33 | Indo-Gangetic, coastal, Northeast, Marathwada, and other secondary hubs |
| 3 — Regional centres | 36 | District and frontier centres (flood plains, Thar edge, hills, drought belts) |

Each region includes `climateZone`, `childPopulationShare`, `primaryRisks`, and `monsoonMonths`. Agents: India Regional Context + India Child Health Impact (`india-impact-agent.ts`).

## Validated / trusted data sources

Catalogue: `src/lib/sources.ts` (`TRUSTED_SOURCES`, `getTrustedSource`).

**Live fetch today:** Open-Meteo Forecast + Air Quality.  
**Everything else** is an authoritative **reference / provenance** framework that grounds heuristics, India CHIS notes, and report citations — not necessarily fetched at runtime.

| Family | Example IDs | Role |
|--------|-------------|------|
| Live weather / AQ | `open-meteo`, `open-meteo-air` | Operational climate inputs |
| Climate EO / forecast | `copernicus-cds`, `nasa-power`, `chirps-rainfall`, `ecmwf`, `noaa-cpc`, `climateserv` | Climate and rainfall context |
| UN health & child rights | `who-guidance`, `who-heat-health`, `who-wash`, `unicef-climate-child`, `unicef-wash`, `unicef-mics` | Child-health / WASH framing |
| Disaster & adaptation | `undrr-sendai`, `inform-risk`, `nd-gain`, `emdat-disasters`, `reliefweb` | Risk and vulnerability framing |
| Food security | `fao-food-security`, `wfp-hunger`, `ipc-acute-food`, `fews-net`, `ghews` | Nutrition / scarcity framing |
| Water / development | `wri-aqueduct`, `world-bank-climate` | Water-stress context |
| Regional health / met | `paho-climate`, `africa-cdc`, `ecdc`, `caribbean-cimh`, `sprep-pacific`, `uk-metoffice`, `bom-australia`, `jma-japan`, `cdc-climate-health` | Region-specific services |
| Humanitarian | `acaps`, `unhcr-climate`, `iom-dtm` | Displacement / crisis context |
| India national | `imd-india`, `cpcb-india`, `nfhs-india`, `nvbdcp-india`, `idsp-india`, `ncdc-india` | India regional + CHIS context |

### Agent provenance wiring

`src/lib/agents/orchestrator.ts` attaches a primary source per agent, for example:

| Agent | Primary source ID |
|-------|-------------------|
| Climate | `open-meteo` |
| Health | `who-heat-health` |
| Nutrition | `fao-food-security` |
| Disease | `who-wash` |
| Natural medicine | `who-traditional-medicine` |
| India regional | `imd-india` |
| India impact | `nfhs-india` |
| Synthesis | `unicef-climate-child` |

Synthesis also lists the full `TRUSTED_SOURCES` set on `dataProvenance` for transparency in the report UI.

## Extending coverage

See [CONTRIBUTING.md](../CONTRIBUTING.md):

1. Add countries/cities with a `tier` in `countries.ts`.
2. Add India regions with tier + climate metadata in `india-regions.ts`.
3. Register new validated feeds in `sources.ts` and wire agents in `orchestrator.ts`.
4. Refresh counts in README / this file / `KGK_Technical_Commendation.source.md` (and UNGM bid templates if needed) when registry size changes materially.
5. Optionally regenerate architecture diagrams: `python3 docs/generate_architecture_diagrams.py`.

## Related documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — system design and pipeline  
- [KGK_Technical_Commendation.pdf](KGK_Technical_Commendation.pdf) — technical commendation (§6 sources & geography)  
- [README.md](../README.md) — product overview and badges  
