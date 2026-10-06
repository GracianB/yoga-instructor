(() => {
  "use strict";

  const PHASES = Object.freeze([
    { id: "start", label: "START", order: 0 },
    { id: "centering", label: "CENTERING", order: 1 },
    { id: "breath", label: "BREATH", order: 2 },
    { id: "warmup", label: "WARMUP", order: 3 },
    { id: "pose-1", label: "POSE", order: 4 },
    { id: "transition", label: "TRANSITION", order: 5 },
    { id: "pose-2", label: "POSE", order: 6 },
    { id: "cooldown", label: "COOLDOWN", order: 7 },
    { id: "savasana", label: "SAVASANA", order: 8 },
    { id: "finish", label: "FINISH", order: 9 }
  ]);

  const STATUS = Object.freeze({
    IDLE: "idle",
    RUNNING: "running",
    PAUSED: "paused",
    FINISHED: "finished"
  });

  class YogaFlowEngine {
    constructor(phases = PHASES) {
      if (!Array.isArray(phases) || phases.length !== 10) {
        throw new Error("YogaFlowEngine requires exactly 10 phases");
      }
      this.phases = Object.freeze(phases.map((phase) => Object.freeze({ ...phase })));
      this.index = 0;
      this.status = STATUS.IDLE;
      this.history = [];
    }

    get current() { return this.phases[this.index]; }
    get isFirst() { return this.index === 0; }
    get isLast() { return this.index === this.phases.length - 1; }

    snapshot() {
      return Object.freeze({
        index: this.index,
        total: this.phases.length,
        progress: this.index / (this.phases.length - 1),
        phase: this.current.id,
        label: this.current.label,
        status: this.status,
        previous: this.index > 0 ? this.phases[this.index - 1].id : null,
        next: this.index < this.phases.length - 1 ? this.phases[this.index + 1].id : null
      });
    }

    emit() {
      const snapshot = this.snapshot();
      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
        window.dispatchEvent(new CustomEvent("yoga:flow", { detail: snapshot }));
      }
      return snapshot;
    }

    record() {
      this.history.push(this.current.id);
      return this.history.length;
    }

    start() {
      this.index = 0;
      this.status = STATUS.RUNNING;
      this.history = [];
      this.record();
      return this.emit();
    }

    next() {
      if (this.status === STATUS.IDLE) return this.start();
      if (this.status === STATUS.PAUSED) return this.snapshot();
      if (this.isLast) {
        this.status = STATUS.FINISHED;
        return this.emit();
      }
      this.index += 1;
      this.status = this.isLast ? STATUS.FINISHED : STATUS.RUNNING;
      this.record();
      return this.emit();
    }

    previous() {
      if (this.index === 0) return this.snapshot();
      this.index -= 1;
      this.status = STATUS.RUNNING;
      this.record();
      return this.emit();
    }

    pause() {
      if (this.status === STATUS.RUNNING) {
        this.status = STATUS.PAUSED;
        return this.emit();
      }
      return this.snapshot();
    }

    resume() {
      if (this.status === STATUS.PAUSED) {
        this.status = STATUS.RUNNING;
        return this.emit();
      }
      return this.snapshot();
    }

    reset() {
      this.index = 0;
      this.status = STATUS.IDLE;
      this.history = [];
      return this.emit();
    }

    goTo(id) {
      const nextIndex = this.phases.findIndex((phase) => phase.id === id);
      if (nextIndex < 0) throw new Error(`Unknown yoga flow phase: ${id}`);
      this.index = nextIndex;
      this.status = this.isLast ? STATUS.FINISHED : STATUS.RUNNING;
      this.record();
      return this.emit();
    }
  }

  const api = Object.freeze({
    PHASES,
    STATUS,
    YogaFlowEngine,
    create() { return new YogaFlowEngine(); }
  });

  if (typeof window !== "undefined") window.YOGA_FLOW = api;
  if (typeof globalThis !== "undefined") globalThis.YOGA_FLOW = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
