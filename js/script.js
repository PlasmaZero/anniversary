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
  /* Heart glyphs. The trailing ︎ is a text-presentation selector: it forces
     monochrome (text) rendering instead of colourful emoji, so every heart picks
     up the theme's rose colour from CSS and the layer stays soft and cohesive. */
  var TS = "︎";
  var HEARTS = ["♥" + TS, "❤" + TS, "♡" + TS, "❥" + TS, "❧" + TS];

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

  /* ───── Little message popup ───── */
  var toastEl = document.getElementById("toast");
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2300);
  }

  /* ───── Gentle chime (Web Audio, off by default) ───── */
  var soundOn = false, audioCtx = null;
  function chime() {
    if (!soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var now = audioCtx.currentTime;
      [659.25, 987.77].forEach(function (f, idx) {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = f;
        o.connect(g); g.connect(audioCtx.destination);
        var t0 = now + idx * 0.08;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.11, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
        o.start(t0); o.stop(t0 + 0.55);
      });
    } catch (e) { /* no audio, no problem */ }
  }

  /* ───── Heart makers ───── */
  function makeHeart(x, y, opts) {
    if (!petalLayer) return;
    opts = opts || {};
    var glyphs = opts.glyphs || HEARTS;
    var p = document.createElement("span");
    p.className = "petal";
    p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    var size = (opts.minSize || 14) + Math.random() * (opts.range || 22);
    var dur = (opts.minDur || 4) + Math.random() * (opts.durRange || 3);
    if (x == null) { p.style.left = Math.random() * 100 + "vw"; }
    else { p.style.left = x + "px"; p.style.top = y + "px"; }
    var spread = opts.drift || 320;
    p.style.fontSize = size + "px";
    p.style.animationDuration = dur + "s";
    p.style.setProperty("--drift", (Math.random() * spread - spread / 2) + "px");
    p.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
    p.style.opacity = (opts.opacity || 0.9).toString();
    petalLayer.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, dur * 1000 + 500);
  }
  // Big hearts scattered all across the screen — they pop in, drift up, fade out.
  function scatter(count, glyphs) {
    if (!petalLayer) return;
    glyphs = glyphs || HEARTS;
    count = count || (reduceMotion ? 10 : 26);
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "petal pop";
      p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      var size = 30 + Math.random() * 34;             // big
      var dur = 1.7 + Math.random() * 1.6;
      p.style.left = (4 + Math.random() * 92) + "vw";  // scattered across X
      p.style.top = (8 + Math.random() * 78) + "vh";   // scattered across Y
      p.style.fontSize = size + "px";
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = (Math.random() * 0.45).toFixed(2) + "s";
      p.style.setProperty("--spin", (Math.random() * 50 - 25) + "deg");
      p.style.opacity = reduceMotion ? "0.95" : "0";
      petalLayer.appendChild(p);
      (function (node, life) {
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, life);
      })(p, (dur + 0.5) * 1000 + 600);
    }
    chime();
  }

  /* ───── Closing buttons ───── */
  var loveBtn = document.getElementById("loveBtn");
  if (loveBtn) loveBtn.addEventListener("click", function () { scatter(null, ["💗", "💕", "💖", "🤍"]); });
  var kissBtn = document.getElementById("kissBtn");
  if (kissBtn) kissBtn.addEventListener("click", function () { scatter(null, ["😘", "💋", "💕"]); toast("mwah 💋"); });
  var replayBtn = document.getElementById("replayBtn");
  if (replayBtn) replayBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ───── Live "time together" counter ─────
     ❤ The exact moment it began. Built from local date parts — new Date(year,
        monthIndex, day, hour, min) — so it always means 11:47 PM on 9 June 2025
        in the viewer's own timezone, with no daylight-saving drift. Counting UP. */
  var ANNIVERSARY = new Date(2025, 5, 9, 23, 47, 0); // 9 June 2025, 11:47 PM
  var cD = document.getElementById("c-days"), cH = document.getElementById("c-hrs"),
      cM = document.getElementById("c-min"), cS = document.getElementById("c-sec");
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tickCounter() {
    if (!cD) return;
    var diff = Date.now() - ANNIVERSARY.getTime();
    if (diff < 0) diff = 0;
    var s = Math.floor(diff / 1000);
    var days = Math.floor(s / 86400); s -= days * 86400;
    var hrs = Math.floor(s / 3600); s -= hrs * 3600;
    var mins = Math.floor(s / 60); s -= mins * 60;
    cD.textContent = days.toLocaleString(); cH.textContent = pad(hrs);
    cM.textContent = pad(mins); cS.textContent = pad(s);
  }
  if (cD) { tickCounter(); setInterval(tickCounter, 1000); }

  /* ───── Reasons I love you ───── */
  var REASONS = [
    "The way you laugh at your own jokes before you even finish them.",
    "How you swear you're not hungry and then eat half of mine anyway.",
    "That you let me be the silliest version of myself, and love me anyway.",
    "The little hum you do when the food is really, really good.",
    "How our plushie shelf keeps growing and you somehow blame me every time.",
    "The face you pull in every single front-camera photo. Yes — that one.",
    "That you held my hand on the glass floor when we were both terrified.",
    "How we end up matching without ever planning to.",
    "The way you say my name when you're half asleep.",
    "That you make an ordinary Tuesday feel like somewhere worth being.",
    "How you remember the tiny things I forget I ever said.",
    "Your matcha order — and the fact that I've got it memorised.",
    "That every adventure is better just because you're the one beside me.",
    "The way you look at me when you think I'm not looking.",
    "Because a whole year in, your smile still makes me nervous.",
    "How 'home' quietly started meaning wherever you are."
  ];
  var reasonBtn = document.getElementById("reasonBtn"),
      reasonText = document.getElementById("reasonText"),
      reasonCount = document.getElementById("reasonCount");
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  if (reasonBtn && reasonText) {
    var order = shuffle(REASONS.map(function (_, i) { return i; })), pos = 0, shown = 0;
    reasonBtn.addEventListener("click", function () {
      if (pos >= order.length) { shuffle(order); pos = 0; }
      var idx = order[pos++]; shown++;
      reasonText.classList.add("swap");
      setTimeout(function () {
        reasonText.textContent = "“" + REASONS[idx] + "”";
        reasonText.classList.remove("swap");
      }, 280);
      if (reasonCount) reasonCount.textContent = "reason no. " + shown;
      reasonBtn.textContent = "another one 💗";
      var r = reasonBtn.getBoundingClientRect();
      makeHeart(r.left + r.width / 2, r.top, { glyphs: ["💗"], minSize: 14, range: 10, drift: 160 });
      chime();
    });
  }

  /* ───── Floating dock ───── */
  var dock = document.getElementById("dock");
  function toggleDock() { if (dock) dock.classList.toggle("show", (window.scrollY || 0) > window.innerHeight * 0.6); }
  if (dock) { window.addEventListener("scroll", toggleDock, { passive: true }); toggleDock(); }

  var rainBtn = document.getElementById("rainBtn");
  if (rainBtn) rainBtn.addEventListener("click", function () { scatter(); });

  var THEMES = ["blush", "sunset", "lavender", "starlight"];
  var THEME_NAMES = { blush: "Blush", sunset: "Sunset", lavender: "Lavender", starlight: "Starlight" };
  try { var saved = localStorage.getItem("ed-theme"); if (saved && THEMES.indexOf(saved) !== -1) document.documentElement.setAttribute("data-theme", saved); } catch (e) {}
  var moodBtn = document.getElementById("moodBtn");
  if (moodBtn) moodBtn.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") || "blush";
    var next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("ed-theme", next); } catch (e) {}
    toast("mood: " + THEME_NAMES[next]);
  });

  var soundBtn = document.getElementById("soundBtn");
  if (soundBtn) soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? "🔊" : "🔈";
    soundBtn.setAttribute("aria-pressed", soundOn ? "true" : "false");
    if (soundOn) { chime(); toast("sound on 🔊"); } else { toast("sound off 🔈"); }
  });

  var topBtn = document.getElementById("topBtn");
  if (topBtn) topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ───── Photo lightbox ───── */
  var lb = document.getElementById("lightbox"),
      lbImg = document.getElementById("lbImg"),
      lbCap = document.getElementById("lbCap"),
      lbClose = document.getElementById("lbClose"),
      lbPrev = document.getElementById("lbPrev"),
      lbNext = document.getElementById("lbNext");
  if (lb && lbImg) {
    var photos = Array.prototype.slice.call(document.querySelectorAll(".frame img")), lbIndex = 0;
    var capFor = function (img) {
      var fc = img.parentNode ? img.parentNode.querySelector("figcaption") : null;
      return fc ? fc.textContent.trim() : (img.getAttribute("alt") || "");
    };
    var showLb = function () {
      var img = photos[lbIndex];
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.getAttribute("alt") || "";
      lbCap.textContent = capFor(img);
    };
    var openLb = function (i) { lbIndex = i; showLb(); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; };
    var closeLb = function () { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
    var nav = function (d) { lbIndex = (lbIndex + d + photos.length) % photos.length; showLb(); };
    photos.forEach(function (img, i) { img.addEventListener("click", function () { openLb(i); }); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === lbImg.parentNode) closeLb(); });
    if (lbClose) lbClose.addEventListener("click", closeLb);
    if (lbPrev) lbPrev.addEventListener("click", function (e) { e.stopPropagation(); nav(-1); });
    if (lbNext) lbNext.addEventListener("click", function (e) { e.stopPropagation(); nav(1); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") nav(-1);
      else if (e.key === "ArrowRight") nav(1);
    });
  }

  /* ───── One-time hint that photos are tappable ───── */
  if (!reduceMotion) setTimeout(function () { toast("psst — tap any photo to make it bigger 💗"); }, 5200);
})();
