/**
 * "Where we work" scroll transition — single source of truth for the scroll script.
 * Same contract as components/hero/heroSequence.ts: everything derives from normalized
 * progress p ∈ [0,1] across the pinned travel, so the renderer can be swapped without
 * touching these numbers.
 *
 * One camera move, three beats: scene 1 copy → dolly + tilt → the friction staircase →
 * the closing statement inside the opening.
 */

export const WHERE_TRAVEL_VH = 300; // the flip chain needs room to read: ~20vh of scroll per 180° turn

/** Two pinned branches running the SAME script over a different plate. The split is purely
 *  The portrait cut is 0.52:1, so it only suits a tall, narrow viewport; anything squarer,
 *  tablet portrait included, crops a third of its height away and loses both the canopy and
 *  the pedestals. Two clauses, because neither axis works alone:
 *
 *    - phones: width + orientation. Aspect ratio cannot be used here — iOS Safari CHANGES it
 *      as the toolbar collapses, and a 375x553 / 375x667 iPhone swapped plates mid-scroll and
 *      rebuilt the whole timeline each time.
 *    - 768-1023px: aspect, so a tall narrow window (e.g. 800x1400) still gets the portrait cut
 *      rather than a staircase squeezed into 22vw. No tablet sits near 5/8 — an iPad portrait
 *      is ~0.75 and its toolbar moves that by ~0.03 — so the toolbar cannot flip this one.
 *
 *  Anything 1024px and up is wide. The queries repeat the motion clause per branch rather than
 *  using `or`, which predates Safari 16.4. Only reduced motion falls through to the static
 *  stacked flow; touch is not excluded, since the flip chain is scrubbed and needs no pointer.
 *  These must stay complementary to the @media blocks in globals.css. The one viewport that can
 *  satisfy both — exactly 5/8 — is resolved to SMALL in both places: CSS by source order, and
 *  WhereScroll by reading matchMedia's `small` condition first. */
const MOTION = "(prefers-reduced-motion: no-preference)";

export const WHERE_QUERY_SMALL =
  `(max-width: 767px) and (orientation: portrait) and ${MOTION},` +
  ` (min-width: 768px) and (max-width: 1023px) and (max-aspect-ratio: 5 / 8) and ${MOTION}`;

export const WHERE_QUERY =
  `(max-width: 767px) and (orientation: landscape) and ${MOTION},` +
  ` (min-width: 768px) and (max-width: 1023px) and (min-aspect-ratio: 5 / 8) and ${MOTION},` +
  ` (min-width: 1024px) and ${MOTION}`;

/**
 * Plate geometry, one entry per branch. Both plates are opaque along the top and open at the
 * bottom, and scene 2 is a BOTTOM-ANCHORED frame in both: the pan lands the plate's bottom edge
 * on the stage bottom, so the pedestals and urn terminate on the edge and the transparent
 * bottom shows the cream ground with no hard seam. Only the top (and, on the wide plate, the
 * sides) are no-expose edges, and the downward pan only ever helps them.
 *
 * `dolly` is what clears the canopy off the top: the portrait cut needs a much stronger push
 * than the wide one because its canopy band is proportionally deeper.
 *
 * CAUTION: each `ratio`/`base` must stay in lockstep with --wf-ratio/--wf-base in globals.css.
 */
export const PLATE = {
  wide: { src: "/where/where-frame.webp", avif: "/where/where-frame.avif", ratio: 1432 / 962, base: 1.06, dolly: 1.12, w: 1432, h: 962 },
  small: { src: "/where/where-frame-small.webp", avif: "/where/where-frame-small.avif", ratio: 1200 / 2304, base: 1.06, dolly: 1.18, w: 1200, h: 2304 },
} as const;
export type Plate = (typeof PLATE)[keyof typeof PLATE];

export const FRAME = {
  idle: 1.02, // the slow breath across the idle beat
  overshoot: 1, // % of stage height the bottom edge tucks past the stage bottom (rounding guard)
} as const;

export type WhereStep = {
  target: string;
  at: readonly [number, number];
  from: Record<string, number>;
  to: Record<string, number>;
  ease: string;
};

/**
 * Scroll script. Exits ease-in, entrances ease-out (hero convention); the camera move is the
 * one exception — it starts and settles from rest, so power2.inOut.
 * The scene-1 copy exit is a stagger, built alongside this in WhereScroll.
 *
 * CAUTION: [data-wf="frame"] scale is written by two ADJACENT (never overlapping) windows.
 * idle.to must equal dolly.from or the scrub strands at the seam.
 */
export const whereScript: WhereStep[] = [
  // ——— idle (0–0.08): a slow breath so the stage never reads as a flat still
  { target: '[data-wf="frame"]', at: [0, 0.08], from: { scale: 1 }, to: { scale: 1.02 }, ease: "none" },

  // ——— camera (0.13–0.38): dolly in and pan down together, landing on the bottom anchor.
  // Both values are NOMINAL — WhereScroll swaps in the active plate's dolly and resolves the
  // pan per refresh, so the plate's bottom edge lands on the stage bottom at every viewport.
  { target: '[data-wf="frame"]', at: [0.13, 0.38], from: { scale: 1.02 }, to: { scale: 1.12 }, ease: "power2.inOut" },
  { target: '[data-wf="frame"]', at: [0.13, 0.38], from: { yPercent: 0 }, to: { yPercent: -27 }, ease: "power2.inOut" },
  // the ground counter-drifts a third: parallax depth without a second plate
  { target: ".wf-ground", at: [0.13, 0.38], from: { yPercent: 0 }, to: { yPercent: -6 }, ease: "power2.inOut" },

  // ——— the staircase narrative, one chained unit per block: appear → flip to the detail, and
  // STAY on the detail. The flip-backs are gone by design — each block holds what it turned
  // over to, so by the closing beat all three read as detail at once. The flips are scrubbed
  // (rotationY on the block's .wf-card-rot rotator, not on .wf-box-card, which the CSS hover
  // flip owns) so the chain still reverses with the scroll like everything else, and hover
  // still toggles a block back to its title because the two rotors compose.
  // opacity, NEVER autoAlpha: autoAlpha writes visibility:hidden, which would drop the section's
  // only links out of the tab order — a keyboard user would never reach them. Mouse reach is
  // gated by BOX_WINDOWS instead, so nothing invisible is ever clickable.
  { target: '[data-wb="1"]', at: [0.34, 0.4], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-wb="1"] .wf-card-rot', at: [0.42, 0.485], from: { rotationY: 0 }, to: { rotationY: 180 }, ease: "power2.inOut" },
  { target: '[data-wb="2"]', at: [0.51, 0.575], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-wb="2"] .wf-card-rot', at: [0.595, 0.66], from: { rotationY: 0 }, to: { rotationY: 180 }, ease: "power2.inOut" },
  { target: '[data-wb="3"]', at: [0.685, 0.75], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  // ...and as block 3 arrives the whole staircase climbs, so 01 and 02 make room and block 3
  // clears the stage bottom in full. BOXES_LIFT is what the CSS box tops are laid out against.
  { target: ".wf-boxes", at: [0.685, 0.78], from: { yPercent: 0 }, to: { yPercent: -14 }, ease: "power2.inOut" },
  { target: '[data-wb="3"] .wf-card-rot', at: [0.77, 0.835], from: { rotationY: 0 }, to: { rotationY: 180 }, ease: "power2.inOut" },

  // ——— the blocks leave upward one by one so the closing statement owns the opening
  { target: '[data-wb="1"]', at: [0.9, 0.945], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -56 }, ease: "power2.in" },
  { target: '[data-wb="2"]', at: [0.915, 0.96], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -56 }, ease: "power2.in" },
  { target: '[data-wb="3"]', at: [0.93, 0.975], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -56 }, ease: "power2.in" },

  // ——— closing beat: the pill settles as the last word lands (word stagger built in WhereScroll)
  { target: ".wf-close .primary-cta", at: [0.955, 0.995], from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 }, ease: "power2.out" },

  // ——— handoff into the next section (mirrors .hs-handoff)
  { target: ".wf-handoff", at: [0.94, 1], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },
];

/** How far the staircase climbs when block 3 arrives, as a % of stage height. The CSS box tops
 *  are laid out so that AFTER this lift block 3 clears the bottom and block 1 sits flush with
 *  the top — change one and re-check the other. */
export const BOXES_LIFT = 14;

/** Where each block has just finished entering, front face up — the focusin scroll target.
 *  Deliberately a point where the rotator reads 0: the focus-visible CSS flip composes with the
 *  scrubbed rotator, so focus must land where the rotator is at rest or the two cancel out. */
export const BOX_SETTLE = [0.41, 0.585, 0.762] as const;
/** p windows in which a block is actually on screen, and therefore mouse-reachable. The blocks
 *  stay tabbable outside these (see the opacity note above) — focusin brings the pin to them. */
export const BOX_WINDOWS = [[0.34, 0.945], [0.51, 0.96], [0.685, 0.975]] as const;
/** Where the closing pill becomes readable — its mouse gate, and the focusin target. */
export const CLOSE_SETTLE = 0.99;
export const CLOSE_OPEN = 0.95;

/** The scene-2 pan target, as a yPercent of the stage box: the travel that moves the plate's
 *  bottom edge from its centered rest position onto the stage bottom at the fully-dollied
 *  scale, plus the overshoot. Negative (upward image travel === camera panning down). */
export function panToBottomPct(plate: Plate, stageW: number, stageH: number) {
  if (!stageW || !stageH) return -FRAME.overshoot;
  const frameH = (Math.max(stageW, stageH * plate.ratio) * plate.base * plate.dolly) / plate.ratio;
  // + overshoot: pan slightly LESS than exact alignment, so the edge tucks below the stage
  // bottom and crops invisibly — panning past it would drag a hard edge into view instead
  return -((frameH / stageH - 1) / 2) * 100 + FRAME.overshoot;
}
