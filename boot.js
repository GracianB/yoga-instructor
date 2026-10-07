/* zen intro boot — decide before first paint, with failsafe */
    (function () {
      try {
        var reduce = window.YOGA_RUNTIME.mediaMatches("(prefers-reduced-motion: reduce)");
        var seen = false;
        try { seen = sessionStorage.getItem("gb-yoga-intro-seen") === "1"; } catch (e) {}
        if (!reduce && !seen) {
          document.documentElement.classList.add("intro-on");
          setTimeout(function () { document.documentElement.classList.add("intro-done"); }, 2150);
        }
      } catch (e) {}
    })();
