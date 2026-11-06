/*
 * Scroll story between the hero and "What I Do".
 *
 * A green route line draws itself and the page darkens into space. Then, pinned to the screen:
 *   1. one pre-rendered video (satellite, the Netherlands, three maps, a dive towards Rotterdam),
 *      moved frame by frame with the scroll;
 *   2. a small live 3D scene (js/twin-scene.js, three.js) in which a few real Rotterdam buildings turn
 *      into a digital twin; it cross-fades in over the end of the video.
 * The timeline (scroll lengths, frame counts) is in js/story-plan.js. Visitors who prefer reduced
 * motion get a still image instead (css/story.css); nothing heavy is loaded for them.
 */
(function () {
  "use strict";

  var story = document.querySelector("[data-story]");
  var lead = document.querySelector("[data-story-lead]");
  var plan = window.STORY_PLAN;
  if (!story || !lead || !plan) { return; }

  var ASSETS = "assets/story/";
  var GLIDE = 0.22;   // seconds the scene takes to settle after a scroll step (higher = softer)
  var CREDITS = {
    globe: "Earth: NASA Blue Marble · Landsat 8 model: NASA",
    imagery: 'Imagery: <a href="https://s2maps.eu" target="_blank" rel="noopener">Sentinel-2 cloudless</a> by EOX IT Services GmbH ' +
      "(contains modified Copernicus Sentinel data 2016 &amp; 2017)",
    elevation: "Elevation: AHN, Rijkswaterstaat",
    heat: "Surface temperature, 20–27 July 2019: MODIS Terra, NASA GIBS",
    landcover: "Land cover: © ESA WorldCover project 2021 / contains modified Copernicus Sentinel data (2021) " +
      "processed by ESA WorldCover consortium",
    twin: '© <a href="https://docs.3dbag.nl/en/copyright/" target="_blank" rel="noopener">3DBAG by tudelft3d and 3DGI</a> ' +
      "(colours changed) · Aerial photo: Beeldmateriaal Nederland, PDOK"
  };

  var leadLine = lead.querySelector(".story-lead__line");
  var leadPath = leadLine.querySelector("path");
  var space = lead.querySelector("[data-story-space]");
  var stars = lead.querySelector(".story-lead__stars");
  var video = story.querySelector("[data-story-video]");
  var twinStage = story.querySelector("[data-story-twin]");
  var credit = story.querySelector("[data-story-credit]");
  var veil = story.querySelector("[data-story-veil]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp01(x) { return Math.min(1, Math.max(0, x)); }
  function ease(x) { x = clamp01(x); return x * x * (3 - 2 * x); }

  // ------------------------------------------------------------------ timeline
  // Absolute scroll positions (vh) of every step, and the video frame each one starts and ends on.
  var steps = [], at = 0, frames = 0;
  plan.steps.forEach(function (s) {
    var step = { from: at, to: at + s.vh, vh: s.vh, frame0: frames, frame1: frames };
    if (s.scene) { step.scene = s.scene; step.frame1 = frames + s.frames; frames += s.frames; }
    if (s.twin) { step.twin = s.twin; }
    steps.push(step);
    at += s.vh;
  });
  var storyVh = at;

  // What to show at a scroll position (vh into the pinned part).
  function stateAt(pos) {
    var state = { frame: 0, scene: 0, twin: -1, twinOpacity: 0 };
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i], f = clamp01((pos - s.from) / s.vh);
      state.frame = s.frame0 + (s.frame1 - s.frame0) * f;
      if (s.scene) {
        state.scene = s.scene[0] + (s.scene[1] - s.scene[0]) * f;
        if (s.scene[1] >= 3) { state.twinOpacity = ease((f - plan.twinFadeFrom) / (1 - plan.twinFadeFrom)); }
      }
      if (s.twin) {
        state.scene = 3;
        state.twin = s.twin[0] + (s.twin[1] - s.twin[0]) * f;
        state.twinOpacity = 1;
      }
      if (pos < s.to) { break; }
    }
    return state;
  }

  function creditFor(state) {
    if (state.twinOpacity >= 0.5) { return CREDITS.twin; }
    if (state.scene < 0.75) { return CREDITS.globe; }
    if (state.scene <= 1) { return CREDITS.imagery; }
    var map = state.scene < 4 / 3 ? CREDITS.elevation : state.scene < 5 / 3 ? CREDITS.heat : CREDITS.landcover;
    return state.scene < 2.5 ? map + "<br>" + CREDITS.imagery : CREDITS.imagery;
  }

  // ------------------------------------------------------------------ lead-in (always)
  function updateLead(vh) {
    var lineBox = leadLine.getBoundingClientRect();
    var lp = reduceMotion ? 1 : clamp01((vh * 0.78 - lineBox.top) / lineBox.height);
    leadPath.style.strokeDashoffset = String(1 - lp);
    lead.classList.toggle("is-complete", lp > 0.985);
    var spaceBox = space.getBoundingClientRect();
    var starsIn = reduceMotion ? 1 : ease(clamp01((vh * 0.95 - spaceBox.top) / (spaceBox.height * 1.1)));
    stars.style.setProperty("--stars", starsIn.toFixed(3));
  }

  if (reduceMotion) {
    updateLead(window.innerHeight);
    return;   // the still image in the markup is all these visitors get
  }

  story.style.height = (100 + storyVh + plan.fadeOutVh) + "vh";

  // ------------------------------------------------------------------ video
  // A tall version for portrait screens (phones), a wide one for everything else.
  var shape = "";
  var wantTime = 0, seeking = false, primed = false;
  function videoShape() { return window.innerHeight > window.innerWidth ? "tall" : "wide"; }
  function loadVideo() {
    var next = videoShape();
    if (next === shape) { return; }
    shape = next;
    seeking = false;
    video.src = ASSETS + "story-orbit-" + shape + ".mp4";
    video.preload = "auto";
    video.load();
  }
  function frameTime(frame) { return (Math.round(frame) + 0.5) / plan.fps; }
  function seek(time) {
    wantTime = time;
    if (!seeking && video.readyState >= 1 && Math.abs(video.currentTime - time) > 0.4 / plan.fps) {
      seeking = true;
      video.currentTime = time;
    }
  }
  video.addEventListener("seeked", function () {
    seeking = false;
    seek(wantTime);   // catch up if the scroll moved on while seeking
  });
  video.addEventListener("loadedmetadata", function () {
    // Some mobile browsers only draw video frames after a play() call; a silent play-pause unlocks it.
    if (!primed) {
      primed = true;
      var p = video.play();
      if (p && p.then) { p.then(function () { video.pause(); seek(wantTime); }).catch(function () {}); }
    }
    seek(wantTime);
  });

  // ------------------------------------------------------------------ twin
  var twin = null, twinLoading = false;
  function loadTwin() {
    if (twinLoading) { return; }
    twinLoading = true;
    var small = Math.min(window.innerWidth, window.innerHeight) < 700;
    var script = document.createElement("script");
    script.src = "js/twin-scene.js";
    script.onload = function () {
      window.TwinScene.create(twinStage, {
        dataUrl: ASSETS + "story-twin-buildings.json",
        aerialUrl: ASSETS + "story-twin-aerial-" + (small ? "1024" : "2048") + ".webp",
        pixelRatio: Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)
      }).then(function (scene) { twin = scene; draw(); }).catch(function () { twinLoading = false; });
    };
    script.onerror = function () { twinLoading = false; };
    document.head.appendChild(script);
  }

  // ------------------------------------------------------------------ drawing
  var target = 0, shown = -1, animating = false, lastFrame = 0, lastCredit = null;

  function draw() {
    var state = stateAt(shown);
    seek(frameTime(state.frame));
    twinStage.style.opacity = state.twinOpacity.toFixed(3);
    video.style.visibility = state.twinOpacity >= 1 ? "hidden" : "visible";   // nothing to composite under the twin
    if (twin && state.twinOpacity > 0) { twin.setProgress(Math.max(0, state.twin)); }
    if (state.scene > 1.2) { loadTwin(); }   // the twin loads while the maps play
    var text = creditFor(state);
    if (text !== lastCredit) { credit.innerHTML = text; lastCredit = text; }
  }

  // Ease the shown position towards the scroll position; time-based, so it feels the same at any frame rate.
  function animate(now) {
    var dt = lastFrame ? Math.min(0.1, (now - lastFrame) / 1000) : 1 / 60;
    lastFrame = now;
    var diff = target - shown;
    shown = Math.abs(diff) < 0.05 ? target : shown + diff * (1 - Math.exp(-dt / GLIDE));
    draw();
    if (shown !== target) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
      lastFrame = 0;
    }
  }

  function update() {
    var vh = window.innerHeight;
    updateLead(vh);
    var r = story.getBoundingClientRect();
    var pos = Math.max(0, -r.top) / vh * 100;
    var entry = clamp01((vh - r.top) / vh);   // 0: story just appears, 1: pinned
    veil.style.opacity = String(Math.max(1 - ease((entry - 0.45) / 0.55), ease((pos - storyVh) / plan.fadeOutVh)));
    target = Math.min(pos, storyVh);
    if (shown < 0) { shown = target; draw(); return; }
    if (!animating && target !== shown) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }

  // The video starts loading once the page itself has loaded (so it never slows the hero image and fonts)
  // and the story is about one and a half screens away.
  function watchVideo() {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { loadVideo(); }
      }, { rootMargin: "150% 0px" }).observe(story);
    } else {
      loadVideo();
    }
  }
  if (document.readyState === "complete") {
    watchVideo();
  } else {
    window.addEventListener("load", watchVideo, { once: true });
  }

  var queued = false;
  function onScroll() {
    if (queued) { return; }
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    if (shape) { loadVideo(); }   // switches between the wide and tall video when the screen turns
    onScroll();
  });
  update();
})();
