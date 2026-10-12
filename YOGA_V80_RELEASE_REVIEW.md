# Yoga Instructor · V80 · Portfolio phase-one release candidate

## Scope

V77–V80 complete a professional reading journey while preserving the interactive studio, three guardians, Asana Book and original practice engine.

| Version | Product experience | Primary contract |
|---|---|---|
| V77 | Four-entry experience ledger, contextual teaching evidence, ES/EN filters, CV and cover letter by language, print layout | No independent verification implied; no fabricated outcomes |
| V78 | 60-second three-chapter guided teaching demonstration, controls, SVG art, slider and full transcript | No autoplay, remote video, forced sound or background timer |
| V79 | Six visible FAQ entries, bilingual OG/Twitter/description metadata and matching FAQPage JSON-LD | Structured answers match exactly the visible FAQ; no imaginary schedules or pricing |
| V80 | Three user journeys: practice, hiring, workplace wellbeing; hand-off to real V74 and V76 tooling | Every route target exists; no profiles, accounts or stored preferences |

## Journey acceptance

1. **Practice**: open #orientacion, choose practice, visit #demostracion, #instructor-flow and #preguntas.
2. **Hiring**: inspect #trayectoria, context in #casos and CV documents in #cv.
3. **Teams**: preview #casos and #programa, open #v76-enquiry with the workplace option preselected. The site must never automatically send the enquiry.
4. ES/EN can be changed after selecting a route without losing that route.
5. At widths 320, 375, 768 and 1280 pixels, links and controls remain readable without horizontal overflow.
6. Keyboard, screen readers, full text transcripts, reduced motion, light/dark and visibility-based playback stop remain valid.

## Quality and release gate

- npm ci.
- npm run quality: syntax, automated checks, Node suites, the cross-version audit:v80 and release audit.
- npm run build: every HTML-referenced asset is present in the Pages package.
- Chromium, Firefox and WebKit shards must pass at the exact pull-request SHA.
- Merge V72–V80 **in order**, resolving divergent histories carefully. A green Node build alone is insufficient.
- Validate the exact main SHA, then verify GitHub Pages including SHA-256 checks of versioned assets (tools/pages-smoke.mjs).
- These PRs are **not a public release** until the deployment checks are complete.

## Presentation and safety

The portfolio is not a healthcare service or diagnostic tool. Professional experience is described contextually; original credentials and employment should be checked independently where necessary. The sixty-second demonstration is illustrative, not footage of a real client session. Do not introduce fabricated testimonials, personal health information, efficacy metrics or unsupported employment claims.

## After V80

V81–V90 will prioritize the teaching experience: the Asana Book, posture options, Nila's anatomy and transitions, the moving breathing guardian and a more focused meditation experience. Features must improve the real experience and pass cross-browser checks, not merely increment version labels.
