# Yoga Instructor · D.30 acceptance and product freeze

**Status:** release candidate, **not** production-verified until CI, merge, Pages and browser checks are green on the exact deployed SHA.

## Shipped code in this candidate

| Step | Delivered change | Proof |
| --- | --- | --- |
| D.23 | Stable paws, neutral Gato/Vaca, grounded pose transitions | PR #113, merged |
| D.24 | Three hand-authored SVG asanas (Mountain, Downward Dog, Butterfly) | PR #114, merged |
| D.25 | Session lengths and restorative/inexperienced profiles | PR #115, integration gate |
| D.26 | Gentle 3/5, natural 4/6, free breathing, shared dragon breath geometry | studio-breath-engine.js; d26 tests |
| D.27 | Guided or truly silent meditation, unintrusive cues | studio-meditation-d27.js; d27 tests |
| D.28 | Hidden-tab rendering sleeps; avoid redundant SVG observer churn; localized controls | practice-studio.js; d28 tests |
| D.29 | Layout, theme, paths, SVG geometry and ES/EN across Chromium/Firefox/WebKit | d29 tests |
| D.30 | This contract, release verification and no new speculative features | tools/build.mjs; tools/release-audit.mjs |

## Acceptance gate before calling D.30 released

- [ ] D.25 integrated into `main` only after all browser shards succeed.
- [ ] D.26–D.30 branch revalidated on latest main, including Node quality/build.
- [ ] Browser CI green in **Chromium, Firefox and WebKit** for both themes and 320/390/768/1440 px.
- [ ] GitHub Quality Gate green on final PR head SHA.
- [ ] PR merged only if no dependency or release conflict is unresolved.
- [ ] GitHub Pages deploy on the exact resulting main SHA reports success.
- [ ] `dist` includes all required JS/CSS; check live URL and no 404s.
- [ ] Verify no changed keyboard focus, initial autoplay, local data leakage or excessive motion.

## Product principles

1. The **same D.17 dragon anatomy** is reused in Movement, Breathing and Meditation. No second decorative character and no PNG substitute.
2. Single monotonic clock. Pausing freezes guidance and visual breathing; resuming preserves elapsed time.
3. Never force breath retention or pace. **Free** means no imposed cycle; guidance remains optional.
4. Feet and ground supports must never move simply to imitate breathing. The studio animates meridian light and halo, not the entire posed skeleton.
5. Reduced-motion and quiet mode freeze decoration without stopping the user-controlled practice clock.
6. No tracking, scores, gamification, remote accounts or automatic voice playback.
7. All selector states must remain usable with keyboard, both languages and mobile.

## Freeze

D.30 is the agreed **maximum iteration** for Yoga Instructor. Future work requires a fresh scope, not D.31-by-inertia. The release remains a candidate until this checklist is verified.
