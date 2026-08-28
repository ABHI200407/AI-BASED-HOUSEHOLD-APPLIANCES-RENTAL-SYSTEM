import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pptx import Presentation
from pptx.util import Pt, Inches, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Pt
from lxml import etree
import copy

# ───────────────────────── PALETTE ─────────────────────────────
BG        = RGBColor(0x0E, 0x14, 0x1F)   # near-black navy
PANEL     = RGBColor(0x17, 0x21, 0x35)   # card background
BORDER    = RGBColor(0x1E, 0x30, 0x50)   # subtle border
ACCENT1   = RGBColor(0x00, 0xB4, 0xD8)   # sky blue
ACCENT2   = RGBColor(0xFF, 0xC3, 0x00)   # gold
ACCENT3   = RGBColor(0x06, 0xD6, 0x7E)   # mint green
ACCENT4   = RGBColor(0xFF, 0x6B, 0x35)   # orange
ACCENT5   = RGBColor(0xE0, 0x3C, 0x7C)   # pink/red
ACCENT6   = RGBColor(0xAB, 0x5C, 0xFF)   # purple
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
OFFWHITE  = RGBColor(0xE8, 0xF0, 0xFE)
MUTED     = RGBColor(0x8A, 0x9B, 0xB8)
DARK      = RGBColor(0x08, 0x0C, 0x14)

W = 13.33
H = 7.5

# ───────────────────────── HELPERS ──────────────────────────────
def set_bg(slide, color=BG):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color

def r(slide, l, t, w, h, fill, line_color=None, line_w=None, rounding=None):
    """Add a rectangle. rounding 0-1 for rounded corners (approx)."""
    from pptx.util import Pt as _Pt
    shape = slide.shapes.add_shape(
        1, Inches(l), Inches(t), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line_color:
        shape.line.color.rgb = line_color
        if line_w:
            shape.line.width = Pt(line_w)
    else:
        shape.line.fill.background()
    return shape

def tx(slide, text, l, t, w, h,
       size=13, bold=False, color=WHITE, align=PP_ALIGN.LEFT,
       italic=False, wrap=True, font="Segoe UI"):
    box = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    run.font.name = font
    return box

def tx_lines(slide, lines, l, t, w, h, default_size=12, default_color=WHITE, gap=3):
    """
    lines = list of dicts:
      { text, size(opt), bold(opt), color(opt), italic(opt), align(opt), space_before(opt) }
    """
    box = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    tf = box.text_frame
    tf.word_wrap = True
    first = True
    for ld in lines:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = ld.get("align", PP_ALIGN.LEFT)
        p.space_before = Pt(ld.get("space_before", gap))
        run = p.add_run()
        run.text = ld.get("text", "")
        run.font.size = Pt(ld.get("size", default_size))
        run.font.bold = ld.get("bold", False)
        run.font.italic = ld.get("italic", False)
        run.font.color.rgb = ld.get("color", default_color)
        run.font.name = "Segoe UI"

def add_table(slide, data, headers, l, t, w, h,
              header_color=ACCENT1, header_text=DARK,
              row_colors=(PANEL, DARK), text_size=10,
              col_widths=None):
    """
    data: list of rows, each row is list of strings.
    headers: list of header strings.
    col_widths: list of fractions (must sum to 1.0). Default: equal.
    """
    from pptx.util import Inches as _I
    rows_count = len(data) + 1
    cols_count = len(headers)
    table = slide.shapes.add_table(
        rows_count, cols_count,
        _I(l), _I(t), _I(w), _I(h)).table

    if col_widths:
        total_emu = int(w * 914400)
        for i, frac in enumerate(col_widths):
            table.columns[i].width = int(total_emu * frac)

    def style_cell(cell, text, bg, fg, bold=False, sz=text_size, al=PP_ALIGN.CENTER):
        cell.fill.solid()
        cell.fill.fore_color.rgb = bg
        tf = cell.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = al
        p.space_before = Pt(2)
        run = p.add_run()
        run.text = text
        run.font.size = Pt(sz)
        run.font.bold = bold
        run.font.color.rgb = fg
        run.font.name = "Segoe UI"
        # Remove cell borders
        for border_tag in ['a:lnL','a:lnR','a:lnT','a:lnB']:
            tc = cell._tc
            tcPr = tc.get_or_add_tcPr()
            ln = etree.SubElement(tcPr, qn(border_tag))
            ln.set('w', '0')
            ln.set('cap', 'flat')
            ln.set('cmpd', 'sng')
            ln.set('algn', 'ctr')
            noFill = etree.SubElement(ln, qn('a:noFill'))

    # Headers
    for ci, hdr in enumerate(headers):
        style_cell(table.cell(0, ci), hdr, header_color, header_text, bold=True, sz=text_size+1)

    # Data rows
    for ri, row in enumerate(data):
        bg = row_colors[ri % len(row_colors)]
        for ci, val in enumerate(row):
            style_cell(table.cell(ri+1, ci), val, bg, WHITE, sz=text_size, al=PP_ALIGN.LEFT)

    return table

def new_slide(prs):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(sl)
    return sl

def slide_hero(slide, eyebrow, title, subtitle="", accent=ACCENT1):
    """Top hero section for every slide."""
    # Top gradient bar
    r(slide, 0, 0, W, 0.07, accent)
    r(slide, 0, 0.07, W, 0.06, RGBColor(
        max(0, accent[0]-30), max(0, accent[1]-30), max(0, accent[2]-30)))
    # Eyebrow
    tx(slide, eyebrow, 0.45, 0.18, 8, 0.35,
       size=10, bold=True, color=accent, font="Segoe UI")
    # Title
    tx(slide, title, 0.45, 0.47, 12.3, 0.75,
       size=28, bold=True, color=WHITE, font="Segoe UI")
    if subtitle:
        r(slide, 0.45, 1.18, 12.4, 0.04, accent)
        tx(slide, subtitle, 0.45, 1.26, 12.3, 0.42,
           size=13, color=MUTED, font="Segoe UI")
    else:
        r(slide, 0.45, 1.18, 12.4, 0.04, accent)

# ════════════════════════════════════════════════════════════════
def build():
    prs = Presentation()
    prs.slide_width  = Inches(W)
    prs.slide_height = Inches(H)

    # ═══════════════════════════════════════════════
    # SLIDE 1 — TITLE
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    # Full-bleed top section
    r(slide, 0, 0, W, 4.5, PANEL)
    r(slide, 0, 0, 0.18, 4.5, ACCENT1)
    r(slide, 0, 4.5, W, 0.07, ACCENT1)
    # Bottom strip
    r(slide, 0, 7.43, W, 0.07, ACCENT1)

    tx(slide, "SDC-II  PROJECT PROPOSAL", 0.45, 0.35, 12, 0.45,
       size=12, bold=True, color=ACCENT1, font="Segoe UI")
    tx(slide, "AI-Powered Household\nAppliance Rental Platform",
       0.45, 0.8, 12, 2.3, size=40, bold=True, color=WHITE, font="Segoe UI")
    tx(slide, "Full-Stack Web Application with 3 AI / ML Modules",
       0.45, 3.1, 12, 0.55, size=16, color=MUTED, font="Segoe UI")
    r(slide, 0.45, 3.72, 2.5, 0.06, ACCENT1)

    # Info pills (bottom section)
    pills = [
        ("Django + React + MongoDB", ACCENT1),
        ("scikit-learn + Prophet + SVD", ACCENT2),
        ("KMIT CSE  |  Sem V  |  2025-26", ACCENT3),
    ]
    for i, (label, color) in enumerate(pills):
        px = 0.45 + i * 4.35
        r(slide, px, 4.85, 4.1, 0.52, BORDER)
        r(slide, px, 4.85, 0.12, 0.52, color)
        tx(slide, label, px + 0.28, 4.92, 3.75, 0.38,
           size=13, color=WHITE, font="Segoe UI")

    tx(slide, "Team: [Names]   |   Mentor: [Name]",
       0.45, 5.65, 12, 0.45, size=13, color=MUTED, font="Segoe UI")

    # ═══════════════════════════════════════════════
    # SLIDE 2 — PROBLEM STATEMENT
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 01", "Problem Statement",
               "The gap in the market that our platform fills", ACCENT1)

    # Two-column cards
    for col, (title, accent, items) in enumerate([
        ("Current Problems", ACCENT5, [
            ("Buying appliances is expensive", "Students / migrants / expats cannot afford full purchase price for short stays."),
            ("Existing rental options are primitive", "Only basic classified ads — no trust, no smart features, no personalization."),
            ("Zero business intelligence for owners", "Owners cannot predict demand or plan inventory."),
            ("No customer retention tools", "No way to identify which customers are about to leave the platform."),
        ]),
        ("Our Proposed Solution", ACCENT3, [
            ("Affordable daily rental marketplace", "Tenants pay per day — not the full appliance price. Accessible to everyone."),
            ("AI-powered personalization", "Smart recommendations based on each tenant's history and preferences."),
            ("30-day demand forecasting", "Prophet ML model predicts which appliances will be in demand next month."),
            ("Churn prediction alerts", "Admin sees a list of at-risk customers so they can take retention action."),
        ]),
    ]):
        left = 0.45 + col * 6.5
        r(slide, left, 1.75, 6.2, 5.6, PANEL)
        r(slide, left, 1.75, 6.2, 0.55, accent)
        tx(slide, title, left + 0.2, 1.82, 5.8, 0.42,
           size=15, bold=True, color=DARK, font="Segoe UI")
        for i, (heading, body) in enumerate(items):
            top = 2.45 + i * 1.2
            r(slide, left + 0.15, top, 5.9, 1.1, BORDER)
            r(slide, left + 0.15, top, 0.07, 1.1, accent)
            tx(slide, heading, left + 0.35, top + 0.08, 5.55, 0.35,
               size=12, bold=True, color=accent, font="Segoe UI")
            tx(slide, body, left + 0.35, top + 0.45, 5.55, 0.55,
               size=11, color=OFFWHITE, font="Segoe UI")

    # ═══════════════════════════════════════════════
    # SLIDE 3 — DATABASE OVERVIEW
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 02", "Database Design  —  MongoDB Collections",
               "6 NoSQL documents, their fields, types and relationships", ACCENT2)

    # Collection summary cards (top row: 3 collections)
    collections_top = [
        ("users", ACCENT1, ["_id  (PK)", "email  (unique)", "password  (hashed)", "full_name", "role  (admin/owner/tenant)", "phone", "address", "date_joined"]),
        ("appliances", ACCENT2, ["_id  (PK)", "owner_id  → users", "name", "category  (AC/Fridge/...)", "price_per_day", "images  (list of paths)", "location", "available  (bool)"]),
        ("bookings", ACCENT3, ["_id  (PK)", "tenant_id  → users", "appliance_id  → appliances", "start_date", "end_date", "status  (requested/approved/...)", "total_amount", "created_at"]),
    ]
    for ci, (name, accent, fields) in enumerate(collections_top):
        left = 0.45 + ci * 4.3
        total_h = 0.52 + len(fields) * 0.39 + 0.15
        r(slide, left, 1.75, 4.05, total_h, PANEL)
        r(slide, left, 1.75, 4.05, 0.52, accent)
        tx(slide, name, left + 0.15, 1.8, 3.75, 0.42,
           size=14, bold=True, color=DARK, font="Segoe UI Semibold")
        for fi, field in enumerate(fields):
            ft = 1.75 + 0.52 + fi * 0.39
            fbg = DARK if fi % 2 == 0 else PANEL
            r(slide, left, ft, 4.05, 0.39, fbg)
            is_pk = "PK" in field
            is_fk = "→" in field
            fc = ACCENT2 if is_pk else (ACCENT5 if is_fk else OFFWHITE)
            tx(slide, field, left + 0.15, ft + 0.05, 3.8, 0.3,
               size=10, bold=is_pk or is_fk, color=fc, font="Segoe UI")

    # Bottom row: 3 ML collections
    collections_bot = [
        ("recommendation_logs", ACCENT4, ["_id  (PK)", "tenant_id  → users", "appliance_id  → appliances", "score  (cosine/SVD float)", "method  (content/collaborative)", "generated_at"]),
        ("demand_forecasts", ACCENT6, ["_id  (PK)", "category  (AC/Fridge/...)", "forecast_date", "predicted_units  (float)", "model_version", "generated_at"]),
        ("churn_scores", ACCENT5, ["_id  (PK)", "tenant_id  → users", "risk_score  (0.0 - 1.0)", "risk_level  (Low/Med/High)", "recency_days", "frequency_count", "monetary_total", "calculated_at"]),
    ]
    for ci, (name, accent, fields) in enumerate(collections_bot):
        left = 0.45 + ci * 4.3
        top_start = 5.05
        total_h = 0.52 + len(fields) * 0.34 + 0.1
        r(slide, left, top_start, 4.05, total_h, PANEL)
        r(slide, left, top_start, 4.05, 0.42, accent)
        tx(slide, name, left + 0.15, top_start + 0.05, 3.75, 0.35,
           size=12, bold=True, color=DARK, font="Segoe UI Semibold")
        for fi, field in enumerate(fields):
            ft = top_start + 0.42 + fi * 0.34
            fbg = DARK if fi % 2 == 0 else PANEL
            r(slide, left, ft, 4.05, 0.34, fbg)
            is_pk = "PK" in field
            is_fk = "→" in field
            fc = ACCENT2 if is_pk else (ACCENT5 if is_fk else OFFWHITE)
            tx(slide, field, left + 0.15, ft + 0.04, 3.8, 0.27,
               size=9, bold=is_pk or is_fk, color=fc, font="Segoe UI")

    # ═══════════════════════════════════════════════
    # SLIDE 4 — ER DIAGRAM (text-visual)
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 03", "Entity Relationship Diagram",
               "How all 6 MongoDB collections relate to each other", ACCENT3)

    # Centre column: ER tree
    r(slide, 0.45, 1.72, 12.4, 5.65, PANEL)

    # users box (centre-top)
    r(slide, 5.1, 1.95, 3.15, 0.65, ACCENT1)
    tx(slide, "users", 5.1, 1.98, 3.15, 0.6,
       size=16, bold=True, color=DARK, align=PP_ALIGN.CENTER, font="Segoe UI Semibold")
    tx(slide, "_id  |  email  |  role  |  full_name  |  date_joined",
       5.1, 2.6, 3.15, 0.3, size=8.5, color=MUTED, align=PP_ALIGN.CENTER)

    # Vertical line down from users
    r(slide, 6.62, 2.95, 0.08, 0.45, ACCENT1)

    # Horizontal splitter
    r(slide, 1.5, 3.4, 10.3, 0.06, BORDER)

    # appliances (left branch)
    r(slide, 0.6, 3.65, 3.5, 0.6, ACCENT2)
    tx(slide, "appliances", 0.6, 3.67, 3.5, 0.56,
       size=14, bold=True, color=DARK, align=PP_ALIGN.CENTER, font="Segoe UI Semibold")
    tx(slide, "owner_id -> users._id\nname | category | price_per_day | images | available",
       0.6, 4.27, 3.5, 0.45, size=8.5, color=MUTED)

    # Vertical line users -> appliances
    r(slide, 2.3, 3.4, 0.06, 0.25, ACCENT2)
    tx(slide, "1:N  (owns)", 0.6, 3.45, 1.6, 0.22, size=8, color=ACCENT2, bold=True)

    # bookings (centre branch)
    r(slide, 4.9, 3.65, 3.55, 0.6, ACCENT3)
    tx(slide, "bookings", 4.9, 3.67, 3.55, 0.56,
       size=14, bold=True, color=DARK, align=PP_ALIGN.CENTER, font="Segoe UI Semibold")
    tx(slide, "tenant_id -> users | appliance_id -> appliances\nstart_date | end_date | status | total_amount",
       4.9, 4.27, 3.55, 0.45, size=8.5, color=MUTED)
    r(slide, 6.62, 3.4, 0.06, 0.25, ACCENT3)
    tx(slide, "1:N  (rents)", 5.5, 3.45, 1.6, 0.22, size=8, color=ACCENT3, bold=True)

    # Vertical line bookings down
    r(slide, 6.62, 4.28, 0.06, 0.38, ACCENT3)
    r(slide, 3.0, 4.65, 7.35, 0.06, BORDER)

    # recommendation_logs
    r(slide, 0.55, 4.9, 3.5, 0.58, ACCENT4)
    tx(slide, "recommendation_logs", 0.55, 4.92, 3.5, 0.54,
       size=11, bold=True, color=DARK, align=PP_ALIGN.CENTER, font="Segoe UI Semibold")
    tx(slide, "tenant_id | appliance_id | score | method | generated_at",
       0.55, 5.5, 3.5, 0.35, size=8.5, color=MUTED)
    r(slide, 3.0, 4.65, 0.06, 0.25, ACCENT4)
    tx(slide, "1:N", 0.6, 4.68, 0.5, 0.2, size=8, color=ACCENT4, bold=True)

    # demand_forecasts
    r(slide, 4.9, 4.9, 3.55, 0.58, ACCENT6)
    tx(slide, "demand_forecasts", 4.9, 4.92, 3.55, 0.54,
       size=11, bold=True, color=DARK, align=PP_ALIGN.CENTER, font="Segoe UI Semibold")
    tx(slide, "category | forecast_date | predicted_units\n(standalone — no FK to users)",
       4.9, 5.5, 3.55, 0.35, size=8.5, color=MUTED)
    r(slide, 6.62, 4.65, 0.06, 0.25, ACCENT6)
    tx(slide, "standalone", 5.5, 4.68, 1.4, 0.2, size=8, color=ACCENT6, bold=True)

    # churn_scores
    r(slide, 9.3, 4.9, 3.5, 0.58, ACCENT5)
    tx(slide, "churn_scores", 9.3, 4.92, 3.5, 0.54,
       size=11, bold=True, color=DARK, align=PP_ALIGN.CENTER, font="Segoe UI Semibold")
    tx(slide, "tenant_id | risk_score | risk_level | RFM | calculated_at",
       9.3, 5.5, 3.5, 0.35, size=8.5, color=MUTED)
    r(slide, 10.3, 4.65, 0.06, 0.25, ACCENT5)
    tx(slide, "1:1/tenant", 9.35, 4.68, 1.2, 0.2, size=8, color=ACCENT5, bold=True)

    # Legend
    r(slide, 0.45, 6.9, 12.4, 0.45, DARK)
    for i, (label, color) in enumerate([
        ("Primary Key (PK)", ACCENT2), ("Foreign Key (FK  ->)", ACCENT5),
        ("1:N  one-to-many", ACCENT3), ("Standalone collection", ACCENT6),
    ]):
        lx = 0.6 + i * 3.1
        r(slide, lx, 6.98, 0.18, 0.18, color)
        tx(slide, label, lx + 0.25, 6.97, 2.8, 0.25, size=9, color=MUTED)

    # ═══════════════════════════════════════════════
    # SLIDE 5 — WHICH PAGE -> WHICH COLLECTION
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 04", "Data Collection Map",
               "Which frontend page triggers what action and writes to which MongoDB collection", ACCENT4)

    headers = ["Page / Screen", "User Action", "Fields Captured", "Stored In"]
    rows = [
        ["Register / Login", "Fill email, password, select role", "email, password (hashed), full_name, role, phone", "users"],
        ["Tenant Home", "Browses, clicks appliances", "Implicit view event (appliance_id, tenant_id)", "recommendation_logs"],
        ["Appliance Detail", "Views appliance page", "appliance_id viewed, timestamp", "recommendation_logs"],
        ["Book / Rent Page", "Picks dates, submits booking", "tenant_id, appliance_id, start/end date, total_amount", "bookings"],
        ["Owner — Add Appliance", "Fills form, uploads images", "name, category, price_per_day, images, location, owner_id", "appliances"],
        ["Owner — Manage Bookings", "Approves or rejects request", "booking _id, status change", "bookings (status update)"],
        ["Admin — Dashboard load", "Page opens (auto)", "Reads bookings -> computes RFM scores per tenant", "churn_scores"],
        ["Admin — Forecast view", "Page opens (auto)", "Reads bookings history by category", "demand_forecasts"],
    ]

    add_table(
        slide, rows, headers,
        l=0.45, t=1.72, w=12.4, h=5.6,
        header_color=ACCENT4, header_text=DARK,
        row_colors=[PANEL, DARK],
        text_size=11,
        col_widths=[0.18, 0.22, 0.37, 0.23],
    )

    # ═══════════════════════════════════════════════
    # SLIDE 6 — AI: RECOMMENDATION ENGINE
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 05", "AI Module 1  —  Recommendation Engine",
               "How we plan to recommend the right appliance to each tenant", ACCENT1)

    # Left column: steps
    r(slide, 0.45, 1.72, 6.1, 5.65, PANEL)
    tx(slide, "Step-by-Step Plan", 0.65, 1.8, 5.7, 0.42,
       size=14, bold=True, color=ACCENT1, font="Segoe UI Semibold")
    r(slide, 0.45, 2.22, 6.1, 0.04, BORDER)

    steps = [
        (ACCENT1, "1. Data Input",
         "Kaggle 'Personalized Recommendation Systems'\ndataset — categories relabeled to AC / Fridge / TV etc."),
        (ACCENT2, "2. Feature Extraction",
         "From appliances collection: category, price_per_day.\nBuild an item feature matrix per appliance."),
        (ACCENT3, "3. Content-Based Filtering",
         "Compute cosine similarity between tenant's past\nbooking features and all available appliances."),
        (ACCENT4, "4. Collaborative Filtering (SVD)",
         "Surprise library SVD: finds tenants with similar\nbooking history, recommends what they rented."),
        (ACCENT6, "5. Hybrid Score & Ranking",
         "Content score + SVD score blended. Top-N\nappliances selected per tenant ID."),
        (ACCENT5, "6. Store & Serve",
         "Results saved to recommendation_logs collection.\nServed via  GET /api/recommend/<tenant_id>/"),
    ]
    for i, (accent, label, body) in enumerate(steps):
        top = 2.34 + i * 0.84
        r(slide, 0.55, top, 5.9, 0.78, DARK)
        r(slide, 0.55, top, 0.07, 0.78, accent)
        tx(slide, label, 0.76, top + 0.06, 5.2, 0.28,
           size=11, bold=True, color=accent, font="Segoe UI Semibold")
        tx(slide, body, 0.76, top + 0.36, 5.2, 0.4,
           size=10, color=OFFWHITE, font="Segoe UI")

    # Right column: data flow
    r(slide, 6.85, 1.72, 6.05, 5.65, PANEL)
    tx(slide, "Data Flow", 7.05, 1.8, 5.65, 0.42,
       size=14, bold=True, color=ACCENT1, font="Segoe UI Semibold")
    r(slide, 6.85, 2.22, 6.05, 0.04, BORDER)

    flow_items = [
        (ACCENT1, "INPUT DATA"),
        (OFFWHITE,  "  bookings collection (tenant_id, appliance_id, dates)"),
        (OFFWHITE,  "  appliances collection (category, price, name)"),
        (OFFWHITE,  "  Kaggle dataset (pre-training interaction data)"),
        (ACCENT2, "TRAINING  (python manage.py train_recommender)"),
        (OFFWHITE,  "  Build item feature matrix from appliances"),
        (OFFWHITE,  "  Compute cosine similarity matrix (scikit-learn)"),
        (OFFWHITE,  "  Train SVD on booking interaction matrix (Surprise)"),
        (OFFWHITE,  "  Save .pkl artifact for both models"),
        (ACCENT3, "INFERENCE  (called per API request)"),
        (OFFWHITE,  "  Load .pkl — compute scores for this tenant"),
        (OFFWHITE,  "  Blend content + SVD scores — take Top-N"),
        (ACCENT5, "OUTPUT"),
        (OFFWHITE,  "  recommendation_logs collection updated"),
        (OFFWHITE,  "  React Tenant Home shows 'Recommended for You'"),
    ]
    y = 2.32
    for (color, text) in flow_items:
        is_label = color != OFFWHITE
        if is_label:
            y += 0.07
        tx(slide, text, 7.05, y, 5.75, 0.3,
           size=10 if not is_label else 11,
           bold=is_label, color=color, font="Segoe UI")
        y += 0.32

    # ═══════════════════════════════════════════════
    # SLIDE 7 — AI: DEMAND FORECASTING
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 06", "AI Module 2  —  Demand Forecasting",
               "How we plan to predict next 30 days of rental demand per appliance category", ACCENT2)

    r(slide, 0.45, 1.72, 6.1, 5.65, PANEL)
    tx(slide, "Step-by-Step Plan", 0.65, 1.8, 5.7, 0.42,
       size=14, bold=True, color=ACCENT2, font="Segoe UI Semibold")
    r(slide, 0.45, 2.22, 6.1, 0.04, BORDER)

    steps2 = [
        (ACCENT2, "1. Data Input",
         "Kaggle 'Retail Store Inventory & Demand Forecasting'\ndataset (atomicd) — categories relabeled to appliances."),
        (ACCENT1, "2. Aggregate Bookings",
         "Query bookings collection. Group by category + week.\nCount rentals per time period to form a time series."),
        (ACCENT3, "3. Prophet Model Training",
         "Facebook Prophet time-series model trained separately\nfor each appliance category (AC, Fridge, TV etc.)."),
        (ACCENT4, "4. 30-Day Forecast",
         "Prophet predicts rental count for the next 30 days\nper category. Output: date + predicted_units."),
        (ACCENT6, "5. Store Predictions",
         "Predictions written to demand_forecasts collection.\n{category, forecast_date, predicted_units, model_version}"),
        (ACCENT5, "6. Admin Dashboard",
         "React admin sees Recharts line chart showing forecast.\nAlso shows revenue trends & stock suggestions."),
    ]
    for i, (accent, label, body) in enumerate(steps2):
        top = 2.34 + i * 0.84
        r(slide, 0.55, top, 5.9, 0.78, DARK)
        r(slide, 0.55, top, 0.07, 0.78, accent)
        tx(slide, label, 0.76, top + 0.06, 5.2, 0.28,
           size=11, bold=True, color=accent, font="Segoe UI Semibold")
        tx(slide, body, 0.76, top + 0.36, 5.2, 0.4,
           size=10, color=OFFWHITE, font="Segoe UI")

    r(slide, 6.85, 1.72, 6.05, 5.65, PANEL)
    tx(slide, "What Admin & Owner Will See", 7.05, 1.8, 5.65, 0.42,
       size=14, bold=True, color=ACCENT2, font="Segoe UI Semibold")
    r(slide, 6.85, 2.22, 6.05, 0.04, BORDER)

    output_cards = [
        (ACCENT2, "30-Day Demand Line Chart",
         "X-axis: next 30 days\nY-axis: predicted rental units per category"),
        (ACCENT1, "Revenue Trend Bar Chart",
         "Monthly revenue aggregated from bookings.total_amount\nGrouped by category and month"),
        (ACCENT3, "Stock Suggestion Panel",
         "If forecast > threshold: 'Consider stocking more ACs'\nAuto-generated insight from forecast data"),
        (ACCENT4, "Occupancy Rate KPI",
         "% of listed appliances currently booked\nComputed live from bookings (status=active)"),
    ]
    y = 2.32
    for (accent, title, body) in output_cards:
        r(slide, 7.0, y, 5.75, 1.2, DARK)
        r(slide, 7.0, y, 0.07, 1.2, accent)
        tx(slide, title, 7.2, y + 0.1, 5.45, 0.35,
           size=12, bold=True, color=accent, font="Segoe UI Semibold")
        tx(slide, body, 7.2, y + 0.48, 5.45, 0.65,
           size=10, color=OFFWHITE, font="Segoe UI")
        y += 1.3

    # ═══════════════════════════════════════════════
    # SLIDE 8 — AI: CHURN PREDICTION
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 07", "AI Module 3  —  Customer Churn Prediction",
               "How we plan to identify tenants who are about to stop using the platform", ACCENT5)

    r(slide, 0.45, 1.72, 6.1, 5.65, PANEL)
    tx(slide, "Step-by-Step Plan", 0.65, 1.8, 5.7, 0.42,
       size=14, bold=True, color=ACCENT5, font="Segoe UI Semibold")
    r(slide, 0.45, 2.22, 6.1, 0.04, BORDER)

    steps3 = [
        (ACCENT5, "1. Data Input",
         "Kaggle 'Online Retail Customer Churn Dataset'\n(hassaneskikri) — features adapted to rental context."),
        (ACCENT2, "2. RFM Feature Engineering",
         "From bookings collection, compute per tenant:\nR = days since last booking\nF = total number of bookings\nM = total money spent (Rs)"),
        (ACCENT3, "3. Model Training",
         "Random Forest Classifier (scikit-learn) trained\non RFM features. Saves accuracy, precision, recall, F1."),
        (ACCENT1, "4. Churn Scoring",
         "Each tenant's RFM computed from live bookings.\nModel outputs risk_score (0.0 to 1.0) per tenant."),
        (ACCENT4, "5. Threshold & Label",
         "< 0.3  ->  Low risk (safe)\n0.3 - 0.7  ->  Medium (monitor)\n> 0.7  ->  High (take action now)"),
        (ACCENT6, "6. Store & Alert",
         "Saved to churn_scores collection (tenant_id + score).\nAPI: GET /api/churn/at-risk/  ->  Admin table view."),
    ]
    for i, (accent, label, body) in enumerate(steps3):
        top = 2.34 + i * 0.84
        r(slide, 0.55, top, 5.9, 0.78, DARK)
        r(slide, 0.55, top, 0.07, 0.78, accent)
        tx(slide, label, 0.76, top + 0.06, 5.2, 0.28,
           size=11, bold=True, color=accent, font="Segoe UI Semibold")
        tx(slide, body, 0.76, top + 0.36, 5.2, 0.4,
           size=10, color=OFFWHITE, font="Segoe UI")

    # Right: RFM explained
    r(slide, 6.85, 1.72, 6.05, 5.65, PANEL)
    tx(slide, "Understanding RFM Features", 7.05, 1.8, 5.65, 0.42,
       size=14, bold=True, color=ACCENT5, font="Segoe UI Semibold")
    r(slide, 6.85, 2.22, 6.05, 0.04, BORDER)

    rfm = [
        (ACCENT5, "R — Recency",
         "Days since the tenant last made a booking.\nFormula: today  -  MAX(bookings.created_at)\nHigh recency = customer inactive for long = RISKY"),
        (ACCENT4, "F — Frequency",
         "Total number of bookings the tenant has made.\nFormula: COUNT(bookings WHERE tenant_id = X)\nLow frequency = rare customer = RISKY"),
        (ACCENT2, "M — Monetary",
         "Total amount the tenant has ever spent.\nFormula: SUM(bookings.total_amount)\nLow monetary = low-value customer = RISKY"),
    ]
    y = 2.32
    for (accent, title, body) in rfm:
        r(slide, 7.0, y, 5.75, 1.45, DARK)
        r(slide, 7.0, y, 0.07, 1.45, accent)
        tx(slide, title, 7.2, y + 0.1, 5.45, 0.35,
           size=13, bold=True, color=accent, font="Segoe UI Semibold")
        tx(slide, body, 7.2, y + 0.5, 5.45, 0.88,
           size=10, color=OFFWHITE, font="Segoe UI")
        y += 1.55

    # Risk label pill table
    r(slide, 7.0, y + 0.05, 5.75, 0.38, DARK)
    for i, (label, bg, fg) in enumerate([
        ("Low  < 0.3", ACCENT3, DARK),
        ("Medium  0.3-0.7", ACCENT2, DARK),
        ("High  > 0.7", ACCENT5, DARK),
    ]):
        lx = 7.08 + i * 1.9
        r(slide, lx, y + 0.1, 1.78, 0.26, bg)
        tx(slide, label, lx, y + 0.11, 1.78, 0.24,
           size=9, bold=True, color=fg, align=PP_ALIGN.CENTER)

    # ═══════════════════════════════════════════════
    # SLIDE 9 — END-TO-END DATA FLOW
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 08", "End-to-End Data Flow",
               "From user action on screen all the way to MongoDB and AI output", ACCENT3)

    layers = [
        ("FRONTEND  (React + Vite + Tailwind)", ACCENT1, [
            "Register / Login", "Tenant Home Page", "Browse Appliances",
            "Book Appliance", "Owner Dashboard", "Admin BI Dashboard",
        ]),
        ("REST API  (Django + DRF + JWT)", ACCENT2, [
            "POST /auth/register/", "GET /appliances/", "POST /bookings/",
            "GET /recommend/<id>/", "GET /bi/dashboard/", "GET /churn/at-risk/",
        ]),
        ("DATABASE  (MongoDB via MongoEngine)", ACCENT3, [
            "users", "appliances", "bookings",
            "recommendation_logs", "demand_forecasts", "churn_scores",
        ]),
    ]

    for row_i, (layer_name, accent, items) in enumerate(layers):
        top = 1.72 + row_i * 1.7
        r(slide, 0.45, top, 12.4, 1.58, PANEL)
        r(slide, 0.45, top, 12.4, 0.42, accent)
        tx(slide, layer_name, 0.65, top + 0.07, 12, 0.3,
           size=12, bold=True, color=DARK, font="Segoe UI Semibold")
        for ci, item in enumerate(items):
            il = 0.55 + ci * 2.05
            r(slide, il, top + 0.52, 1.88, 0.96, DARK)
            r(slide, il, top + 0.52, 1.88, 0.06, accent)
            tx(slide, item, il + 0.08, top + 0.65, 1.72, 0.7,
               size=10, color=OFFWHITE, align=PP_ALIGN.CENTER, font="Segoe UI")
        if row_i < 2:
            tx(slide, "v", 6.6, top + 1.6, 0.4, 0.25,
               size=13, bold=True, color=BORDER, align=PP_ALIGN.CENTER)

    # AI training strip
    r(slide, 0.45, 6.85, 12.4, 0.52, RGBColor(0x06, 0x2A, 0x44))
    r(slide, 0.45, 6.85, 0.1, 0.52, ACCENT2)
    tx(slide,
       "AI LAYER  (Django management commands, run manually or on schedule):  "
       "train_recommender.py   |   train_forecast.py   |   train_churn.py   "
       "->  saves .pkl model artifacts  ->  serves predictions via REST API",
       0.65, 6.9, 12.1, 0.42, size=10, color=ACCENT2, font="Segoe UI")

    # ═══════════════════════════════════════════════
    # SLIDE 10 — TECH STACK
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 09", "Technology Stack",
               "Every library and tool we plan to use and why", ACCENT6)

    stacks = [
        ("Frontend", ACCENT1, [
            ("React.js 18 + Vite", "Modern SPA framework with fast build tool"),
            ("Tailwind CSS", "Utility-first CSS for rapid UI development"),
            ("Recharts", "Charts for Admin BI dashboard"),
            ("Axios", "HTTP client for all REST API calls"),
            ("React Router DOM", "Client-side routing between pages"),
            ("JWT (localStorage)", "Store access token for authenticated requests"),
        ]),
        ("Backend", ACCENT2, [
            ("Django 5.x + DRF", "Python web framework + REST API layer"),
            ("djangorestframework-simplejwt", "JWT access + refresh token auth"),
            ("MongoEngine ODM", "Object-Document Mapper for MongoDB"),
            ("django-cors-headers", "Allow React (port 5173) to call Django"),
            ("Local media/ folder", "Store uploaded appliance images"),
            ("Management commands", "Trigger ML training manually via CLI"),
        ]),
        ("Database", ACCENT3, [
            ("MongoDB  (NoSQL)", "Flexible document store — no rigid schema"),
            ("MongoEngine", "ORM-like layer to define Python document classes"),
            ("MongoDB Atlas (free)", "Cloud-hosted MongoDB for deployment"),
            ("6 collections", "users, appliances, bookings, 3 ML result docs"),
            (".env  MONGO_URI", "Connection string kept outside codebase"),
            ("Auto indexes", "On email, owner_id, tenant_id for fast lookups"),
        ]),
        ("AI / ML", ACCENT4, [
            ("scikit-learn", "Cosine similarity + Random Forest classifier"),
            ("Surprise (SVD)", "Collaborative filtering / matrix factorization"),
            ("Prophet (Facebook)", "Time-series demand forecasting"),
            ("pandas", "Data wrangling for Kaggle dataset preprocessing"),
            (".pkl artifacts", "Trained model files — no retrain on every request"),
            ("3 Kaggle datasets", "Real-world data for all 3 AI modules"),
        ]),
    ]

    for ci, (title, accent, items) in enumerate(stacks):
        left = 0.45 + ci * 3.22
        r(slide, left, 1.72, 3.05, 5.65, PANEL)
        r(slide, left, 1.72, 3.05, 0.5, accent)
        tx(slide, title, left + 0.12, 1.78, 2.8, 0.38,
           size=14, bold=True, color=DARK, font="Segoe UI Semibold")
        for ri, (lib, desc) in enumerate(items):
            rt = 2.32 + ri * 0.85
            rbg = DARK if ri % 2 == 0 else PANEL
            r(slide, left, rt, 3.05, 0.82, rbg)
            tx(slide, lib, left + 0.12, rt + 0.05, 2.8, 0.3,
               size=11, bold=True, color=accent, font="Segoe UI Semibold")
            tx(slide, desc, left + 0.12, rt + 0.38, 2.8, 0.4,
               size=9.5, color=MUTED, font="Segoe UI")

    # ═══════════════════════════════════════════════
    # SLIDE 11 — CONCLUSION
    # ═══════════════════════════════════════════════
    slide = new_slide(prs)
    slide_hero(slide, "SLIDE 10", "Conclusion & Future Scope",
               "Summary of what we plan to deliver and where this can go next", ACCENT3)

    # Left — Goals
    r(slide, 0.45, 1.72, 6.1, 5.65, PANEL)
    r(slide, 0.45, 1.72, 0.12, 5.65, ACCENT1)
    tx(slide, "What We Plan to Deliver", 0.72, 1.8, 5.65, 0.42,
       size=14, bold=True, color=ACCENT1, font="Segoe UI Semibold")
    r(slide, 0.45, 2.22, 6.1, 0.04, BORDER)

    goals = [
        (ACCENT1, "Full-stack rental marketplace",
         "Working Tenant, Owner, Admin role-based system\nwith JWT auth and MongoDB backend"),
        (ACCENT2, "3 AI/ML modules integrated",
         "Recommendation Engine (Content-Based + SVD)\nDemand Forecasting (Prophet) + Churn (Random Forest)"),
        (ACCENT3, "Clean DBMS design",
         "6 MongoDB collections, properly referenced\nusers -> appliances -> bookings -> ML result docs"),
        (ACCENT4, "Deployable full-stack app",
         "Django REST backend + React frontend\nConfigured with .env for local/cloud deployment"),
    ]
    for i, (accent, title, body) in enumerate(goals):
        top = 2.35 + i * 1.22
        r(slide, 0.6, top, 5.8, 1.15, DARK)
        r(slide, 0.6, top, 0.07, 1.15, accent)
        tx(slide, title, 0.82, top + 0.1, 5.4, 0.32,
           size=12, bold=True, color=accent, font="Segoe UI Semibold")
        tx(slide, body, 0.82, top + 0.48, 5.4, 0.6,
           size=10, color=OFFWHITE, font="Segoe UI")

    # Right — Future scope
    r(slide, 6.85, 1.72, 6.05, 5.65, PANEL)
    r(slide, 6.85, 1.72, 0.12, 5.65, ACCENT3)
    tx(slide, "Future Enhancements", 7.12, 1.8, 5.65, 0.42,
       size=14, bold=True, color=ACCENT3, font="Segoe UI Semibold")
    r(slide, 6.85, 2.22, 6.05, 0.04, BORDER)

    future = [
        (ACCENT3, "IoT Integration", "Track live appliance health and usage via sensors"),
        (ACCENT2, "Dynamic AI Pricing", "Auto-adjust price_per_day using demand forecast"),
        (ACCENT1, "Mobile App", "React Native app reusing the same Django REST API"),
        (ACCENT4, "LLM Chat Assistant", "'Which AC for my 2BHK?' — NLP-based recommendation"),
        (ACCENT6, "Razorpay Payments", "Replace mock payments with real online gateway"),
        (ACCENT5, "Multi-city + Geo Search", "Location-based appliance search across cities"),
    ]
    for i, (accent, title, body) in enumerate(future):
        top = 2.35 + i * 0.82
        r(slide, 7.0, top, 5.75, 0.75, DARK)
        r(slide, 7.0, top, 0.07, 0.75, accent)
        tx(slide, title, 7.22, top + 0.07, 5.45, 0.28,
           size=11, bold=True, color=accent, font="Segoe UI Semibold")
        tx(slide, body, 7.22, top + 0.4, 5.45, 0.3,
           size=10, color=MUTED, font="Segoe UI")

    # ─────────────────────────────────────────────
    out = r"c:\Users\coding\Desktop\PROJECT\SDC2\AI_Appliance_Rental_FinalPPT.pptx"
    prs.save(out)
    print(f"Saved -> {out}")


if __name__ == "__main__":
    build()
