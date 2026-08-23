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
 * (465 of 1432px transparent in the last row) — and the tilt moves the image up, spending
 * exactly that bottom headroom. So the cover box is pre-scaled by `base` and the tilt is
 * clamped at runtime to whatever headroom that bought.
 *
 * CAUTION: `base` must stay in lockstep with --wf-base in globals.css.
 */
export const FRAME = {
  ratio: 1432 / 962, // 1.48857
  base: 1.06, // === --wf-base
  idle: 1.02, // the slow breath across the idle beat
  dolly: 1.15, // scale at the end of the camera move (measured off the scene-2 still)
  tilt: -18, // yPercent of the STAGE box — the planes are inset:0, so % === stage %
  safety: 0.9, // never spend more than 90% of the measured headroom
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

  // ——— camera (0.18–0.48): dolly in and tilt down together. Same window, same ease, on purpose:
  // the dolly is what buys the vertical headroom the tilt spends, so the two must advance in
  // lockstep or a mid-move frame exposes the plate's open bottom edge (see headroomPct below).
  { target: '[data-wf="frame"]', at: [0.18, 0.48], from: { scale: 1.02 }, to: { scale: 1.15 }, ease: "power2.inOut" },
  { target: '[data-wf="frame"]', at: [0.18, 0.48], from: { yPercent: 0 }, to: { yPercent: -18 }, ease: "power2.inOut" },
  // the staircase is sized to clear the stage on its own, so it does NOT ride the -18 tilt —
  // it only drifts, which keeps the plane alive against the frame without breaking the fit
  { target: ".wf-boxes", at: [0.42, 0.8], from: { yPercent: 0 }, to: { yPercent: -4 }, ease: "none" },
  // the ground counter-drifts a third: parallax depth without a second plate
  { target: ".wf-ground", at: [0.18, 0.48], from: { yPercent: 0 }, to: { yPercent: -6 }, ease: "power2.inOut" },

  // ——— the staircase enters top to bottom, each block overlapping the previous by half its window.
  // opacity, NEVER autoAlpha: autoAlpha writes visibility:hidden, which would drop the section's
  // only links out of the tab order — a keyboard user would never reach them. Mouse reach is
  // gated by BOX_WINDOWS instead, so nothing invisible is ever clickable.
  { target: '[data-wb="1"]', at: [0.42, 0.52], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-wb="2"]', at: [0.49, 0.59], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-wb="3"]', at: [0.56, 0.66], from: { opacity: 0, y: 64, scale: 0.94 }, to: { opacity: 1, y: 0, scale: 1 }, ease: "power2.out" },

  // ——— the blocks recede (0.80–0.89) so the closing statement owns the opening
  { target: '[data-wb="1"]', at: [0.8, 0.87], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -48 }, ease: "power2.in" },
  { target: '[data-wb="2"]', at: [0.81, 0.88], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -48 }, ease: "power2.in" },
  { target: '[data-wb="3"]', at: [0.82, 0.89], from: { opacity: 1, y: 0 }, to: { opacity: 0, y: -48 }, ease: "power2.in" },

  // ——— closing beat: the pill settles as the last word lands (word stagger built in WhereScroll)
  { target: ".wf-close .primary-cta", at: [0.92, 0.98], from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 }, ease: "power2.out" },

  // ——— handoff into the next section (mirrors .hs-handoff)
  { target: ".wf-handoff", at: [0.9, 1], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },
];

/** Where each block finishes entering: the auto-flip peek fires here, and focusin scrolls the pin here. */
export const BOX_SETTLE = [0.52, 0.59, 0.66] as const;
/** p windows in which a block is actually on screen, and therefore mouse-reachable. The blocks
 *  stay tabbable outside these (see the opacity note above) — focusin brings the pin to them. */
export const BOX_WINDOWS = [[0.42, 0.87], [0.49, 0.88], [0.56, 0.89]] as const;
/** Where the closing pill becomes readable — its mouse gate, and the focusin target. */
export const CLOSE_SETTLE = 0.98;
export const CLOSE_OPEN = 0.92;

/** Vertical headroom of the cover box, as a percentage of stage height, measured at the
 *  fully-dollied scale — which is where the tilt reaches full amplitude. Both ramp on the same
 *  eased window and the dolly's headroom grows faster than the tilt spends it, so checking the
 *  end point is sufficient for the whole move. */
export function headroomPct(stageW: number, stageH: number) {
  const frameH = (Math.max(stageW, stageH * FRAME.ratio) * FRAME.base * FRAME.dolly) / FRAME.ratio;
  return ((frameH - stageH) / 2 / stageH) * 100;
}

/** 0–1 scaler applied to every yPercent in the script; 1 when the headroom covers the full tilt. */
export function tiltFactor(stageW: number, stageH: number) {
  if (!stageW || !stageH) return 1;
  return Math.min(1, (headroomPct(stageW, stageH) * FRAME.safety) / Math.abs(FRAME.tilt));
}
