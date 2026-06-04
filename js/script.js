/* ════════════════════════════════════════════
   One Year of Us · for Elisha
   ════════════════════════════════════════════ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───── Opening curtain ───── */
  var intro = document.getElementById("intro");
  var introBtn = document.getElementById("introBtn");

  function dismissIntro() {
    if (!intro || intro.classList.contains("hidden")) return;
    intro.classList.add("hidden");
    document.body.style.overflow = "";
    startReveal();
    setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 1100);
  }

  if (intro) {
    document.body.style.overflow = "hidden";
    if (introBtn) introBtn.addEventListener("click", dismissIntro);
    // auto-open after a short, gentle beat
    setTimeout(dismissIntro, reduceMotion ? 600 : 3200);
  }

  /* ───── Scroll-reveal ───── */
  var revealStarted = false;
  function startReveal() {
    if (revealStarted) return;
    revealStarted = true;
    var items = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  }
  // also kick reveal if the intro never showed
  if (!intro) startReveal();

  /* ───── Scroll progress bar ───── */
  var progress = document.getElementById("progress");
  function onScroll() {
    if (!progress) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ───── Floating petals / hearts ───── */
  var petalLayer = document.getElementById("petals");
  var HEARTS = ["♥", "❤", "🤍", "💗", "✿"];

  function spawnPetal() {
    if (!petalLayer || document.hidden) return;
    var p = document.createElement("span");
    p.className = "petal";
    p.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    var size = 10 + Math.random() * 20;
    var dur = 9 + Math.random() * 9;
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = size + "px";
    p.style.animationDuration = dur + "s";
    p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    p.style.setProperty("--spin", (Math.random() * 540 - 180) + "deg");
    p.style.opacity = (0.35 + Math.random() * 0.4).toString();
    petalLayer.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, dur * 1000 + 400);
  }

  if (!reduceMotion && petalLayer) {
    var ambient = setInterval(spawnPetal, 1400);
    setTimeout(spawnPetal, 4000);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { clearInterval(ambient); }
      else { ambient = setInterval(spawnPetal, 1400); }
    });
  }

  /* ───── "tap for a little love" burst ───── */
  var loveBtn = document.getElementById("loveBtn");
  function burst(originX, originY) {
    if (!petalLayer) return;
    var n = reduceMotion ? 6 : 16;
    for (var i = 0; i < n; i++) {
      (function () {
        var p = document.createElement("span");
        p.className = "petal";
        p.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
        var size = 14 + Math.random() * 22;
        var dur = 4 + Math.random() * 3;
        p.style.left = originX + "px";
        p.style.top = originY + "px";
        p.style.fontSize = size + "px";
        p.style.animationDuration = dur + "s";
        p.style.setProperty("--drift", (Math.random() * 320 - 160) + "px");
        p.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
        p.style.opacity = "0.9";
        petalLayer.appendChild(p);
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, dur * 1000 + 400);
      })();
    }
  }
  if (loveBtn) {
    loveBtn.addEventListener("click", function () {
      var r = loveBtn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top);
    });
  }
})();
