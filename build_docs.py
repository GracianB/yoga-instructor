#!/usr/bin/env python3
"""Yoga CV + cover letters. One page. Same system as the site."""
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
MUTED = (90, 99, 84)
LINE = (210, 204, 186)
WHITE = (255, 253, 247)

W = 210
H = 297
M = 16


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
        self.rect(0, 0, 5.5, H, "F")
        self.set_fill_color(*SAGE)
        self.rect(5.5, 0, 1.2, H, "F")

    def kicker(self, text, y):
        self.set_xy(M + 2, y)
        self.set_font("Sans", "B", 8)
        self.set_text_color(*SAGE)
        self.cell(0, 5, text.upper())
        return y + 6

    def rule(self, y):
        self.set_draw_color(*LINE)
        self.set_line_width(0.25)
        self.line(M + 2, y, W - M, y)
        return y + 3.5


def header(pdf, role, tag, tagline, contacts):
    y = 16
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "B", 26)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 10, "Gracián Baena")
    y += 11
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "B", 9)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 5, f"{role}  ·  {tag}")
    y += 7
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "I", 13)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 6, tagline)
    y += 8
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "", 8)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 4.5, contacts)
    return pdf.rule(y + 7)


def footer(pdf, url):
    pdf.set_fill_color(*FOREST)
    pdf.rect(0, H - 12, W, 12, "F")
    pdf.set_xy(M + 2, H - 10)
    pdf.set_font("Sans", "", 8)
    pdf.set_text_color(*SAGE_L)
    pdf.cell(0, 6, url, link=url)


def doors(pdf, y, title, items):
    y = pdf.kicker(title, y)
    col_w = (W - M * 2 - 4) / 3
    x0 = M + 2
    for i, (h, p) in enumerate(items):
        x = x0 + i * col_w
        pdf.set_fill_color(*WHITE)
        pdf.rect(x, y, col_w - 3, 24, "F")
        pdf.set_xy(x + 2.5, y + 2.5)
        pdf.set_font("Sans", "B", 8)
        pdf.set_text_color(*SAGE)
        pdf.cell(col_w - 8, 4, f"0{i+1}  {h}")
        pdf.set_xy(x + 2.5, y + 8)
        pdf.set_font("Sans", "", 8)
        pdf.set_text_color(*FOREST)
        pdf.multi_cell(col_w - 8, 3.7, p)
    return y + 28


def job(pdf, y, dates, place, title, body):
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "B", 8)
    pdf.set_text_color(*SAGE)
    pdf.cell(38, 4.5, dates)
    pdf.set_font("Serif", "B", 11)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 4.5, place)
    y += 5
    pdf.set_xy(M + 40, y)
    pdf.set_font("Sans", "B", 8)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 4, title)
    y += 4.5
    pdf.set_xy(M + 40, y)
    pdf.set_font("Sans", "", 8.5)
    pdf.set_text_color(*FOREST)
    pdf.multi_cell(W - M * 2 - 40, 3.7, body)
    return pdf.get_y() + 3.2


def save(pdf, *names):
    data = pdf.output()
    for name in names:
        path = ROOT / name
        path.write_bytes(data)
        print("wrote", path, path.stat().st_size)


def cv_es():
    pdf = Doc()
    y = header(
        pdf,
        "INSTRUCTOR DE YOGA",
        "MURCIA",
        "Presencia. Respiración. Práctica real.",
        "gracianbaenagonzalez@gmail.com   ·   +34 687 470 725   ·   linkedin.com/in/gracianbaena   ·   gracianb.github.io/yoga-instructor",
    )
    y = doors(
        pdf,
        y,
        "Cómo trabajo",
        [
            ("SALA", "Clases multi-nivel. Entras, respiras, sales distinto. Sin teatro."),
            ("1:1", "Movilidad, estrés, hábito. Una persona, un criterio."),
            ("EQUIPOS", "Bienestar en el trabajo. Lo hice en Google / YouTube."),
        ],
    )
    y = pdf.kicker("Experiencia", y)
    y = job(
        pdf, y, "ABR 2022 — JUN 2026", "Mood Fitness · Murcia",
        "Instructor de yoga",
        "Clases multi-nivel en sala: presencia, seguridad y progresión. Murcia, hasta el cierre del centro por cambio de titularidad.",
    )
    y = job(
        pdf, y, "2020 — 2021", "Majorel · Google / YouTube",
        "Wellness Ambassador · yoga corporativo",
        "Programas de yoga y bienestar para equipos IT + ES. Salud mental y hábito en un entorno de operaciones globales.",
    )
    y = job(
        pdf, y, "2019 — 2022", "Clases particulares",
        "Instructor personalizado",
        "Sesiones adaptadas: movilidad, estrés, constancia y técnica.",
    )
    y = job(
        pdf, y, "2016 — 2019", "Shaolin Temple",
        "Kung Fu Shaolin",
        "Disciplina, presencia y constancia. La base física antes de la sala.",
    )
    y = pdf.rule(y)
    y = pdf.kicker("Formación", y)
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "B", 11)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 5, "Instructor de Yoga · Madrid · 2019")
    y += 5.5
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "", 8.5)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(W - M * 2, 3.8, "Certificación oficial. Formación intensiva en asanas, pranayama y filosofía. Prácticas en Madrid. Complemento: Grado en Turismo (Erasmus, Bergamo 2012) y Diplomatura en Turismo (Murcia 2011).")
    y = pdf.get_y() + 4
    y = pdf.rule(y)
    y = pdf.kicker("Idiomas", y)
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "", 9)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 5, "ES nativo   ·   EN C1   ·   IT C1   ·   PT básico   ·   FR básico")
    y += 8
    y = pdf.rule(y)
    y = pdf.kicker("Filosofía", y)
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "I", 12)
    pdf.set_text_color(*FOREST)
    pdf.multi_cell(W - M * 2, 5.2, "Busco clases transformadoras y honestas: cuerpo, respiración y atención. Sin postureo. Con método y calidez.")
    y = pdf.get_y() + 8
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "B", 8)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 5, "ASANA   ·   PRANAYAMA   ·   MEDITACIÓN   ·   MINDFULNESS   ·   FACILITACIÓN")
    footer(pdf, "https://gracianb.github.io/yoga-instructor/")
    save(pdf, "Gracian_Baena_CV_Yoga_ES.pdf", "CV_Gracian_Baena_Yoga_ES.pdf", "assets/CV_Gracian_Baena_Yoga_ES.pdf")


def cv_en():
    pdf = Doc()
    y = header(
        pdf,
        "YOGA INSTRUCTOR",
        "MURCIA",
        "Presence. Breath. Real practice.",
        "gracianbaenagonzalez@gmail.com   ·   +34 687 470 725   ·   linkedin.com/in/gracianbaena   ·   gracianb.github.io/yoga-instructor",
    )
    y = doors(
        pdf,
        y,
        "How I work",
        [
            ("STUDIO", "Multi-level classes. You walk in, you breathe, you leave different."),
            ("1:1", "Mobility, stress, habit. One person, one criterion."),
            ("TEAMS", "Wellbeing at work. I did it at Google / YouTube."),
        ],
    )
    y = pdf.kicker("Experience", y)
    y = job(
        pdf, y, "APR 2022 — JUN 2026", "Mood Fitness · Murcia",
        "Yoga instructor",
        "Multi-level studio classes: presence, safety and progression. Murcia, until the centre closed after a change of ownership.",
    )
    y = job(
        pdf, y, "2020 — 2021", "Majorel · Google / YouTube",
        "Wellness Ambassador · corporate yoga",
        "Yoga and wellbeing programmes for IT + ES teams. Mental health and habit in a global operations setting.",
    )
    y = job(
        pdf, y, "2019 — 2022", "Private classes",
        "Personalised instructor",
        "Sessions tailored to mobility, stress, consistency and technique.",
    )
    y = job(
        pdf, y, "2016 — 2019", "Shaolin Temple",
        "Shaolin Kung Fu",
        "Discipline, presence and consistency. The physical base before the studio.",
    )
    y = pdf.rule(y)
    y = pdf.kicker("Training", y)
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "B", 11)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 5, "Yoga Instructor · Madrid · 2019")
    y += 5.5
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "", 8.5)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(W - M * 2, 3.8, "Official certification. Intensive training in asana, pranayama and philosophy. Practice placements in Madrid. Also: Tourism Degree (Erasmus, Bergamo 2012) and Tourism Diploma (Murcia 2011).")
    y = pdf.get_y() + 4
    y = pdf.rule(y)
    y = pdf.kicker("Languages", y)
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "", 9)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 5, "ES native   ·   EN C1   ·   IT C1   ·   PT basic   ·   FR basic")
    y += 8
    y = pdf.rule(y)
    y = pdf.kicker("Philosophy", y)
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "I", 12)
    pdf.set_text_color(*FOREST)
    pdf.multi_cell(W - M * 2, 5.2, "Honest, transformative classes: body, breath and attention. No performance. Method and warmth.")
    y = pdf.get_y() + 8
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "B", 8)
    pdf.set_text_color(*SAGE)
    pdf.cell(0, 5, "ASANA   ·   PRANAYAMA   ·   MEDITATION   ·   MINDFULNESS   ·   FACILITATION")
    footer(pdf, "https://gracianb.github.io/yoga-instructor/")
    save(pdf, "Gracian_Baena_CV_Yoga_EN.pdf", "CV_Gracian_Baena_Yoga_EN.pdf", "assets/CV_Gracian_Baena_Yoga_EN.pdf")


def letter(pdf, date, greeting, paras, close, name):
    y = header(
        pdf,
        "INSTRUCTOR DE YOGA" if "Estimad" in greeting or "Hola" in greeting else "YOGA INSTRUCTOR",
        "MURCIA",
        "Presencia. Respiración. Práctica real." if "Estimad" in greeting or "Hola" in greeting else "Presence. Breath. Real practice.",
        "gracianbaenagonzalez@gmail.com   ·   +34 687 470 725   ·   gracianb.github.io/yoga-instructor",
    )
    pdf.set_xy(M + 2, y)
    pdf.set_font("Sans", "", 9)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 5, date)
    y += 10
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "B", 12)
    pdf.set_text_color(*FOREST)
    pdf.cell(0, 6, greeting)
    y += 10
    pdf.set_font("Serif", "", 11)
    pdf.set_text_color(*FOREST)
    for p in paras:
        pdf.set_xy(M + 2, y)
        pdf.multi_cell(W - M * 2, 5.4, p)
        y = pdf.get_y() + 5
    y += 4
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "I", 11)
    pdf.cell(0, 6, close)
    y += 8
    pdf.set_xy(M + 2, y)
    pdf.set_font("Serif", "B", 13)
    pdf.cell(0, 6, name)
    footer(pdf, "https://gracianb.github.io/yoga-instructor/")


def carta_es():
    pdf = Doc()
    letter(
        pdf,
        "Murcia, agosto 2026",
        "Hola.",
        [
            "Enseño yoga desde 2019. No vendo una estética. Guío práctica: cuerpo, respiración y atención. En sala, en 1:1 y con equipos.",
            "En Mood Fitness (Murcia) di clase hasta junio 2026, cuando el centro cerró. Antes, yoga corporativo en Majorel para equipos de Google / YouTube. Antes aún, Shaolin: disciplina que se nota en cómo se sostiene una clase.",
            "Busco un espacio —o un equipo— donde la práctica sea honesta. Multi-nivel, sin postureo, con método y calidez. Si encaja, hablemos.",
        ],
        "Gracias por el tiempo.",
        "Gracián Baena",
    )
    save(pdf, "Gracian_Baena_Carta_Yoga_ES.pdf")


def letter_en():
    pdf = Doc()
    letter(
        pdf,
        "Murcia, August 2026",
        "Hello.",
        [
            "I have taught yoga since 2019. I do not sell an aesthetic. I guide practice: body, breath and attention. In the studio, one to one, and with teams.",
            "At Mood Fitness (Murcia) I taught through June 2026, when the centre closed. Before that, corporate yoga at Majorel for Google / YouTube teams. Before that, Shaolin: discipline you can feel in how a class is held.",
            "I am looking for a room — or a team — where practice stays honest. Multi-level, no performance, method and warmth. If that fits, let’s talk.",
        ],
        "Thank you for your time.",
        "Gracián Baena",
    )
    save(pdf, "Gracian_Baena_Cover_Letter_Yoga_EN.pdf")


if __name__ == "__main__":
    cv_es()
    cv_en()
    carta_es()
    letter_en()
    print("done")
