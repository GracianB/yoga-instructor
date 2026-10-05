/* ================================================================
   YOGA SANCTUARY · LIVING EXPERIENCE
   Phase 03–08: ritual state, one breath, presence, sound, memory,
   quiet mode and ambient wayfinding.
   ================================================================ */
(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const PRACTICE_KEY = "gb-yoga-practice";
  const QUIET_KEY = "gb-yoga-quiet";
  const LAST_SECTION_KEY = "gb-yoga-section";

  const copy = {
    es: {
      dockLabel: "Un respiro",
      breath: "Un respiro",
      pause: "Pausa",
      reset: "Otra vez",
      inhale: "Inhala",
      hold: "Sostén",
      exhale: "Exhala",
      complete: "Ya estás aquí.",
      quietOn: "Silencio visual",
      quietOff: "Volver al ambiente",
      shortcut: "B",
      section: "Presencia",
      labels: {
        inicio: "Presencia",
        ritual: "Ritual",
        campo: "Campo",
        sobre: "Sobre mí",
        oferta: "Cómo trabajo",
        camino: "Camino",
        experiencia: "Experiencia",
        formacion: "Formación",
        filosofia: "Filosofía",
        cv: "CV",
        contacto: "Contacto"
      }
    },
    en: {
      dockLabel: "One breath",
      breath: "One breath",
      pause: "Pause",
      reset: "Again",
      inhale: "Inhale",
      hold: "Hold",
      exhale: "Exhale",
      complete: "You are here.",
      quietOn: "Visual quiet",
      quietOff: "Bring the room back",
      shortcut: "B",
      section: "Presence",
      labels: {
        inicio: "Presence",
        ritual: "Ritual",
        campo: "Field",
        sobre: "About",
        oferta: "How I work",
        camino: "Path",
        experiencia: "Experience",
        formacion: "Training",
        filosofia: "Philosophy",
        cv: "CV",
        contacto: "Contact"
      }
    }
  };

  const lang = () => root.lang === "en" ? "en" : "es";
  const t = () => copy[lang()];

  function createDock() {
    if (document.querySelector(".sanctuary-dock")) return document.querySelector(".sanctuary-dock");

    const dock = document.createElement("aside");
    dock.className = "sanctuary-dock";
    dock.setAttribute("aria-label", t().dockLabel);
    dock.innerHTML =
      '<button class="sanctuary-breath" type="button" aria-describedby="breath-phase" aria-pressed="false">' +
        '<span class="breath-ring" aria-hidden="true"><span class="breath-ring-fill"></span><span class="breath-ring-core"></span></span>' +
        '<span class="breath-copy">' +
          '<small class="breath-kicker">03 · ' + t().dockLabel + '</small>' +
          '<strong id="breath-phase">' + t().breath + '</strong>' +
          '<em class="breath-time">19s</em>' +
        '</span>' +
      '</button>' +
      '<div class="sanctuary-dock-tools">' +
        '<span class="sanctuary-section" aria-live="polite">' + t().section + '</span>' +
        '<button class="sanctuary-quiet" type="button" aria-pressed="false">' + t().quietOn + '</button>' +
      '</div>';
    document.body.appendChild(dock);
    return dock;
  }

  const dock = createDock();
  const breathButton = dock.querySelector(".sanctuary-breath");
  const breathPhase = dock.querySelector("#breath-phase");
  const breathTime = dock.querySelector(".breath-time");
  const quietButton = dock.querySelector(".sanctuary-quiet");
  const sectionLabel = dock.querySelector(".sanctuary-section");

  let breathRunning = false;
  let breathStarted = 0;
  let breathRaf = 0;
  const cycle = [
    { name: "inhale", seconds: 4 },
    { name: "hold", seconds: 7 },
    { name: "exhale", seconds: 8 }
  ];
  const cycleSeconds = 19;

  function breathText(phase) {
    const labels = t();
    return phase === "inhale" ? labels.inhale : phase === "hold" ? labels.hold : labels.exhale;
  }

  function renderBreath(elapsed, finished = false) {
    const safe = Math.min(Math.max(elapsed, 0), cycleSeconds);
    let cursor = safe;
    let phase = "exhale";
    for (const item of cycle) {
      if (cursor <= item.seconds) {
        phase = item.name;
        break;
      }
      cursor -= item.seconds;
    }
    const pct = finished ? 100 : (safe / cycleSeconds) * 100;
    root.style.setProperty("--breath-pct", pct.toFixed(2) + "%");
    body.dataset.breathPhase = finished ? "complete" : phase;
    breathPhase.textContent = finished ? t().complete : breathText(phase);
    breathTime.textContent = finished ? "0s" : Math.max(0, Math.ceil(cycleSeconds - safe)) + "s";
    breathButton.setAttribute("aria-pressed", String(breathRunning));
  }

  function stopBreath(completed) {
    breathRunning = false;
    if (breathRaf) cancelAnimationFrame(breathRaf);
    breathRaf = 0;
    renderBreath(completed ? cycleSeconds : 0, completed);
  }

  function tickBreath(now) {
    if (!breathRunning) return;
    const elapsed = (now - breathStarted) / 1000;
    if (elapsed >= cycleSeconds) {
      stopBreath(true);
      return;
    }
    renderBreath(elapsed);
    breathRaf = requestAnimationFrame(tickBreath);
  }

  breathButton.addEventListener("click", () => {
    if (breathRunning) {
      stopBreath(false);
      return;
    }
    breathRunning = true;
    breathStarted = performance.now();
    renderBreath(0);
    breathRaf = requestAnimationFrame(tickBreath);
  });

  function syncDockLanguage() {
    const labels = t();
    dock.setAttribute("aria-label", labels.dockLabel);
    dock.querySelector(".breath-kicker").textContent = "03 · " + labels.dockLabel;
    quietButton.textContent = body.classList.contains("quiet-mode") ? labels.quietOff : labels.quietOn;
    const phase = body.dataset.breathPhase;
    if (phase === "complete") breathPhase.textContent = labels.complete;
    else if (phase === "inhale" || phase === "hold" || phase === "exhale") breathPhase.textContent = breathText(phase);
    else if (!breathRunning) breathPhase.textContent = labels.breath;
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-set-lang]")) requestAnimationFrame(syncDockLanguage);
  });

  function applyQuiet(value, persist = true) {
    body.classList.toggle("quiet-mode", value);
    quietButton.setAttribute("aria-pressed", String(value));
    quietButton.textContent = value ? t().quietOff : t().quietOn;
    if (persist) {
      try { localStorage.setItem(QUIET_KEY, value ? "1" : "0"); } catch (_) {}
    }
  }

  quietButton.addEventListener("click", () => applyQuiet(!body.classList.contains("quiet-mode")));

  try {
    applyQuiet(localStorage.getItem(QUIET_KEY) === "1", false);
  } catch (_) {}

  // Phase 07 · remember the last practice, without trapping the visitor.
  function rememberPractice() {
    const active = document.querySelector(".ritual-choice[aria-pressed='true']");
    const key = active && active.dataset.practice;
    if (!key) return;
    try { localStorage.setItem(PRACTICE_KEY, key); } catch (_) {}
  }

  document.addEventListener("click", (event) => {
    const choice = event.target.closest(".ritual-choice");
    if (choice) rememberPractice();
  });

  requestAnimationFrame(() => {
    try {
      const saved = localStorage.getItem(PRACTICE_KEY);
      const choice = saved && document.querySelector(".ritual-choice[data-practice='" + saved + "']");
      if (choice) {
        document.body.dataset.practice = saved;
        document.querySelectorAll(".ritual-choice").forEach((item) => {
          const active = item === choice;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
      }
    } catch (_) {}
  });

  // Phase 05 · presence field.
  if (!reduced && finePointer) {
    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / Math.max(window.innerWidth, 1)) * 100;
      const y = (event.clientY / Math.max(window.innerHeight, 1)) * 100;
      root.style.setProperty("--presence-x", x.toFixed(2) + "%");
      root.style.setProperty("--presence-y", y.toFixed(2) + "%");
    }, { passive: true });
  }

  // Phase 05 · scroll becomes a physical signal, not a progress bar.
  let lastScroll = window.scrollY;
  let lastTime = performance.now();
  let energy = 0;
  let decayRaf = 0;

  function decayScroll() {
    energy *= 0.86;
    root.style.setProperty("--scroll-energy", Math.min(1, energy).toFixed(3));
    if (energy > 0.01) decayRaf = requestAnimationFrame(decayScroll);
    else decayRaf = 0;
  }

  window.addEventListener("scroll", () => {
    if (reduced) return;
    const now = performance.now();
    const delta = Math.abs(window.scrollY - lastScroll);
    const dt = Math.max(16, now - lastTime);
    energy = Math.min(1.5, (delta / dt) * 9);
    lastScroll = window.scrollY;
    lastTime = now;
    if (!decayRaf) decayRaf = requestAnimationFrame(decayScroll);
    if (delta > 30) body.classList.add("in-motion");
    window.clearTimeout(window.__yogaMotionTimer);
    window.__yogaMotionTimer = window.setTimeout(() => body.classList.remove("in-motion"), 180);
  }, { passive: true });

  // Phase 06 · sound becomes a breathing light, never a visual equalizer.
  const audio = document.getElementById("focus-audio");
  if (audio && !reduced) {
    let soundRaf = 0;
    const stopSound = () => {
      body.classList.remove("sound-active");
      if (soundRaf) cancelAnimationFrame(soundRaf);
      soundRaf = 0;
      root.style.setProperty("--sound-pulse", "0");
      root.style.setProperty("--sound-blur", "20px");
    };
    const animateSound = () => {
      if (audio.paused || audio.ended) {
        stopSound();
        return;
      }
      const bpm = 62;
      const pulse = (Math.sin((audio.currentTime * bpm / 60) * Math.PI * 2) + 1) / 2;
      root.style.setProperty("--sound-pulse", (pulse * 0.7).toFixed(3));
      root.style.setProperty("--sound-blur", (20 + pulse * 28).toFixed(1) + "px");
      body.classList.add("sound-active");
      soundRaf = requestAnimationFrame(animateSound);
    };
    audio.addEventListener("play", () => {
      if (!soundRaf) soundRaf = requestAnimationFrame(animateSound);
    });
    audio.addEventListener("pause", stopSound);
    audio.addEventListener("ended", stopSound);
  }

  // Phase 07 · wayfinding. The page knows where you are, not who you are.
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const key = visible.target.id;
      body.dataset.activeSection = key;
      const label = t().labels[key] || t().section;
      sectionLabel.textContent = label;
      try { localStorage.setItem(LAST_SECTION_KEY, key); } catch (_) {}
    }, { threshold: [0.12, 0.35, 0.6], rootMargin: "-8% 0px -42% 0px" });
    sections.forEach((section) => observer.observe(section));
  }

  // Phase 08 · keyboard escape hatch. B toggles breathing, Q toggles quiet mode.
  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.key.toLowerCase() === "b") breathButton.click();
    if (event.key.toLowerCase() === "q") quietButton.click();
  });

  // Ambient variables, initial state.
  root.style.setProperty("--presence-x", "50%");
  root.style.setProperty("--presence-y", "42%");
  root.style.setProperty("--scroll-energy", "0");
  root.style.setProperty("--sound-pulse", "0");
  renderBreath(0);
})();
