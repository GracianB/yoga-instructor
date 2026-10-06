(() => {
  "use strict";

  const engineApi = typeof window !== "undefined" ? window.YOGA_FLOW : null;
  const root = document.getElementById("instructor-flow");
  if (!engineApi || !root) return;

  const engine = engineApi.create();
  const phaseLabel = document.getElementById("flow-phase-label");
  const phaseMeta = document.getElementById("flow-phase-meta");
  const state = document.getElementById("flow-state");
  const progress = document.getElementById("flow-progress-bar");
  const consoleRoot = root.querySelector(".flow-console");
  const pauseButton = root.querySelector('[data-flow-action="pause"]');

  const labels = {
    es: {
      start: "INICIO",
      centering: "CENTRADO",
      breath: "RESPIRACIÓN",
      warmup: "CALENTAMIENTO",
      "pose-1": "ASANA",
      transition: "TRANSICIÓN",
      "pose-2": "ASANA",
      cooldown: "VUELTA A LA CALMA",
      savasana: "SAVASANA",
      finish: "CIERRE"
    },
    en: {
      start: "START",
      centering: "CENTERING",
      breath: "BREATH",
      warmup: "WARMUP",
      "pose-1": "POSE",
      transition: "TRANSITION",
      "pose-2": "POSE",
      cooldown: "COOLDOWN",
      savasana: "SAVASANA",
      finish: "FINISH"
    }
  };

  const stateLabels = {
    es: { idle: "EN ESPERA", running: "EN PRÁCTICA", paused: "EN PAUSA", finished: "COMPLETADA" },
    en: { idle: "IDLE", running: "PRACTICE", paused: "PAUSED", finished: "FINISHED" }
  };

  const render = (snapshot) => {
    const lang = document.documentElement.lang === "en" ? "en" : "es";
    const copy = labels[lang][snapshot.phase] || snapshot.label;
    if (phaseLabel) phaseLabel.textContent = copy;
    if (phaseMeta) phaseMeta.textContent = `${snapshot.index + 1} / ${snapshot.total}`;
    if (state) state.textContent = stateLabels[lang][snapshot.status] || snapshot.status.toUpperCase();
    if (progress) progress.style.transform = `scaleX(${snapshot.progress})`;
    if (consoleRoot) consoleRoot.dataset.flowStatus = snapshot.status;
    if (pauseButton) pauseButton.textContent = snapshot.status === "paused"
      ? (lang === "en" ? "Resume" : "Continuar")
      : (lang === "en" ? "Pause" : "Pausa");
  };

  const actions = {
    start: () => engine.start(),
    previous: () => engine.previous(),
    pause: () => engine.status === "paused" ? engine.resume() : engine.pause(),
    next: () => engine.next(),
    reset: () => engine.reset()
  };

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-flow-action]");
    if (!button) return;
    const action = actions[button.dataset.flowAction];
    if (action) action();
  });

  window.addEventListener("yoga:flow", (event) => render(event.detail));
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-set-lang]")) {
      requestAnimationFrame(() => render(engine.snapshot()));
    }
  });

  render(engine.snapshot());
})();
