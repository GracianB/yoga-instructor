# YOGA · Phase 1 architecture baseline (2026-10-18)

## Scope and invariants

Phase 1 makes room for architectural consolidation without imposing artificial limits on the number of scripts, stylesheets, or bytes. This is **not** permission to load unlimited resources into the browser: sizes are measured and optimization remains a release concern.

Production must continue to preserve the ordered CSS cascade via `tools/p4-production-css.mjs`. Do not manually merge styles without visual regression testing. The build copies a declared asset allowlist and checks every linked root script or stylesheet is included. The V100 manifest remains the deployed integrity ledger.

## Current architecture (verified in source)

- Entry point: `index.html`, with many historical stylesheet and deferred-script generations.
- Production pipeline: `tools/build.mjs` emits `dist/`, assembles ordered styles into a single CSS bundle and writes/verifies the release manifest.
- Resource integrity: `tools/p3-architecture.mjs` checks duplicated CSS/JS references, nondeferred scripts, missing/empty local files and traversal paths; it now reports resource size/count **without ceilings**.
- Navigation and portfolio layers coexist with studio, asana library, flow, breathing, meditation, music, guardians and camera.
- The practice ritual V104 uses the existing practice clock rather than adding a separate timer.

## Architectural boundaries for phases 2–6

1. **Shell**: locale, theme, navigation, accessibility and contact/CV links. Must not own the practice clock.
2. **Domain**: immutable asana definitions, variants, constraints, sequencing and safety cues. Must be usable without the UI.
3. **Kinematics**: anatomical rig, joint constraints, support/ground contacts and pose interpolation. Rendering must not change movement semantics.
4. **Practice core**: one clock, session state machine, start/pause/resume/finish, breath and meditation timing.
5. **Presentation**: character skins, scenic effects, audio and studio controls. All optional; core must work without them.
6. **Verification**: deterministic tests for domain and state, browser E2E, screenshot/pose regression, reduced motion and keyboard access.

## Stabilization rules

- Treat `main` as production. Work in feature branches and merge only after tests and visual review.
- Preserve current HTML IDs and the event contracts until callers are inventoried. Do not delete historical layers solely because their filename includes an old version.
- Before removing a stylesheet, compare source cascade and compiled cascade; after removal, inspect hero, studio, guardians and both language modes at phone and desktop widths.
- Before removing a script, verify whether globals, DOM hooks, and callback initialization depend on it.
- Never treat passed unit tests as proof of anatomical correctness. Pose acceptance requires grounded diagrams and visible joint/weight-bearing tests.
- No new arbitrary numeric ceilings; collect bytes, request counts, long tasks, accessibility and interaction metrics and act on regressions with evidence.

## Release checklist for phase 1

- [x] Remove numeric resource ceilings in architecture audit.
- [x] Update corresponding regression test to validate telemetry.
- [ ] Run `npm run quality` against the branch in a checkout with Node >=24.
- [ ] Run `npm run build` and verify dist HTML and manifest.
- [ ] Run `npm run test:browser` after dependencies/browser installation.
- [ ] Capture desktop and mobile screenshots before merging.

Execution is still pending. No automated test result or deployed change is claimed here.


## Automated evidence now available

- `npm run audit:inventory`: ordered entrypoint inventory with SHA-256, byte size and page ownership.
- `npm run audit:coupling`: read-only heuristic map of literal global accesses, DOM element IDs, emitted/listened custom event strings, and event edges.
- Both are part of `npm run quality`; audit output is printed to CI logs and does not change deployed assets.
- To save a reproducible inventory locally, run `node tools/architecture-inventory.mjs --write` (writes `artifacts/architecture-inventory.json`).
- A heuristic event edge is *not* proof of exclusive ownership. Verify listeners, initialization order, dynamic references and browser behavior before relocating modules.

## Next code-migration checkpoints

1. Identify which globals are written by which file, and distinguish producers/consumers.
2. Introduce explicit adapters for the clock, pose data and rendering one boundary at a time.
3. Keep the existing public entrypoint contract until E2E and screenshot comparisons agree.
4. Validate actual Tadasana/Uttanasana joints and supports independently from studio skins.
