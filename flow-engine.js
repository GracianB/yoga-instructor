(() => {
  "use strict";

  const PHASES = Object.freeze([
    { id: "start", label: "START", order: 0, durationSeconds: 30, cue: "Llegar y preparar la práctica." },
    { id: "centering", label: "CENTERING", order: 1, durationSeconds: 60, cue: "Encontrar estabilidad y atención." },
    { id: "breath", label: "BREATH", order: 2, durationSeconds: 90, cue: "Regular la respiración sin forzar." },
    { id: "warmup", label: "WARMUP", order: 3, durationSeconds: 120, cue: "Movilizar el cuerpo de forma progresiva." },
    { id: "pose-1", label: "POSE", order: 4, durationSeconds: 180, cue: "Sostener la postura con respiración estable." },
    { id: "transition", label: "TRANSITION", order: 5, durationSeconds: 45, cue: "Cambiar de forma con control y sin prisa." },
    { id: "pose-2", label: "POSE", order: 6, durationSeconds: 180, cue: "Integrar fuerza, movilidad y atención." },
    { id: "cooldown", label: "COOLDOWN", order: 7, durationSeconds: 90, cue: "Reducir intensidad y dejar espacio a la respiración." },
    { id: "savasana", label: "SAVASANA", order: 8, durationSeconds: 180, cue: "Soltar el esfuerzo y permanecer quieto." },
    { id: "finish", label: "FINISH", order: 9, durationSeconds: 30, cue: "Cerrar la práctica sin romper la atención." }
  ].map((phase) => Object.freeze(phase)));

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
        durationSeconds: this.current.durationSeconds,
        cue: this.current.cue,
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
      if (this.isLast || this.status === STATUS.FINISHED) {
        return this.snapshot();
      }
      this.index += 1;
      this.status = this.isLast ? STATUS.FINISHED : STATUS.RUNNING;
      this.record();
      return this.emit();
    }

    previous() {
      if (this.index === 0 || this.status === STATUS.FINISHED) return this.snapshot();
      const wasPaused = this.status === STATUS.PAUSED;
      this.index -= 1;
      this.status = wasPaused ? STATUS.PAUSED : STATUS.RUNNING;
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
      const wasPaused = this.status === STATUS.PAUSED;
      this.index = nextIndex;
      this.status = this.isLast ? STATUS.FINISHED : (wasPaused ? STATUS.PAUSED : STATUS.RUNNING);
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
