/* D18 Presence Studio · functional breath and meditation beside the D17 asana flow.
   No autoplay, no remote calls, no competing animation loop. */
(() => {
  "use strict";
  const root = document.getElementById("instructor-flow");
  const Clock = window.YOGA_STUDIO_CLOCK?.PracticeClock;
  if (!root || !Clock) return;

  const dragon = root.querySelector(".flow-console");
  const guided = root.querySelector("#studio-guided");
  const modes = [...root.querySelectorAll("[data-studio-mode]")];
  const minutes = [...root.querySelectorAll("[data-studio-duration-index]")];
  const primary = root.querySelector('[data-studio-action="primary"]');
  const reset = root.querySelector('[data-studio-action="reset"]');
  const status = root.querySelector("#studio-live-state");
  const heading = root.querySelector("#studio-guided-title");
  const cue = root.querySelector("#studio-guided-cue");
  const countdown = root.querySelector("#studio-guided-countdown");
  const progress = root.querySelector("#studio-guided-progress");
  const orb = root.querySelector(".studio-breath-orb");
  if (!dragon || !guided || !primary || !reset || !status || !heading || !cue || !countdown || !progress || !orb) return;

  const dict = {
    es: {
      overline: "TU ESPACIO · TRES CAMINOS", entranceTitle: "¿Qué necesita tu cuerpo hoy?",
      entranceLead: "Elige una práctica. Sin prisa, sin tener que demostrar nada.",
      asanas: "Movimiento", asanasDetail: "10 fases · dragón Yin / Yang",
      breath: "Respiración", breathDetail: "Un ritmo suave · 4 / 6",
      meditation: "Meditación", meditationDetail: "Silencio y atención",
      minutes: "DURACIÓN", ready: "PREPARADO", idle: "PREPARADO", running: "EN PRÁCTICA",
      paused: "EN PAUSA", finished: "COMPLETADA",
      begin: "Empezar", pause: "Pausar", resume: "Continuar",
      again: "Repetir", reset: "Reiniciar", 
      inhale: "Inhala suavemente", exhale: "Exhala sin esfuerzo",
      breathReady: "Encuentra tu propia respiración",
      breathCue: "Inspirar 4 segundos, espirar 6. Sin retenciones ni obligación de seguir el ritmo.",
      meditationReady: "Un momento solo para estar aquí",
      meditationCue: "Siéntate con comodidad. Observa la respiración y vuelve a ella cuando te distraigas.",
      meditationBegin: "Llega a este momento", meditationFocus: "Observa sin juzgar",
      meditationEnd: "Deja espacio al silencio",
      finishedTitle: "La práctica termina. La calma continúa.",
      finishedCue: "Puedes quedarte unos instantes, sin hacer nada más.",
      breathNote: "Un ritmo orientativo, no una prueba. Si notas incomodidad o mareo, vuelve a respirar de forma natural.",
      meditationNote: "Puedes mantener los ojos cerrados o la mirada suave. La quietud no exige ninguna postura perfecta.",
      liveRegion: "Estado de la práctica"
    },
    en: {
      overline: "YOUR SPACE · THREE PATHS", entranceTitle: "What does your body need today?",
      entranceLead: "Choose a practice. No hurry, nothing to prove.",
      asanas: "Movement", asanasDetail: "10 phases · Yin / Yang dragon",
      breath: "Breathing", breathDetail: "Gentle rhythm · 4 / 6",
      meditation: "Meditation", meditationDetail: "Silence and attention",
      minutes: "DURATION", ready: "READY", idle: "READY", running: "PRACTISING",
      paused: "PAUSED", finished: "COMPLETE",
      begin: "Begin", pause: "Pause", resume: "Resume",
      again: "Practice again", reset: "Reset",
      inhale: "Breathe in gently", exhale: "Breathe out easily",
      breathReady: "Find your natural breath",
      breathCue: "Breathe in for 4 seconds, out for 6. No breath holding and no pressure to follow the pace.",
      meditationReady: "A moment just to be here",
      meditationCue: "Sit comfortably. Notice your breathing and gently return whenever your mind wanders.",
      meditationBegin: "Arrive in this moment", meditationFocus: "Observe without judgement",
      meditationEnd: "Make room for silence",
      finishedTitle: "The practice ends. The calm stays.",
      finishedCue: "You can remain here for a few moments, with nothing more to do.",
      breathNote: "This rhythm is a suggestion, not a test. If you feel discomfort or dizziness, return to natural breathing.",
      meditationNote: "Close your eyes or soften your gaze. Stillness does not require a perfect posture.",
      liveRegion: "Practice status"
    }
  };
  const presets = Object.freeze({ breath: [3,5,8], meditation: [5,10,15] });
  const clock = new Clock(() => performance.now());
  let mode = "asanas";
  let durationIndex = 1;
  let asanaBusy = false;
  let ticker = null;
  const language = () => document.documentElement.lang === "en" ? "en" : "es";
  const copy = (key) => dict[language()][key] || key;
  const pad = (x) => String(x).padStart(2,"0");
  const format = (seconds) => pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
  const ease = (t) => t * t * (3 - 2 * t);
  const setText = (element, value) => { if (element.textContent !== value) element.textContent = value; };

  const stopTick = () => {
    if (ticker !== null) { clearInterval(ticker); ticker = null; }
  };
  const configuredDuration = () => presets[mode]?.[durationIndex] || 5;

  const syncLanguage = () => {
    root.querySelectorAll("[data-studio-copy]").forEach((element) => {
      setText(element, copy(element.dataset.studioCopy));
    });
    root.querySelector(".studio-modes")?.setAttribute("aria-label",
      language() === "en" ? "Choose practice type" : "Elige el tipo de práctica");
    status.setAttribute("aria-label", copy("liveRegion"));
    countdown.setAttribute("aria-label", language() === "en" ? "Remaining time" : "Tiempo restante");
    progress.parentElement?.setAttribute("aria-label", language() === "en" ? "Session progress" : "Progreso de la sesión");
    if (mode !== "asanas") render();
  };

  const lockChoices = () => {
    const guidedBusy = mode !== "asanas" && ["running","paused"].includes(clock.snapshot().status);
    const locked = asanaBusy || guidedBusy;
    modes.forEach((button) => {
      const selected = button.dataset.studioMode === mode;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-selected", selected);
      button.disabled = locked && !selected;
    });
  };

  const syncDurations = () => {
    minutes.forEach((button) => {
      const selected = Number(button.dataset.studioDurationIndex) === durationIndex;
      const value = presets[mode]?.[Number(button.dataset.studioDurationIndex)];
      setText(button, value + " min");
      button.setAttribute("aria-pressed", String(selected));
      button.disabled = clock.snapshot().status === "running" || clock.snapshot().status === "paused";
    });
  };

  const render = () => {
    if (mode === "asanas") return;
    const snapshot = clock.snapshot();
    const isBreathing = mode === "breath";
    const complete = snapshot.status === "finished";
    const waiting = snapshot.status === "idle";
    const elapsed = snapshot.elapsedMs;
    const cycle = (elapsed % 10000) / 1000;
    let titleKey = isBreathing ? "breathReady" : "meditationReady";
    let cueKey = isBreathing ? "breathCue" : "meditationCue";

    if (complete) {
      titleKey = "finishedTitle";
      cueKey = "finishedCue";
    } else if (!waiting && isBreathing) {
      titleKey = cycle < 4 ? "inhale" : "exhale";
    } else if (!waiting) {
      titleKey = snapshot.progress < .15 ? "meditationBegin" :
        snapshot.progress < .85 ? "meditationFocus" : "meditationEnd";
    }

    setText(heading, copy(titleKey));
    setText(cue, copy(cueKey));
    setText(status, copy(snapshot.status));
    guided.dataset.studioStatus = snapshot.status;
    orb.style.setProperty("--studio-breath-scale",
      isBreathing && snapshot.status !== "idle" && !complete
        ? String(cycle < 4 ? .87 + .20 * ease(cycle / 4) : 1.07 - .20 * ease((cycle - 4) / 6))
        : "1");
    countdown.textContent = format(Math.ceil(snapshot.remainingMs / 1000));
    progress.style.transform = "scaleX(" + snapshot.progress.toFixed(4) + ")";
    progress.parentElement?.setAttribute("aria-valuenow", String(Math.round(snapshot.progress * 100)));
    setText(root.querySelector("#studio-guided-note"), copy(isBreathing ? "breathNote" : "meditationNote"));
    setText(primary, copy(waiting ? "begin" : snapshot.status === "running" ? "pause" :
      snapshot.status === "paused" ? "resume" : "again"));
    primary.setAttribute("aria-pressed", String(snapshot.status === "running"));
    reset.disabled = waiting;
    syncDurations();
    lockChoices();
    if (complete) stopTick();
  };

  const select = (next) => {
    if (!["asanas","breath","meditation"].includes(next) || next === mode) return;
    if (asanaBusy || (mode !== "asanas" &&
        ["running","paused"].includes(clock.snapshot().status))) return;
    stopTick();
    mode = next;
    root.dataset.studioMode = mode;
    durationIndex = 1;
    dragon.hidden = mode !== "asanas";
    guided.hidden = mode === "asanas";
    if (mode !== "asanas") clock.reset(configuredDuration());
    lockChoices();
    if (mode !== "asanas") render();
  };

  // The original Flow listens for keyboard shortcuts on this same section.
  // Never let an invisible asana session start while a guided mode is active.
  root.addEventListener("keydown", (event) => {
    if (mode !== "asanas" && ["s","S","r","R","p","P","ArrowLeft","ArrowRight"].includes(event.key))
      event.stopImmediatePropagation();
  }, true);

  root.addEventListener("click", (event) => {
    const modeButton = event.target.closest("button[data-studio-mode]");
    if (modeButton && !modeButton.disabled) { select(modeButton.dataset.studioMode); return; }
    const durationButton = event.target.closest("[data-studio-duration-index]");
    if (durationButton && !durationButton.disabled && mode !== "asanas") {
      durationIndex = Number(durationButton.dataset.studioDurationIndex);
      clock.reset(configuredDuration());
      render();
      return;
    }
    const action = event.target.closest("[data-studio-action]");
    if (!action || action.disabled || mode === "asanas") return;
    if (action.dataset.studioAction === "reset") {
      stopTick();
      clock.reset(configuredDuration());
      render();
      return;
    }
    const current = clock.snapshot().status;
    if (current === "running") {
      clock.pause();
      stopTick();
    } else if (current === "paused") {
      clock.resume();
      ticker = setInterval(render, 200);
    } else {
      clock.start(configuredDuration());
      stopTick();
      ticker = setInterval(render, 200);
    }
    render();
  });

  window.addEventListener("yoga:flow", ({detail}) => {
    asanaBusy = ["running","paused"].includes(detail?.status);
    lockChoices();
  });
  const langObserver = new MutationObserver(syncLanguage);
  langObserver.observe(document.documentElement, {attributes:true,attributeFilter:["lang"]});
  window.addEventListener("pagehide", stopTick);
  window.addEventListener("pageshow", () => {
    if (mode !== "asanas" && clock.snapshot().status === "running" && ticker === null)
      ticker = setInterval(render, 200);
    if (mode !== "asanas") render();
  });
  syncLanguage();
  lockChoices();
})();
