/** Frozen path→element grouping for public/cases/case-0N.svg.
 *  Generated 2026-08-19 from the committed SVGs by geometric analysis
 *  (bbox clustering of absolute-coordinate path data). Refs are
 *  document-order path indices; every group holds WHOLE path elements —
 *  compound paths are never split, because their hole subpaths only
 *  punch while fused with their outer contour. All fills share one
 *  opaque color, so regrouping (reordering) is render-identical.
 *  Regenerate only if the art files change. */

export interface ClipRect {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CaseGroupingSpec {
  /** array order = DOM order of the emitted <g data-el> wrappers */
  groups: Array<{ name: string; refs: number[] }>;
  /** named clip rects in viewBox coordinates, rendered full-size */
  clips: ClipRect[];
  /** clip name → group name it applies to (several clips may share a group) */
  clipOwner: Record<string, string>;
}

export const caseGroups: Record<string, CaseGroupingSpec> = {
  // 4 planes (as two fused pairs) → double frame → 3 output bars. viewBox 0 0 1067 524
  "case-01": {
    groups: [
      { name: "planes12", refs: [35, 30, 36, 41, 42, 43, 45, 47, 52, 53, 54, 59, 60, 66, 67, 68, 69, 73, 80, 102, 108, 111, 115, 142] },
      { name: "planes34", refs: [29, 44, 57, 58, 61, 64, 77, 81, 89, 90, 91, 94, 99, 104, 128] },
      { name: "frameOuter", refs: [39, 40, 46, 55, 56, 87, 93, 97, 100, 107, 110, 116, 118, 119, 121, 125, 129, 130, 144, 145] },
      { name: "frameLeftDash", refs: [48, 72, 78, 79, 96, 112, 131, 140, 146, 147] },
      { name: "frameInner", refs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 65] },
      { name: "bar1", refs: [37, 38, 50, 62, 75, 76, 83, 84, 86, 95, 103, 105, 106, 109, 117, 132, 134, 137, 138, 139] },
      { name: "bar2", refs: [31, 32, 33, 34] },
      { name: "bar3", refs: [49, 51, 63, 70, 71, 74, 82, 85, 88, 92, 98, 101, 113, 114, 120, 122, 123, 124, 126, 127, 133, 135, 136, 141, 143] },
    ],
    clips: [
      { name: "frameL", x: 476, y: 40, w: 159, h: 464 },
      { name: "frameR", x: 635, y: 40, w: 159, h: 464 },
      { name: "leftDash", x: 500, y: 140, w: 14, h: 356 },
    ],
    clipOwner: { frameL: "frameOuter", frameR: "frameOuter", leftDash: "frameLeftDash" },
  },

  // 4 circles → ring → 3 branch+box outputs. The whole outer contour network is
  // one fused path ("master"), so stages are clip-band reveals; only the ring's
  // inner rim (path 1) is a free element. viewBox 0 0 944 557
  "case-02": {
    groups: [
      { name: "master", refs: [0] },
      { name: "ringDetail", refs: [1] },
    ],
    clips: [
      // one ltr sweep across the circle row reads as the circles appearing in
      // sequence and guarantees the connector segments between them are covered
      { name: "sweep", x: -8, y: 240, w: 452, h: 90 },
      { name: "ring", x: 428, y: 145, w: 204, h: 275 },
      { name: "branchTop", x: 600, y: -2, w: 348, h: 188 },
      { name: "branchMid", x: 600, y: 186, w: 348, h: 185 },
      { name: "branchBot", x: 600, y: 371, w: 348, h: 188 },
    ],
    clipOwner: {
      sweep: "master", ring: "master",
      branchTop: "master", branchMid: "master", branchBot: "master",
    },
  },

  // concentric orbits + cubes (fused with orbit1) + raised cube climax.
  // Cubes appear as orbit1's ltr sweep passes them (left→centre→right). viewBox 0 0 912 650
  "case-03": {
    groups: [
      { name: "orbit1", refs: [0] },
      { name: "orbit2", refs: [3, 4] },
      { name: "orbit3", refs: [1] },
      { name: "raisedCube", refs: [2] },
      { name: "dashes", refs: [7, 6, 5, 8, 9] },
    ],
    clips: [
      { name: "orbit3", x: 310, y: 358, w: 272, h: 138 },
      { name: "orbit2", x: 96, y: 271, w: 642, h: 281 },
      { name: "orbit1", x: -6, y: 224, w: 936, h: 446 },
      { name: "dashLine", x: 450, y: 170, w: 14, h: 192 },
    ],
    clipOwner: { orbit3: "orbit3", orbit2: "orbit2", orbit1: "orbit1", dashLine: "dashes" },
  },

  // accordion planes folding toward one block. viewBox 0 0 887 627
  "case-04": {
    groups: [
      { name: "plane1", refs: [3] },
      { name: "plane2", refs: [1] },
      { name: "plane3", refs: [4] },
      { name: "plane4", refs: [2] },
      { name: "plane5", refs: [0] },
      { name: "planeEdges", refs: [6, 7, 8, 9, 13, 18, 25, 26, 28, 31, 32, 35, 44, 50, 51, 52] },
      { name: "convergeUpper", refs: [15, 16, 17, 21, 22, 23, 27, 29, 30, 33, 34, 36, 37, 39, 40, 43, 45, 46, 48, 49, 54] },
      { name: "convergeLower", refs: [20, 24, 38, 41, 42, 47, 53] },
      { name: "block", refs: [5, 10, 11, 12, 14, 19] },
    ],
    clips: [
      { name: "convUp", x: 538, y: 42, w: 316, h: 232 },
      { name: "convLo", x: 546, y: 560, w: 230, h: 70 },
    ],
    clipOwner: { convUp: "convergeUpper", convLo: "convergeLower" },
  },
};
