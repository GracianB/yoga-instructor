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
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  const audio = document.getElementById("focus-audio");
  const playBtn = document.getElementById("audio-play");
  const muteBtn = document.getElementById("audio-mute");
  const vol = document.getElementById("audio-vol");
  if (audio && playBtn) {
    audio.volume = vol ? Number(vol.value) : 0.45;
    playBtn.addEventListener("click", async () => {
      if (audio.paused) {
        try { await audio.play(); playBtn.textContent = "Pause"; } catch (_) {}
      } else {
        audio.pause();
        playBtn.textContent = playBtn.getAttribute("data-i18n") === "fieldPlay" ? (document.documentElement.lang === "en" ? "Play" : "Play") : "Play";
      }
    });
    muteBtn?.addEventListener("click", () => {
      audio.muted = !audio.muted;
      muteBtn.textContent = audio.muted ? "Unmute" : (document.documentElement.lang === "en" ? "Mute" : "Silencio");
    });
    vol?.addEventListener("input", () => {
      audio.volume = Number(vol.value);
      if (audio.volume > 0 && audio.muted) audio.muted = false;
    });
  }
})();
