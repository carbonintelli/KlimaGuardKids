# KlimaGuard Kids API

Base URL (local): `http://localhost:3000`

## `GET /api/countries`

Lists supported countries with nested Tier 1–3 city presets.

**Response (shape):**

```json
{
  "count": {
    "countries": 159,
    "cities": 482,
    "byTier": { "1": 168, "2": 163, "3": 151 },
    "trustedSources": 50
  },
  "countries": [
    {
      "code": "BD",
      "name": "Bangladesh",
      "flag": "🇧🇩",
      "defaultCity": "Dhaka",
      "lat": 23.81,
      "lon": 90.41,
      "cities": [
        { "id": "dhaka", "city": "Dhaka", "lat": 23.81, "lon": 90.41, "tier": 1, "primaryRisks": ["flood", "heat"] }
      ]
    }
  ]
}
```

## `GET /api/india/regions`

Lists India CHIS regions (tier, climate zone, monsoon months, risks).

## `GET /api/analyze`

Service metadata (agent list, registry counts). Also points to `/api/kpi`.

## `POST /api/analyze`

Runs the full agent pipeline.

**Body:**

```json
{
  "countryCode": "BD",
  "cityId": "chattogram"
}
```

India deep analysis:

```json
{
  "countryCode": "IN",
  "regionId": "mumbai"
}
```

Optional overrides: `city`, `lat`, `lon`.

**Success:** `SynthesisReport` JSON (climate, health, nutrition, disease, natural medicine, child guidance, correlations, provenance; India fields when `IN`).

**Errors:** `400` invalid body · `404` unsupported country · `500` climate/pipeline failure (after retries; may succeed via cached climate when available).

## `GET /api/kpi`

Public coverage + investment transparency metrics (registry counts, seed placeholders, process-local analyze counters).

## Client usage

```bash
curl -s http://localhost:3000/api/kpi | jq .coverage
curl -s -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"countryCode":"IN","regionId":"delhi-ncr"}' | jq .indiaImpact.compositeScore
```

See also: [ARCHITECTURE.md](ARCHITECTURE.md), [DATA_SOURCES_AND_GEOGRAPHY.md](DATA_SOURCES_AND_GEOGRAPHY.md), [CONTRIBUTING.md](../CONTRIBUTING.md).
