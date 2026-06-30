# KlimaGuard Kids

<p align="center">
  <img src="public/logo.svg" alt="KlimaGuard Kids logo" width="96" />
</p>

<p align="center">
  <strong>Open-source, agentic AI platform for child-centric climate health preparedness</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" /></a>
  <a href="https://github.com/carbonintelli/ClimateResilienceChildHealth/actions"><img src="https://img.shields.io/badge/Open%20Source-Yes-brightgreen.svg" alt="Open Source" /></a>
  <img src="https://img.shields.io/badge/India-12%20regions-orange.svg" alt="12 India regions" />
  <img src="https://img.shields.io/badge/Agents-9-blue.svg" alt="9 AI agents" />
</p>

---

KlimaGuard Kids connects live climate data with health, nutrition, and disease intelligence through **nine cooperating AI agents** — turning raw forecasts into age-appropriate guidance and **quantified child health impact scores** for Indian regions.

## What it does

### Global agents (all countries)

1. **Climate Data Agent** — live weather and air quality from [Open-Meteo](https://open-meteo.com/)
2. **Health Risk Agent** — heat, respiratory, flood, and vector stressors (WHO-aligned heuristics)
3. **Nutrition & Food Security Agent** — hydration, food safety, drought/flood nutrition impacts
4. **Disease Outlook Agent** — waterborne, vector-borne, and heat illness preparedness
5. **Natural Medicine Agent** — evidence-tagged supportive remedies under caregiver supervision
6. **Synthesis Agent** — cross-agent correlation and age-banded guidance (ages 5–8, 9–12, 13–17)
7. **Kids Health Chat Agent** — conversational Q&A on health and climate impact, age-appropriate tone, privacy filtering, and consultant scheduling

### India-specific agents

8. **India Regional Context Agent** — interprets monsoon cycles, climate zones, and state-level child vulnerability across **12 Indian regions**
9. **India Child Health Impact Agent** — measures the **Child Health Impact Score (CHIS)** (0–100) across five dimensions:
   - Child Heat Vulnerability Index (CHVI)
   - Child Respiratory Burden Score (CRBS)
   - Waterborne Disease Pressure Index (WDPI)
   - Vector-Borne Disease Pressure (VBDP)
   - Climate Nutrition Stress Index (CNSI)

All formulas are **transparent and open-source** in `src/lib/agents/india-impact-agent.ts`.

## Quick start

```bash
git clone https://github.com/carbonintelli/ClimateResilienceChildHealth.git
cd ClimateResilienceChildHealth
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000):

- **Health chat** — age-banded Q&A on health and climate impact with privacy safeguards
- **Dashboard** — global analysis for 20 countries
- **India** — regional child health impact analysis across 12 climate zones

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/countries` | GET | List supported countries |
| `/api/india/regions` | GET | List 12 Indian regions with climate metadata |
| `/api/analyze` | POST | Run full agent pipeline |
| `/api/chat` | POST | Kids health chat (age-banded, privacy-safe) |
| `/api/chat` | GET | Chat service metadata |
| `/api/consultant/schedule` | POST | Book a health consultant call (demo) |
| `/api/consultant/schedule` | GET | List available consultant slots |

### Analyze India region

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"countryCode": "IN", "regionId": "mumbai"}'
```

### Supported India regions

Delhi NCR, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Ahmedabad, Lucknow, Patna, Guwahati, Jaipur, Kochi

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- Live data: Open-Meteo Forecast + Air Quality APIs (no API key required)
- References: IMD, CPCB, NFHS-5, NVBDCP, WHO climate-health guidance

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, coding standards, and how to add new regions or agents.

## Open source

This project is released under the [MIT License](LICENSE). You are free to use, modify, and distribute it.

## Disclaimer

KlimaGuard Kids is a community preparedness tool, not a medical diagnostic system. Always consult qualified healthcare providers for clinical decisions.
