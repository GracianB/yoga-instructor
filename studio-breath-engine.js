/* Yoga D.26 | One clock, three gentle breath pathways.
 * Pure mathematical model: no timers, storage, audio, forced breath holds or DOM.
 * Consumers pass the existing studio clock's monotonic elapsed milliseconds. */
(function (global) {
  "use strict";
  const PATTERNS = Object.freeze({
    soft: Object.freeze({ id: "soft", inhale: 3, exhale: 5 }),
    natural: Object.freeze({ id: "natural", inhale: 4, exhale: 6 }),
    free: Object.freeze({ id: "free", inhale: 0, exhale: 0 })
  });
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const smooth = t => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
  function frame(elapsedMs, id = "natural") {
    if (!Number.isFinite(elapsedMs) || elapsedMs < 0) throw new RangeError("elapsedMs must be non-negative and finite");
    const pattern = PATTERNS[id] || PATTERNS.natural;
    if (pattern.id === "free") return Object.freeze({
      id: pattern.id, phase: "free", phaseRemaining: 0, cycleSeconds: 0,
      expansion: 0.5, scale: 1, glow: 0.28
    });
    const total = pattern.inhale + pattern.exhale;
    const seconds = (elapsedMs / 1000) % total;
    const inhaling = seconds < pattern.inhale;
    const phase = inhaling ? "inhale" : "exhale";
    const fraction = inhaling ? seconds / pattern.inhale : (seconds - pattern.inhale) / pattern.exhale;
    // Derivative zero at endpoints, so switching phases never jolts the shape.
    const expansion = inhaling ? smooth(fraction) : 1 - smooth(fraction);
    return Object.freeze({
      id: pattern.id, phase,
      phaseRemaining: (inhaling ? pattern.inhale - seconds : total - seconds),
      cycleSeconds: total,
      expansion, scale: 0.89 + 0.18 * expansion,
      glow: 0.24 + 0.68 * expansion
    });
  }
  const api = Object.freeze({ PATTERNS, frame });
  if (global) global.YOGA_BREATH_D26 = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
