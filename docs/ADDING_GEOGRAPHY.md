# Good first contribution: add a city or India region

## Add a global city (Tier 1–3)

1. Open `src/lib/countries.ts`.
2. Ensure the country exists in `COUNTRIES` (ISO code, name, flag).
3. Append a city under `CITIES_BY_COUNTRY[CODE]`:

```ts
{ id: "cox-bazar", city: "Cox's Bazar", lat: 21.4272, lon: 92.0058, tier: 3, primaryRisks: ["cyclone", "flood"] }
```

4. Choose `tier`: `1` metro · `2` emerging · `3` district/frontier.
5. Run `npm test` and `npm run build`.
6. Test in UI: `/dashboard` → country → city, or `POST /api/analyze` with `cityId`.

## Add an India CHIS region

1. Open `src/lib/india-regions.ts`.
2. Add an `IndiaRegion` with `tier`, `climateZone`, `monsoonMonths`, `primaryRisks`, `childPopulationShare`.
3. Test on `/india` or `POST /api/analyze` with `{ "countryCode": "IN", "regionId": "your-id" }`.

## After larger registry changes

Update counts in `README.md`, `docs/DATA_SOURCES_AND_GEOGRAPHY.md`, and regenerate docs if needed.
