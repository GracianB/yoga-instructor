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
  const phaseProgress = document.getElementById("flow-phase-progress-bar");
  const phaseCue = document.getElementById("flow-phase-cue");
  const phaseTarget = document.getElementById("flow-phase-target");
  const phaseLabel = document.getElementById("flow-phase-label");
  const phaseMeta = document.getElementById("flow-phase-meta");
  const state = document.getElementById("flow-state");
  const progress = document.getElementById("flow-progress-bar");
  const progressTrack = root.querySelector(".flow-progress");
  const consoleRoot = root.querySelector(".flow-console");
  const pauseButton = root.querySelector('[data-flow-action="pause"]');
  const actionButtons = [...root.querySelectorAll("[data-flow-action]")];
  let poseLocked = true; // prevents leaving a pose before its crossfade settles

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
          ? `Phase ${snapshot.index + 1} of ${snapshot.total}: ${labels[lang][snapshot.phase] || snapshot.label}`
          : `Fase ${snapshot.index + 1} de ${snapshot.total}: ${labels[lang][snapshot.phase] || snapshot.label}`
      );
    }

    actionButtons.forEach((button) => {
      const action = button.dataset.flowAction;
      // One unmistakable first step: only Start or the optional preview can
      // create a session. Side arrows never double as a second Start control.
      const disabled =
        (action === "previous" && (idle || first || last || paused)) ||
        (action === "next" && (idle || last || paused)) ||
        (action === "pause" && (idle || last)) ||
        (action === "reset" && idle) ||
        (action === "start" && !(idle || snapshot.status === "finished")) ||
        (action === "preview" && !idle) ||
        (poseLocked && ["start", "preview", "previous", "next"].includes(action));

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

    if (previous) {
      previous.setAttribute("aria-keyshortcuts", "ArrowLeft");
      previous.setAttribute("aria-label",lang==="en"?"Previous pose":"Postura anterior");
    }
    if (next) {
      next.setAttribute("aria-keyshortcuts", "ArrowRight");
      next.setAttribute("aria-label",lang==="en"?"Next pose":"Postura siguiente");
    }
    if (start) start.setAttribute("aria-keyshortcuts", "S");
    if (reset) reset.setAttribute("aria-keyshortcuts", "R");
  };

  let preview = false;
  const setPreview = value => { preview = value; window.dispatchEvent(new CustomEvent("yoga:preview", { detail: value })); };
  // D25: one deterministic schedule, shared with the original phase clock.
  // The five-second quick tour and D20 default pacing remain unchanged.
  let planKey = "", plannedDurations = null;
  const designSettings = () => ({
    level: root.dataset.sessionLevel || "steady",
    length: root.dataset.sessionLength || "auto",
    recovery: root.dataset.sessionRecovery === "true",
    pace: root.dataset.studioPace || "balanced"
  });
  const durationFor = snapshot => {
    if (preview) return 5;
    const designer = window.YOGA_SESSION_DESIGN;
    if (!designer) return window.YOGA_STUDIO_PLANS?.duration(snapshot.durationSeconds,root.dataset.studioPace||"balanced") ?? (snapshot.durationSeconds||0);
    const options = designSettings(), key = [options.level,options.length,options.recovery,options.pace].join(":");
    if (key !== planKey) {
      plannedDurations = designer.build(window.YOGA_FLOW.PHASES,options).durations;
      planKey = key;
    }
    return plannedDurations?.[snapshot.phase] ?? snapshot.durationSeconds;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  const renderSession = () => {
    if (sessionTime) sessionTime.textContent = formatTime(session.snapshot().elapsedSeconds);
    if (phaseTime) {
      const snapshot = engine.snapshot();
      const elapsed = phase.snapshot().elapsedSeconds;
      const duration = durationFor(snapshot);
      const remaining = Math.max(0, duration - elapsed);
      const lang = getLang();
      const cues = { start: "Arrive and prepare for practice.", centering: "Find stability and attention.", breath: "Regulate your breathing without forcing.", warmup: "Mobilise your body progressively.", "pose-1": "Hold the pose with steady breathing.", transition: "Transition with control and without rushing.", "pose-2": "Integrate strength, mobility and attention.", cooldown: "Reduce intensity and leave room for breathing.", savasana: "Release effort and remain still.", finish: "Close the practice with attention." };
      if (phaseCue) {
        const adapted = window.YOGA_SESSION_DESIGN?.cue(snapshot.phase,lang,designSettings());
        phaseCue.textContent = adapted || (lang === "en" ? cues[snapshot.phase] : snapshot.cue || "");
      }
      if (phaseTarget) phaseTarget.textContent = formatTime(duration);
      phaseTime.textContent = formatTime(remaining);
      phaseTime.setAttribute("aria-label", lang === "en" ? `Phase time remaining: ${formatTime(remaining)}. Target: ${formatTime(duration)}` : `Tiempo restante de fase: ${formatTime(remaining)}. Objetivo: ${formatTime(duration)}`);
      if (phaseProgress) phaseProgress.style.transform = `scaleX(${duration ? Math.min(1, elapsed / duration) : 0})`;
    }
  };

  let lastPhase = engine.snapshot().phase;

  const syncPhaseClock = (snapshot) => {
    if (snapshot.phase !== lastPhase) {
      phase.reset();
      if (snapshot.status === "running") {
        phase.start();
      } else if (snapshot.status === "paused") {
        phase.start();
        phase.pause();
      }
      lastPhase = snapshot.phase;
    }

    if (snapshot.status === "finished") {
      phase.reset();
      lastPhase = snapshot.phase;
    }
  };

  const render = (snapshot) => {
    const lang = getLang();
    const copy = labels[lang][snapshot.phase] || snapshot.label;
    if (phaseLabel) phaseLabel.textContent = copy;
    if (phaseMeta) phaseMeta.textContent = `${snapshot.index + 1} / ${snapshot.total}`;
    if (state) state.textContent = stateLabels[lang][snapshot.status] || snapshot.status.toUpperCase();
    if (progress) progress.style.transform = `scaleX(${snapshot.progress})`;
    if (consoleRoot) consoleRoot.dataset.flowStatus = snapshot.status;
    const startButton = root.querySelector('[data-flow-action="start"]');
    if (startButton) {
      startButton.textContent = snapshot.status === "finished"
        ? (lang === "en" ? "Practice again" : "Repetir práctica")
        : (lang === "en" ? "Begin practice" : "Empezar práctica");
    }
    if (pauseButton) {
      pauseButton.textContent = snapshot.status === "paused"
        ? (lang === "en" ? "Resume" : "Continuar")
        : (lang === "en" ? "Pause" : "Pausa");
    }
    const resetButton = root.querySelector('[data-flow-action="reset"]');
    if (resetButton) {
      const finished = snapshot.status === "finished";
      const resetLabel = finished
        ? (lang === "en" ? "Return to start" : "Volver al inicio")
        : (lang === "en" ? "Reset" : "Reiniciar");
      resetButton.textContent = resetLabel;
      resetButton.setAttribute("aria-label", resetLabel);
    }
    updateAccessibility(snapshot);
  };

  const actions = {
    preview: () => { setPreview(true); session.start(); phase.start(); engine.start(); renderSession(); },
    start: () => { session.start(); phase.start(); engine.start(); setPreview(false); renderSession(); },
    previous: () => engine.previous(),
    pause: () => {
      if (engine.status === "paused") { session.resume(); phase.resume(); engine.resume(); }
      else { session.pause(); phase.pause(); engine.pause(); }
      renderSession();
    },
    next: () => {
      if (poseLocked || engine.status === "idle" || engine.status === "paused") return;
      engine.next();
    },
    reset: () => { session.reset(); phase.reset(); engine.reset(); setPreview(false); renderSession(); }
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

  window.addEventListener("yoga:studio-plan", () => renderSession());
  window.addEventListener("yoga:session-design", () => renderSession());

  window.addEventListener("yoga:flow", (event) => {
    const snapshot = event.detail;
    syncPhaseClock(snapshot);
    if (snapshot.status === "finished") session.finish();
    render(snapshot);
    renderSession();
  });

  window.addEventListener("yoga:pose-changing", () => {
    poseLocked = true;
    updateAccessibility(engine.snapshot());
  });
  window.addEventListener("yoga:pose-ready", () => {
    poseLocked = false;
    updateAccessibility(engine.snapshot());
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-set-lang]")) {
      window.YOGA_RUNTIME.frame(() => { render(engine.snapshot()); renderSession(); });
    }
  });

  // Guide and controls are two deferred modules. The first pose-ready event
  // can occur before this listener is registered: resynchronise once from
  // the actual DOM state so Next is never stranded disabled after Start.
  const guideReady=document.getElementById("flow-guide");
  poseLocked=!guideReady || guideReady.dataset.ready!=="true";
  render(engine.snapshot());
  renderSession();
  window.setInterval(() => {
    renderSession();
    const snapshot = engine.snapshot();
    if (!poseLocked && snapshot.status === "running" && snapshot.durationSeconds > 0 && phase.snapshot().elapsedSeconds >= durationFor(snapshot)) engine.next();
  }, 250);
})();