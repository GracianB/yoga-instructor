# Yoga Applications · Independent working previews

Two separate, usable application previews. **Yoga Instructor's professional
portfolio stays untouched.** It continues to describe both projects as under
construction. Neither app is linked from its homepage.

| App | Local | GitHub Pages preview |
|---|---|---|
| Yoga Practice | /apps/yoga-practice/ | https://gracianb.github.io/yoga-instructor/apps/yoga-practice/ |
| Yoga Asana Book | /apps/asana-book/ | https://gracianb.github.io/yoga-instructor/apps/asana-book/ |

These URLs become usable **only after the build and Pages deployment pass**.

## Yoga Practice

A minimal independent practice timer built on the existing audited
\`practice-time-core.js\` and \`studio-clock.js\`. Three modes (gentle movement,
adaptable breathing, meditation), 5/10/15 minutes, start/pause/resume/reset,
accessible keyboard tabs, automatic pause when the browser is hidden, ES/EN,
light/dark themes and responsive visual feedback. No audio autoplay, analytics,
storage, mandatory breath holding or external requests.

## Yoga Asana Book

The original, immutable 12-posture catalog from \`asana-library.js\`, projected
through \`asana-domain.js\`, with searchable bilingual names, three filters,
support instructions, setup/breath/exit guidance, next/previous navigation,
and SVG diagrams **built from each authored posture's original torso, head,
limb and contact-point geometry**. ES/EN, light/dark and keyboard usable.
Instructional material, not medical advice.

## Isolation and next steps

Each preview is in its own folder, shares only \`apps/shared/app.css\` and a
small existing library/clock dependency. Neither runs the original large
practice/studio engine or the portfolio JavaScript. This is a tested
independent foundation, **not a claim that the original rich legacy studio
has been migrated feature-for-feature**.

The connector cannot create new repositories in this session. To create
\`yoga-practice\` and \`yoga-asana-book\` repos later, export each app folder
plus the respective time or asana data dependencies. Configure separate CI
and Pages deployment before replacing the preview URLs.

Both preview HTML pages specify \`noindex,nofollow\`. The site's public project
cards remain marked “En construcción”.

## Quality

\`\`\`bash
npm ci
npm test
npm run build
npx playwright test tests/browser/apps-standalone.spec.js
\`\`\`
