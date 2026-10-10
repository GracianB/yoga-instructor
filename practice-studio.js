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
  const Breath = window.YOGA_BREATH_D26;
  const Meditation = window.YOGA_MEDITATION_D27;
  const Sculpt = window.YOGA_ANATOMY_D28;
  const immersionButton = root.querySelector('[data-studio-action="immersion"]');
  const meditationChoices = root.querySelector(".studio-meditation-choices");
  const meditationFocusChoices = root.querySelector(".studio-meditation-focus");
  const meditationFocusButtons = [...root.querySelectorAll("button[data-meditation-focus]")];
  const breathPhaseDetail = root.querySelector("#studio-breath-phase-detail");
  const meditationButtons = [...root.querySelectorAll("button[data-meditation-style]")];
  const breathButtons = [...root.querySelectorAll("[data-breath-pattern]")];
  const breathChoices = root.querySelector(".studio-breath-patterns");
  if (!dragon || !guided || !primary || !reset || !status || !heading || !cue || !countdown || !progress || !orb || !Breath || !breathChoices || breathButtons.length !== 3 || !Meditation || !Sculpt || !immersionButton || !meditationChoices || meditationButtons.length !== 2 || !meditationFocusChoices || meditationFocusButtons.length !== 3 || !breathPhaseDetail) return;

  const dict = {
    es: {
      overline: "TU ESPACIO · TRES CAMINOS", entranceTitle: "¿Qué necesita tu cuerpo hoy?",
      entranceLead: "Elige una práctica. Sin prisa, sin tener que demostrar nada.",
      asanas: "Movimiento", asanasDetail: "Nila · 10 posturas Yin/Yang",
      breath: "Respiración", breathDetail: "Dragón sereno · a tu ritmo",
      meditation: "Meditación", meditationDetail: "Uma · guardiana lunar",
      minutes: "DURACIÓN", ready: "PREPARADO", idle: "PREPARADO", running: "EN PRÁCTICA",
      paused: "EN PAUSA", finished: "COMPLETADA",
      begin: "Empezar", pause: "Pausar", resume: "Continuar",
      again: "Repetir", reset: "Reiniciar", 
      inhale: "Inhala suavemente", exhale: "Exhala sin esfuerzo",
      patternLabel: "RITMO", softPattern: "Suave · 3/5", naturalPattern: "Natural · 4/6", freePattern: "Libre",
      breathFree: "Respira a tu ritmo", breathFreeCue: "Sin cuenta ni cadencia. El dragón descansa contigo.",
      breathSoftCue: "Inspira 3, espira 5. Es orientativo: no fuerces ni retengas el aire.",
      breathFreeNote: "Sin ritmo impuesto. Respira naturalmente y descansa cuando quieras.",
      breathingFreeLabel: "Sin cuenta", breathingReadyLabel: "A tu ritmo",
      breathReady: "Encuentra tu propia respiración",
      breathCue: "Inspirar 4 segundos, espirar 6. Sin retenciones ni obligación de seguir el ritmo.",
      meditationReady: "Un momento solo para estar aquí",
      meditationCue: "Siéntate con comodidad. Observa la respiración y vuelve a ella cuando te distraigas.",
      meditationBegin: "Llega a este momento", meditationFocus: "Observa sin juzgar",
      meditationEnd: "Deja espacio al silencio",
      meditationStyleLabel: "GUÍA", meditationGuided: "Acompañada", meditationSilent: "En silencio",
      meditationFocusLabel: "ENFOQUE", focusBreath: "Respiración", focusBody: "Cuerpo", focusSpace: "Entorno",
      meditationBodyCue: "Observa la mandíbula, los hombros, el pecho y los pies. Suelta lo que puedas.",
      meditationSpaceCue: "Percibe los sonidos y el espacio alrededor, sin necesidad de cambiar nada.",
      meditationFree: "Aquí y ahora", meditationFreeCue: "Practica a tu manera. Sin mensajes ni cambios de ritmo.",
      meditationBeginCue: "Busca una postura cómoda. Deja que el cuerpo llegue.",
      meditationFocusCue: "Observa los pensamientos. Vuelve con suavidad al presente.",
      meditationEndCue: "Percibe el espacio y abre la mirada cuando lo necesites.",
      finishedTitle: "La práctica termina. La calma continúa.",
      finishedCue: "Puedes quedarte unos instantes, sin hacer nada más.",
      breathNote: "Un ritmo orientativo, no una prueba. Si notas incomodidad o mareo, vuelve a respirar de forma natural.",
      meditationNote: "Puedes mantener los ojos cerrados o la mirada suave. La quietud no exige ninguna postura perfecta.",
      enterImmersion: "Concentración", exitImmersion: "Mostrar opciones",
      immersionA11yOn: "Activar vista de concentración", immersionA11yOff: "Mostrar todas las opciones",
      liveRegion: "Estado de la práctica"
    },
    en: {
      overline: "YOUR SPACE · THREE PATHS", entranceTitle: "What does your body need today?",
      entranceLead: "Choose a practice. No hurry, nothing to prove.",
      asanas: "Movement", asanasDetail: "Nila · 10 Yin/Yang poses",
      breath: "Breathing", breathDetail: "Calm dragon · at your pace",
      meditation: "Meditation", meditationDetail: "Uma · lunar guardian",
      minutes: "DURATION", ready: "READY", idle: "READY", running: "PRACTISING",
      paused: "PAUSED", finished: "COMPLETE",
      begin: "Begin", pause: "Pause", resume: "Resume",
      again: "Practice again", reset: "Reset",
      inhale: "Breathe in gently", exhale: "Breathe out easily",
      patternLabel: "PACE", softPattern: "Gentle · 3/5", naturalPattern: "Natural · 4/6", freePattern: "Free",
      breathFree: "Breathe in your own time", breathFreeCue: "No counting, no imposed pace. Rest with the dragon.",
      breathSoftCue: "Breathe in for 3, out for 5. Optional guidance: never strain or hold.",
      breathFreeNote: "No imposed pace. Breathe naturally and rest whenever you need.",
      breathingFreeLabel: "Unpaced", breathingReadyLabel: "Your pace",
      breathReady: "Find your natural breath",
      breathCue: "Breathe in for 4 seconds, out for 6. No breath holding and no pressure to follow the pace.",
      meditationReady: "A moment just to be here",
      meditationCue: "Sit comfortably. Notice your breathing and gently return whenever your mind wanders.",
      meditationBegin: "Arrive in this moment", meditationFocus: "Observe without judgement",
      meditationEnd: "Make room for silence",
      meditationStyleLabel: "GUIDANCE", meditationGuided: "Guided", meditationSilent: "Silent",
      meditationFocusLabel: "FOCUS", focusBreath: "Breath", focusBody: "Body", focusSpace: "Surroundings",
      meditationBodyCue: "Notice your jaw, shoulders, chest and feet. Soften wherever you can.",
      meditationSpaceCue: "Notice nearby sounds and the space around you, without changing anything.",
      meditationFree: "Here and now", meditationFreeCue: "Practise your way. No changing messages or imposed rhythm.",
      meditationBeginCue: "Settle into a comfortable position. Let your body arrive.",
      meditationFocusCue: "Notice thoughts. Return gently to the present.",
      meditationEndCue: "Sense the space. Open your gaze whenever you're ready.",
      finishedTitle: "The practice ends. The calm stays.",
      finishedCue: "You can remain here for a few moments, with nothing more to do.",
      breathNote: "This rhythm is a suggestion, not a test. If you feel discomfort or dizziness, return to natural breathing.",
      meditationNote: "Close your eyes or soften your gaze. Stillness does not require a perfect posture.",
      enterImmersion: "Focus view", exitImmersion: "Show options",
      immersionA11yOn: "Enable focus view", immersionA11yOff: "Show all practice options",
      liveRegion: "Practice status"
    }
  };
  const presets = Object.freeze({ breath: [3,5,8], meditation: [5,10,15] });
  const clock = new Clock(() => performance.now());
  let mode = "asanas";
  let durationIndex = 1;
  let breathPattern = "natural";
  let meditationStyle = "guided";
  let meditationFocus = "breath";
  let immersive = false;
  let asanaBusy = false;
  let ticker = null;
  const language = () => document.documentElement.lang === "en" ? "en" : "es";
  const copy = (key) => dict[language()][key] || key;
  const pad = (x) => String(x).padStart(2,"0");
  const format = (seconds) => pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
  const setText = (element, value) => { if (element && element.textContent !== value) element.textContent = value; };
  // Status changes must not force an expensive SVG pose update on every tick.
  const setData = (element, key, value) => {
    if (element.dataset[key] !== value) element.dataset[key] = value;
  };
  const setVar = (element, key, value) => {
    if (element.style.getPropertyValue(key) !== value) element.style.setProperty(key, value);
  };

  const stopTick = () => {
    if (ticker !== null) { clearInterval(ticker); ticker = null; }
  };
  const tick = () => {
    if (document.hidden) { stopTick(); return; }
    render();
  };
  const startTick = () => {
    stopTick();
    if (!document.hidden) ticker = setInterval(tick, 200);
  };
  const configuredDuration = () => presets[mode]?.[durationIndex] || 5;
  const setImmersive = (value) => {
    immersive = Boolean(value) && mode !== "asanas";
    setData(guided, "studioImmersion", String(immersive));
    immersionButton.setAttribute("aria-pressed", String(immersive));
    setText(immersionButton, copy(immersive ? "exitImmersion" : "enterImmersion"));
    immersionButton.setAttribute("aria-label", copy(immersive ? "immersionA11yOff" : "immersionA11yOn"));
  };

  const syncLanguage = () => {
    root.querySelectorAll("[data-studio-copy]").forEach((element) => {
      setText(element, copy(element.dataset.studioCopy));
    });
    root.querySelector(".studio-modes")?.setAttribute("aria-label",
      language() === "en" ? "Choose practice type" : "Elige el tipo de práctica");
    breathChoices.setAttribute("aria-label", language() === "en" ? "Breathing pace" : "Ritmo de respiración");
    meditationChoices.setAttribute("aria-label", language() === "en" ? "Meditation style" : "Tipo de meditación");
    meditationFocusChoices.setAttribute("aria-label", language() === "en" ? "Meditation focus" : "Punto de atención");
    status.setAttribute("aria-label", copy("liveRegion"));
    countdown.setAttribute("aria-label", language() === "en" ? "Remaining time" : "Tiempo restante");
    progress.parentElement?.setAttribute("aria-label", language() === "en" ? "Session progress" : "Progreso de la sesión");
    setImmersive(immersive);
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

  const syncBreathButtons = () => {
    breathChoices.hidden = mode !== "breath";
    const busy = ["running", "paused"].includes(clock.snapshot().status);
    breathButtons.forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.breathPattern === breathPattern));
      button.disabled = busy;
    });
    guided.dataset.breathPattern = breathPattern;
  };

  const syncMeditationButtons = () => {
    meditationChoices.hidden = mode !== "meditation";
    const busy = ["running", "paused"].includes(clock.snapshot().status);
    meditationButtons.forEach(button => {
      button.disabled = busy;
      button.setAttribute("aria-pressed", String(button.dataset.meditationStyle === meditationStyle));
    });
    guided.dataset.meditationStyle = meditationStyle;
  };

  const syncFocusButtons = () => {
    meditationFocusChoices.hidden = mode !== "meditation" || meditationStyle !== "guided";
    const busy = ["running", "paused"].includes(clock.snapshot().status);
    meditationFocusButtons.forEach(button => {
      button.disabled = busy;
      button.setAttribute("aria-pressed", String(button.dataset.meditationFocus === meditationFocus));
    });
    guided.dataset.meditationFocus = meditationFocus;
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
    const breathing = Breath.frame(elapsed, breathPattern);
    const activeBreath = isBreathing && !waiting && !complete && breathing.phase !== "free";
    const shape = Sculpt.sculpt(breathing, activeBreath);
    let titleKey = isBreathing ? "breathReady" : "meditationReady";
    let cueKey = isBreathing ? "breathCue" : "meditationCue";

    if (complete) {
      titleKey = "finishedTitle";
      cueKey = "finishedCue";
    } else if (!waiting && isBreathing) {
      titleKey = breathing.phase === "free" ? "breathFree" : breathing.phase;
      cueKey = breathPattern === "soft" ? "breathSoftCue" : breathPattern === "free" ? "breathFreeCue" : "breathCue";
    } else if (!waiting) {
      const guidance = Meditation.cue(snapshot.progress, meditationStyle, meditationFocus);
      titleKey = guidance.title;
      cueKey = guidance.cue;
    }

    // Only phase changes are announced, not each 200 ms clock refresh.
    const announce = isBreathing && breathPattern !== "free" ||
      !isBreathing && meditationStyle === "guided" ? "polite" : "off";
    if (heading.getAttribute("aria-live") !== announce) heading.setAttribute("aria-live", announce);
    setText(heading, copy(titleKey));
    breathPhaseDetail.hidden = !isBreathing;
    if (isBreathing) {
      const label = waiting ? copy("breathingReadyLabel") :
        complete ? copy("finished") :
        breathing.phase === "free" ? copy("breathingFreeLabel") :
        copy(breathing.phase) + " · " + Math.ceil(breathing.phaseRemaining) + " s";
      setText(breathPhaseDetail, label);
    }
    setText(cue, copy(cueKey));
    setText(status, copy(snapshot.status));
    setData(guided, "studioStatus", snapshot.status);
    setData(guided, "breathPhase", isBreathing && !waiting && !complete ? breathing.phase : "rest");
    // One monotonic clock controls both the words and the guardian's light.
    setVar(orb, "--studio-breath-scale", activeBreath ? breathing.scale.toFixed(4) : "1");
    setVar(guided, "--studio-breath-glow", activeBreath ? breathing.glow.toFixed(4) : ".28");
    setVar(guided, "--studio-rib-expansion", shape.rib);
    // V36: visible seated dragon breathing, with feet and head planted.
    setVar(guided, "--studio-guardian-expansion", activeBreath ? (1 + .095 * breathing.expansion).toFixed(4) : "1");
    setVar(guided, "--studio-guardian-wing", activeBreath ? (1 + .045 * breathing.expansion).toFixed(4) : "1");
    setVar(guided, "--studio-d28-wing-vein", shape.wingVein);
    setVar(guided, "--studio-d28-tail-light", shape.tailLight);
    setVar(guided, "--studio-d28-horn", shape.horn);
    setVar(guided, "--studio-d28-halo", shape.halo);
    setVar(guided, "--studio-breath-opacity", shape.arch);
    setVar(guided, "--studio-wing-opacity", shape.wing);
    setText(countdown, format(Math.ceil(snapshot.remainingMs / 1000)));
    const ratio = "scaleX(" + snapshot.progress.toFixed(4) + ")";
    if (progress.style.transform !== ratio) progress.style.transform = ratio;
    const amount = String(Math.round(snapshot.progress * 100));
    if (progress.parentElement?.getAttribute("aria-valuenow") !== amount)
      progress.parentElement?.setAttribute("aria-valuenow", amount);
    setText(root.querySelector("#studio-guided-note"),
      copy(isBreathing ? breathPattern === "free" ? "breathFreeNote" : "breathNote" : "meditationNote"));
    setText(primary, copy(waiting ? "begin" : snapshot.status === "running" ? "pause" :
      snapshot.status === "paused" ? "resume" : "again"));
    primary.setAttribute("aria-pressed", String(snapshot.status === "running"));
    setImmersive(immersive);
    reset.disabled = waiting;
    syncDurations();
    syncBreathButtons();
    syncMeditationButtons();
    syncFocusButtons();
    lockChoices();
    if (complete) stopTick();
  };

  const select = (next) => {
    if (!["asanas","breath","meditation"].includes(next) || next === mode) return;
    if (asanaBusy || (mode !== "asanas" &&
        ["running","paused"].includes(clock.snapshot().status))) return;
    stopTick();
    mode = next;
    setImmersive(false);
    root.dataset.studioMode = mode;
    guided.dataset.studioActive = mode;
    durationIndex = 1;
    dragon.hidden = mode !== "asanas";
    guided.hidden = mode === "asanas";
    if (mode !== "asanas") clock.reset(configuredDuration());
    lockChoices();
    syncBreathButtons();
    syncMeditationButtons();
    syncFocusButtons();
    if (mode !== "asanas") render();
  };

  // The original Flow listens for keyboard shortcuts on this same section.
  // Never let an invisible asana session start while a guided mode is active.
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && immersive && mode !== "asanas") {
      event.preventDefault();
      setImmersive(false);
      immersionButton.focus();
    }
    if (mode !== "asanas" && ["s","S","r","R","p","P","ArrowLeft","ArrowRight"].includes(event.key))
      event.stopImmediatePropagation();
  }, true);

  root.addEventListener("click", (event) => {
    const modeButton = event.target.closest("button[data-studio-mode]");
    if (modeButton && !modeButton.disabled) { select(modeButton.dataset.studioMode); return; }
    const breathButton = event.target.closest("button[data-breath-pattern]");
    if (breathButton && !breathButton.disabled && mode === "breath" &&
        Breath.PATTERNS[breathButton.dataset.breathPattern]) {
      breathPattern = breathButton.dataset.breathPattern;
      render();
      return;
    }
    const meditationButton = event.target.closest("button[data-meditation-style]");
    if (meditationButton && !meditationButton.disabled && mode === "meditation" &&
        Meditation.STYLES.includes(meditationButton.dataset.meditationStyle)) {
      meditationStyle = meditationButton.dataset.meditationStyle;
      render();
      return;
    }
    const focusButton = event.target.closest("button[data-meditation-focus]");
    if (focusButton && !focusButton.disabled && mode === "meditation" &&
        meditationStyle === "guided" &&
        Meditation.FOCUSES.includes(focusButton.dataset.meditationFocus)) {
      meditationFocus = focusButton.dataset.meditationFocus;
      render();
      return;
    }
    const durationButton = event.target.closest("[data-studio-duration-index]");
    if (durationButton && !durationButton.disabled && mode !== "asanas") {
      durationIndex = Number(durationButton.dataset.studioDurationIndex);
      clock.reset(configuredDuration());
      render();
      return;
    }
    const action = event.target.closest("[data-studio-action]");
    if (!action || action.disabled || mode === "asanas") return;
    if (action.dataset.studioAction === "immersion") {
      setImmersive(!immersive);
      return;
    }
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
      startTick();
    } else {
      clock.start(configuredDuration());
      stopTick();
      startTick();
    }
    render();
  });

  window.addEventListener("yoga:flow", ({detail}) => {
    asanaBusy = ["running","paused"].includes(detail?.status);
    lockChoices();
  });
  const langObserver = new MutationObserver(syncLanguage);
  langObserver.observe(document.documentElement, {attributes:true,attributeFilter:["lang"]});
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTick();
    else if (mode !== "asanas") {
      if (clock.snapshot().status === "running") startTick();
      render();
    }
  });
  window.addEventListener("pagehide", stopTick);
  window.addEventListener("pageshow", () => {
    if (mode !== "asanas" && clock.snapshot().status === "running" && ticker === null)
      startTick();
    if (mode !== "asanas") render();
  });
  syncLanguage();
  syncBreathButtons();
  syncMeditationButtons();
  syncFocusButtons();
  setImmersive(false);
  lockChoices();
})();
