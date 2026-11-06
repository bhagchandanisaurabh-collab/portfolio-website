/*
 * Timeline of the scroll story, shared by the page (js/story.js) and the one-time render tool (bake.html).
 *
 * vh      scroll length of the step (100 = one screen height).
 * scene   pre-rendered into the video: the globe scene's progress runs from scene[0] to scene[1]
 *         over "frames" video frames (0-1 satellite to the Netherlands, 1-2 the three maps,
 *         2-3 the dive towards Rotterdam).
 * hold    keeps the current video frame while the visitor scrolls (a pause on a finished map).
 * twin    drives the live twin scene from twin[0] to twin[1].
 *
 * Changing a "scene" step means rendering and encoding the video again; vh and hold lengths
 * can be changed freely.
 */
window.STORY_PLAN = {
  fps: 30,
  steps: [
    { vh: 200, scene: [0, 0.24], frames: 60 },          // around Landsat 8
    { vh: 200, scene: [0.24, 0.6], frames: 60 },        // slow turn towards Earth
    { vh: 200, scene: [0.6, 1], frames: 60 },           // zoom to the whole Netherlands
    { vh: 100, scene: [1, 4 / 3], frames: 30 },         // map 1: elevation scans in
    { vh: 45, hold: true },
    { vh: 100, scene: [4 / 3, 5 / 3], frames: 30 },     // map 2: surface temperature
    { vh: 45, hold: true },
    { vh: 100, scene: [5 / 3, 2], frames: 30 },         // map 3: land cover
    { vh: 45, hold: true },
    { vh: 150, scene: [2, 3], frames: 45 },             // dive towards the Wilhelminapier
    { vh: 500, twin: [0, 1] }                           // physical city to digital twin (live)
  ],
  twinFadeFrom: 0.72,   // share of the dive after which the twin cross-fades in over the video
  fadeOutVh: 78         // back to black at the end, then the page continues
};
