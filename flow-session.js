(() => {
  "use strict";

  const STATUS = Object.freeze({
    IDLE: "idle",
    RUNNING: "running",
    PAUSED: "paused",
    FINISHED: "finished"
  });

  class YogaSessionClock {
    constructor(now = () => Date.now()) {
      this.now = now;
      this.startedAt = null;
      this.pausedAt = null;
      this.pausedTotal = 0;
      this.elapsedBeforeStart = 0;
      this.status = STATUS.IDLE;
    }

    get elapsed() {
      if (this.startedAt === null) return this.elapsedBeforeStart;
      const end = this.status === STATUS.PAUSED && this.pausedAt !== null
        ? this.pausedAt
        : this.now();
      return Math.max(0, end - this.startedAt - this.pausedTotal);
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
      this.pausedAt = null;
      this.pausedTotal = 0;
      this.elapsedBeforeStart = 0;
      this.status = STATUS.RUNNING;
      return this.snapshot();
    }

    pause() {
      if (this.status === STATUS.RUNNING) {
        this.pausedAt = this.now();
        this.status = STATUS.PAUSED;
      }
      return this.snapshot();
    }

    resume() {
      if (this.status === STATUS.PAUSED) {
        this.pausedTotal += Math.max(0, this.now() - this.pausedAt);
        this.pausedAt = null;
        this.status = STATUS.RUNNING;
      }
      return this.snapshot();
    }

    finish() {
      if (this.status === STATUS.RUNNING) {
        this.elapsedBeforeStart = this.elapsed;
      } else if (this.status === STATUS.PAUSED) {
        this.elapsedBeforeStart = this.elapsed;
      }
      this.startedAt = null;
      this.pausedAt = null;
      this.pausedTotal = 0;
      this.status = STATUS.FINISHED;
      return this.snapshot();
    }

    reset() {
      this.startedAt = null;
      this.pausedAt = null;
      this.pausedTotal = 0;
      this.elapsedBeforeStart = 0;
      this.status = STATUS.IDLE;
      return this.snapshot();
    }
  }

  const api = Object.freeze({
    STATUS,
    YogaSessionClock,
    create() {
      return new YogaSessionClock();
    }
  });

  if (typeof window !== "undefined") window.YOGA_SESSION = api;
  if (typeof globalThis !== "undefined") globalThis.YOGA_SESSION = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();