# YOGA anatomy laboratory · Developer guide

This branch introduces a safe development surface for posture mechanics **without**
silently replacing the existing Yoga Instructor characters.

## Try it locally

From the repository root:

```bash
npm ci
npm run test:anatomy
npm start
```

Open **http://127.0.0.1:4185/anatomy-lab.html**.

To verify the built Pages artifact:

```bash
npm run build
npm run test:lab:browser
```

The browser test visits both `/anatomy-lab.html` and `/dist/anatomy-lab.html`.
The lab is intentionally not linked from the portfolio homepage. Its inclusion
in a PR build does **not** mean that a public preview or GitHub Pages deployment exists.

## Subsystem ownership

| Owner | Module | Guarantees / limits |
|---|---|---|
| Data | `asana-library.js` | Existing authored poses and bilingual text |
| Domain | `asana-domain.js` | Separately indexed, immutable lessons and SVG geometry |
| Legacy anatomy | `nila-kinematics-v84.js` | SVG path waypoints and contact assumptions |
| Diagnostics | `anatomy-diagnostics.js` | Joint angle and support diagnostics, read-only |
| Reference rig | `articulated-rig.js` | 16 joints, connections, illustrative standing/fold targets |
| Constraints | `rig-constraints.js` | Iterative segment-length correction, anchored ankles, residuals |
| Two-bone IK | `rig-ik.js` | Side-selectable knee/elbow bend, contact reach residuals |
| Motion | `rig-motion.js` | Smooth easing, deterministic frames, angle measurements |
| Lab UI | `anatomy-lab.js` | SVG body rendering, controls, overlays and error visualizations |
| Presentation | `anatomy-lab.css` | Scoped responsive layout independent of portfolio styles |
| Lab composition | `anatomy-lab.html` | Semantic structure and ordered script imports |

The public studio still renders using its original character pipeline. The
Asana Book now reads lesson projections for text and filters while the old
rendering function receives the original authored SVG geometry. This narrows
coupling without silently changing the published design.

## Contract and quality checklist

- User time and sequence progression are owned by the existing practice
  clock/flow. The lab playback clock is intentionally local to the lab page.
- The reference stance and fold are illustrative sketches, not verified 3D
  human joint positions.
- Anchors must not move, geometry must stay finite, and the solver must disclose
  residual segment-length errors.
- Browser smoke runs on Chromium, Firefox and WebKit, and on source and built
  artifacts. A smoke test does not establish aesthetic or anatomical quality.
- The lab has native buttons/range controls, keyboard support and explicit
  playback. It does not autoplay its animation.
- A segment-length error heatmap is a developer tool, **not an injury-risk
  warning**.

## Before integrating into live yoga illustrations

1. Define pose skeleton landmarks and rest lengths for each actual character.
2. Define explicit bend-plane preferences, IK for knee/elbow chains and joint
   range limits; resolve hips and foot contacts consistently.
3. Support continuous foot and hand contact, camera variations and side views.
4. Skin the skeleton with anatomy-informed volume, hands, feet, neck and face.
5. Validate Tadasana and Uttanasana against actual pose references in a
   visual review, including entry and exit movement.
6. Only then connect the new rig to the Asana Book or Studio behind a feature
   flag, with mobile, accessibility and browser regression tests.

This PR deliberately separates the experimental rig from the original
production characters until those gates are met.
