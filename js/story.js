/*
 * Scroll story between the hero and "What I Do".
 *
 * A green route line draws itself and the page darkens into space. Then, pinned to the screen:
 *   1. a pre-rendered image sequence (satellite, the Netherlands, three maps, a dive towards Rotterdam),
 *      drawn on a canvas and moved frame by frame with the scroll;
 *   2. a small live 3D scene (js/twin-scene.js, three.js) in which a few real Rotterdam buildings turn
 *      into a digital twin; it cross-fades in over the end of the sequence.
 * Why images and not a video: a video can only jump to a new frame about 10 to 20 times a second while
 * scrolling; a decoded image is drawn in a millisecond or two, so the picture keeps up with the scroll.
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
  // Every rendered frame, in three sizes: phones, laptops, and large or high-density screens.
  var SEQUENCES = {
    tall: { dir: ASSETS + "frames-tall/", width: 720, height: 1440 },
    wide: { dir: ASSETS + "frames-wide/", width: 1600, height: 900 },
    widexl: { dir: ASSETS + "frames-wide-xl/", width: 1920, height: 1080 }
  };
  var PARALLEL = 6;   // images downloading at the same time
  // Time the scene takes to settle after a scroll step. Touch scrolling is already smooth, so none there.
  var GLIDE = window.matchMedia("(pointer: coarse)").matches ? 0 : 0.1;
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
  var canvas = story.querySelector("[data-story-frames]");
  var twinStage = story.querySelector("[data-story-twin]");
  var credit = story.querySelector("[data-story-credit]");
  var veil = story.querySelector("[data-story-veil]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp01(x) { return Math.min(1, Math.max(0, x)); }
  function ease(x) { x = clamp01(x); return x * x * (3 - 2 * x); }

  // ------------------------------------------------------------------ timeline
  // Absolute scroll positions (vh) of every step, and the rendered frame each one starts and ends on.
  var steps = [], at = 0, frames = 0;
  plan.steps.forEach(function (s) {
    var step = { from: at, to: at + s.vh, vh: s.vh, frame0: frames, frame1: frames };
    if (s.scene) { step.scene = s.scene; step.frame1 = frames + s.frames; frames += s.frames; }
    if (s.twin) { step.twin = s.twin; }
    steps.push(step);
    at += s.vh;
  });
  var storyVh = at;
  var COUNT = frames + 1;   // one image per rendered frame

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

  // ------------------------------------------------------------------ image sequence
  // A tall sequence for portrait screens (phones), a wide one for everything else. Images download in
  // rounds (every 16th, then every 8th, ...), so a rough version of the whole story works early and
  // the gaps fill in; the frames around the current scroll position always go first.
  // Downloaded images stay packed (small); only the frames around the current position are unpacked,
  // in the background, so drawing never has to wait for an image to be unpacked.
  var ctx = canvas.getContext("2d", { alpha: false });
  var AHEAD = 10, BEHIND = 5, KEEP = 12;   // frames unpacked ahead of / behind the position; kept up to KEEP away
  var shape = "", seq = null, packed = [], ready = [], unpacking = null, requested = null;
  var queue = [], active = 0, generation = 0, wanted = 0, painted = "";

  function sequenceShape() {
    if (window.innerHeight > window.innerWidth) { return "tall"; }
    // Screens that would show more than ~1700 real pixels across get the 1920 px images.
    var physical = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    return physical > 1700 ? "widexl" : "wide";
  }
  function frameUrl(i) { return seq.dir + "s" + String(i).padStart(3, "0") + ".webp"; }

  function loadOrder() {
    var order = [], seen = new Uint8Array(COUNT);
    [32, 16, 8, 4, 2, 1].forEach(function (stride) {
      for (var i = 0; i < COUNT; i += stride) {
        if (!seen[i]) { seen[i] = 1; order.push(i); }
      }
    });
    if (!seen[COUNT - 1]) { order.push(COUNT - 1); }
    return order;
  }

  function startSequence() {
    var next = sequenceShape();
    if (next === shape) { return; }
    shape = next;
    seq = SEQUENCES[shape];
    generation++;
    ready.forEach(function (bitmap) { if (bitmap && bitmap.close) { bitmap.close(); } });
    packed = new Array(COUNT);
    ready = new Array(COUNT);
    unpacking = new Uint8Array(COUNT);
    requested = new Uint8Array(COUNT);
    queue = loadOrder();
    active = 0;
    painted = "";
    sizeCanvas();
    pump();
  }

  function pump() {
    while (active < PARALLEL && queue.length) {
      var i = queue.shift();
      if (!requested[i]) { download(i, generation); }
    }
  }

  function download(i, gen) {
    requested[i] = 1;
    active++;
    fetch(frameUrl(i))
      .then(function (response) {
        if (!response.ok) { throw new Error(response.status); }
        return response.blob();
      })
      .then(function (blob) {
        if (gen !== generation) { return; }
        packed[i] = blob;
        if (Math.abs(i - wanted) <= KEEP || !painted) { unpackAround(); }
      })
      .catch(function () {
        if (gen === generation) { requested[i] = 0; }   // a failed image may be tried again later
      })
      .then(function () {
        if (gen === generation) { active--; pump(); }
      });
  }

  // Unpacks the downloaded frames near the current position and frees the ones far away.
  // At most two frames unpack at a time, nearest first, so a burst of unpacking never stalls the page.
  var DECODE_AT_ONCE = 2, decoding = 0, decodeNext = [];
  function unpackAround() {
    if (!seq) { return; }
    var centre = Math.round(wanted);
    for (var k = 0; k < COUNT; k++) {
      if (ready[k] && Math.abs(k - centre) > KEEP) {
        if (ready[k].close) { ready[k].close(); }
        ready[k] = null;
      }
    }
    decodeNext = [];
    for (var d = 0; d <= Math.max(AHEAD, BEHIND); d++) {   // centre outwards: nearest decodes first
      var a = centre + d, b = centre - d;
      if (d <= AHEAD && a < COUNT && packed[a] && !ready[a] && !unpacking[a]) { decodeNext.push(a); }
      if (d && d <= BEHIND && b >= 0 && packed[b] && !ready[b] && !unpacking[b]) { decodeNext.push(b); }
    }
    // Nothing near is downloaded yet (a fast jump): show the nearest downloaded frame meanwhile.
    if (!ready[centre] && !decodeNext.length) {
      var n = nearest(packed, wanted);
      if (n >= 0 && !ready[n] && !unpacking[n]) { decodeNext.push(n); }
    }
    drainDecodes();
  }

  function drainDecodes() {
    while (decoding < DECODE_AT_ONCE && decodeNext.length) {
      var i = decodeNext.shift();
      if (packed[i] && !ready[i] && !unpacking[i]) { unpack(i, generation); }
    }
  }

  function unpack(i, gen) {
    unpacking[i] = 1;
    decoding++;
    var job = window.createImageBitmap ? createImageBitmap(packed[i]) : imageFromBlob(packed[i]);
    job.then(function (bitmap) {
      unpacking[i] = 0;
      decoding--;
      if (gen !== generation || Math.abs(i - Math.round(wanted)) > KEEP + 4) {
        if (bitmap.close) { bitmap.close(); }
      } else {
        ready[i] = bitmap;
        if (Math.abs(i - wanted) <= 2 || !painted || painted.slice(-5) === ":near") { painted = ""; paint(); }
      }
      drainDecodes();
    }).catch(function () {
      unpacking[i] = 0;
      decoding--;
      drainDecodes();
    });
  }

  function imageFromBlob(blob) {   // for browsers without createImageBitmap
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  // Ask for the images around the current position before the rest of the queue.
  function prioritise(i) {
    for (var k = i + 3; k >= i - 1; k--) {
      if (k >= 0 && k < COUNT && !requested[k]) { queue.unshift(k); }
    }
    pump();
  }

  // The canvas never has more pixels than the images can fill (and never more than the screen has).
  function sizeCanvas() {
    if (!seq) { return; }
    var w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    var cover = Math.max(w / seq.width, h / seq.height);
    var ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, 1 / cover));
    var cw = Math.round(w * ratio), ch = Math.round(h * ratio);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
      painted = "";
    }
  }

  function drawCover(img, alpha) {
    var cw = canvas.width, ch = canvas.height;
    var scale = Math.max(cw / seq.width, ch / seq.height);
    var dw = seq.width * scale, dh = seq.height * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function nearest(list, p) {
    for (var d = 0; d < COUNT; d++) {
      var a = Math.floor(p) - d, b = Math.ceil(p) + d;
      if (a >= 0 && list[a]) { return a; }
      if (b < COUNT && list[b]) { return b; }
    }
    return -1;
  }

  // Draws sequence position p: the frame itself, or the nearest one that is ready. Frames are never
  // blended together, because blending shows fast-moving things (the satellite) twice.
  function paint() {
    if (!seq) { return; }
    var p = Math.min(COUNT - 1, Math.max(0, wanted));
    var i = Math.round(p);
    var n = ready[i] ? i : nearest(ready, p);
    if (n >= 0) {
      var key = n + ":1";
      if (key !== painted) {
        drawCover(ready[n], 1);
        painted = key;
      }
    }
    unpackAround();
    if (!packed[i]) { prioritise(i); }
  }

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
        // Sharpness capped: about 2.5 times less work than full retina, hardly visible on a moving scene.
        pixelRatio: Math.min(window.devicePixelRatio || 1, small ? 1 : 1.25)
      }).then(function (scene) { twin = scene; draw(); }).catch(function () { twinLoading = false; });
    };
    script.onerror = function () { twinLoading = false; };
    document.head.appendChild(script);
  }

  // ------------------------------------------------------------------ drawing
  var target = 0, shown = -1, animating = false, lastFrame = 0, lastCredit = null, idleTimer = 0;

  function draw() {
    var state = stateAt(shown);
    var covered = state.twinOpacity >= 1;
    twinStage.style.opacity = state.twinOpacity.toFixed(3);
    canvas.style.visibility = covered ? "hidden" : "visible";   // nothing to draw under the twin
    if (!covered) {
      wanted = state.frame;
      paint();
    }
    if (twin && state.twinOpacity > 0) { twin.setProgress(Math.max(0, state.twin)); }
    if (state.scene > 1.2) { loadTwin(); }   // at the latest while the maps play
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
    // Setting up the 3D scene takes a moment; do it during the first pause in scrolling inside the
    // story, when a short hitch cannot be seen.
    if (!twinLoading && pos > 0) {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(loadTwin, 300);
    }
    if (shown < 0 || GLIDE === 0) { shown = target; draw(); return; }
    if (!animating && target !== shown) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }

  // The images start loading once the page itself has loaded (so they never slow the hero image and
  // fonts) and the story is about one and a half screens away.
  function watchStory() {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { startSequence(); }
      }, { rootMargin: "150% 0px" }).observe(story);
    } else {
      startSequence();
    }
  }
  if (document.readyState === "complete") {
    watchStory();
  } else {
    window.addEventListener("load", watchStory, { once: true });
  }

  var queued = false;
  function onScroll() {
    if (queued) { return; }
    queued = true;
    requestAnimationFrame(function () { queued = false; update(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    if (shape) {
      startSequence();   // switches between the wide and tall images when the screen turns
      sizeCanvas();
      painted = "";
    }
    onScroll();
  });
  update();
})();
