(() => {
  "use strict";

  const I18N = window.YOGA_I18N || {};
  const LANG_KEY = "gb-yoga-lang";
  const THEME_KEY = "gb-yoga-theme";

  let lang = "es";
  let theme = "light";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function getByPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] != null ? acc[key] : null), obj);
  }

  function syncCvLinks() {
    const href = lang === "en"
      ? "./assets/CV_Gracian_Baena_Yoga_EN.pdf"
      : "./assets/CV_Gracian_Baena_Yoga_ES.pdf";
    const letter = lang === "en"
      ? "./Gracian_Baena_Cover_Letter_Yoga_EN.pdf"
      : "./Gracian_Baena_Carta_Yoga_ES.pdf";
    document.querySelectorAll("[data-cv-link]").forEach((a) => {
      a.setAttribute("href", href);
      a.removeAttribute("download");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer");
    });
    document.querySelectorAll("[data-letter-link]").forEach((a) => {
      a.setAttribute("href", letter);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noreferrer");
    });
  }

  function applyI18n() {
    const t = I18N[lang] || I18N.es;
    document.documentElement.lang = t.htmlLang || lang;
    document.title = t.title || document.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && t.metaDescription) meta.setAttribute("content", t.metaDescription);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const val = getByPath(t, el.dataset.i18n);
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const val = getByPath(t, el.dataset.i18nHtml);
      if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      const active = btn.getAttribute("data-set-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const value = getByPath(t, el.dataset.i18nAriaLabel);
      if (value != null) el.setAttribute("aria-label", value);
    });
    syncCvLinks();
    const audio = document.getElementById("focus-audio");
    const playBtn = document.getElementById("audio-play");
    const muteBtn = document.getElementById("audio-mute");
    if (playBtn && audio) {
      playBtn.setAttribute("aria-label", audio.paused ? (t.fieldPlay || "Play") : (t.fieldPause || "Pause"));
      playBtn.setAttribute("aria-pressed", String(!audio.paused));
    }
    if (muteBtn && audio) {
      muteBtn.textContent = audio.muted ? (t.fieldUnmute || "Audio") : (t.fieldMute || "Mute");
    }
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#06070a" : "#f4efe4");
    document.querySelectorAll("[data-set-theme]").forEach((btn) => {
      const active = btn.getAttribute("data-set-theme") === theme;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function setLang(next, persist = true) {
    lang = next === "en" ? "en" : "es";
    document.documentElement.setAttribute("data-lang", lang);
    if (persist) {
      try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
      try {
        const url = new URL(location.href);
        url.searchParams.set("lang", lang);
        history.replaceState(null, "", url);
      } catch (_) {}
    }
    applyI18n();
  }

  function setTheme(next, persist = true) {
    theme = next === "dark" ? "dark" : "light";
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    }
    applyTheme();
  }

  // Init from storage / system
  try {
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang === "en" || savedLang === "es") lang = savedLang;
  } catch (_) {}
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") theme = savedTheme;
    else if (window.YOGA_RUNTIME.mediaMatches("(prefers-color-scheme: dark)")) theme = "dark";
  } catch (_) {}

  const params = new URLSearchParams(location.search);
  if (params.get("lang") === "en" || params.get("lang") === "es") lang = params.get("lang");
  if (params.get("theme") === "dark" || params.get("theme") === "light") theme = params.get("theme");

  setLang(lang, false);
  setTheme(theme, false);

  document.addEventListener("click", (e) => {
    const langBtn = e.target.closest("[data-set-lang]");
    if (langBtn) {
      e.preventDefault();
      setLang(langBtn.getAttribute("data-set-lang"));
      return;
    }
    const themeBtn = e.target.closest("[data-set-theme]");
    if (themeBtn) {
      e.preventDefault();
      setTheme(themeBtn.getAttribute("data-set-theme"));
      return;
    }
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#nav");
  const setMenu = (open, returnFocus = false) => {
    nav?.classList.toggle("open", open);
    menuToggle?.classList.toggle("is-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    if (returnFocus) menuToggle?.focus();
  };
  menuToggle?.addEventListener("click", () => setMenu(!nav?.classList.contains("open")));
  nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("open")) setMenu(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenu(false);
  }, { passive: true });

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  const markInView = (el) => el.classList.add("is-in");
  if (reveals.length && typeof window.IntersectionObserver === "function") {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markInView(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
    // Immediately mark anything already in the viewport
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) markInView(el);
    });
    // Belt-and-suspenders: if nothing revealed after 100ms, show all
    setTimeout(() => {
      const anyIn = Array.from(reveals).some((el) => el.classList.contains("is-in"));
      if (!anyIn) reveals.forEach(markInView);
    }, 100);
  } else {
    reveals.forEach(markInView);
  }

  const audio = document.getElementById("focus-audio");
  const playBtn = document.getElementById("audio-play");
  const muteBtn = document.getElementById("audio-mute");
  const vol = document.getElementById("audio-vol");
  const seek = document.getElementById("audio-seek");
  const curEl = document.getElementById("audio-cur");
  const durEl = document.getElementById("audio-dur");
  const player = document.getElementById("focus-player");
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ":" + String(sec).padStart(2, "0");
  };
  const i18nT = () => (window.YOGA_I18N && window.YOGA_I18N[document.documentElement.lang === "en" ? "en" : "es"]) || {};
  const paintMute = () => {
    if (!muteBtn || !audio) return;
    const t = i18nT();
    muteBtn.textContent = audio.muted ? (t.fieldUnmute || "Audio") : (t.fieldMute || "Mute");
  };
  if (audio && playBtn) {
    audio.volume = vol ? Number(vol.value) : 0.45;
    playBtn.addEventListener("click", async () => {
      if (audio.paused) {
        try { await audio.play(); } catch (error) {
          player?.classList.add("is-audio-error");
          playBtn.setAttribute("aria-label", i18nT().fieldAudioError || "Audio unavailable");
        }
      } else {
        audio.pause();
      }
    });
    audio.addEventListener("play", () => {
      player?.classList.add("is-playing");
      playBtn.setAttribute("aria-label", i18nT().fieldPause || "Pause");
      playBtn.setAttribute("aria-pressed", "true");
    });
    audio.addEventListener("error", () => {
      player?.classList.add("is-audio-error");
      playBtn.setAttribute("aria-label", i18nT().fieldAudioError || "Audio unavailable");
    });
    audio.addEventListener("canplay", () => player?.classList.remove("is-audio-error"));
    audio.addEventListener("pause", () => {
      player?.classList.remove("is-playing");
      playBtn.setAttribute("aria-label", i18nT().fieldPlay || "Play");
      playBtn.setAttribute("aria-pressed", "false");
    });
    audio.addEventListener("loadedmetadata", () => {
      if (durEl) durEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      if (curEl) curEl.textContent = fmt(audio.currentTime);
      if (seek && Number.isFinite(audio.duration) && audio.duration > 0) seek.value = String((audio.currentTime / audio.duration) * 100);
    });
    seek?.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    });
    muteBtn?.addEventListener("click", () => {
      audio.muted = !audio.muted;
      paintMute();
    });
    vol?.addEventListener("input", () => {
      audio.volume = Number(vol.value);
      if (audio.volume > 0 && audio.muted) {
        audio.muted = false;
        paintMute();
      }
    });
    paintMute();
    // Enable after audio handlers are installed.
    playBtn.dataset.audioReady = "true";
    playBtn.disabled = false;
  }


  // Hero motion preferences.
  const hero = document.querySelector(".hero");
  if (hero) {
    const reduce = window.YOGA_RUNTIME.mediaMatches("(prefers-reduced-motion: reduce)");
    if (reduce) {
      hero.setAttribute("data-breath", "still");
      document.documentElement.classList.add("reduce-motion");
    } else {
      hero.setAttribute("data-breath", "cycle");
      // Use mouse/pen events even when Firefox reports no fine hover.
      let bounds;
      const reset = () => {
        bounds = null;
        for (const key of ["--px", "--py", "--copy-x", "--copy-y"])
          hero.style.setProperty(key, "0px");
      };
      const move = (e) => {
        if (e.pointerType === "touch" || document.body.classList.contains("quiet-mode") ||
            window.YOGA_RUNTIME.mediaMatches("(prefers-reduced-motion: reduce)")) return;
        // Cached geometry avoids a forced layout read for each pointer move.
        const r = bounds || (bounds = hero.getBoundingClientRect());
        if (!r.width || !r.height) return;
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        hero.style.setProperty("--px", (x * 8).toFixed(2) + "px");
        hero.style.setProperty("--py", (y * 8).toFixed(2) + "px");
        hero.style.setProperty("--copy-x", (x * -4).toFixed(2) + "px");
        hero.style.setProperty("--copy-y", (y * -2).toFixed(2) + "px");
      };
      hero.addEventListener("pointermove", move, { passive: true });
      hero.addEventListener("pointerleave", reset);
      const invalidate = () => { bounds = null; };
      window.addEventListener("scroll", invalidate, { passive: true });
      window.addEventListener("resize", invalidate, { passive: true });
      document.addEventListener("yoga:quiet", () => {
        if (document.body.classList.contains("quiet-mode")) reset();
      });
    }
  }

})();
(() => {
  "use strict";
  const reduce = window.YOGA_RUNTIME.mediaMatches("(prefers-reduced-motion: reduce)");
  const fine = window.YOGA_RUNTIME.mediaMatches("(hover: hover) and (pointer: fine)");
  const root = document.documentElement;
  const rAF = window.YOGA_RUNTIME.frame;

  // Intro.
  (function intro() {
    if (!root.classList.contains("intro-on")) return;
    try { sessionStorage.setItem("gb-yoga-intro-seen", "1"); } catch (_) {}
    let done = false;
    const finish = () => { if (done) return; done = true; root.classList.add("intro-done"); };
    const timer = setTimeout(finish, 2400);
    const skip = () => { clearTimeout(timer); finish(); };
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach((ev) =>
      window.addEventListener(ev, skip, { once: true, passive: true }));
  })();

  // Scroll rail.
  (function rail() {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop || 0) / max * 100 : 0;
      root.style.setProperty("--sp", pct.toFixed(2) + "%");
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; rAF(update); } }, { passive: true });
    update();
  })();

  // Spotlight.
  (function spotlight() {
    if (reduce || !fine) return;
    let shown = false;
    window.addEventListener("pointermove", (e) => {
      root.style.setProperty("--sx", (e.clientX / window.innerWidth * 100).toFixed(1) + "%");
      root.style.setProperty("--sy", (e.clientY / window.innerHeight * 100).toFixed(1) + "%");
      if (!shown) { shown = true; document.body.classList.add("has-spot"); }
    }, { passive: true });
  })();

  // Magnetic buttons.
  (function magnetic() {
    if (reduce || !fine) return;
    document.querySelectorAll(".hero-actions .btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mfx", ((e.clientX - (r.left + r.width / 2)) * 0.22).toFixed(1) + "px");
        btn.style.setProperty("--mfy", ((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1) + "px");
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.setProperty("--mfx", "0px");
        btn.style.setProperty("--mfy", "0px");
      });
    });
  })();

  /* One clock for the lotus, caption and selected breathing practice. */
  (function breath() {
    const hero = document.querySelector(".hero");
    const phaseEl = hero && hero.querySelector(".breath-phase");
    if (!phaseEl) return;
    const words = {
      es: { inhale: "Inhala", hold: "Sostén", exhale: "Exhala" },
      en: { inhale: "Inhale", hold: "Hold", exhale: "Exhale" }
    };
    let elapsed = 0, last = performance.now(), source = null;
    hero.style.setProperty("--lotus-open", reduce ? ".5" : "0");
    window.addEventListener("yoga:breath", ({detail}) => {
      source = detail.active ? detail : null;
      last = performance.now();
    });
    const tick = () => {
      const now = performance.now();
      const blocked = document.hidden || document.body.classList.contains("quiet-mode");
      const still = window.YOGA_RUNTIME.mediaMatches("(prefers-reduced-motion: reduce)");
      if (!blocked && !still && !source) elapsed += (now - last) / 1000;
      last = now;
      if (blocked) return;
      if (still && !source) {
        hero.setAttribute("data-phase", "still");
        phaseEl.textContent = "4 · 7 · 8";
        return;
      }
      const t = elapsed % 19;
      const phase = source ? source.phase : t < 4 ? "inhale" : t < 11 ? "hold" : "exhale";
      const duration = phase === "inhale" ? 4 : phase === "hold" ? 7 : 8;
      const progress = source ? source.progress : (t - (phase === "inhale" ? 0 : phase === "hold" ? 4 : 11)) / duration;
      const left = source ? source.remaining : Math.ceil(duration * (1 - progress));
      if (!still) hero.style.setProperty("--lotus-open", (phase === "inhale" ? progress : phase === "hold" ? 1 : 1 - progress).toFixed(4));
      const lang = root.lang === "en" ? "en" : "es";
      hero.setAttribute("data-phase", phase);
      phaseEl.textContent = words[lang][phase] + " · " + left;
    };
    document.addEventListener("visibilitychange", () => { last = performance.now(); });
    document.addEventListener("yoga:quiet", () => { last = performance.now(); tick(); });
    tick();
    setInterval(tick, 250);
  })();

  // Ambient particles.
  (function motes() {
    const canvas = document.querySelector(".fx-motes");
    if (!canvas || reduce) return;
    let ctx;
    try { ctx = canvas.getContext("2d", { alpha: true }); } catch (_) { return; }
    if (!ctx) return;
    const PAL = {
      light: [[47,107,79],[184,146,31],[138,106,61],[201,162,39]],
      dark:  [[125,202,165],[243,212,55],[196,165,116],[158,224,192]]
    };
    let w = 0, h = 0, dpr = 1, parts = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const pal = () => (root.getAttribute("data-theme") === "dark" ? PAL.dark : PAL.light);

    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(22, Math.min(54, Math.round(w * h / 30000)));
      const P = pal();
      parts = [];
      for (let i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.14,
          vy: -(Math.random() * 0.28 + 0.08),
          r: Math.random() * 1.6 + 0.9,
          a: Math.random() * 0.35 + 0.18,
          sway: Math.random() * 6.28,
          c: P[(Math.random() * P.length) | 0]
        });
      }
    }

    let frameId = 0;
    function frame() {
      if (document.hidden || document.body.classList.contains("quiet-mode")) { frameId = 0; return; }
      ctx.clearRect(0, 0, w, h);
      const P = pal();
      for (const p of parts) {
        p.sway += 0.01;
        p.x += p.vx + Math.sin(p.sway) * 0.15;
        p.y += p.vy;
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 120 && d > 0.1) { p.x += (dx / d) * 0.5; p.y += (dy / d) * 0.4; }
        }
        if (p.y < -12) { p.y = h + 12; p.x = Math.random() * w; p.c = P[(Math.random() * P.length) | 0]; }
        if (p.x < -12) p.x = w + 12; else if (p.x > w + 12) p.x = -12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;
        ctx.fill();
      }
      frameId = rAF(frame);
    }

    window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; }, { passive: true });
    window.addEventListener("pointerleave", () => { mouse.active = false; });
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 180); }, { passive: true });
    resize();
    const resume = () => {
      if (!frameId && !document.hidden && !document.body.classList.contains("quiet-mode")) frameId = rAF(frame);
    };
    document.addEventListener("visibilitychange", resume);
    document.addEventListener("yoga:quiet", resume);
    resume();
  })();
})();


// SANCTUARY PASS · ritual interaction
(() => {
  "use strict";
  const root = document.body;
  const state = document.getElementById("ritual-state");
  const detail = document.getElementById("ritual-state-detail");
  const choices = document.querySelectorAll(".ritual-choice");
  if (!root || !choices.length) return;

  const copy = {
    es: {
      arrive: ["Aterrizar", "Baja el ruido. Empieza aquí."],
      move: ["Mover", "Despierta el cuerpo. Sin prisa."],
      focus: ["Afinar", "Respira, observa, encuentra centro."],
      share: ["Compartir", "Lleva la práctica a una sala o equipo."]
    },
    en: {
      arrive: ["Arrive", "Lower the noise. Begin here."],
      move: ["Move", "Wake the body. Without hurry."],
      focus: ["Focus", "Breathe, observe, find centre."],
      share: ["Share", "Bring practice to a room or a team."]
    }
  };

  const apply = (key, scroll) => {
    const lang = document.documentElement.lang === "en" ? "en" : "es";
    const pair = copy[lang][key] || copy[lang].arrive;
    root.dataset.practice = key;
    choices.forEach((choice) => {
      const active = choice.dataset.practice === key;
      choice.classList.toggle("is-active", active);
      choice.setAttribute("aria-pressed", String(active));
    });
    if (state) state.textContent = pair[0];
    if (detail) detail.textContent = pair[1];

    if (scroll) {
      const activeChoice = Array.from(choices).find((choice) => choice.dataset.practice === key);
      const target = activeChoice && activeChoice.dataset.target;
      const el = target ? document.querySelector(target) : null;
      if (el) el.scrollIntoView({ behavior: window.YOGA_RUNTIME.mediaMatches("(prefers-reduced-motion: reduce)") ? "auto" : "smooth", block: "start" });
    }
  };

  choices.forEach((choice) => {
    choice.addEventListener("click", () => apply(choice.dataset.practice || "arrive", true));
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-set-lang]")) {
      window.YOGA_RUNTIME.frame(() => {
        const active = Array.from(choices).find((choice) => choice.getAttribute("aria-pressed") === "true");
        apply((active && active.dataset.practice) || "arrive", false);
      });
    }
  });

  document.addEventListener("yoga:practice", (event) => apply(event.detail, false));
  apply("arrive", false);
})();
