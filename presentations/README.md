# KlimaGuard Kids presentations

| File | Purpose |
|------|---------|
| `KlimaGuard-Kids-Pitch.pptx` | Investor / partner pitch (problem, solution, agents, traction, roadmap) |
| `KlimaGuard-Kids-Check-In.pptx` | Progress check-in (status, completed work, blockers, next 90 days) |

Coverage figures in the generators should match the demo registry (159 countries, 482 Tier 1–3 cities, 77 India regions, ~50 validated sources). See [`docs/DATA_SOURCES_AND_GEOGRAPHY.md`](../docs/DATA_SOURCES_AND_GEOGRAPHY.md).

## Regenerate

```bash
pip install python-pptx
python presentations/generate_decks.py
```

Slides use brand colors from the web app (`#0ea5e9` ocean, `#0f172a` ink).
