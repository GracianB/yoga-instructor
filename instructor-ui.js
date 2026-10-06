(() => {
  "use strict";

  const engineApi = typeof window !== "undefined" ? window.YOGA_FLOW : null;
  const sessionApi = typeof window !== "undefined" ? window.YOGA_SESSION : null;
  const phaseApi = typeof window !== "undefined" ? window.YOGA_PHASE : null;
  const root = document.getElementById("instructor-flow");
  if (!engineApi || !sessionApi || !phaseApi || !root) return;

  const engine = engineApi.create();
  const session = sessionApi.create();
  const phase = phaseApi.create();
  const sessionTime = document.getElementById("flow-session-time");
  const phaseTime = document.getElementById("flow-phase-time");
  const phaseLabel = document.getElementById("flow-phase-label");
  const phaseMeta = document.getElementById("flow-phase-meta");
  const state = document.getElementById("flow-state");
  const progress = document.getElementById("flow-progress-bar");
  const progressTrack = root.querySelector(".flow-progress");
  const consoleRoot = root.querySelector(".flow-console");
  const pauseButton = root.querySelector('[data-flow-action="pause"]');
  const actionButtons = [...root.querySelectorAll("[data-flow-action]")];

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

  const getLang = () => document.documentElement.lang === "en" ? "en" : "es";

  const isTypingContext = (target) => {
    if (!(target instanceof Element)) return false;
    return target.matches("input, textarea, select, [contenteditable='true']");
  };

  const updateAccessibility = (snapshot) => {
    const lang = getLang();
    const first = snapshot.index === 0;
    const last = snapshot.index === snapshot.total - 1;
    const paused = snapshot.status === "paused";
    const idle = snapshot.status === "idle";

    if (sessionTime) {
      sessionTime.setAttribute("aria-label", lang === "en" ? "Session time" : "Tiempo de sesión");
    }

    if (progressTrack) {
      progressTrack.setAttribute("role", "progressbar");
      progressTrack.setAttribute("aria-valuemin", "1");
      progressTrack.setAttribute("aria-valuemax", String(snapshot.total));
      progressTrack.setAttribute("aria-valuenow", String(snapshot.index + 1));
      progressTrack.setAttribute(
        "aria-valuetext",
        lang === "en"
          ? `Phase ${snapshot.index + 1} of ${snapshot.total}: ${snapshot.label}`
          : `Fase ${snapshot.index + 1} de ${snapshot.total}: ${snapshot.label}`
      );
    }

    actionButtons.forEach((button) => {
      const action = button.dataset.flowAction;
      const disabled =
        (action === "previous" && first) ||
        (action === "next" && last) ||
        (action === "pause" && (idle || last));

      button.disabled = disabled;
      button.setAttribute("aria-disabled", String(disabled));
    });

    if (pauseButton) {
      const label = paused
        ? (lang === "en" ? "Resume practice" : "Continuar práctica")
        : (lang === "en" ? "Pause practice" : "Pausar práctica");
      pauseButton.setAttribute("aria-label", label);
      pauseButton.setAttribute("aria-pressed", String(paused));
      pauseButton.setAttribute("aria-keyshortcuts", "P");
    }

    const previous = root.querySelector('[data-flow-action="previous"]');
    const next = root.querySelector('[data-flow-action="next"]');
    const start = root.querySelector('[data-flow-action="start"]');
    const reset = root.querySelector('[data-flow-action="reset"]');

    if (previous) previous.setAttribute("aria-keyshortcuts", "ArrowLeft");
    if (next) next.setAttribute("aria-keyshortcuts", "ArrowRight");
    if (start) start.setAttribute("aria-keyshortcuts", "S");
    if (reset) reset.setAttribute("aria-keyshortcuts", "R");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  const renderSession = () => {
    if (sessionTime) sessionTime.textContent = formatTime(session.snapshot().elapsedSeconds);
    if (phaseTime) phaseTime.textContent = formatTime(phase.snapshot().elapsedSeconds);
  };

  let lastPhase = engine.snapshot().phase;

  const syncPhaseClock = (snapshot) => {
    if (snapshot.phase !== lastPhase) {
      if (snapshot.status === "running") {
        phase.reset();
        phase.start();
      } else {
        phase.reset();
      }
      lastPhase = snapshot.phase;
    }

    if (snapshot.status === "finished") phase.reset();
  };

  const render = (snapshot) => {
    const lang = getLang();
    const copy = labels[lang][snapshot.phase] || snapshot.label;
    if (phaseLabel) phaseLabel.textContent = copy;
    if (phaseMeta) phaseMeta.textContent = `${snapshot.index + 1} / ${snapshot.total}`;
    if (state) state.textContent = stateLabels[lang][snapshot.status] || snapshot.status.toUpperCase();
    if (progress) progress.style.transform = `scaleX(${snapshot.progress})`;
    if (consoleRoot) consoleRoot.dataset.flowStatus = snapshot.status;
    if (pauseButton) {
      pauseButton.textContent = snapshot.status === "paused"
        ? (lang === "en" ? "Resume" : "Continuar")
        : (lang === "en" ? "Pause" : "Pausa");
    }
    updateAccessibility(snapshot);
  };

  const actions = {
    start: () => { engine.start(); session.start(); phase.start(); renderSession(); },
    previous: () => engine.previous(),
    pause: () => {
      if (engine.status === "paused") { engine.resume(); session.resume(); }
      else { engine.pause(); session.pause(); }
      renderSession();
    },
    next: () => {
      if (engine.status === "idle") { engine.start(); session.start(); phase.start(); }
      engine.next();
    },
    reset: () => { engine.reset(); session.reset(); phase.reset(); renderSession(); }
  };

  const runAction = (name) => {
    const button = root.querySelector(`[data-flow-action="${name}"]`);
    if (button && !button.disabled && actions[name]) actions[name]();
  };

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-flow-action]");
    if (!button || button.disabled) return;
    const action = actions[button.dataset.flowAction];
    if (action) action();
  });

  root.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || isTypingContext(event.target)) return;

    const key = event.key;
    const shortcut = key.length === 1 ? key.toLowerCase() : key;

    const shortcuts = {
      ArrowLeft: "previous",
      ArrowRight: "next",
      p: "pause",
      s: "start",
      r: "reset"
    };

    const action = shortcuts[shortcut];
    if (!action) return;

    event.preventDefault();
    runAction(action);
  });

  window.addEventListener("yoga:flow", (event) => {
    const snapshot = event.detail;
    render(snapshot);
    syncPhaseClock(snapshot);
    if (snapshot.status === "finished") session.finish();
    renderSession();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-set-lang]")) {
      requestAnimationFrame(() => render(engine.snapshot()));
    }
  });

  render(engine.snapshot());
  renderSession();
  window.setInterval(renderSession, 1000);
})();