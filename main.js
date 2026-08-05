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
      ? "./CV_Gracian_Baena_Yoga_EN.pdf"
      : "./CV_Gracian_Baena_Yoga_ES.pdf";
    document.querySelectorAll("[data-cv-link]").forEach((a) => {
      a.setAttribute("href", href);
      a.removeAttribute("download");
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
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0f120f" : "#f7f3ea");
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

  // —— mobile menu ——
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

  // —— scroll reveal ——
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

  // —— header scroll state ——
  const header = document.getElementById("site-header");
  const progressFill = document.querySelector("[data-progress]");
  if (header || progressFill) {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (header) header.classList.toggle("scrolled", window.scrollY > 20);
          if (progressFill) {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            progressFill.style.width = pct + "%";
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // —— scroll-spy nav ——
  const navLinks = document.querySelectorAll(".nav > a[href^='#']");
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((a) => {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  // —— animated stat counters ——
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const dur = 1200;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io2.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => io2.observe(c));
  }
})();
