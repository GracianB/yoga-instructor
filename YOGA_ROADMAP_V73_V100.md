# Yoga Instructor · V73–V100

**Objetivo**: completar un producto serio en dos experiencias conectadas pero diferenciadas: **portfolio de instructor** (credibilidad, captación y narrativa profesional) y **estudio guiado** (Asanas, Movement, Breath y Meditation). No convertir el número de versión en una métrica de calidad.

**Reglas de publicación**:
1. Rama y PR por versión o bloque coherente; sin fusionar regresiones.
2. Node, release audit, Chromium, Firefox y WebKit son obligatorios.
3. GitHub Pages solo publica un SHA de main validado; verificar el despliegue real.
4. Respetar inglés/español, teclado, lectores de pantalla, quiet mode y prefers-reduced-motion.
5. Una mejora técnica no cuenta como mejora visual sin revisar anatomía, contraste y uso en móvil.
6. No presentar experiencias clínicas, cifras, empleo directo en clientes de Majorel ni testimonios sin evidencia.

## Roadmap de producto

| Versión | Entrega sustancial | Aceptación |
|---|---|---|
| **V73** | Portfolio profesional como capítulo independiente, tres rutas de enseñanza, evidencia profesional, CV y contacto contextuales | Primer capítulo tras portada; selector accesible ES/EN, móvil y Pages |
| V74 | Estudios de caso editoriales de sala, clases privadas y empresas | Cada caso explica contexto, intervención y límites, sin datos inventados |
| V75 | Nueva narrativa visual del portfolio con fotografías autorizadas o arte original y jerarquía tipográfica definitiva | Lectura en móvil y escritorio, contrastes revisados |
| V76 | Contacto orientado a oportunidades: clases, corporativo, colaboraciones | Diferentes asuntos y mensajes, privacidad intacta |
| V77 | Curriculum narrativo y certificaciones verificables | Consistencia entre CV web, PDF y portada |
| V78 | Demo profesional de 60 segundos sin video obligatorio ni sonido automático | Acceso alternativo por texto, reproducción opt-in |
| V79 | Auditoría SEO, datos estructurados, OG y búsqueda profesional | Sin afirmaciones exageradas, metadatos completos ES/EN |
| V80 | Cierre de portfolio fase 1 | Pruebas y revisión editorial de todos los recorridos |
| V81 | Libro de asanas: navegación didáctica por familias anatómicas | No confundir biblioteca y Movement |
| V82 | Fichas de asanas: preparación, ejecución, salida, variantes y contraindicaciones generales prudentes | Navegación asistiva y revisión técnica |
| V83 | Nila: Árbol y Perro boca abajo redibujados desde cinemática articular | Siluetas coherentes y apoyos claros a cuatro tamaños |
| V84 | Nila: suelo, caderas, manos, rodillas, hombros y transiciones anatómicas | Sin discontinuidades al cambiar postura |
| V85 | Movimiento: fluidez entre posturas y descansos | Velocidad contenida, control del reloj y reduced motion |
| V86 | Breath: movimiento corporal del dragón sincronizado y amplitud parametrizable | Pausa congela y reanudación continúa, sin segundo reloj |
| V87 | Breath: guía visual de respiración natural y variantes suaves | Sin prometer efectos médicos ni forzar retenciones |
| V88 | Breath: diseño de calma, colores propios y mínima carga visual | Claridad para fases e intervalo; contraste AA |
| V89 | Meditation: anclas de atención configurables y ritual de llegada | Sin sobreestimulación ni recomendaciones clínicas |
| V90 | Meditation: guía de voz opcional y biblioteca de silencios/ambientes locales | Audio siempre voluntario; controles accesibles |
| V91 | Uma: expresividad sutil, foco ocular y presencia | El personaje acompaña, no distrae |
| V92 | Identidad de Nila, dragón y Uma como tres mundos visuales coherentes | Paletas distintas con sistema compartido de UI |
| V93 | Personalizador de prácticas: duración, intensidad y objetivo | Preferencias locales; opción de borrar; sin cuentas |
| V94 | Diseño de secuencias progresivas y descanso | Fases, pausas y reinicio fiables |
| V95 | Sesión compartible mediante URL sin datos sensibles | Parámetros validables y recuperables |
| V96 | Rendimiento: reducción del CSS heredado y activos cargados por contexto | Menos solicitudes; perfiles en móvil |
| V97 | Accesibilidad avanzada: zoom 200/400 %, narración, teclado y motion | Axe, Playwright y pruebas manuales |
| V98 | Auditoría visual comparativa de posturas, navegadores y resoluciones | Capturas base y checklist anatómico |
| V99 | Candidato a lanzamiento: enlaces, navegación y estado de publicación | Zero regressions en los flujos críticos |
| **V100** | Edición definitiva Yoga Instructor: portfolio + estudio, demostración end-to-end | Release verificable, páginas accesibles y documentación de producto |

## Dependencias actuales
- V72 PR #146 debe superar los seis fragmentos de navegadores antes de entrar en main.
- V73 se propone contra la rama de V72 para evitar mezclar una función nueva con fallos históricos del estudio.
- Ninguna de V74–V100 se marca como implementada hasta que exista código y validación.
