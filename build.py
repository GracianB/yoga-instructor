#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gracián Baena — Yoga CV, zen redesign
Builds self-contained HTML (ES / EN) with embedded fonts
and renders A4 PDFs via Microsoft Edge headless.
"""
import math
import base64
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(ROOT, "..", "assets"))
os.makedirs(ASSETS, exist_ok=True)


def b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def load_font(name):
    path = os.path.join(ROOT, "fonts", name)
    if not os.path.exists(path):
        return ""
    return b64(path)


FRAUNCES = load_font("fraunces.woff2")
FRAUNCES_IT = load_font("fraunces-italic.woff2")
FRAUNCES_500 = load_font("fraunces-500.woff2")
MANROPE = load_font("manrope.woff2")
MANROPE_600 = load_font("manrope-600.woff2")

FONT_FACES = f"""
@font-face {{
  font-family: 'Fraunces Var';
  src: url(data:font/woff2;base64,{FRAUNCES}) format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}}
@font-face {{
  font-family: 'Fraunces Var';
  src: url(data:font/woff2;base64,{FRAUNCES_500}) format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: block;
}}
@font-face {{
  font-family: 'Fraunces Var';
  src: url(data:font/woff2;base64,{FRAUNCES_IT}) format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: block;
}}
@font-face {{
  font-family: 'Manrope Var';
  src: url(data:font/woff2;base64,{MANROPE}) format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: block;
}}
@font-face {{
  font-family: 'Manrope Var';
  src: url(data:font/woff2;base64,{MANROPE_600}) format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: block;
}}
"""


def breathline_path(width=620, height=72, cy=36, periods=3.5, amp=24, n=220):
    pts = []
    for i in range(n + 1):
        t = i / n
        x = width * t
        envelope = math.sin(math.pi * t)
        y = cy - amp * envelope * math.sin(2 * math.pi * periods * t)
        pts.append(f"{x:.2f},{y:.2f}")
    return "M" + " L".join(pts)


BREATH_D = breathline_path()
BREATH_SVG = f'''<svg class="breathline" viewBox="0 0 620 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <path d="{BREATH_D}" fill="none" stroke="#DAA428" stroke-width="2.1" stroke-linecap="round"/>
</svg>'''

ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>'
ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.7 10.9c1.4 2.7 3.7 5 6.4 6.4l2.1-2.1c.3-.3.7-.4 1.1-.3 1.1.4 2.2.6 3.4.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.3.6 3.4.1.4 0 .8-.3 1.1l-2.1 2.1z"/></svg>'
ICON_LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 16.5l9-9"/><path d="M9 7.5h7.5V15"/></svg>'
ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>'

BASE_CSS = """
:root{
  --ink:#1E2A1F;
  --ink-soft:#4B5643;
  --paper:#F7F3EA;
  --mist:#EFE9D8;
  --gold:#DAA428;
  --bronze:#9C7A3C;
  --sage:#77876B;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  width:210mm;
  height:297mm;
  overflow:hidden;
  background:var(--paper);
  color:var(--ink);
  font-family:'Manrope Var', system-ui, sans-serif;
  font-weight:430;
  font-size:8.6pt;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}
.sheet{
  width:210mm;
  height:297mm;
  max-height:297mm;
  overflow:hidden;
  /* Más aire arriba y lados — menos “pegado” */
  padding:16mm 16mm 0 16mm;
  position:relative;
  display:flex;
  flex-direction:column;
  background:var(--paper);
}
.header{margin-bottom:3.2mm; flex-shrink:0;}
.brandrow{display:flex; align-items:flex-start; gap:4mm;}
.monogram{
  width:11mm; height:11mm; border-radius:50%;
  border:0.6pt solid var(--gold);
  display:flex; align-items:center; justify-content:center;
  font-family:'Fraunces Var', Georgia, serif; font-style:italic; font-weight:520;
  font-size:10.5pt; color:var(--ink); flex-shrink:0; margin-top:0.8mm;
}
.eyebrow{
  font-family:'Manrope Var', sans-serif; font-weight:680; font-size:7.3pt;
  letter-spacing:0.16em; text-transform:uppercase; color:var(--sage);
  margin:0 0 1.4mm 0;
}
h1{
  font-family:'Fraunces Var', Georgia, serif; font-weight:440; font-style:normal;
  font-size:27pt; margin:0; letter-spacing:0.003em; color:var(--ink); line-height:0.96;
}
.tagline{
  font-family:'Fraunces Var', Georgia, serif; font-style:italic; font-weight:440;
  font-size:11.2pt; color:var(--ink-soft); margin:2.2mm 0 0 0;
}
.tagline .accent{ color:var(--gold); }
.breathline{ display:block; width:100%; max-width:152mm; height:5.2mm; margin:2mm 0 0.8mm 0; }
.contactrow{
  display:flex; flex-wrap:wrap; column-gap:5.5mm; row-gap:1.2mm;
  font-size:7.5pt; font-weight:560; color:var(--ink-soft); margin-top:1mm;
}
.contactrow a{ color:var(--ink-soft); text-decoration:none; }
.contactrow .item{ display:flex; align-items:center; gap:1.5mm; }
.contactrow svg{ width:8.5pt; height:8.5pt; color:var(--gold); flex-shrink:0; }
.stats{
  display:flex; margin:3.5mm 0 4mm 0; flex-shrink:0;
  border-top:0.55pt solid rgba(30,42,31,.16);
  border-bottom:0.55pt solid rgba(30,42,31,.16);
}
.stat{ flex:1; padding:2.2mm 3.8mm; border-left:0.55pt solid rgba(30,42,31,.16); }
.stat:first-child{ border-left:none; padding-left:0; }
.stat .num{
  font-family:'Fraunces Var', Georgia, serif; font-weight:520;
  font-size:13pt; color:var(--gold); display:block; line-height:1;
}
.stat .lbl{ font-size:6.5pt; color:var(--ink-soft); display:block; margin-top:0.9mm; line-height:1.25; }
.grid{ display:grid; grid-template-columns:52mm 1fr; column-gap:7.5mm; flex:1; min-height:0; }
.sidebar{ border-right:0.55pt solid rgba(30,42,31,.16); padding-right:7.5mm; }
.section{ margin-bottom:3.6mm; }
.section:last-child{ margin-bottom:0; }
.sectitle{
  display:flex; align-items:center; gap:2mm;
  font-family:'Manrope Var', sans-serif; font-weight:760; font-size:7.3pt;
  letter-spacing:0.12em; text-transform:uppercase; color:var(--gold);
  margin:0 0 2.2mm 0;
}
.sectitle::after{ content:''; flex:1; height:0.55pt; background:linear-gradient(to right, rgba(218,164,40,.55), rgba(218,164,40,0)); }
.profile-text{ font-size:8.5pt; line-height:1.5; color:var(--ink); margin:0; }
.job{ margin-bottom:2.8mm; }
.job:last-child{ margin-bottom:0; }
.job-meta{ display:flex; align-items:baseline; gap:2mm; margin-bottom:0.8mm; flex-wrap:wrap; }
.job-date{ font-family:'Manrope Var', sans-serif; font-weight:760; font-size:7.1pt; letter-spacing:0.04em; color:var(--gold); text-transform:uppercase; white-space:nowrap; }
.job-tag{ font-size:6.1pt; font-weight:650; letter-spacing:0.05em; text-transform:uppercase; color:var(--sage); border:0.55pt solid var(--sage); border-radius:20px; padding:0.4mm 1.8mm; }
.job-org{ font-family:'Fraunces Var', Georgia, serif; font-style:italic; font-weight:520; font-size:10pt; color:var(--ink); margin:0.2mm 0 0.35mm 0; }
.job-role{ font-weight:720; font-size:8.2pt; color:var(--ink); margin:0 0 0.9mm 0; }
.job ul{ margin:0; padding-left:3.2mm; }
.job li{ font-size:7.9pt; line-height:1.36; color:var(--ink-soft); margin-bottom:0.35mm; }
.job li::marker{ color:var(--gold); }
.job li:last-child{ margin-bottom:0; }
.train-head{ display:flex; gap:1.6mm; align-items:baseline; margin-bottom:0.8mm; flex-wrap:wrap; }
.train-year{ font-weight:760; font-size:7.1pt; color:var(--gold); }
.train-tag{ font-size:6pt; font-weight:650; letter-spacing:0.05em; text-transform:uppercase; color:var(--sage); }
.train-title{ font-family:'Fraunces Var', Georgia, serif; font-style:italic; font-weight:500; font-size:8.7pt; color:var(--ink); margin:0 0 0.8mm 0; }
.train-desc{ font-size:7.4pt; line-height:1.4; color:var(--ink-soft); margin:0; }
.edu-entry{ display:flex; gap:1.8mm; font-size:7.5pt; color:var(--ink-soft); margin-bottom:1.7mm; line-height:1.35; }
.edu-entry:last-child{ margin-bottom:0; }
.edu-year{ font-weight:760; color:var(--gold); flex-shrink:0; }
.skills-text{ font-size:7.7pt; line-height:1.55; color:var(--ink); margin:0; }
.skills-text .sep{ color:var(--gold); font-weight:700; margin:0 1mm; }
.langs{ display:flex; flex-direction:column; gap:1.3mm; }
.lang-row{ display:flex; align-items:center; justify-content:space-between; }
.lang-name{ font-size:7.8pt; color:var(--ink); font-weight:560; }
.lang-right{ display:flex; align-items:center; gap:1.4mm; }
.lang-level{ font-size:6.3pt; color:var(--ink-soft); letter-spacing:0.02em; }
.dots{ display:flex; gap:0.7mm; }
.dot{ width:1.5mm; height:1.5mm; border-radius:50%; background:rgba(30,42,31,.15); }
.dot.on{ background:var(--gold); }
/* Philosophy: compact + aire — sigue en página 1 */
.philosophy{
  background:var(--ink); color:var(--paper);
  margin:3.5mm -16mm 0 -16mm; padding:3.8mm 16mm 4mm 16mm;
  width:calc(100% + 32mm);
  flex-shrink:0;
}
.philosophy .sectitle{ color:var(--gold); margin-bottom:1.5mm; }
.philo-quote{
  font-family:'Fraunces Var', Georgia, serif; font-style:italic; font-weight:400;
  font-size:10pt; line-height:1.32; color:var(--paper); margin:0 0 1.5mm 0; max-width:162mm;
}
.philo-close{ font-size:7.3pt; color:rgba(247,243,234,.78); margin:0; max-width:162mm; line-height:1.32; }
.philo-foot{
  margin-top:2.6mm; padding-top:1.7mm; border-top:0.55pt solid rgba(247,243,234,.18);
  font-size:5.7pt; letter-spacing:0.12em; text-transform:uppercase; color:rgba(247,243,234,.48);
  display:flex; justify-content:space-between;
}
@media print{
  body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; height:297mm; overflow:hidden; }
  a{ color:inherit; }
  @page{ size:A4; margin:0; }
  .sheet{ height:297mm; max-height:297mm; overflow:hidden; }
}
"""

CONTENT = {
    "es": dict(
        lang="es",
        eyebrow="Instructor de Yoga certificado · Murcia, España",
        name="GRACIÁN BAENA",
        tagline_pre="Presencia. Respiración. ",
        tagline_accent="Práctica real.",
        email="gracianbaenagonzalez@gmail.com",
        phone="+34 687 470 725",
        linkedin_label="linkedin.com/in/gracianbaena",
        linkedin_href="https://www.linkedin.com/in/gracianbaena",
        web_label="gracianb.github.io/yoga-instructor",
        web_href="https://gracianb.github.io/yoga-instructor/",
        stats=[
            ("2019", "Certificación · Madrid"),
            ("2022—hoy", "Mood Fitness · activo"),
            ("7+", "años de práctica en sala"),
            ("5", "idiomas"),
        ],
        sec_profile="Perfil",
        profile="Instructor de yoga certificado (Madrid, 2019) con experiencia en clases multinivel, bienestar corporativo y facilitación de grupos. Base de práctica en Mood Fitness (Murcia). Anteriormente Wellness Ambassador e instructor en entorno Majorel / Google-YouTube. Combino presencia en sala, respiración y método con experiencia real de equipos y cliente.",
        sec_experience="Trayectoria en yoga y bienestar",
        jobs=[
            dict(date="2022 — HOY", tag="ACTIVO", org="Mood Fitness · Murcia", role="Instructor de Yoga",
                 bullets=[
                     "Diseño y dirijo clases para diversos niveles y necesidades",
                     "Foco en presencia, seguridad, progresión y hábito de práctica",
                     "Murcia como base continua de enseñanza en sala",
                 ]),
            dict(date="2020 — 2021", tag="CORPORATIVO", org="Majorel · Proyecto Google / YouTube",
                 role="Instructor de yoga corporativo · Wellness Ambassador",
                 bullets=[
                     "Programas de yoga y bienestar para empleados",
                     "Apoyo a salud mental y hábitos en equipos IT + ES",
                     "Facilitación en entorno de operaciones globales",
                 ]),
            dict(date="2019 — 2022", tag="1:1", org="Clases particulares", role="Instructor de yoga personalizado",
                 bullets=[
                     "Sesiones 1:1 adaptadas a movilidad, estrés, técnica y constancia",
                 ]),
        ],
        sec_training="Formación en yoga",
        training=dict(year="2019", tag="OFICIAL", title="Instructor de Yoga — Madrid",
                       desc="Formación intensiva: asanas, pranayama y filosofía del yoga. Prácticas en Madrid."),
        sec_education="Formación complementaria",
        education=[
            ("2012", "Grado en Turismo · Erasmus, Bergamo (Italia)"),
            ("2011", "Diplomatura en Turismo · Murcia"),
            ("2022+", "Datos / automatización / IA (formación continua)"),
        ],
        sec_skills="Habilidades",
        skills=["Asana", "Pranayama", "Meditación", "Mindfulness", "Multinivel", "Facilitación de grupos", "Yoga corporativo", "Sesiones 1:1"],
        sec_langs="Idiomas",
        langs=[("Español", "Nativo", 5), ("Inglés", "C1", 4), ("Italiano", "C1", 4), ("Portugués", "Básico", 2), ("Francés", "Básico", 2)],
        sec_philosophy="Filosofía",
        philo_quote="Clases honestas: cuerpo, respiración y atención.",
        philo_quote2="Sin postureo. Método, calidez y criterio.",
        philo_close="Disponible para clases, colaboraciones y bienestar en equipos · Murcia",
        footer_left="Gracián Baena · Yoga · Presencia",
        footer_right="Murcia, España",
    ),
    "en": dict(
        lang="en",
        eyebrow="Certified Yoga Instructor · Murcia, Spain",
        name="GRACIÁN BAENA",
        tagline_pre="Presence. Breath. ",
        tagline_accent="Real practice.",
        email="gracianbaenagonzalez@gmail.com",
        phone="+34 687 470 725",
        linkedin_label="linkedin.com/in/gracianbaena",
        linkedin_href="https://www.linkedin.com/in/gracianbaena",
        web_label="gracianb.github.io/yoga-instructor",
        web_href="https://gracianb.github.io/yoga-instructor/",
        stats=[
            ("2019", "Certified · Madrid"),
            ("2022—now", "Mood Fitness · active"),
            ("7+", "years teaching in-studio"),
            ("5", "languages"),
        ],
        sec_profile="Profile",
        profile="Certified yoga instructor (Madrid, 2019) with experience in multi-level classes, corporate wellness and group facilitation. Teaching base at Mood Fitness (Murcia). Formerly Wellness Ambassador and instructor in a Majorel / Google–YouTube environment. I combine room presence, breathwork and method with real team and client experience.",
        sec_experience="Yoga & wellness experience",
        jobs=[
            dict(date="2022 — PRESENT", tag="ACTIVE", org="Mood Fitness · Murcia", role="Yoga Instructor",
                 bullets=[
                     "Design and lead classes for diverse levels and needs",
                     "Focus on presence, safety, progression and practice habit",
                     "Murcia as a continuous in-studio teaching base",
                 ]),
            dict(date="2020 — 2021", tag="CORPORATE", org="Majorel · Google / YouTube project",
                 role="Corporate Yoga Instructor · Wellness Ambassador",
                 bullets=[
                     "Yoga and wellbeing programmes for employees",
                     "Mental health and habit support for IT + ES teams",
                     "Facilitation within a global operations environment",
                 ]),
            dict(date="2019 — 2022", tag="1:1", org="Private Classes", role="Personalised Yoga Instructor",
                 bullets=[
                     "1:1 sessions tailored to mobility, stress, technique and consistency",
                 ]),
        ],
        sec_training="Yoga training",
        training=dict(year="2019", tag="OFFICIAL", title="Yoga Instructor Certification — Madrid",
                       desc="Intensive training: asana, pranayama and yoga philosophy. Practice placements in Madrid."),
        sec_education="Additional education",
        education=[
            ("2012", "Tourism Degree · Erasmus, Bergamo (Italy)"),
            ("2011", "Tourism Diploma · Murcia"),
            ("2022+", "Data / automation / AI (ongoing training)"),
        ],
        sec_skills="Skills",
        skills=["Asana", "Pranayama", "Meditation", "Mindfulness", "Multi-level", "Group facilitation", "Corporate yoga", "1:1 sessions"],
        sec_langs="Languages",
        langs=[("Spanish", "Native", 5), ("English", "C1", 4), ("Italian", "C1", 4), ("Portuguese", "Basic", 2), ("French", "Basic", 2)],
        sec_philosophy="Philosophy",
        philo_quote="Honest classes: body, breath and attention.",
        philo_quote2="No performance — method, warmth and discernment.",
        philo_close="Open to classes, collaborations and team wellbeing · Murcia",
        footer_left="Gracián Baena · Yoga · Presence",
        footer_right="Murcia, Spain",
    ),
}


def dots_html(level, total=5):
    return "".join(f'<span class="dot{" on" if i < level else ""}"></span>' for i in range(total))


def build_html(d):
    jobs_html = ""
    for j in d["jobs"]:
        bullets = "".join(f"<li>{b}</li>" for b in j["bullets"])
        jobs_html += f"""
        <div class="job">
          <div class="job-meta"><span class="job-date">{j['date']}</span><span class="job-tag">{j['tag']}</span></div>
          <div class="job-org">{j['org']}</div>
          <div class="job-role">{j['role']}</div>
          <ul>{bullets}</ul>
        </div>"""

    edu_html = "".join(
        f'<div class="edu-entry"><span class="edu-year">{y}</span><span>{t}</span></div>'
        for y, t in d["education"]
    )

    tags_html = ' <span class="sep">·</span> '.join(d["skills"])

    langs_html = ""
    for name, level_label, lvl in d["langs"]:
        langs_html += f"""
        <div class="lang-row">
          <span class="lang-name">{name}</span>
          <span class="lang-right"><span class="lang-level">{level_label}</span><span class="dots">{dots_html(lvl)}</span></span>
        </div>"""

    stats_html = "".join(
        f'<div class="stat"><span class="num">{n}</span><span class="lbl">{l}</span></div>'
        for n, l in d["stats"]
    )

    t = d["training"]

    return f"""<!DOCTYPE html>
<html lang="{d['lang']}">
<head>
<meta charset="UTF-8">
<title>{d['name']} — CV Yoga</title>
<style>
{FONT_FACES}
{BASE_CSS}
</style>
</head>
<body>
<div class="sheet">

  <div class="header">
    <div class="brandrow">
      <div class="monogram">GB</div>
      <div>
        <div class="eyebrow">{d['eyebrow']}</div>
        <h1>{d['name']}</h1>
      </div>
    </div>
    <div class="tagline">{d['tagline_pre']}<span class="accent">{d['tagline_accent']}</span></div>
    {BREATH_SVG}
    <div class="contactrow">
      <span class="item">{ICON_MAIL}{d['email']}</span>
      <span class="item">{ICON_PHONE}{d['phone']}</span>
      <span class="item">{ICON_LINK}<a href="{d['linkedin_href']}">{d['linkedin_label']}</a></span>
      <span class="item">{ICON_LINK}<a href="{d['web_href']}">{d['web_label']}</a></span>
      <span class="item">{ICON_PIN}Murcia</span>
    </div>
  </div>

  <div class="stats">{stats_html}</div>

  <div class="grid">
    <div class="sidebar">

      <div class="section">
        <div class="sectitle">{d['sec_training']}</div>
        <div class="train-entry">
          <div class="train-head"><span class="train-year">{t['year']}</span><span class="train-tag">{t['tag']}</span></div>
          <div class="train-title">{t['title']}</div>
          <p class="train-desc">{t['desc']}</p>
        </div>
      </div>

      <div class="section">
        <div class="sectitle">{d['sec_education']}</div>
        {edu_html}
      </div>

      <div class="section">
        <div class="sectitle">{d['sec_skills']}</div>
        <p class="skills-text">{tags_html}</p>
      </div>

      <div class="section">
        <div class="sectitle">{d['sec_langs']}</div>
        <div class="langs">{langs_html}</div>
      </div>

    </div>

    <div class="main">
      <div class="section">
        <div class="sectitle">{d['sec_profile']}</div>
        <p class="profile-text">{d['profile']}</p>
      </div>

      <div class="section">
        <div class="sectitle">{d['sec_experience']}</div>
        {jobs_html}
      </div>
    </div>
  </div>

  <div class="philosophy">
    <div class="sectitle">{d['sec_philosophy']}</div>
    <p class="philo-quote">{d['philo_quote']}<br>{d['philo_quote2']}</p>
    <p class="philo-close">{d['philo_close']}</p>
    <div class="philo-foot"><span>{d['footer_left']}</span><span>{d['footer_right']}</span></div>
  </div>

</div>
</body>
</html>"""


def find_edge():
    candidates = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None


def html_to_pdf(html_path, pdf_path, edge):
    html_uri = "file:///" + html_path.replace("\\", "/")
    cmd = [
        edge,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--print-to-pdf-no-header",
        f"--print-to-pdf={pdf_path}",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=8000",
        html_uri,
    ]
    print("rendering", pdf_path)
    subprocess.run(cmd, check=False, capture_output=True, text=True, timeout=60)
    if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000:
        print("OK", pdf_path, os.path.getsize(pdf_path), "bytes")
        return True
    print("FAIL pdf", pdf_path)
    return False


if __name__ == "__main__":
    edge = find_edge()
    if not edge:
        print("Edge not found — HTML only")
    else:
        print("Edge:", edge)

    for key in ("es", "en"):
        html = build_html(CONTENT[key])
        html_path = os.path.join(ROOT, f"cv_{key}.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
        print("wrote", html_path, len(html), "chars")

        if edge:
            pdf_name = f"CV_Gracian_Baena_Yoga_{key.upper()}.pdf"
            pdf_path = os.path.join(ASSETS, pdf_name)
            html_to_pdf(html_path, pdf_path, edge)
            # also copy next to html
            alt = os.path.join(ROOT, pdf_name)
            if os.path.exists(pdf_path):
                import shutil
                shutil.copy2(pdf_path, alt)

    print("done")
