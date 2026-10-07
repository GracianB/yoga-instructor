# Yoga V5 — closure contract

Base audited: `2927a24ff82329338c28f99975e849b66de837bd` (2026-10-07).

## Scope and evidence

| Phase | Implementation | Verification |
| --- | --- | --- |
| 1. Baseline | Separate V5 branch; preserve Lotus/Sanctuary identity | Baseline had two failing Node contracts, both corrected |
| 2. Presentation | Preserve botanical lotus, paper/forest/sage palette; compact mobile dock and visible focus | Responsive browser captures at 320, 390, 768 and 1440 px |
| 3. Visitor journey | Reliable menu close, Escape focus return, section scroll offsets | Navigation/contact browser checks |
| 4. CSS consolidation | Remove unused 33,726-byte stylesheet, duplicated font import and eleven identical rules | CSS parser and resource budgets |
| 5. Practice | Shared bound frame scheduling; one hero breath timer; consistent saved intention and copy | Practice start/pause/resume/previous/finish/reset, breathing and audio browser checks |
| 6. Runtime | Media/animation fallbacks, throwing canvas fallback, safe storage and lifecycle-aware ambience | Receiver regression tests and browser fault injection |
| 7. ES/EN and documents | Translate controls, accessible names, cues and target; correct CV web PDF links and Mood wording | Language changes during practice and PDF signature/link checks |
| 8. Accessibility | Focus rings, reduced motion, keyboard menu and compact mobile dock | WCAG A/AA axe scan in both themes plus keyboard/browser checks |
| 9. Actual verification | Node tests plus Playwright Chromium/Firefox/WebKit; console and own resource failures are blockers | `npm run quality` and `npm run test:browser` |
| 10. Release | Allowlisted static build; verification precedes Pages deployment | `npm run build`; release only after CI and live checks |

## Reproducible checks

```sh
npm ci
npm run quality
npx playwright install --with-deps chromium firefox webkit
npm run test:browser
npm run build
```

`npm run test:e2e` is the legacy alias for Node contracts. Actual browser end-to-end coverage is `npm run test:browser`. WebKit is an engine-level check, not proof of testing every Safari device.

Browser tests replace Google Fonts and the external Vortex frame with fixtures to isolate first-party behavior. Live external resources need separate verification. Audio and PDFs are real local assets, not fixtures.

Resource budgets cover file size; they do not constitute measured Core Web Vitals. A successful build contains only public website assets, never tests or dependencies.

## Publish and maintain

Pages must use **GitHub Actions** as its source to honor `.github/workflows/deploy.yml`. Branch-based legacy Pages builds do not honor that workflow gate. Do not label V5 published until the deployed HTML includes `runtime.js?v=yoga-5`, all required verification succeeds, and the live contact/documents can be reached.

After release, reserve new features for a later version. Maintenance covers broken links, factual updates, security fixes and regressions. Keep the original audit commit as the rollback reference.
