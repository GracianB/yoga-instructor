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
      ? "./Gracian_Baena_CV_Yoga_EN.pdf"
      : "./Gracian_Baena_CV_Yoga_ES.pdf";
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

    syncCvLinks();
    const audio = document.getElementById("focus-audio");
    const playBtn = document.getElementById("audio-play");
    const muteBtn = document.getElementById("audio-mute");
    if (playBtn && audio) {
      playBtn.setAttribute("aria-label", audio.paused ? (t.fieldPlay || "Play") : (t.fieldPause || "Pause"));
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
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
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
  menuToggle?.addEventListener("click", () => {
    const open = !nav?.classList.contains("open");
    nav?.classList.toggle("open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  const markInView = (el) => el.classList.add("is-in");
  if (reveals.length && "IntersectionObserver" in window) {
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
        try { await audio.play(); } catch (_) {}
      } else {
        audio.pause();
      }
    });
    audio.addEventListener("play", () => {
      player?.classList.add("is-playing");
      playBtn.setAttribute("aria-label", i18nT().fieldPause || "Pause");
    });
    audio.addEventListener("pause", () => {
      player?.classList.remove("is-playing");
      playBtn.setAttribute("aria-label", i18nT().fieldPlay || "Play");
    });
    audio.addEventListener("loadedmetadata", () => {
      if (durEl) durEl.textContent = fmt(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      if (curEl) curEl.textContent = fmt(audio.currentTime);
      if (seek && audio.duration) seek.value = String((audio.currentTime / audio.duration) * 100);
    });
    seek?.addEventListener("input", () => {
      if (!audio.duration) return;
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
  }


  // Presence hero — 4-7-8 breath phase labels + reduced-motion class
  const hero = document.querySelector(".hero");
  if (hero) {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      hero.setAttribute("data-breath", "still");
      document.documentElement.classList.add("reduce-motion");
    } else {
      hero.setAttribute("data-breath", "cycle");
      const phaseEl = hero.querySelector(".breath-phase");
      const labels = { inhale: "4", hold: "7", exhale: "8" };
      // 19s cycle: inhale 0–4, hold 4–11, exhale 11–19
      const tick = () => {
        const t = (performance.now() / 1000) % 19;
        let phase = "exhale";
        if (t < 4) phase = "inhale";
        else if (t < 11) phase = "hold";
        hero.setAttribute("data-phase", phase);
        if (phaseEl && !phaseEl.hasAttribute("data-i18n-locked")) {
          // Keep "4 · 7 · 8" caption; mark active digit via data-phase for CSS
        }
      };
      tick();
      setInterval(tick, 200);

      // Subtle pointer parallax → --px / --py on .hero (~±14px)
      const max = 14;
      const onMove = (e) => {
        const r = hero.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        hero.style.setProperty("--px", (x * max).toFixed(2) + "px");
        hero.style.setProperty("--py", (y * max).toFixed(2) + "px");
      };
      const onLeave = () => {
        hero.style.setProperty("--px", "0px");
        hero.style.setProperty("--py", "0px");
      };
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }
  }

})();
/* ══════════════════════════════════════════════════════════════
   ZEN MAX PASS · v=zen-max-1 — added behaviours (self-contained)
   ══════════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const root = document.documentElement;
  const rAF = window.requestAnimationFrame || ((f) => setTimeout(f, 16));

  /* —— 1 · breathing intro —— */
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

  /* —— 2 · scroll progress rail —— */
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

  /* —— 3 · warm cursor spotlight —— */
  (function spotlight() {
    if (reduce || !fine) return;
    let shown = false;
    window.addEventListener("pointermove", (e) => {
      root.style.setProperty("--sx", (e.clientX / window.innerWidth * 100).toFixed(1) + "%");
      root.style.setProperty("--sy", (e.clientY / window.innerHeight * 100).toFixed(1) + "%");
      if (!shown) { shown = true; document.body.classList.add("has-spot"); }
    }, { passive: true });
  })();

  /* —— 4 · magnetic hero CTAs —— */
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

  /* —— 5 · live 4-7-8 breath caption —— */
  (function breath() {
    if (reduce) return;
    const hero = document.querySelector(".hero");
    const phaseEl = hero && hero.querySelector(".breath-phase");
    if (!phaseEl) return;
    const words = {
      es: { inhale: "Inhala", hold: "Sostén", exhale: "Exhala" },
      en: { inhale: "Inhale", hold: "Hold", exhale: "Exhale" }
    };
    const tick = () => {
      const t = (performance.now() / 1000) % 19;
      let phase, left;
      if (t < 4) { phase = "inhale"; left = Math.ceil(4 - t); }
      else if (t < 11) { phase = "hold"; left = Math.ceil(11 - t); }
      else { phase = "exhale"; left = Math.ceil(19 - t); }
      const lang = root.lang === "en" ? "en" : "es";
      phaseEl.textContent = words[lang][phase] + " · " + left;
    };
    tick();
    setInterval(tick, 250);
  })();

  /* —— 6 · rising motes (soft, warm, drift up) —— */
  (function motes() {
    const canvas = document.querySelector(".fx-motes");
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d", { alpha: true });
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

    function frame() {
      if (document.hidden) { rAF(frame); return; }
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
      rAF(frame);
    }

    window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; }, { passive: true });
    window.addEventListener("pointerleave", () => { mouse.active = false; });
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 180); }, { passive: true });
    resize();
    rAF(frame);
  })();
})();
