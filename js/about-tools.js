(function () {
  "use strict";

  var section = document.querySelector(".about-tools");
  if (!section) return;

  // A logo filename identifies a local Simple Icons asset; otherwise use a text badge.
  var categories = {
    gis: [
      { name: "QGIS", logo: "qgis" },
      { name: "ArcGIS Pro", logo: "arcgis" },
      { name: "PostGIS", badge: "PG" },
      { name: "GeoPandas", logo: "geopandas" },
      { name: "Shapely", badge: "Sh" },
      { name: "Rasterio", badge: "Rio" },
      { name: "GDAL", logo: "gdal" },
      { name: "momepy", badge: "mm" }
    ],
    earth: [
      { name: "Google Earth Engine", logo: "googleearthengine" },
      { name: "ECOSTRESS", badge: "ECO" },
      { name: "Sentinel-2", badge: "S2" },
      { name: "Landsat", badge: "LS" },
      { name: "MODIS", badge: "MOD" }
    ],
    web: [
      { name: "Leaflet", logo: "leaflet" },
      { name: "MapLibre", logo: "maplibre" },
      { name: "Mapbox GL JS", logo: "mapbox" },
      { name: "OpenLayers", logo: "openlayers" },
      { name: "Cesium", logo: "cesium" },
      { name: "JavaScript", logo: "javascript" },
      { name: "HTML", logo: "html5" },
      { name: "CSS", logo: "css" }
    ],
    data: [
      { name: "Python", logo: "python" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "SQL", badge: "SQL" },
      { name: "Pandas", logo: "pandas" },
      { name: "NumPy", logo: "numpy" },
      { name: "Jupyter", logo: "jupyter" },
      { name: "Git", logo: "git" },
      { name: "GitHub", logo: "github" },
      { name: "SQLite", logo: "sqlite" },
      { name: "FastAPI", logo: "fastapi" }
    ],
    services: [
      { name: "OGC API Features", badge: "OGC" },
      { name: "WMS", badge: "WMS" },
      { name: "WFS", badge: "WFS" },
      { name: "PDOK", badge: "PDOK" },
      { name: "BAG", badge: "BAG" },
      { name: "CBS", badge: "CBS" },
      { name: "GeoJSON", badge: "{ }" }
    ]
  };

  var stage = section.querySelector(".tools-stage");
  var buttons = Array.from(section.querySelectorAll(".tools-category"));
  var orbit = section.querySelector(".tools-orbit");
  var status = section.querySelector(".tools-status");
  var hoverInput = window.matchMedia("(min-width: 769px) and (hover: hover) and (pointer: fine)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var activeCategory = null;
  var hoverCandidate = null;
  var lastPointerX;
  var lastPointerY;
  var hoverSelection;
  var hoverSelectionPoint;
  var hoverTimer;
  var revealTimer;

  function createTool(tool, index, count) {
    var item = document.createElement("li");
    var counter = document.createElement("div");
    var node = document.createElement("div");
    var icon = document.createElement("span");
    var label = document.createElement("span");
    item.className = "tools-orbit-slot";
    item.style.setProperty("--tool-angle", (index * 360 / count - 90) + "deg");
    counter.className = "tools-tool-counter";
    node.className = "tools-tool";
    icon.className = "tools-tool-icon";
    icon.setAttribute("aria-hidden", "true");
    label.className = "tools-tool-label";
    label.textContent = tool.name;

    if (tool.logo) {
      var image = document.createElement("img");
      image.src = "assets/tools/" + tool.logo + ".svg";
      image.alt = "";
      image.width = 25;
      image.height = 25;
      icon.appendChild(image);
    } else {
      icon.classList.add("tools-tool-badge");
      icon.textContent = tool.badge;
    }

    node.append(icon, label);
    counter.appendChild(node);
    item.appendChild(counter);
    return item;
  }

  function activate(button) {
    clearTimeout(hoverTimer);
    hoverCandidate = null;
    var category = button.dataset.category;
    if (activeCategory === category) return;
    activeCategory = category;
    clearTimeout(revealTimer);
    stage.classList.remove("is-revealed");
    stage.classList.add("is-active", "is-switching");

    var position = 0;
    buttons.forEach(function (candidate) {
      var selected = candidate === button;
      candidate.classList.toggle("is-selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
      if (selected) {
        delete candidate.dataset.position;
      } else {
        candidate.dataset.position = String(position++);
      }
    });

    // Recreate the track so its rotation and all counter-rotations share a clock.
    var list = document.createElement("ul");
    list.className = "tools-orbit-track";
    categories[category].forEach(function (tool, index, tools) {
      list.appendChild(createTool(tool, index, tools.length));
    });
    orbit.replaceChildren(list);
    orbit.setAttribute("aria-labelledby", button.id);
    orbit.removeAttribute("aria-label");
    orbit.hidden = false;
    status.textContent = button.querySelector(".tools-category-label").textContent + ": " + categories[category].length + " tools.";
    revealTimer = setTimeout(function () {
      stage.classList.remove("is-switching");
      stage.classList.add("is-revealed");
    }, reducedMotion.matches ? 0 : 480);
  }

  // Repositioning a node under a stationary cursor must not select it again.
  stage.addEventListener("pointermove", function (event) {
    if (!hoverInput.matches || event.pointerType === "touch") return;
    if (event.clientX === lastPointerX && event.clientY === lastPointerY) return;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    var button = event.target.closest(".tools-category");
    if (button === hoverCandidate) return;
    clearTimeout(hoverTimer);
    hoverCandidate = button;
    if (button) {
      hoverTimer = setTimeout(function () {
        if (button.matches(":hover")) {
          hoverSelection = button;
          hoverSelectionPoint = { x: lastPointerX, y: lastPointerY };
          activate(button);
        }
      }, 150);
    }
  });

  buttons.forEach(function (button) {
    button.addEventListener("pointerleave", function () {
      clearTimeout(hoverTimer);
      hoverCandidate = null;
    });
    button.addEventListener("click", function (event) {
      // A click at the same spot after a hover move confirms that selection.
      if (hoverInput.matches && event.detail > 0 && hoverSelectionPoint &&
          Math.hypot(event.clientX - hoverSelectionPoint.x, event.clientY - hoverSelectionPoint.y) < 6) {
        activate(hoverSelection);
      } else {
        hoverSelectionPoint = null;
        activate(button);
      }
    });
  });

  window.addEventListener("resize", function () {
    stage.classList.remove("is-switching");
  });

  // Offscreen sections do not need continuous motion; no animation-frame loop is used.
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      stage.classList.toggle("is-offscreen", !entries[0].isIntersecting);
    });
    observer.observe(stage);
  }
})();
