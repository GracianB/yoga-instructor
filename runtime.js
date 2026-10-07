(() => {
  "use strict";
  const mediaMatches = (query) => {
    try { return typeof window.matchMedia === "function" && window.matchMedia(query).matches; }
    catch (_) { return false; }
  };
  const frame = (callback) => typeof window.requestAnimationFrame === "function"
    ? window.requestAnimationFrame(callback)
    : window.setTimeout(() => callback(performance.now()), 16);
  const cancel = (id) => typeof window.cancelAnimationFrame === "function"
    ? window.cancelAnimationFrame(id) : window.clearTimeout(id);
  window.YOGA_RUNTIME = Object.freeze({ mediaMatches, frame, cancel });
})();
