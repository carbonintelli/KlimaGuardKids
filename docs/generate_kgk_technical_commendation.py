#!/usr/bin/env python3
"""Generate docs/KGK_Technical_Commendation.pdf — rich-text technical documentation."""

from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)

ROOT = Path(__file__).resolve().parent
# Editable source for regeneration (rich PDF is the published document).
SOURCE_MD = ROOT / "KGK_Technical_Commendation.source.md"
LEGACY_MD = ROOT / "UNGM_TECHNICAL_DOCUMENTATION.md"
OUT_PDF = ROOT / "KGK_Technical_Commendation.pdf"
IMAGES = ROOT / "images"

OCEAN = colors.HexColor("#0ea5e9")
INK = colors.HexColor("#0f172a")
MUTED = colors.HexColor("#475569")
LEAF = colors.HexColor("#16a34a")
SAFFRON = colors.HexColor("#f59e0b")
ROW_ALT = colors.HexColor("#f0f9ff")
HEADER_BG = colors.HexColor("#0c4a6e")
CODE_BG = colors.HexColor("#f1f5f9")


def strip_md_links(text: str) -> str:
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", text)
    text = text.replace("`", "")
    return text


def inline_html(text: str) -> str:
    """Convert light Markdown inline markup to ReportLab paragraph markup."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<link href="\2" color="#0284c7"><u>\1</u></link>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`([^`]+)`", r'<font face="Courier" size="8" color="#334155">\1</font>', text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", text)
    return text


def build_styles():
    base = getSampleStyleSheet()
    styles = {
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=26,
            leading=32,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=14,
            leading=18,
            textColor=OCEAN,
            alignment=TA_CENTER,
            spaceAfter=6,
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=INK,
            spaceBefore=16,
            spaceAfter=8,
            borderPadding=3,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=colors.HexColor("#0369a1"),
            spaceBefore=12,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=INK,
            leftIndent=8,
            spaceAfter=2,
        ),
        "callout": ParagraphStyle(
            "callout",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=9.5,
            leading=13,
            textColor=MUTED,
            leftIndent=10,
            rightIndent=10,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "caption": ParagraphStyle(
            "caption",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=10,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "th": ParagraphStyle(
            "th",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=colors.white,
        ),
        "td": ParagraphStyle(
            "td",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=INK,
        ),
        "code": ParagraphStyle(
            "code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7.5,
            leading=10,
            textColor=INK,
            backColor=CODE_BG,
            leftIndent=6,
            rightIndent=6,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
    }
    return styles


def parse_table(lines: list[str]) -> list[list[str]]:
    rows = []
    for line in lines:
        if re.match(r"^\|[\s\-:|]+\|$", line.strip()):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        rows.append(cells)
    return rows


def make_table(rows: list[list[str]], styles) -> Table:
    data = []
    for i, row in enumerate(rows):
        style = styles["th"] if i == 0 else styles["td"]
        data.append([Paragraph(inline_html(cell), style) for cell in row])

    col_count = max(len(r) for r in data)
    usable = A4[0] - 36 * 2
    col_w = usable / col_count
    t = Table(data, colWidths=[col_w] * col_count, hAlign="LEFT", repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_BG),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#94a3b8")),
    ]
    for r in range(1, len(data)):
        if r % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, r), (-1, r), ROW_ALT))
    t.setStyle(TableStyle(style_cmds))
    return t


def transform_source(md: str) -> str:
    """Retitle document from UNGM markdown to KGK Technical Commendation."""
    md = md.replace(
        "# KlimaGuard Kids  \n## Technical Documentation for UNGM Submission",
        "# KlimaGuard Kids\n## KGK Technical Commendation",
    )
    md = md.replace(
        "| **Document title** | KlimaGuard Kids — Technical Documentation (UNGM) |",
        "| **Document title** | KlimaGuard Kids — KGK Technical Commendation |",
    )
    md = md.replace(
        "> This document provides a clear technical description of KlimaGuard Kids for United Nations Global Marketplace (UNGM) vendor registration, capability statements, and related solicitation responses. It is intended for procurement, ICT, programme, and evaluation reviewers.",
        "> This document provides a clear technical description of KlimaGuard Kids (KGK) for procurement, ICT, programme, partner, and evaluation reviewers. It serves as the product technical commendation and capability statement.",
    )
    md = md.replace(
        "| **This file** (`docs/UNGM_TECHNICAL_DOCUMENTATION.md`) | UNGM-oriented technical capability statement |",
        "| **This file** (`docs/KGK_Technical_Commendation.pdf`) | KGK technical commendation / capability statement |",
    )
    md = md.replace(
        "**UNGM upload guidance:** Convert this Markdown file (and selected diagrams from `docs/images/`) to a single PDF labelled clearly, for example:  \n"
        "`Sustainow_Technologies_KlimaGuard_Kids_Technical_Documentation.pdf`  \n"
        "Attach under the supplier’s UNGM **My Documents** area and link it to the relevant registration or solicitation response as required.",
        "**Distribution guidance:** Use this PDF (`docs/KGK_Technical_Commendation.pdf`) as the official KlimaGuard Kids technical commendation for partner, procurement, and programme submissions. Diagrams in `docs/images/` are embedded below where relevant.",
    )
    md = md.replace(
        "*End of technical documentation.*",
        "*End of KGK Technical Commendation.*",
    )
    return md


def add_header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(OCEAN)
    canvas.setLineWidth(1.5)
    canvas.line(36, A4[1] - 22, A4[0] - 36, A4[1] - 22)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(36, A4[1] - 16, "KlimaGuard Kids — KGK Technical Commendation")
    canvas.drawRightString(A4[0] - 36, A4[1] - 16, "Sustainow Technologies")
    canvas.setStrokeColor(colors.HexColor("#cbd5e1"))
    canvas.setLineWidth(0.6)
    canvas.line(36, 28, A4[0] - 36, 28)
    canvas.drawCentredString(A4[0] / 2, 16, f"Page {doc.page}")
    canvas.restoreState()


def md_to_flowables(md: str, styles) -> list:
    story: list = []
    lines = md.splitlines()
    i = 0
    first_h1 = True

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped == "---":
            story.append(Spacer(1, 4))
            story.append(
                HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#cbd5e1"), spaceAfter=8)
            )
            i += 1
            continue

        # HTML image blocks
        if stripped.startswith("<p align=") or stripped.startswith("<img "):
            block = [stripped]
            i += 1
            while i < len(lines) and "</p>" not in lines[i - 1] and not lines[i].strip().startswith("##"):
                block.append(lines[i].strip())
                if "</p>" in lines[i]:
                    i += 1
                    break
                i += 1
            blob = " ".join(block)
            m = re.search(r'src="([^"]+)"', blob)
            alt = re.search(r'alt="([^"]*)"', blob)
            if m:
                img_path = ROOT / m.group(1)
                if img_path.exists():
                    img = Image(str(img_path), width=6.3 * inch, height=3.4 * inch, kind="proportional")
                    img.hAlign = "CENTER"
                    story.append(Spacer(1, 6))
                    story.append(img)
                    if alt:
                        story.append(Paragraph(alt.group(1), styles["caption"]))
            continue

        if stripped.startswith("```"):
            lang = stripped[3:].strip()
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # closing fence
            code = "\n".join(code_lines)
            story.append(Preformatted(code, styles["code"]))
            continue

        if stripped.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s\-:|]+\|$", lines[i + 1].strip()):
            table_lines = [stripped]
            i += 1
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            rows = parse_table(table_lines)
            if rows:
                story.append(Spacer(1, 4))
                story.append(make_table(rows, styles))
                story.append(Spacer(1, 8))
            continue

        if stripped.startswith("# "):
            title = stripped[2:].strip()
            if first_h1:
                story.append(Spacer(1, 40))
                logo = ROOT.parent / "logo" / "logo_klimaguardkids.jpeg"
                if logo.exists():
                    img = Image(str(logo), width=1.3 * inch, height=1.3 * inch, kind="proportional")
                    img.hAlign = "CENTER"
                    story.append(img)
                    story.append(Spacer(1, 12))
                story.append(Paragraph(inline_html(title), styles["cover_title"]))
                first_h1 = False
            else:
                story.append(Paragraph(inline_html(title), styles["h1"]))
            i += 1
            continue

        if stripped.startswith("## "):
            title = stripped[3:].strip()
            # Cover subtitle vs section heading
            if title.startswith("KGK Technical"):
                story.append(Paragraph(inline_html(title), styles["cover_sub"]))
                story.append(Paragraph("Sustainow Technologies · MIT Open Source", styles["cover_meta"]))
                story.append(Paragraph("Rich-text technical commendation for partners &amp; procurement", styles["cover_meta"]))
                story.append(Spacer(1, 10))
                story.append(
                    HRFlowable(width="40%", thickness=2, color=OCEAN, spaceBefore=4, spaceAfter=16, hAlign="CENTER")
                )
            else:
                story.append(Paragraph(inline_html(title), styles["h1"]))
                story.append(
                    HRFlowable(width="100%", thickness=1.2, color=OCEAN, spaceBefore=0, spaceAfter=6)
                )
            i += 1
            continue

        if stripped.startswith("### "):
            story.append(Paragraph(inline_html(stripped[4:].strip()), styles["h2"]))
            i += 1
            continue

        if stripped.startswith("> "):
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip().lstrip("> ").strip())
                i += 1
            story.append(Paragraph(inline_html(" ".join(quote_lines)), styles["callout"]))
            continue

        if stripped.startswith("- ") or stripped.startswith("* "):
            items = []
            while i < len(lines) and (lines[i].strip().startswith("- ") or lines[i].strip().startswith("* ")):
                items.append(ListItem(Paragraph(inline_html(lines[i].strip()[2:]), styles["bullet"]), leftIndent=12))
                i += 1
            story.append(
                ListFlowable(
                    items,
                    bulletType="bullet",
                    start="•",
                    bulletFontName="Helvetica",
                    bulletFontSize=9,
                    bulletColor=OCEAN,
                    leftIndent=18,
                    spaceBefore=2,
                    spaceAfter=6,
                )
            )
            continue

        if re.match(r"^\d+\.\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i].strip()):
                text = re.sub(r"^\d+\.\s+", "", lines[i].strip())
                items.append(ListItem(Paragraph(inline_html(text), styles["bullet"]), leftIndent=12))
                i += 1
            story.append(
                ListFlowable(
                    items,
                    bulletType="1",
                    leftIndent=18,
                    spaceBefore=2,
                    spaceAfter=6,
                )
            )
            continue

        # Paragraph (possibly multi-line until blank)
        para = [stripped]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].strip().startswith(
            ("#", "|", "-", "*", ">", "```", "<")
        ) and not re.match(r"^\d+\.\s+", lines[i].strip()):
            # stop if next looks like a heading/table start already handled
            if lines[i].strip().startswith("###") or lines[i].strip().startswith("##"):
                break
            para.append(lines[i].strip())
            i += 1
        story.append(Paragraph(inline_html(" ".join(para)), styles["body"]))

    return story


def load_source_markdown() -> str:
    if SOURCE_MD.exists():
        return SOURCE_MD.read_text(encoding="utf-8")
    if LEGACY_MD.exists():
        # One-time migration path from the former UNGM markdown filename.
        text = transform_source(LEGACY_MD.read_text(encoding="utf-8"))
        SOURCE_MD.write_text(text, encoding="utf-8")
        return text
    raise SystemExit(
        f"Missing documentation source. Expected {SOURCE_MD.name} "
        f"(or legacy {LEGACY_MD.name})."
    )


def main() -> None:
    md = load_source_markdown()
    # Ensure source file stays in sync when regenerating from legacy.
    if not SOURCE_MD.exists():
        SOURCE_MD.write_text(md, encoding="utf-8")
    styles = build_styles()
    story = md_to_flowables(md, styles)

    doc = SimpleDocTemplate(
        str(OUT_PDF),
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=40,
        title="KlimaGuard Kids — KGK Technical Commendation",
        author="Sustainow Technologies",
        subject="Technical commendation and capability statement for KlimaGuard Kids",
        creator="KlimaGuard Kids documentation generator",
    )
    doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    print(f"wrote {OUT_PDF} ({OUT_PDF.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
