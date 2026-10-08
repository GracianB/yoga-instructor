/* D18 Practice Studio: deterministic elapsed-time clock; no background loops. */
(() => {
  "use strict";

  class PracticeClock {
    constructor(now = () => performance.now()) {
      this.now = now;
      this.durationMs = 300000;
      this.elapsedBefore = 0;
      this.startedAt = null;
      this.status = "idle";
    }

    reset(minutes = this.durationMs / 60000) {
      if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 90) {
        throw new RangeError("Practice duration must be between 0 and 90 minutes");
      }
      this.durationMs = Math.round(minutes * 60000);
      this.elapsedBefore = 0;
      this.startedAt = null;
      this.status = "idle";
      return this.snapshot();
    }

    start(minutes = this.durationMs / 60000) {
      this.reset(minutes);
      this.status = "running";
      this.startedAt = this.now();
      return this.snapshot();
    }

    pause() {
      if (this.status === "running") {
        this.elapsedBefore = Math.min(this.durationMs,
          this.elapsedBefore + Math.max(0, this.now() - this.startedAt));
        this.startedAt = null;
        this.status = this.elapsedBefore >= this.durationMs ? "finished" : "paused";
      }
      return this.snapshot();
    }

    resume() {
      if (this.status === "paused") {
        this.startedAt = this.now();
        this.status = "running";
      }
      return this.snapshot();
    }

    snapshot() {
      let elapsedMs = this.elapsedBefore;
      if (this.status === "running") {
        elapsedMs += Math.max(0, this.now() - this.startedAt);
        if (elapsedMs >= this.durationMs) {
          elapsedMs = this.durationMs;
          this.elapsedBefore = elapsedMs;
          this.startedAt = null;
          this.status = "finished";
        }
      }
      elapsedMs = Math.min(this.durationMs, elapsedMs);
      return Object.freeze({
        status: this.status,
        durationMs: this.durationMs,
        elapsedMs,
        remainingMs: Math.max(0, this.durationMs - elapsedMs),
        progress: this.durationMs ? elapsedMs / this.durationMs : 0
      });
    }
  }

  const api = Object.freeze({ PracticeClock, create: (now) => new PracticeClock(now) });
  if (typeof window !== "undefined") window.YOGA_STUDIO_CLOCK = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
