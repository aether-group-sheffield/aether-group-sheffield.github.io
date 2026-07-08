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

  /* ---- Publications filters: theme AND year both filter the results ---- */
  var themeButtons = document.querySelectorAll(".pub-filter[data-filter]");
  var yearButtons = document.querySelectorAll(".pub-filter[data-year]");
  if (themeButtons.length) {
    var pubItems = document.querySelectorAll(".pub-item");
    var yearGroups = document.querySelectorAll(".pub-year-group");
    var emptyMsg = document.querySelector(".pub-empty");
    var activeTheme = "all";
    var activeYear = "all";

    function applyFilters() {
      pubItems.forEach(function (item) {
        var themes = (item.getAttribute("data-theme") || "").split(/\s+/);
        var group = item.closest(".pub-year-group");
        var year = group ? group.id.replace("y-", "") : "";
        var themeOk = activeTheme === "all" || themes.indexOf(activeTheme) !== -1;
        var yearOk = activeYear === "all" || year === activeYear;
        item.hidden = !(themeOk && yearOk);
      });
      var anyVisible = false;
      yearGroups.forEach(function (group) {
        var visible = group.querySelectorAll(".pub-item:not([hidden])").length;
        group.hidden = visible === 0;
        if (visible) { anyVisible = true; }
      });
      if (emptyMsg) { emptyMsg.hidden = anyVisible; }
    }

    function wire(buttons, set) {
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) {
            b.classList.remove("is-active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-pressed", "true");
          set(btn);
          applyFilters();
        });
      });
    }
    wire(themeButtons, function (btn) { activeTheme = btn.getAttribute("data-filter"); });
    wire(yearButtons, function (btn) { activeYear = btn.getAttribute("data-year"); });
  }

  /* ---- Photo carousel (Life in the group) ----
     One photo per view; prev/next and dots page exactly one slide. */
  document.querySelectorAll(".carousel").forEach(function (carousel) {
    var track = carousel.querySelector(".carousel-track");
    var prev = carousel.querySelector(".carousel-prev");
    var next = carousel.querySelector(".carousel-next");
    if (!track || !prev || !next) { return; }
    var slides = track.querySelectorAll("figure");

    // single-photo carousels need no navigation at all
    if (slides.length < 2) {
      carousel.classList.add("no-nav");
      return;
    }

    // build the dot indicators
    var dots = document.createElement("div");
    dots.className = "carousel-dots";
    dots.setAttribute("role", "tablist");
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Go to photo " + (i + 1) + " of " + slides.length);
      dot.addEventListener("click", function () { goTo(i); });
      dots.appendChild(dot);
    });
    carousel.appendChild(dots);

    var current = 0;

    function slideWidth() {
      var fig = slides[0];
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return fig.getBoundingClientRect().width + gap;
    }

    function setStates(index) {
      current = Math.max(0, Math.min(slides.length - 1, index));
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      dots.querySelectorAll(".carousel-dot").forEach(function (d, i) {
        d.classList.toggle("is-active", i === current);
      });
    }

    function goTo(index) {
      index = Math.max(0, Math.min(slides.length - 1, index));
      track.scrollTo({ left: index * slideWidth() });
      setStates(index);
    }

    prev.addEventListener("click", function () { goTo(current - 1); });
    next.addEventListener("click", function () { goTo(current + 1); });
    // keep state in sync when the user scrolls/swipes the track directly
    track.addEventListener("scroll", function () {
      var index = Math.round(track.scrollLeft / slideWidth());
      if (index !== current) { setStates(index); }
    }, { passive: true });
    window.addEventListener("resize", function () { goTo(current); });
    setStates(0);
  });
})();
