$ErrorActionPreference = "Stop"

function Write-YogaPdf {
  param([string]$Path, [string[]]$Lines)

  $sbContent = New-Object System.Text.StringBuilder
  [void]$sbContent.Append("BT`n/F1 10 Tf`n50 800 Td`n13 TL`n")
  $i = 0
  foreach ($line in $Lines) {
    $safe = $line
    $safe = $safe.Replace("\","\\").Replace("(","\(").Replace(")","\)")
    $map = @{
      [char]0x00E1="a";[char]0x00E9="e";[char]0x00ED="i";[char]0x00F3="o";[char]0x00FA="u"
      [char]0x00C1="A";[char]0x00C9="E";[char]0x00CD="I";[char]0x00D3="O";[char]0x00DA="U"
      [char]0x00F1="n";[char]0x00D1="N";[char]0x00FC="u";[char]0x00B7="-";[char]0x2014="-"
      [char]0x2013="-";[char]0x00D7="x"
    }
    foreach ($k in $map.Keys) { $safe = $safe.Replace([string]$k, $map[$k]) }
    $chars = $safe.ToCharArray() | ForEach-Object {
      $c = [int][char]$_
      if ($c -ge 32 -and $c -le 126) { $_ } else { " " }
    }
    $ascii = -join $chars
    if ($i -eq 0) { [void]$sbContent.Append("($ascii) Tj`n") }
    else { [void]$sbContent.Append("T*`n($ascii) Tj`n") }
    $i++
  }
  [void]$sbContent.Append("ET`n")
  $stream = $sbContent.ToString()
  $streamLen = [System.Text.Encoding]::ASCII.GetByteCount($stream)

  $o1 = "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj`n"
  $o2 = "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj`n"
  $o3 = "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj`n"
  $o4 = "4 0 obj<< /Length $streamLen >>stream`n$stream`nendstream`nendobj`n"
  $o5 = "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj`n"

  $pdf = New-Object System.Text.StringBuilder
  [void]$pdf.Append("%PDF-1.4`n")
  $off = @()
  foreach ($o in @($o1,$o2,$o3,$o4,$o5)) {
    $off += $pdf.Length
    [void]$pdf.Append($o)
  }
  $xref = $pdf.Length
  [void]$pdf.Append("xref`n0 6`n")
  [void]$pdf.Append("0000000000 65535 f `n")
  foreach ($o in $off) { [void]$pdf.Append(("{0:D10} 00000 n `n" -f $o)) }
  [void]$pdf.Append("trailer<< /Size 6 /Root 1 0 R >>`n")
  [void]$pdf.Append("startxref`n$xref`n%%EOF`n")

  $bytes = [System.Text.Encoding]::ASCII.GetBytes($pdf.ToString())
  [System.IO.File]::WriteAllBytes($Path, $bytes)
  Write-Output ("WROTE {0} {1}" -f $Path, $bytes.Length)
}

$es = @(
  "GRACIAN BAENA",
  "Instructor de Yoga certificado | Murcia, Espana",
  "Email: gracianbaenagonzalez@gmail.com | Tel: +34 687 470 725",
  "LinkedIn: linkedin.com/in/gracianbaena",
  "",
  "PERFIL",
  "Instructor de yoga certificado (Madrid, 2019) con experiencia en clases",
  "multi-nivel, bienestar corporativo y facilitacion de grupos. Base de",
  "practica en Mood Fitness (Murcia). Anteriormente Wellness Ambassador e",
  "instructor en entorno Majorel / Google-YouTube. Combino presencia en sala,",
  "respiracion y metodo con experiencia real de equipos y cliente.",
  "",
  "EXPERIENCIA EN YOGA Y BIENESTAR",
  "",
  "2022 - Actualidad | Mood Fitness | Murcia",
  "Instructor de Yoga",
  "- Diseno y dirijo clases para diversos niveles y necesidades",
  "- Foco en presencia, seguridad, progresion y habito de practica",
  "- Murcia como base continua de ensenanza en sala",
  "",
  "2020 - 2021 | Majorel | Proyecto Google / YouTube",
  "Instructor de yoga corporativo | Wellness Ambassador",
  "- Programas de yoga y bienestar para empleados",
  "- Apoyo a salud mental y habitos en equipos IT + ES",
  "- Facilitacion en entorno de operaciones globales",
  "",
  "2019 - 2022 | Clases particulares",
  "Instructor de yoga personalizado",
  "- Sesiones 1:1 adaptadas a movilidad, estres, tecnica y constancia",
  "",
  "FORMACION EN YOGA",
  "2019 | Certificacion oficial Instructor de Yoga | Madrid",
  "- Formacion intensiva: asanas, pranayama y filosofia",
  "- Practicas en Madrid",
  "",
  "FORMACION COMPLEMENTARIA",
  "2012 | Grado en Turismo | Erasmus - Bergamo (Italia)",
  "2011 | Diplomatura en Turismo | Murcia",
  "2022+| Data / automatizacion / IA (formacion continua)",
  "",
  "HABILIDADES",
  "Yoga: asanas, pranayama, meditacion, mindfulness, multi-nivel",
  "Ensenanza: facilitacion de grupos, yoga corporativo, 1:1",
  "Idiomas: ES nativo | EN C1 | IT C1 | PT basico | FR basico",
  "",
  "FILOSOFIA",
  "Clases honestas y transformadoras: cuerpo, respiracion y atencion.",
  "Sin postureo. Con metodo, calidez y criterio.",
  "Disponible para clases, colaboraciones y bienestar en equipos."
)

$en = @(
  "GRACIAN BAENA",
  "Certified Yoga Instructor | Murcia, Spain",
  "Email: gracianbaenagonzalez@gmail.com | Phone: +34 687 470 725",
  "LinkedIn: linkedin.com/in/gracianbaena",
  "",
  "PROFILE",
  "Certified yoga instructor (Madrid, 2019) with experience in multi-level",
  "classes, corporate wellness and group facilitation. Teaching base at Mood",
  "Fitness (Murcia). Formerly Wellness Ambassador and instructor in a Majorel",
  "/ Google-YouTube environment. I combine room presence, breathwork and method",
  "with real team and customer experience.",
  "",
  "YOGA AND WELLNESS EXPERIENCE",
  "",
  "2022 - Present | Mood Fitness | Murcia",
  "Yoga Instructor",
  "- Design and lead classes for diverse levels and needs",
  "- Focus on presence, safety, progression and practice habit",
  "- Murcia as continuous in-room teaching base",
  "",
  "2020 - 2021 | Majorel | Google / YouTube project",
  "Corporate yoga instructor | Wellness Ambassador",
  "- Yoga and wellbeing programmes for employees",
  "- Mental health and habit support for IT + ES teams",
  "- Facilitation in a global operations environment",
  "",
  "2019 - 2022 | Private classes",
  "Personalised yoga instructor",
  "- 1:1 sessions tailored to mobility, stress, technique and consistency",
  "",
  "YOGA TRAINING",
  "2019 | Official Yoga Instructor certification | Madrid",
  "- Intensive training: asana, pranayama and yoga philosophy",
  "- Practice placements in Madrid",
  "",
  "ADDITIONAL EDUCATION",
  "2012 | Tourism Degree | Erasmus - Bergamo (Italy)",
  "2011 | Tourism Diploma | Murcia",
  "2022+| Data / automation / AI (ongoing training)",
  "",
  "SKILLS",
  "Yoga: asana, pranayama, meditation, mindfulness, multi-level",
  "Teaching: group facilitation, corporate yoga, 1:1",
  "Languages: ES native | EN C1 | IT C1 | PT basic | FR basic",
  "",
  "PHILOSOPHY",
  "Honest, transformative classes: body, breath and attention.",
  "No performance. Method, warmth and judgement.",
  "Open to classes, collaborations and team wellbeing. Murcia."
)

$out = "C:\Users\graci\yoga-instructor\assets"
if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }
Write-YogaPdf -Path "$out\CV_Gracian_Baena_Yoga_ES.pdf" -Lines $es
Write-YogaPdf -Path "$out\CV_Gracian_Baena_Yoga_EN.pdf" -Lines $en
Copy-Item "$out\CV_Gracian_Baena_Yoga_ES.pdf" "C:\Users\graci\Downloads\CV_Gracian_Baena_Yoga_ES.pdf" -Force
Copy-Item "$out\CV_Gracian_Baena_Yoga_EN.pdf" "C:\Users\graci\Downloads\CV_Gracian_Baena_Yoga_EN.pdf" -Force
Get-ChildItem $out\CV_Gracian_Baena_Yoga_*.pdf | Format-Table Name, Length -AutoSize
