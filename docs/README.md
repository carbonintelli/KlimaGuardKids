# KlimaGuard Kids — Documentation index

Technical and proposal documentation for the open-source KlimaGuard Kids platform (Sustainow Technologies).

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Design goals, stack, agent pipeline, client/server boundary |
| [DATA_SOURCES_AND_GEOGRAPHY.md](DATA_SOURCES_AND_GEOGRAPHY.md) | Tiers, registries (159 / 482 / 77), trusted sources, provenance |
| [KGK_Technical_Commendation.pdf](KGK_Technical_Commendation.pdf) | Procurement-ready technical commendation (regenerate from `.source.md`) |
| [KGK_Technical_Commendation.source.md](KGK_Technical_Commendation.source.md) | Editable source for the PDF |
| [../README.md](../README.md) | Product overview, quick start, API examples |
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | How to add geography, agents, and contribute |

## Architecture diagrams (`images/`)

Regenerate core set:

```bash
python3 docs/generate_architecture_diagrams.py
```

| Image | Topic |
|-------|--------|
| `system-layers.png` | UI → API → orchestrator → agents → report |
| `client-server.png` | Browser vs Node boundary |
| `agent-pipeline.png` | Eight agents + India branch |
| `analyze-sequence.png` | Analyze request sequence |
| `data-registries.png` | Country / city / India resolution |
| `chis-dimensions.png` | India CHIS dimensions |
| `play-gamification.png` | Age-banded play model |
| `repo-map.png` | Repository layout |
| `tech-stack-annex1.png` | Full tech-stack annex (client / server / external / meta) |
| `curriculum-map-annex3.png` | Content / curriculum hierarchy |
| `content-sample-annex4.png` | Sample Ages 5–8 mission pack |

## UNICEF Venture Fund / UNGM materials

Bid pack: [`../UNGM/submission/`](../UNGM/submission/) · regenerate with `python3 UNGM/fill_sustainow_bid.py`

| Doc | Template |
|-----|----------|
| [UNGM_Template3_Product_Design_Plan.md](UNGM_Template3_Product_Design_Plan.md) | 12-month design / data plan |
| [UNGM_Template7_Budget_Plan.md](UNGM_Template7_Budget_Plan.md) | Project + company budget (USD 60,000 seed ask) |

**Live demo:** https://klimaguardkids.sustainow.in/  
**Source:** https://github.com/carbonintelli/KlimaGuardKids  
**License:** MIT
