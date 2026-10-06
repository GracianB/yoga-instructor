(() => {
  "use strict";

  class YogaPhaseClock {
    constructor(now = () => Date.now()) {
      this.now = now;
      this.startedAt = null;
      this.elapsedBeforeStart = 0;
      this.status = "idle";
    }

    get elapsed() {
      if (this.startedAt === null) return this.elapsedBeforeStart;
      return Math.max(0, this.elapsedBeforeStart + this.now() - this.startedAt);
    }

    snapshot() {
      return Object.freeze({
        elapsedMs: this.elapsed,
        elapsedSeconds: Math.floor(this.elapsed / 1000),
        status: this.status
      });
    }

    start() {
      this.startedAt = this.now();
      this.elapsedBeforeStart = 0;
      this.status = "running";
      return this.snapshot();
    }

    pause() {
      if (this.status === "running") {
        this.elapsedBeforeStart = this.elapsed;
        this.startedAt = null;
        this.status = "paused";
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

    reset() {
      this.startedAt = null;
      this.elapsedBeforeStart = 0;
      this.status = "idle";
      return this.snapshot();
    }
  }

  const api = Object.freeze({
    YogaPhaseClock,
    create() {
      return new YogaPhaseClock();
    }
  });

  if (typeof window !== "undefined") window.YOGA_PHASE = api;
  if (typeof globalThis !== "undefined") globalThis.YOGA_PHASE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();