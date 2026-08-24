/**
 * "Where we work" scroll transition — single source of truth for the scroll script.
 * Same contract as components/hero/heroSequence.ts: everything derives from normalized
 * progress p ∈ [0,1] across the pinned travel, so the renderer can be swapped without
 * touching these numbers.
 *
 * One camera move, three beats: scene 1 copy → dolly + tilt → the friction staircase →
 * the closing statement inside the opening.
 */

export const WHERE_TRAVEL_VH = 200; // hero is 300; this stage has one camera move, not two scenes
/** The pinned branch. Below 900px, squarer than 5:4, touch, or reduced motion → stacked flow.
 *  Must stay exactly complementary to the stacked @media query in globals.css. */
export const WHERE_QUERY =
  "(min-width: 900px) and (min-aspect-ratio: 5 / 4) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export const WHERE_ASSETS = { frame: "/where/where-frame.webp" } as const;

/**
 * Frame plane geometry. The plate is zero-bleed on top/left/right and OPEN at the bottom
 * (465 of 1432px transparent in the last row). Scene 2 is a BOTTOM-ANCHORED frame: the pan
 * lands the plate's bottom edge on the stage bottom, so the opaque bottom corners (left wall,
 * right columns and urn) terminate on the edge exactly like the still, and the transparent
 * bottom region shows the cream ground with no hard edge. Only top/left/right remain
 * no-expose edges — the downward pan only ever helps them.
 *
 * CAUTION: `base` must stay in lockstep with --wf-base in globals.css.
 */
export const FRAME = {
  ratio: 1432 / 962, // 1.48857
  base: 1.06, // === --wf-base
  idle: 1.02, // the slow breath across the idle beat
  dolly: 1.12, // scale at the end of the camera move — the still's scene 2 is barely more zoomed; the drama is the pan
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
  // ——— idle (0–0.12): a slow breath so the stage never reads as a flat still
  { target: '[data-wf="frame"]', at: [0, 0.12], from: { scale: 1 }, to: { scale: 1.02 }, ease: "none" },

  // ——— camera (0.18–0.48): dolly in and pan down together, landing on the bottom anchor.
  // The pan's yPercent here is NOMINAL — WhereScroll resolves it to panToBottomPct() per
  // refresh, so the plate's bottom edge lands exactly on the stage bottom at every viewport.
  { target: '[data-wf="frame"]', at: [0.18, 0.48], from: { scale: 1.02 }, to: { scale: 1.12 }, ease: "power2.inOut" },
  { target: '[data-wf="frame"]', at: [0.18, 0.48], from: { yPercent: 0 }, to: { yPercent: -27 }, ease: "power2.inOut" },
  // the staircase is sized to clear the stage on its own, so it does NOT ride the -18 tilt —
  // it only drifts, which keeps the plane alive against the frame without breaking the fit
  { target: ".wf-boxes", at: [0.42, 0.8], from: { yPercent: 0 }, to: { yPercent: -4 }, ease: "none" },
  // the ground counter-drifts a third: parallax depth without a second plate
  { target: ".wf-ground", at: [0.18, 0.48], from: { yPercent: 0 }, to: { yPercent: -6 }, ease: "power2.inOut" },

  // ——— the staircase narrative, one chained unit per block: appear → flip to the detail →
  // flip back, the flip-back riding the SAME window as the next block's entrance. The flips
  // are scrubbed (rotationY on the block's .wf-card-rot rotator, not on .wf-box-card, which
  // the CSS hover flip owns) so the whole chain reverses with the scroll like everything else.
  // opacity, NEVER autoAlpha: autoAlpha writes visibility:hidden, which would drop the section's
  // only links out of the tab order — a keyboard user would never reach them. Mouse reach is
  // gated by BOX_WINDOWS instead, so nothing invisible is ever clickable.
  { target: '[data-wb="1"]', at: [0.4, 0.45], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-wb="1"] .wf-card-rot', at: [0.455, 0.5], from: { rotationY: 0 }, to: { rotationY: 180 }, ease: "power2.inOut" },
  { target: '[data-wb="1"] .wf-card-rot', at: [0.54, 0.585], from: { rotationY: 180 }, to: { rotationY: 0 }, ease: "power2.inOut" },
  { target: '[data-wb="2"]', at: [0.54, 0.585], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-wb="2"] .wf-card-rot', at: [0.595, 0.64], from: { rotationY: 0 }, to: { rotationY: 180 }, ease: "power2.inOut" },
  { target: '[data-wb="2"] .wf-card-rot', at: [0.68, 0.725], from: { rotationY: 180 }, to: { rotationY: 0 }, ease: "power2.inOut" },
  { target: '[data-wb="3"]', at: [0.68, 0.725], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-wb="3"] .wf-card-rot', at: [0.735, 0.78], from: { rotationY: 0 }, to: { rotationY: 180 }, ease: "power2.inOut" },
  { target: '[data-wb="3"] .wf-card-rot', at: [0.8, 0.845], from: { rotationY: 180 }, to: { rotationY: 0 }, ease: "power2.inOut" },

  // ——— the blocks leave upward one by one so the closing statement owns the opening
  { target: '[data-wb="1"]', at: [0.855, 0.895], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -48 }, ease: "power2.in" },
  { target: '[data-wb="2"]', at: [0.87, 0.91], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -48 }, ease: "power2.in" },
  { target: '[data-wb="3"]', at: [0.885, 0.925], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -48 }, ease: "power2.in" },

  // ——— closing beat: the pill settles as the last word lands (word stagger built in WhereScroll)
  { target: ".wf-close .primary-cta", at: [0.94, 0.99], from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 }, ease: "power2.out" },

  // ——— handoff into the next section (mirrors .hs-handoff)
  { target: ".wf-handoff", at: [0.9, 1], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },
];

/** Where each block has finished its whole unit (entered, flipped, flipped back) — the focusin
 *  scroll target. Deliberately AFTER the flip-back: the focus-visible CSS flip composes with the
 *  scrubbed rotator, so focus must land where the rotator is back at 0 or the two cancel out. */
export const BOX_SETTLE = [0.6, 0.74, 0.85] as const;
/** p windows in which a block is actually on screen, and therefore mouse-reachable. The blocks
 *  stay tabbable outside these (see the opacity note above) — focusin brings the pin to them. */
export const BOX_WINDOWS = [[0.4, 0.895], [0.54, 0.91], [0.68, 0.925]] as const;
/** Where the closing pill becomes readable — its mouse gate, and the focusin target. */
export const CLOSE_SETTLE = 0.98;
export const CLOSE_OPEN = 0.92;

/** The scene-2 pan target, as a yPercent of the stage box: the travel that moves the plate's
 *  bottom edge from its centered rest position onto the stage bottom at the fully-dollied
 *  scale, plus the overshoot. Negative (upward image travel === camera panning down). */
export function panToBottomPct(stageW: number, stageH: number) {
  if (!stageW || !stageH) return -FRAME.overshoot;
  const frameH = (Math.max(stageW, stageH * FRAME.ratio) * FRAME.base * FRAME.dolly) / FRAME.ratio;
  // + overshoot: pan slightly LESS than exact alignment, so the edge tucks below the stage
  // bottom and crops invisibly — panning past it would drag a hard edge into view instead
  return -((frameH / stageH - 1) / 2) * 100 + FRAME.overshoot;
}
