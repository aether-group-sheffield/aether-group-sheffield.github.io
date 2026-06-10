/* AETHER Group — site behaviour
   - Mobile navigation toggle
   - OpenDyslexic font toggle (persisted, per the AETHER style guide's
     accessibility requirements)
   - Reveal-on-scroll, disabled for users who prefer reduced motion
*/
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---- OpenDyslexic toggle ---- */
  var FONT_KEY = "aether-font";
  var fontButtons = document.querySelectorAll("[data-font-toggle]");

  function applyFontPref(enabled) {
    document.documentElement.classList.toggle("font-od", enabled);
    fontButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", enabled ? "true" : "false");
    });
  }

  var stored = null;
  try { stored = localStorage.getItem(FONT_KEY); } catch (e) { /* storage blocked */ }
  applyFontPref(stored === "opendyslexic");

  fontButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var enabled = !document.documentElement.classList.contains("font-od");
      applyFontPref(enabled);
      try {
        localStorage.setItem(FONT_KEY, enabled ? "opendyslexic" : "default");
      } catch (e) { /* storage blocked */ }
    });
  });

  /* ---- Mobile navigation ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---- Reveal on scroll ---- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }
})();
