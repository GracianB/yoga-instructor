/* D18 adapter: public clock contract backed by isolated time calculations. */
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
      const core = typeof window !== "undefined" ? window.YOGA_TIME_CORE : require("./practice-time-core.js");
      let elapsedMs = this.status === "running"
        ? core.elapsed(this.elapsedBefore, this.startedAt, this.now(), this.durationMs)
        : this.elapsedBefore;
      if (this.status === "running") {
        if (elapsedMs >= this.durationMs) {
          elapsedMs = this.durationMs;
          this.elapsedBefore = elapsedMs;
          this.startedAt = null;
          this.status = "finished";
        }
      }
      elapsedMs = Math.min(this.durationMs, elapsedMs);
      return core.frame(this.status, this.durationMs, elapsedMs);
    }
  }

  const api = Object.freeze({ PracticeClock, create: (now) => new PracticeClock(now) });
  if (typeof window !== "undefined") window.YOGA_STUDIO_CLOCK = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
