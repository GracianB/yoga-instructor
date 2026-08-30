#!/usr/bin/env python3
"""Yoga CV + letters. One page. Matches the site: paper, forest, sage, breath line."""
import math
from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SERIF_B = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SERIF_I = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"

PAPER = (247, 243, 234)
FOREST = (30, 42, 31)
SAGE = (47, 107, 79)
SAGE_L = (125, 202, 165)
GOLD = (201, 154, 36)
MUTED = (90, 99, 84)
LINE = (214, 208, 190)
WHITE = (255, 253, 247)
INK = (30, 42, 31)

W, H, M = 210, 297, 18


def cycle_spec(steps, spu=12):
    """steps: list of ('in'|'hold'|'out'|'rest', beats). One cycle. y 0..1."""
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
            for _i in range(n * spu):
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
            for _i in range(n * spu):
                pts.append((t, 0.0))
                t += dt
            y = 0.0
        pts.append((t, y))
    return pts, sum(beats), beats


PAT_478 = [("in", 4), ("hold", 7), ("out", 8)]
PAT_4444 = [("in", 4), ("hold", 4), ("out", 4), ("rest", 4)]


class Doc(FPDF):
    def __init__(self):
        super().__init__(format="A4", unit="mm")
        self.set_auto_page_break(False)
        self.add_font("Serif", "", SERIF)
        self.add_font("Serif", "B", SERIF_B)
        self.add_font("Serif", "I", SERIF_I)
        self.add_font("Sans", "", SANS)
        self.add_font("Sans", "B", SANS_B)
        self.add_page()
        self.set_fill_color(*PAPER)
        self.rect(0, 0, W, H, "F")
        self.set_fill_color(*FOREST)
        self.rect(0, 0, 6, H, "F")
        self.set_fill_color(*SAGE)
        self.rect(6, 0, 1.4, H, "F")

    def breath(self, x, y, w, h=9, labels=False, pattern="478"):
        steps = PAT_478 if pattern == "478" else PAT_4444
        raw, cycle, beats = cycle_spec(steps)
        tmax = raw[-1][0] or 1
        pts = []
        for tx, ty in raw:
            nx = x + tx / tmax * w
            ny = y + (1 - ty) * h
            pts.append((nx, ny))
        self.set_draw_color(*GOLD)
        self.set_line_width(0.7)
        self.polyline(pts, style="D")
        if labels:
            self.set_font("Sans", "B", 7)
            self.set_text_color(*GOLD)
            x0 = x
            for n in beats:
                seg = w * (n / cycle)
                self.set_xy(x0, y + h + 1.2)
                self.cell(seg, 3.4, str(n), align="C")
                x0 += seg
            return y + h + 6
        return y + h + 3.5

    def kicker(self, text, y):
        self.set_xy(M, y)
        self.set_font("Sans", "B", 7.5)
        self.set_text_color(*SAGE)
        self.cell(0, 4, text.upper())
        return y + 5.5

    def rule(self, y, gap=4):
        self.set_draw_color(*LINE)
        self.set_line_width(0.22)
        self.line(M, y, W - M, y)
        return y + gap


def mark(pdf, x, y, size=15):
    pdf.set_draw_color(*SAGE)
    pdf.set_line_width(0.5)
    pdf.set_fill_color(*PAPER)
    pdf.ellipse(x, y, size, size, style="D")
    pdf.set_font("Serif", "I", 11)
    pdf.set_text_color(*FOREST)
    pdf.set_xy(x, y + 4)
    pdf.cell(size, 7, "GB", align="C")


def header(pdf, role, place, tagline, contacts):
    y = 14
    mark(pdf, M, y, 16)
    pdf.set_xy(M + 20, y + 1)
    pdf.set_font("Serif", "B", 24)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 9, "Gracián Baena")
    pdf.set_xy(M + 20, y + 9.5)
    pdf.set_font("Sans", "B", 8)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 4.5, f"{role}  ·  {place}")
    y = 36
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "I", 16)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 7, tagline)
    y = pdf.breath(M, y + 12, W - M * 2, 10, labels=True, pattern="478")
    pdf.set_xy(M, y + 2)
    pdf.set_font("Sans", "", 8)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 4, contacts)
    return y + 9


def footer(pdf, url):
    pdf.set_fill_color(*FOREST)
    pdf.rect(0, H - 14, W, 14, "F")
    pdf.set_xy(M, H - 11)
    pdf.set_font("Sans", "", 8)
    pdf.set_text_color(*SAGE_L)
    pdf.cell(90, 6, "Presencia  ·  Respiración  ·  Práctica real")
    pdf.set_font("Sans", "B", 8)
    pdf.cell(0, 6, url, align="R", link=url)


def doors(pdf, y, title, items):
    y = pdf.kicker(title, y)
    col_w = (W - M * 2) / 3
    for i, (h, p) in enumerate(items):
        x = M + i * col_w
        pdf.set_fill_color(*WHITE)
        pdf.rect(x, y, col_w - 3.5, 28, "F")
        pdf.set_draw_color(*LINE)
        pdf.set_line_width(0.2)
        pdf.rect(x, y, col_w - 3.5, 28)
        pdf.set_fill_color(*SAGE)
        pdf.rect(x, y, 1.6, 28, "F")
        pdf.set_xy(x + 5, y + 3)
        pdf.set_font("Sans", "B", 7.5)
        pdf.set_text_color(*SAGE)
        pdf.cell(col_w - 10, 4, f"0{i+1}")
        pdf.set_xy(x + 5, y + 7.5)
        pdf.set_font("Serif", "B", 12)
        pdf.set_text_color(*FOREST)
        pdf.cell(col_w - 10, 5, h)
        pdf.set_xy(x + 5, y + 14)
        pdf.set_font("Sans", "", 8)
        pdf.set_text_color(*MUTED)
        pdf.multi_cell(col_w - 10, 3.6, p)
    return y + 32


def job(pdf, y, dates, place, title, body):
    pdf.set_xy(M, y)
    pdf.set_font("Sans", "B", 7.5)
    pdf.set_text_color(*SAGE)
    pdf.cell(42, 4.4, dates)
    pdf.set_font("Serif", "B", 12)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 4.4, place)
    y += 5.2
    pdf.set_xy(M + 42, y)
    pdf.set_font("Sans", "B", 8)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 4, title)
    y += 4.4
    pdf.set_xy(M + 42, y)
    pdf.set_font("Sans", "", 8.5)
    pdf.set_text_color(*FOREST)
    pdf.multi_cell(W - M * 2 - 42, 3.8, body)
    return pdf.get_y() + 3.4


def save(pdf, *names):
    data = pdf.output()
    for name in names:
        path = ROOT / name
        path.write_bytes(data)
        print("wrote", path.name, path.stat().st_size)


def cv(lang):
    es = lang == "es"
    pdf = Doc()
    y = header(
        pdf,
        "INSTRUCTOR DE YOGA" if es else "YOGA INSTRUCTOR",
        "MURCIA",
        "Presencia. Respiración. Práctica real." if es else "Presence. Breath. Real practice.",
        "gracianbaenagonzalez@gmail.com    +34 687 470 725    linkedin.com/in/gracianbaena    gracianb.github.io/yoga-instructor",
    )
    y = doors(
        pdf,
        y,
        "Cómo trabajo" if es else "How I work",
        [
            ("Sala" if es else "Studio",
             "Clases multi-nivel. Entras, respiras, sales distinto." if es
             else "Multi-level classes. Walk in, breathe, leave different."),
            ("1:1",
             "Movilidad, estrés, hábito. Una persona, un criterio." if es
             else "Mobility, stress, habit. One person, one criterion."),
            ("Equipos" if es else "Teams",
             "Bienestar en el trabajo. Lo hice en Google / YouTube." if es
             else "Wellbeing at work. I did it at Google / YouTube."),
        ],
    )
    y = pdf.rule(y, 5)
    y = pdf.kicker("Experiencia" if es else "Experience", y)
    y = job(
        pdf, y, "ABR 2022 — JUN 2026" if es else "APR 2022 — JUN 2026",
        "Mood Fitness · Murcia",
        "Instructor de yoga" if es else "Yoga instructor",
        "Clases multi-nivel en sala: presencia, seguridad y progresión. Hasta el cierre del centro por cambio de titularidad."
        if es else "Multi-level studio classes: presence, safety and progression. Until the centre closed after a change of ownership.",
    )
    y = job(
        pdf, y, "2020 — 2021", "Majorel · Google / YouTube",
        "Wellness Ambassador · yoga corporativo" if es else "Wellness Ambassador · corporate yoga",
        "Programas de yoga y bienestar para equipos IT + ES. Salud mental y hábito."
        if es else "Yoga and wellbeing programmes for IT + ES teams. Mental health and habit.",
    )
    y = job(
        pdf, y, "2019 — 2022",
        "Clases particulares" if es else "Private classes",
        "Instructor personalizado" if es else "Personalised instructor",
        "Sesiones adaptadas: movilidad, estrés, constancia y técnica."
        if es else "Sessions tailored to mobility, stress, consistency and technique.",
    )
    y = job(
        pdf, y, "2016 — 2019", "Shaolin Temple",
        "Kung Fu Shaolin",
        "Disciplina, presencia y constancia. La base física antes de la sala."
        if es else "Discipline, presence and consistency. The physical base before the studio.",
    )
    y = pdf.rule(y, 5)
    split = y
    y = pdf.kicker("Formación" if es else "Training", y)
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "B", 11)
    pdf.set_text_color(*FOREST)
    pdf.cell(88, 5, "Instructor de Yoga · Madrid · 2019" if es else "Yoga Instructor · Madrid · 2019")
    pdf.set_xy(M, y + 5.5)
    pdf.set_font("Sans", "", 8)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(88, 3.6, "Certificación oficial. Asanas, pranayama y filosofía. Prácticas en Madrid."
                   if es else "Official certification. Asana, pranayama and philosophy. Placements in Madrid.")

    pdf.set_xy(M + 96, split)
    pdf.set_font("Sans", "B", 7.5)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 4, "IDIOMAS" if es else "LANGUAGES")
    pdf.set_xy(M + 96, split + 6)
    pdf.set_font("Sans", "", 9)
    pdf.set_text_color(*FOREST)
    pdf.multi_cell(70, 4.2, "ES nativo\nEN C1    IT C1\nPT básico    FR básico" if es
                   else "ES native\nEN C1    IT C1\nPT basic    FR basic")

    y = max(pdf.get_y(), y + 16) + 5
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "I", 13)
    pdf.set_text_color(*FOREST)
    quote = ("Busco clases transformadoras y honestas: cuerpo, respiración y atención. Sin postureo. Con método y calidez."
             if es else "Honest, transformative classes: body, breath and attention. No performance. Method and warmth.")
    pdf.multi_cell(W - M * 2, 5.6, quote)
    y = pdf.get_y() + 6
    pdf.set_xy(M, y)
    pdf.set_font("Sans", "B", 7.5)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 4, "ASANA  ·  PRANAYAMA  ·  MEDITACIÓN  ·  MINDFULNESS  ·  FACILITACIÓN" if es
             else "ASANA  ·  PRANAYAMA  ·  MEDITATION  ·  MINDFULNESS  ·  FACILITATION")
    footer(pdf, "https://gracianb.github.io/yoga-instructor/")
    if es:
        save(pdf, "Gracian_Baena_CV_Yoga_ES.pdf", "CV_Gracian_Baena_Yoga_ES.pdf", "assets/CV_Gracian_Baena_Yoga_ES.pdf")
    else:
        save(pdf, "Gracian_Baena_CV_Yoga_EN.pdf", "CV_Gracian_Baena_Yoga_EN.pdf", "assets/CV_Gracian_Baena_Yoga_EN.pdf")


def cover(es):
    pdf = Doc()
    y = header(
        pdf,
        "INSTRUCTOR DE YOGA" if es else "YOGA INSTRUCTOR",
        "MURCIA",
        "Presencia. Respiración. Práctica real." if es else "Presence. Breath. Real practice.",
        "gracianbaenagonzalez@gmail.com    +34 687 470 725    gracianb.github.io/yoga-instructor",
    )
    pdf.set_xy(M, y)
    pdf.set_font("Sans", "", 9)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 5, "Murcia, agosto 2026" if es else "Murcia, August 2026")
    y += 12
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "B", 14)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 7, "Hola." if es else "Hello.")
    y += 12
    paras = [
        "Enseño yoga desde 2019. No vendo una estética. Guío práctica: cuerpo, respiración y atención. En sala, en 1:1 y con equipos.",
        "En Mood Fitness (Murcia) di clase hasta junio 2026, cuando el centro cerró. Antes, yoga corporativo en Majorel para equipos de Google / YouTube. Antes aún, Shaolin: disciplina que se nota en cómo se sostiene una clase.",
        "Busco un espacio —o un equipo— donde la práctica sea honesta. Multi-nivel, sin postureo, con método y calidez. Si encaja, hablemos.",
    ] if es else [
        "I have taught yoga since 2019. I do not sell an aesthetic. I guide practice: body, breath and attention. In the studio, one to one, and with teams.",
        "At Mood Fitness (Murcia) I taught through June 2026, when the centre closed. Before that, corporate yoga at Majorel for Google / YouTube teams. Before that, Shaolin: discipline you can feel in how a class is held.",
        "I am looking for a room — or a team — where practice stays honest. Multi-level, no performance, method and warmth. If that fits, let’s talk.",
    ]
    pdf.set_font("Serif", "", 12)
    pdf.set_text_color(*FOREST)
    for p in paras:
        pdf.set_xy(M, y)
        pdf.multi_cell(W - M * 2, 6, p)
        y = pdf.get_y() + 6
    y += 5
    y = pdf.breath(M, y, W - M * 2, 8, labels=False, pattern="478")
    y += 5
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "I", 12)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 6, "Gracias por el tiempo." if es else "Thank you for your time.")
    y += 10
    pdf.set_xy(M, y)
    pdf.set_font("Serif", "B", 14)
    pdf.cell(0, 6, "Gracián Baena")
    footer(pdf, "https://gracianb.github.io/yoga-instructor/")
    save(pdf, "Gracian_Baena_Carta_Yoga_ES.pdf" if es else "Gracian_Baena_Cover_Letter_Yoga_EN.pdf")


if __name__ == "__main__":
    cv("es")
    cv("en")
    cover(True)
    cover(False)
    print("done")
