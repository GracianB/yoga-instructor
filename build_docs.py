#!/usr/bin/env python3
"""Yoga CV + letters — premium presence one-pagers.
Paper / forest / sage world matching gracianb.github.io/yoga-instructor.
"""
from __future__ import annotations

import math
from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SERIF_B = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SERIF_I = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
SERIF_BI = "/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
SANS_I = "/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"
MONO_B = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"

PAPER = (243, 239, 228)
PAPER_W = (255, 254, 249)
FOREST = (30, 42, 31)
SAGE = (47, 107, 79)
SAGE_L = (125, 202, 165)
SAGE_SOFT = (95, 143, 116)
GOLD = (184, 146, 31)
MUTED = (90, 99, 84)
LINE = (214, 208, 190)
LINE_SOFT = (228, 222, 206)
INK = (23, 32, 25)
EARTH = (138, 106, 61)

W, H, M = 210, 297, 16
URL = "https://gracianb.github.io/yoga-instructor/"
CONTACT = (
    "gracianbaenagonzalez@gmail.com   ·   +34 687 470 725   ·   "
    "linkedin.com/in/gracianbaena   ·   gracianb.github.io/yoga-instructor"
)


def cycle_spec(steps, spu=14):
    pts = []
    t = 0.0
    dt = 1.0 / spu
    y = 0.0
    beats = []
    for kind, n in steps:
        beats.append(n)
        if kind == "in":
            for i in range(n * spu):
                u = i / (n * spu)
                y = 0.5 - 0.5 * math.cos(math.pi * u)
                pts.append((t, y))
                t += dt
            y = 1.0
        elif kind == "hold":
            for _ in range(n * spu):
                pts.append((t, 1.0))
                t += dt
            y = 1.0
        elif kind == "out":
            for i in range(n * spu):
                u = i / (n * spu)
                y = 0.5 + 0.5 * math.cos(math.pi * u)
                pts.append((t, y))
                t += dt
            y = 0.0
        else:
            for _ in range(n * spu):
                pts.append((t, 0.0))
                t += dt
            y = 0.0
        pts.append((t, y))
    return pts, sum(beats), beats


PAT_478 = [("in", 4), ("hold", 7), ("out", 8)]


class Doc(FPDF):
    def __init__(self):
        super().__init__(format="A4", unit="mm")
        self.set_auto_page_break(False)
        self.add_font("Serif", "", SERIF)
        self.add_font("Serif", "B", SERIF_B)
        self.add_font("Serif", "I", SERIF_I)
        self.add_font("Serif", "BI", SERIF_BI)
        self.add_font("Sans", "", SANS)
        self.add_font("Sans", "B", SANS_B)
        self.add_font("Sans", "I", SANS_I)
        self.add_font("Mono", "", MONO)
        self.add_font("Mono", "B", MONO_B)
        self.add_page()
        self.set_fill_color(*PAPER)
        self.rect(0, 0, W, H, "F")
        # Forest spine + sage edge
        self.set_fill_color(*FOREST)
        self.rect(0, 0, 5.5, H, "F")
        self.set_fill_color(*SAGE)
        self.rect(5.5, 0, 1.6, H, "F")
        # Soft top wash
        self.set_fill_color(*PAPER_W)
        self.rect(7.1, 0, W - 7.1, 8, "F")
        # Soft bottom wash under footer
        self.set_fill_color(236, 232, 220)
        self.rect(7.1, H - 22, W - 7.1, 8, "F")

    def breath(self, x, y, w, h=8.5, labels=False):
        raw, cycle, beats = cycle_spec(PAT_478)
        tmax = raw[-1][0] or 1
        pts = []
        for tx, ty in raw:
            pts.append((x + tx / tmax * w, y + (1 - ty) * h))
        # soft under-curve
        self.set_draw_color(*LINE)
        self.set_line_width(0.35)
        soft = [(px, py + 1.2) for px, py in pts[::2]]
        if len(soft) > 1:
            self.polyline(soft, style="D")
        self.set_draw_color(*GOLD)
        self.set_line_width(0.85)
        self.polyline(pts, style="D")
        # end dots
        self.set_fill_color(*SAGE)
        self.ellipse(pts[0][0] - 0.9, pts[0][1] - 0.9, 1.8, 1.8, "F")
        self.ellipse(pts[-1][0] - 0.9, pts[-1][1] - 0.9, 1.8, 1.8, "F")
        if labels:
            self.set_font("Mono", "B", 7)
            self.set_text_color(*GOLD)
            x0 = x
            for n in beats:
                seg = w * (n / cycle)
                self.set_xy(x0, y + h + 1.0)
                self.cell(seg, 3.2, str(n), align="C")
                x0 += seg
            return y + h + 5.5
        return y + h + 2.8

    def kicker(self, text, y):
        self.set_xy(M, y)
        self.set_font("Mono", "B", 7.2)
        self.set_text_color(*SAGE)
        self.cell(0, 3.8, text.upper())
        # small sage rule under kicker
        self.set_draw_color(*SAGE)
        self.set_line_width(0.35)
        tw = self.get_string_width(text.upper()) + 2
        self.line(M, y + 4.4, M + min(tw, 42), y + 4.4)
        return y + 7.0

    def rule(self, y, gap=4.2):
        self.set_draw_color(*LINE)
        self.set_line_width(0.22)
        self.line(M, y, W - M, y)
        return y + gap


def mark(pdf, x, y, size=15.5):
    pdf.set_fill_color(*PAPER_W)
    pdf.set_draw_color(*SAGE)
    pdf.set_line_width(0.55)
    pdf.ellipse(x, y, size, size, style="DF")
    # inner ring
    pdf.set_draw_color(*SAGE_SOFT)
    pdf.set_line_width(0.25)
    pdf.ellipse(x + 1.6, y + 1.6, size - 3.2, size - 3.2, style="D")
    pdf.set_font("Serif", "I", 10.5)
    pdf.set_text_color(*FOREST)
    pdf.set_xy(x, y + 4.2)
    pdf.cell(size, 7, "GB", align="C")


def header(pdf, role, place, tagline, contacts, breath_labels=True):
    y = 12.5
    mark(pdf, M, y, 16)
    pdf.set_xy(M + 20, y + 0.8)
    pdf.set_font("Serif", "B", 23.5)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 8.5, "Gracián Baena")
    pdf.set_xy(M + 20, y + 9.2)
    pdf.set_font("Mono", "B", 7.5)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 4.2, f"{role}  ·  {place}")
    y = 33.5
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "I", 15.5)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 6.5, tagline)
    y = pdf.breath(M, y + 10.5, W - M * 2, 9.5 if breath_labels else 7.2, labels=breath_labels)
    pdf.set_xy(M, y + 1.2)
    pdf.set_font("Sans", "", 7.6)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 3.8, contacts)
    return y + 7.5


def footer(pdf):
    pdf.set_fill_color(*FOREST)
    pdf.rect(0, H - 13.5, W, 13.5, "F")
    pdf.set_fill_color(*SAGE)
    pdf.rect(0, H - 13.5, 7.1, 13.5, "F")
    pdf.set_xy(M, H - 10.2)
    pdf.set_font("Sans", "", 7.6)
    pdf.set_text_color(*SAGE_L)
    pdf.cell(95, 5.5, "Presencia  ·  Respiración  ·  Práctica real")
    pdf.set_font("Mono", "B", 7.2)
    pdf.cell(0, 5.5, URL.replace("https://", ""), align="R", link=URL)


def doors(pdf, y, title, items):
    y = pdf.kicker(title, y)
    col_w = (W - M * 2) / 3
    card_h = 30
    for i, (h, p) in enumerate(items):
        x = M + i * col_w
        pdf.set_fill_color(*PAPER_W)
        pdf.rect(x, y, col_w - 3.2, card_h, "F")
        pdf.set_draw_color(*LINE)
        pdf.set_line_width(0.22)
        pdf.rect(x, y, col_w - 3.2, card_h)
        pdf.set_fill_color(*SAGE)
        pdf.rect(x, y, 1.7, card_h, "F")
        pdf.set_xy(x + 5, y + 3.2)
        pdf.set_font("Mono", "B", 7)
        pdf.set_text_color(*SAGE)
        pdf.cell(col_w - 10, 3.6, f"0{i + 1}")
        pdf.set_xy(x + 5, y + 7.8)
        pdf.set_font("Serif", "B", 11.5)
        pdf.set_text_color(*FOREST)
        pdf.cell(col_w - 10, 4.8, h)
        pdf.set_xy(x + 5, y + 14.2)
        pdf.set_font("Sans", "", 7.7)
        pdf.set_text_color(*MUTED)
        pdf.multi_cell(col_w - 10, 3.5, p)
    return y + card_h + 5


def job(pdf, y, dates, place, title, body):
    # date column + content
    pdf.set_xy(M, y)
    pdf.set_font("Mono", "B", 7)
    pdf.set_text_color(*SAGE)
    pdf.cell(40, 4.2, dates)
    pdf.set_font("Serif", "B", 11.5)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 4.2, place)
    y += 4.8
    pdf.set_xy(M + 40, y)
    pdf.set_font("Sans", "B", 7.8)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 3.8, title)
    y += 4.0
    pdf.set_xy(M + 40, y)
    pdf.set_font("Sans", "", 8.2)
    pdf.set_text_color(*INK)
    pdf.multi_cell(W - M * 2 - 40, 3.55, body)
    return pdf.get_y() + 3.0


def chip(pdf, x, y, w, h, label, sub):
    pdf.set_fill_color(*PAPER_W)
    pdf.set_draw_color(*LINE)
    pdf.set_line_width(0.2)
    pdf.rect(x, y, w, h, "DF")
    pdf.set_xy(x + 2.2, y + 1.6)
    pdf.set_font("Mono", "B", 7)
    pdf.set_text_color(*SAGE)
    pdf.cell(w - 4, 3.2, label)
    pdf.set_xy(x + 2.2, y + 5.2)
    pdf.set_font("Sans", "", 7.2)
    pdf.set_text_color(*MUTED)
    pdf.cell(w - 4, 3.2, sub)


def save(pdf, *names):
    data = bytes(pdf.output())
    for name in names:
        path = ROOT / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        print("wrote", path.name, path.stat().st_size)


def cv(lang: str):
    es = lang == "es"
    pdf = Doc()
    y = header(
        pdf,
        "INSTRUCTOR DE YOGA" if es else "YOGA INSTRUCTOR",
        "MURCIA",
        "Presencia. Respiración. Práctica real." if es else "Presence. Breath. Real practice.",
        CONTACT,
        breath_labels=True,
    )

    # —— PROFILE ——
    y = pdf.kicker("Perfil" if es else "Profile", y)
    profile = (
        "Instructor certificado (Madrid 2019). Combino presencia en sala, adaptación multi-nivel "
        "y experiencia corporativa (Majorel · Google / YouTube). Clases honestas: cuerpo, "
        "respiración y atención — con método y calidez. Disponible para sala, 1:1 y equipos."
        if es
        else "Certified instructor (Madrid 2019). I combine room presence, multi-level teaching "
        "and corporate experience (Majorel · Google / YouTube). Honest classes: body, breath "
        "and attention — with method and warmth. Available for studio, 1:1 and teams."
    )
    pdf.set_xy(M, y)
    pdf.set_font("Sans", "", 9.0)
    pdf.set_text_color(*INK)
    pdf.multi_cell(W - M * 2, 4.0, profile)
    y = pdf.get_y() + 4.5

    # —— TEACHING APPROACH ——
    y = doors(
        pdf,
        y,
        "Enfoque de enseñanza" if es else "Teaching approach",
        [
            (
                "Sala" if es else "Studio",
                "Clases multi-nivel. Entras, respiras, sales distinto. Sin teatro."
                if es
                else "Multi-level classes. Walk in, breathe, leave different. No theatre.",
            ),
            (
                "1:1",
                "Movilidad, estrés, hábito. Una persona, un criterio."
                if es
                else "Mobility, stress, habit. One person, one criterion.",
            ),
            (
                "Equipos" if es else "Teams",
                "Bienestar en el trabajo. Lo hice en Google / YouTube."
                if es
                else "Wellbeing at work. I did it at Google / YouTube.",
            ),
        ],
    )

    y = pdf.rule(y, 4.5)

    # —— EXPERIENCE ——
    y = pdf.kicker("Experiencia" if es else "Experience", y)
    y = job(
        pdf,
        y,
        "ABR 2022 — JUN 2026" if es else "APR 2022 — JUN 2026",
        "Mood Fitness · Murcia",
        "Instructor de yoga" if es else "Yoga instructor",
        (
            "Diseñé y dirigí clases multi-nivel en sala: presencia, seguridad y progresión. "
            "Hasta el cierre del centro por cambio de titularidad (junio 2026)."
            if es
            else "Designed and led multi-level studio classes: presence, safety and progression. "
            "Until the centre closed after a change of ownership (June 2026)."
        ),
    )
    y = job(
        pdf,
        y,
        "2020 — 2021",
        "Majorel · Google / YouTube",
        "Wellness Ambassador · yoga corporativo" if es else "Wellness Ambassador · corporate yoga",
        (
            "Programas de yoga y bienestar para equipos IT + ES en un entorno de operaciones "
            "globales. Salud mental, hábito y facilitación de grupos."
            if es
            else "Yoga and wellbeing programmes for IT + ES teams in a global ops environment. "
            "Mental health, habit and group facilitation."
        ),
    )
    y = job(
        pdf,
        y,
        "2019 — 2022",
        "Clases particulares" if es else "Private classes",
        "Instructor personalizado" if es else "Personalised instructor",
        (
            "Sesiones adaptadas a movilidad, estrés, constancia y técnica."
            if es
            else "Sessions tailored to mobility, stress, consistency and technique."
        ),
    )
    y = job(
        pdf,
        y,
        "2016 — 2019",
        "Shaolin Temple",
        "Kung Fu Shaolin",
        (
            "Disciplina, presencia y constancia. La base física antes de la sala."
            if es
            else "Discipline, presence and consistency. The physical base before the studio."
        ),
    )

    y = pdf.rule(y, 4.2)

    # —— EDUCATION + LANGUAGES (two columns) ——
    split = y
    y = pdf.kicker("Formación" if es else "Education", y)
    edu_items = [
        (
            "Instructor de Yoga · Madrid · 2019" if es else "Yoga Instructor · Madrid · 2019",
            "Certificación oficial. Asanas, pranayama y filosofía. Prácticas en Madrid."
            if es
            else "Official certification. Asana, pranayama and philosophy. Placements in Madrid.",
        ),
        (
            "Grado en Turismo · Erasmus · Italia" if es else "Tourism Degree · Erasmus · Italy",
            "Università degli Studi di Bergamo.",
        ),
        (
            "Diplomatura Turismo · Murcia" if es else "Tourism Diploma · Murcia",
            "Escuela Universitaria de Murcia.",
        ),
    ]
    ey = y
    for title, body in edu_items:
        pdf.set_xy(M, ey)
        pdf.set_font("Serif", "B", 9.5)
        pdf.set_text_color(*FOREST)
        pdf.cell(92, 4.0, title)
        ey += 4.2
        pdf.set_xy(M, ey)
        pdf.set_font("Sans", "", 7.5)
        pdf.set_text_color(*MUTED)
        pdf.multi_cell(92, 3.3, body)
        ey = pdf.get_y() + 2.2

    # Languages column
    pdf.set_xy(M + 100, split)
    pdf.set_font("Mono", "B", 7.2)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 3.8, "IDIOMAS" if es else "LANGUAGES")
    pdf.set_draw_color(*SAGE)
    pdf.set_line_width(0.35)
    pdf.line(M + 100, split + 4.4, M + 126, split + 4.4)

    langs = [
        ("ES", "Nativo" if es else "Native"),
        ("EN", "Alto · C1" if es else "High · C1"),
        ("IT", "Alto · C1" if es else "High · C1"),
        ("PT", "Básico" if es else "Basic"),
        ("FR", "Básico" if es else "Basic"),
        ("CA", "Entiendo · no hablo" if es else "Understand · do not speak"),
    ]
    ly = split + 7.2
    chip_w = 40
    for i, (code, level) in enumerate(langs):
        col = i % 2
        row = i // 2
        chip(pdf, M + 100 + col * (chip_w + 3), ly + row * 11.5, chip_w, 10, code, level)

    y = max(ey, ly + 3 * 11.5) + 3.5

    # Quote band
    pdf.set_fill_color(*PAPER_W)
    pdf.set_draw_color(*LINE)
    pdf.set_line_width(0.2)
    qh = 18
    pdf.rect(M, y, W - M * 2, qh, "DF")
    pdf.set_fill_color(*SAGE)
    pdf.rect(M, y, 1.6, qh, "F")
    quote = (
        "Busco clases transformadoras y honestas: cuerpo, respiración y atención. "
        "Sin postureo. Con método y calidez."
        if es
        else "Honest, transformative classes: body, breath and attention. "
        "No performance. Method and warmth."
    )
    pdf.set_xy(M + 5, y + 3.5)
    pdf.set_font("Serif", "I", 10.5)
    pdf.set_text_color(*FOREST)
    pdf.multi_cell(W - M * 2 - 8, 4.4, quote)

    y = y + qh + 4.5
    pdf.set_xy(M, y)
    pdf.set_font("Mono", "B", 6.8)
    pdf.set_text_color(*SAGE)
    pdf.cell(
        0,
        3.6,
        "ASANA  ·  PRANAYAMA  ·  MEDITACIÓN  ·  MINDFULNESS  ·  FACILITACIÓN  ·  YOGA CORPORATIVO"
        if es
        else "ASANA  ·  PRANAYAMA  ·  MEDITATION  ·  MINDFULNESS  ·  FACILITATION  ·  CORPORATE YOGA",
    )

    footer(pdf)
    if es:
        save(
            pdf,
            "Gracian_Baena_CV_Yoga_ES.pdf",
            "CV_Gracian_Baena_Yoga_ES.pdf",
            "assets/CV_Gracian_Baena_Yoga_ES.pdf",
        )
    else:
        save(
            pdf,
            "Gracian_Baena_CV_Yoga_EN.pdf",
            "CV_Gracian_Baena_Yoga_EN.pdf",
            "assets/CV_Gracian_Baena_Yoga_EN.pdf",
        )


def cover(es: bool):
    pdf = Doc()
    y = header(
        pdf,
        "INSTRUCTOR DE YOGA" if es else "YOGA INSTRUCTOR",
        "MURCIA",
        "Presencia. Respiración. Práctica real." if es else "Presence. Breath. Real practice.",
        "gracianbaenagonzalez@gmail.com   ·   +34 687 470 725   ·   gracianb.github.io/yoga-instructor",
        breath_labels=False,
    )
    y = pdf.rule(y, 6.5)

    pdf.set_xy(M, y)
    pdf.set_font("Sans", "", 8.5)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 4.2, "Murcia, septiembre 2026" if es else "Murcia, September 2026")
    y += 10

    pdf.set_xy(M, y)
    pdf.set_font("Serif", "B", 13)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 5.5, "Hola," if es else "Hello,")
    y += 9.5

    paras = (
        [
            (
                "Enseño yoga desde 2019. Lo que ofrezco es presencia, respiración y práctica real "
                "— no una estética. Clases multi-nivel en sala, sesiones 1:1 y trabajo con equipos, "
                "siempre con método y calidez."
            ),
            (
                "Hasta junio de 2026 di clase en Mood Fitness (Murcia, González Adalid 12). "
                "Tras un cambio de titularidad el hueco se cerró; yo sigo enseñando. "
                "Antes, como Wellness Ambassador en Majorel, llevé programas de yoga y "
                "bienestar para equipos de Google y YouTube. La base de disciplina y "
                "presencia viene del Shaolin Temple (2016–2019) y de la certificación "
                "oficial en Madrid (2019)."
            ),
            (
                "Busco un espacio honesto para clases multi-nivel: cuerpo, respiración y "
                "atención, con método y sin postureo. De momento estoy disponible fines de "
                "semana, tardes y noches."
            ),
            (
                "Si encaja con lo que buscáis, estaré encantado de conversar o concertar "
                "una clase de prueba. Gracias por el tiempo y la atención."
            ),
        ]
        if es
        else [
            (
                "I have taught yoga since 2019. What I offer is presence, breath and real "
                "practice — not an aesthetic. Multi-level studio classes, one-to-one sessions "
                "and team work, always with method and warmth."
            ),
            (
                "Through June 2026 I taught at Mood Fitness in Murcia (González Adalid 12). "
                "After a change of ownership the slot closed; I continue teaching. Before "
                "that, as Wellness Ambassador at Majorel, I ran yoga and wellbeing "
                "programmes for Google and YouTube teams. My foundation in discipline and "
                "presence comes from Shaolin Temple (2016–2019) and official certification "
                "in Madrid (2019)."
            ),
            (
                "I am looking for an honest multi-level space: body, breath and attention, "
                "with method and without performance. For now I am available weekends, "
                "evenings and nights."
            ),
            (
                "If that sounds like a fit, I would welcome a conversation or a trial class. "
                "Thank you for your time and attention."
            ),
        ]
    )

    pdf.set_font("Serif", "", 11.2)
    pdf.set_text_color(*FOREST)
    for p in paras:
        pdf.set_xy(M, y)
        pdf.multi_cell(W - M * 2, 5.9, p, align="L")
        y = pdf.get_y() + 5.8

    # Signature with quiet breath motif
    y = max(y + 2, H - 48)
    y = pdf.breath(M, y, (W - M * 2) * 0.48, 5.2, labels=False)
    y += 6
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "B", 12.5)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 5.5, "Gracián Baena")
    y += 6.2
    pdf.set_xy(M, y)
    pdf.set_font("Sans", "", 7.8)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 3.8, "Murcia  ·  Instructor de Yoga  ·  gracianb.github.io/yoga-instructor"
             if es else "Murcia  ·  Yoga Instructor  ·  gracianb.github.io/yoga-instructor")

    footer(pdf)
    save(
        pdf,
        "Gracian_Baena_Carta_Yoga_ES.pdf" if es else "Gracian_Baena_Cover_Letter_Yoga_EN.pdf",
    )


if __name__ == "__main__":
    cv("es")
    cv("en")
    cover(True)
    cover(False)
    print("done")
