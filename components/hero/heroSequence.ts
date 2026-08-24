/**
 * Hero scroll transition — single source of truth for the scroll script.
 * See doc/Hero_Scroll_Transition_Implementation_Plan.md (§3 stage, §4 script).
 *
 * Everything derives from normalized progress p ∈ [0,1] across the pinned travel;
 * the renderer (DOM/canvas) can be swapped without touching these numbers.
 */

export const HERO_TRAVEL_VH = 300; // raise to 350–400 if the slow-cinema feel is lacking — p values stay unchanged
export const MOBILE_QUERY = "(max-width: 720px)";

export const HERO_ASSETS = {
  s1Sky: "/hero/hero-s1-a-sky.webp",
  s1City: "/hero/hero-s1-b-city.webp",
  s1Temple: "/hero/hero-s1-c-temple.webp",
  s1Trees: "/hero/hero-s1-d-trees.webp",
  s2Sky: "/hero/hero-s2-a-sky.webp",
  s2Lake: "/hero/hero-s2-b-lake.webp",
  s2Arch: "/hero/hero-s2-c-arch.webp",
  s1Poster: "/hero/hero-s1-poster.webp",
  s2Poster: "/hero/hero-s2-poster.webp",
} as const;

/** Bayer dissolve band (§5). Canvas is active slightly wider than the threshold
 *  sweep so both edges land on pure single-sky frames and the DOM handoff is seamless. */
export const DISSOLVE = {
  band: [0.42, 0.585],
  sweep: [0.45, 0.58],
  cellPx: 7, // aligned to device pixels at draw time (caution §8)
  s1SkyScale: 1.18, // 1-A held at the end of its push
  s2SkyScale: [1.12, 1.06], // must mirror the DOM tween on [data-hs="s2-a"]
  s2SkySettle: [0.45, 0.6],
} as const;

/** Rain surge around the dissolve: density ×1.5, slight speed-up (§4, §5). */
export const RAIN_SURGE = { band: [0.4, 0.6], ramp: 0.05, density: 0.5, speed: 0.35 } as const;

/** Shared mutable state written by the ScrollTrigger and read by the canvas renderers. */
export type HeroMotion = {
  p: number;
  visible: boolean;
  /** mobile movement/particle multiplier (×0.5 on small screens, §6) */
  factor: number;
  /** degraded by the frame-rate probe (§6): front rain off, dissolve → plain crossfade */
  quality: { frontRain: boolean; dither: boolean };
};

export const createHeroMotion = (): HeroMotion => ({
  p: 0,
  visible: true,
  factor: 1,
  quality: { frontRain: true, dither: true },
});

export type HeroStep = {
  target: string;
  at: readonly [number, number];
  from: Record<string, number>;
  to: Record<string, number>;
  ease: string;
};

/**
 * Scroll script §4. Exits ease-in (accelerating away), entrances ease-out
 * (decelerating into place), the dissolve stays linear.
 * Headline and mission word staggers are built alongside this in HeroScroll.
 */
export const heroScript: HeroStep[] = [
  // ——— S1 exit: dolly forward past the temple (0.15–0.40)
  { target: '[data-hs="s1-d"]', at: [0.15, 0.4], from: { scale: 1, xPercent: 0 }, to: { scale: 1.6, xPercent: 25 }, ease: "power2.in" },
  { target: '[data-hs="s1-d"]', at: [0.15, 0.35], from: { autoAlpha: 1 }, to: { autoAlpha: 0 }, ease: "power1.in" },
  { target: '[data-hs="s1-c"]', at: [0.15, 0.42], from: { scale: 1, xPercent: 0, yPercent: 0 }, to: { scale: 1.35, xPercent: 18, yPercent: -8 }, ease: "power2.in" },
  // safety fade so only sky + rain remain by p=0.45 even on very wide viewports
  { target: '[data-hs="s1-c"]', at: [0.36, 0.44], from: { autoAlpha: 1 }, to: { autoAlpha: 0 }, ease: "power1.in" },
  { target: '[data-hs="s1-b"]', at: [0.15, 0.4], from: { scale: 1, yPercent: 0 }, to: { scale: 1.12, yPercent: 10 }, ease: "power2.in" },
  { target: '[data-hs="s1-b"]', at: [0.38, 0.45], from: { autoAlpha: 1 }, to: { autoAlpha: 0 }, ease: "none" },
  { target: '[data-hs="s1-a"]', at: [0.15, 0.4], from: { scale: 1.08 }, to: { scale: 1.18 }, ease: "none" },
  // release S1 sky from the render tree once the dissolve has fully handed over (§9 memory)
  { target: '[data-hs="s1-a"]', at: [0.585, 0.6], from: { autoAlpha: 1 }, to: { autoAlpha: 0 }, ease: "none" },

  // ——— Dissolve band (0.40–0.60): DOM crossfade is the baseline; the Bayer
  // canvas renders the true dither above it whenever it is available.
  { target: '[data-hs="s2-a"]', at: [0.45, 0.58], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },
  { target: '[data-hs="s2-a"]', at: [0.45, 0.6], from: { scale: 1.12 }, to: { scale: 1.06 }, ease: "power2.out" },

  // ——— serif interlude riding the sky change: words reveal via the scrub (stagger
  // built in HeroScroll on .hs-il-word); the LINES exit before the arch forms —
  // parent vs child targets, so the two motions never write the same property
  { target: ".hs-il-1", at: [0.575, 0.615], from: { autoAlpha: 1, y: 0 }, to: { autoAlpha: 0, y: -24 }, ease: "power2.in" },
  { target: ".hs-il-2", at: [0.585, 0.625], from: { autoAlpha: 1, y: 0 }, to: { autoAlpha: 0, y: -24 }, ease: "power2.in" },

  // ——— S2 entrance: pull back into the colonnade (0.60–0.85)
  { target: '[data-hs="s2-b"]', at: [0.58, 0.63], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },
  { target: '[data-hs="s2-b"]', at: [0.6, 0.78], from: { yPercent: 18, scale: 1.15 }, to: { yPercent: 0, scale: 1 }, ease: "power2.out" },
  { target: '[data-hs="s2-c"]', at: [0.6, 0.68], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },
  { target: '[data-hs="s2-c"]', at: [0.6, 0.85], from: { scale: 1.8 }, to: { scale: 1 }, ease: "power2.out" },
  { target: ".hs-vignette", at: [0.62, 0.85], from: { autoAlpha: 0 }, to: { autoAlpha: 0.7 }, ease: "power1.out" },

  // ——— the scene-1 scrim leaves with the copy it carries
  { target: ".hero-scrim", at: [0.15, 0.3], from: { autoAlpha: 1 }, to: { autoAlpha: 0 }, ease: "power1.in" },
  // the mission's scrim rides the parent while the words stagger on the children
  { target: ".hs-mission", at: [0.79, 0.84], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },

  // ——— Handoff into the next section
  { target: ".hs-handoff", at: [0.9, 1], from: { autoAlpha: 0 }, to: { autoAlpha: 1 }, ease: "none" },
];

/** Mouse parallax amplitudes during the idle stage, in percent (§4 row 1). */
export const IDLE_PARALLAX: ReadonlyArray<{ target: string; amp: number }> = [
  { target: "s1-a", amp: 0.5 },
  { target: "s1-b", amp: 1 },
  { target: "s1-c", amp: 2 },
  { target: "s1-d", amp: 3 },
];
