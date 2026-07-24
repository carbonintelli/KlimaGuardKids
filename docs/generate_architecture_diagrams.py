#!/usr/bin/env python3
"""Generate technical architecture diagrams for docs/ARCHITECTURE.md."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch, Rectangle

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "images"
OUT.mkdir(parents=True, exist_ok=True)

INK = "#0f172a"
MUTED = "#64748b"
OCEAN = "#0ea5e9"
SKY = "#bae6fd"
LEAF = "#4ade80"
LEAF_SOFT = "#dcfce7"
SAFFRON = "#f97316"
SUN = "#fbbf24"
CORAL = "#fb7185"
PAPER = "#f8fafc"
WHITE = "#ffffff"


def box(ax, x, y, w, h, text, face, fs=9, ec=INK, lw=1.2, tc=INK):
    patch = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.03,rounding_size=0.12",
        facecolor=face,
        edgecolor=ec,
        linewidth=lw,
    )
    ax.add_patch(patch)
    ax.text(
        x + w / 2,
        y + h / 2,
        text,
        ha="center",
        va="center",
        fontsize=fs,
        color=tc,
        wrap=True,
    )


def arrow(ax, x1, y1, x2, y2, color=MUTED, lw=1.4):
    ax.annotate(
        "",
        xy=(x2, y2),
        xytext=(x1, y1),
        arrowprops=dict(arrowstyle="->", color=color, lw=lw),
    )


def save(fig, name: str) -> Path:
    path = OUT / name
    fig.savefig(path, dpi=180, bbox_inches="tight", facecolor=WHITE)
    plt.close(fig)
    print("wrote", path)
    return path


def draw_system_layers() -> Path:
    fig, ax = plt.subplots(figsize=(11, 7.2))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7.2)
    ax.axis("off")
    ax.set_title(
        "System layers — UI → API → Orchestrator → Agents → Report",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    layers = [
        (0.4, 5.7, 10.2, 1.1, SKY, "Presentation\nNext.js pages: /dashboard  ·  /india  ·  /play  ·  /pitch"),
        (0.4, 4.2, 10.2, 1.1, OCEAN, "API boundary\nPOST /api/analyze   GET /api/countries   GET /api/india/regions"),
        (0.4, 2.7, 10.2, 1.1, LEAF_SOFT, "Orchestrator\nsrc/lib/agents/orchestrator.ts — sequence, India gate, agent status"),
        (0.4, 1.0, 10.2, 1.3, "#fef3c7", "Domain agents + registries\nClimate · Health · Nutrition · Disease · Natural medicine · India · Synthesis\nCountries/cities · India regions · Trusted sources"),
    ]
    for x, y, w, h, color, text in layers:
        box(ax, x, y, w, h, text, color, fs=10)

    for y in (5.7, 4.2, 2.7):
        arrow(ax, 5.5, y, 5.5, y - 0.35, OCEAN, 1.8)

    ax.text(
        5.5,
        0.35,
        "Output contract: SynthesisReport JSON → ReportView / IndiaImpactPanel / KidsPlayHub",
        ha="center",
        va="center",
        fontsize=9,
        color=MUTED,
    )
    return save(fig, "system-layers.png")


def draw_analyze_sequence() -> Path:
    fig, ax = plt.subplots(figsize=(11.5, 6.8))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 11.5)
    ax.set_ylim(0, 6.8)
    ax.axis("off")
    ax.set_title(
        "Analyze sequence — from city selection to child guidance",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    steps = [
        (0.3, 4.8, "1. Select place\nCountry + cityId\nor India regionId", SKY),
        (3.1, 4.8, "2. Validate\nZod schema +\nregistry resolve", OCEAN),
        (5.9, 4.8, "3. Fetch climate\nOpen-Meteo\nweather + AQI", "#7dd3fc"),
        (8.7, 4.8, "4. Heuristics\nHealth · Nutrition\nDisease (parallel)", LEAF_SOFT),
        (1.7, 2.2, "5. Natural medicine\n+ India agents if IN", SAFFRON),
        (4.7, 2.2, "6. Synthesis\nCorrelations +\nage-band cards", LEAF),
        (7.7, 2.2, "7. Render UI\nReport / CHIS /\nPlay missions", "#fef3c7"),
    ]
    for x, y, text, color in steps:
        box(ax, x, y, 2.5, 1.5, text, color, fs=9)

    arrow(ax, 2.8, 5.55, 3.1, 5.55)
    arrow(ax, 5.6, 5.55, 5.9, 5.55)
    arrow(ax, 8.4, 5.55, 8.7, 5.55)
    arrow(ax, 9.95, 4.8, 8.95, 3.7)
    arrow(ax, 2.95, 2.95, 4.7, 2.95)
    arrow(ax, 7.2, 2.95, 7.7, 2.95)
    arrow(ax, 5.5, 4.8, 2.95, 3.7)

    ax.text(
        5.75,
        0.7,
        "Failure mode: climate fetch error → HTTP 500. Missing country/city → HTTP 404.",
        ha="center",
        fontsize=9,
        color=MUTED,
    )
    return save(fig, "analyze-sequence.png")


def draw_agent_pipeline() -> Path:
    fig, ax = plt.subplots(figsize=(12, 7.4))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 7.4)
    ax.axis("off")
    ax.set_title(
        "Eight-agent pipeline — global path vs India path",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    box(ax, 4.2, 6.3, 3.6, 0.75, "Open-Meteo climate + air quality", SKY, 10)
    box(ax, 4.2, 5.1, 3.6, 0.75, "Climate Data Agent", OCEAN, 10)
    arrow(ax, 6.0, 6.3, 6.0, 5.85)

    domain = [
        (0.4, 3.5, "Health Risk"),
        (3.3, 3.5, "Nutrition"),
        (6.2, 3.5, "Disease"),
        (9.1, 3.5, "Natural\nMedicine"),
    ]
    for x, y, label in domain:
        box(ax, x, y, 2.4, 1.0, label, "#bae6fd", 9)
        arrow(ax, 6.0, 5.1, x + 1.2, 4.5)

    box(ax, 1.2, 1.7, 3.2, 1.1, "India Regional\nContext Agent", "#fed7aa", 9)
    box(ax, 4.8, 1.7, 3.2, 1.1, "India Impact Agent\nCHIS 0–100", SAFFRON, 9)
    box(ax, 8.4, 1.7, 3.2, 1.1, "Synthesis Agent\nAge-banded guidance", LEAF, 9)

    ax.text(2.8, 3.2, "only if countryCode = IN", ha="center", fontsize=8, color=SAFFRON, fontweight="bold")
    arrow(ax, 2.8, 3.5, 2.8, 2.8, SAFFRON)
    arrow(ax, 2.8, 1.7, 4.8, 2.25, SAFFRON)
    arrow(ax, 7.0, 3.5, 10.0, 2.8)
    arrow(ax, 8.0, 2.25, 8.4, 2.25)
    arrow(ax, 6.4, 1.7, 6.4, 0.85, OCEAN)

    box(ax, 3.5, 0.25, 5.0, 0.7, "SynthesisReport → dashboards & kids play", "#fef3c7", 10)
    return save(fig, "agent-pipeline.png")


def draw_client_server() -> Path:
    fig, ax = plt.subplots(figsize=(11.5, 6.5))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 11.5)
    ax.set_ylim(0, 6.5)
    ax.axis("off")
    ax.set_title(
        "Client vs server boundary",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    # two columns
    ax.add_patch(
        FancyBboxPatch(
            (0.4, 0.6),
            5.0,
            5.2,
            boxstyle="round,pad=0.05,rounding_size=0.15",
            facecolor="#e0f2fe",
            edgecolor=OCEAN,
            linewidth=2,
        )
    )
    ax.add_patch(
        FancyBboxPatch(
            (6.1, 0.6),
            5.0,
            5.2,
            boxstyle="round,pad=0.05,rounding_size=0.15",
            facecolor=LEAF_SOFT,
            edgecolor="#16a34a",
            linewidth=2,
        )
    )

    ax.text(2.9, 5.4, "Browser (client)", ha="center", fontsize=12, fontweight="bold", color=OCEAN)
    ax.text(8.6, 5.4, "Server (Node / Route Handlers)", ha="center", fontsize=12, fontweight="bold", color="#15803d")

    client_items = [
        "Dashboard / India / Play pages",
        "CountrySelector · CitySelector",
        "IndiaRegionSelector",
        "ReportView · IndiaImpactPanel",
        "KidsPlayHub missions & badges",
        "localStorage play progress",
    ]
    server_items = [
        "/api/analyze · /api/countries",
        "/api/india/regions",
        "orchestrator + all agents",
        "Open-Meteo network fetch",
        "countries.ts · india-regions.ts",
        "Zod validation · SynthesisReport",
    ]
    for i, text in enumerate(client_items):
        box(ax, 0.7, 4.4 - i * 0.65, 4.4, 0.55, text, WHITE, 9)
    for i, text in enumerate(server_items):
        box(ax, 6.4, 4.4 - i * 0.65, 4.4, 0.55, text, WHITE, 9)

    ax.annotate(
        "fetch JSON",
        xy=(6.1, 3.3),
        xytext=(5.4, 3.3),
        fontsize=9,
        color=INK,
        fontweight="bold",
        arrowprops=dict(arrowstyle="->", color=INK, lw=1.6),
    )
    return save(fig, "client-server.png")


def draw_data_registries() -> Path:
    fig, ax = plt.subplots(figsize=(11.5, 6.6))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 11.5)
    ax.set_ylim(0, 6.6)
    ax.axis("off")
    ax.set_title(
        "Data registries — how places resolve to coordinates",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    box(ax, 0.4, 4.6, 3.4, 1.5, "COUNTRIES\nISO code · name · flag\n~143 entries", SKY, 10)
    box(ax, 4.05, 4.6, 3.4, 1.5, "CITIES_BY_COUNTRY\ncity id · lat/lon · risks\n~323 presets", OCEAN, 10)
    box(ax, 7.7, 4.6, 3.4, 1.5, "INDIA_REGIONS\n37 zones · tier · climate\nmonsoon months", SAFFRON, 10)

    box(ax, 2.2, 2.6, 7.0, 1.3, "getCityPreset(code, cityId)  or  getIndiaRegion(regionId)\n→ { city, lat, lon }", LEAF_SOFT, 11)
    arrow(ax, 2.1, 4.6, 4.5, 3.9)
    arrow(ax, 5.75, 4.6, 5.75, 3.9)
    arrow(ax, 9.4, 4.6, 7.0, 3.9)

    box(ax, 1.5, 0.7, 8.5, 1.3, "POST /api/analyze\nUses resolved coordinates for Open-Meteo + agent heuristics", "#fef3c7", 11)
    arrow(ax, 5.75, 2.6, 5.75, 2.0)
    return save(fig, "data-registries.png")


def draw_chis_dimensions() -> Path:
    fig, ax = plt.subplots(figsize=(11, 6.2))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 6.2)
    ax.axis("off")
    ax.set_title(
        "India CHIS — five child-health impact dimensions",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    dims = [
        (0.4, 3.6, "CHVI", "Child Heat\nVulnerability", "#fda4af"),
        (2.5, 3.6, "CRBS", "Child Respiratory\nBurden", SKY),
        (4.6, 3.6, "WDPI", "Waterborne\nDisease Pressure", OCEAN),
        (6.7, 3.6, "VBDP", "Vector-Borne\nDisease Pressure", LEAF),
        (8.8, 3.6, "CNSI", "Climate Nutrition\nStress", SUN),
    ]
    for x, y, code, label, color in dims:
        box(ax, x, y, 1.9, 1.8, f"{code}\n\n{label}", color, 9)

    box(ax, 2.5, 1.5, 6.0, 1.2, "Composite CHIS score 0–100\nTransparent formulas in india-impact-agent.ts", SAFFRON, 11)
    for x in (1.35, 3.45, 5.55, 7.65, 9.75):
        arrow(ax, x, 3.6, 5.5, 2.7, MUTED, 1.2)

    ax.text(
        5.5,
        0.7,
        "Activated only for countryCode = IN after regional context agent runs",
        ha="center",
        fontsize=9,
        color=MUTED,
    )
    return save(fig, "chis-dimensions.png")


def draw_play_gamification() -> Path:
    fig, ax = plt.subplots(figsize=(11.5, 6.4))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 11.5)
    ax.set_ylim(0, 6.4)
    ax.axis("off")
    ax.set_title(
        "Kids play — age-tiered missions from guidance",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    bands = [
        (0.4, 4.2, "Ages 5-8\nLittle Climate Heroes\nStars currency", "#fef9c3"),
        (4.05, 4.2, "Ages 9-12\nClimate Cadets\nPoints currency", SKY),
        (7.7, 4.2, "Ages 13-17\nImpact Leaders\nImpact XP currency", LEAF_SOFT),
    ]
    for x, y, text, color in bands:
        box(ax, x, y, 3.4, 1.6, text, color, 10)

    box(ax, 0.8, 2.3, 4.5, 1.3, "Baseline missions\nAlways available starter pack", WHITE, 10)
    box(ax, 6.2, 2.3, 4.5, 1.3, "Climate missions\nFrom ChildGuidance after /api/analyze", OCEAN, 10)
    arrow(ax, 2.1, 4.2, 3.05, 3.6)
    arrow(ax, 5.75, 4.2, 3.05, 3.6)
    arrow(ax, 9.4, 4.2, 8.45, 3.6)

    box(ax, 2.5, 0.5, 6.5, 1.2, "Browser localStorage progress\nXP · levels · badges · streaks — no child accounts", "#fef3c7", 10)
    arrow(ax, 3.05, 2.3, 5.75, 1.7)
    arrow(ax, 8.45, 2.3, 5.75, 1.7)
    return save(fig, "play-gamification.png")


def draw_repo_map() -> Path:
    fig, ax = plt.subplots(figsize=(11, 6.8))
    fig.patch.set_facecolor(WHITE)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 6.8)
    ax.axis("off")
    ax.set_title(
        "Code map — where technical pieces live",
        fontsize=15,
        fontweight="bold",
        color=INK,
        pad=12,
    )

    box(ax, 0.4, 5.2, 10.2, 1.1, "src/app — pages (/dashboard, /india, /play) + API route handlers", SKY, 11)
    box(ax, 0.4, 3.7, 4.9, 1.2, "src/components\nSelectors · ReportView\nKidsPlayHub · Logo", OCEAN, 10)
    box(ax, 5.7, 3.7, 4.9, 1.2, "src/lib/agents\nOrchestrator + 8 agents\nCHIS formulas", LEAF, 10)
    box(ax, 0.4, 2.1, 3.3, 1.2, "countries.ts\nCities registry", "#bae6fd", 10)
    box(ax, 3.9, 2.1, 3.3, 1.2, "india-regions.ts\n37 zones", SAFFRON, 10)
    box(ax, 7.4, 2.1, 3.2, 1.2, "gamification.ts\nPlay rules", "#fef3c7", 10)
    box(ax, 0.4, 0.5, 10.2, 1.2, "docs/ARCHITECTURE.md + docs/images/ — technical design explained here", PAPER, 10)
    return save(fig, "repo-map.png")


def main() -> None:
    paths = [
        draw_system_layers(),
        draw_analyze_sequence(),
        draw_agent_pipeline(),
        draw_client_server(),
        draw_data_registries(),
        draw_chis_dimensions(),
        draw_play_gamification(),
        draw_repo_map(),
    ]
    print(f"generated {len(paths)} diagrams in {OUT}")


if __name__ == "__main__":
    main()
