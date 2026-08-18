# Elagon AI — Hero Scroll Transition Implementation Plan (Narrative A)

> Goal: a 2.5D multiplane scroll transition for the hero, from the "temple exterior" scene to the "colonnade interior" scene.
> Camera language: **dolly forward past the temple → dither dissolve → pull back into the colonnade**. Fully scroll-scrubbed and reversible.

---

## 0. Tech Stack

| Purpose | Choice |
|---|---|
| Scroll engine | GSAP ScrollTrigger (`scrub: true`) + Lenis smooth scrolling |
| Layer rendering | DOM/CSS transforms first (7 layered WebP images); digital rain and dissolve on `<canvas>` |
| Dissolve effect | Canvas/WebGL fragment shader, 4×4 Bayer ordered-dither threshold sweep |
| Build | Vite + vanilla TS (or match the existing project stack) |
| Type | Display headings in a grotesque sans (current hero direction); body ink color `#26211A` |

> If particle inter-layer depth or realtime dithering needs an upgrade later, migrate the layers to Three.js textured planes.
> The stage and the script stay unchanged — only the renderer is swapped (renderer-swappable principle).

---

## 1. Skills to Use (MengTo/Skills repo)

In reading order; all paths live under `agent-skills/web-design/`:

| Order | Skill | Where it applies |
|---|---|---|
| 1 | `webgl-landing-steering` | Set the lane before coding: this project is Lane A (cinematic, but text legibility and CTA outrank effects) |
| 2 | `scroll-scrubbed-visual-sequence` | Stage skeleton: pinned stage + normalized progress p + renderer-swappable architecture. Write the `sequence` config object following its pattern |
| 3 | `cinematic-scroll-storytelling` | GSAP ScrollTrigger + Lenis choreography vocabulary: scrub, pin, parallax, staggered reveal, footer handoff |
| 4 | `dither-background` | Bayer 4×4 dither algorithm, ported into the dissolve shader and realtime grain overlay |
| 5 | `staggered-word-reveal` | Word-by-word title exit and mission-statement entrance (0.07s per word, driven by p) |
| 6 | `progressive-blur` | Progressive blur on the top nav pill |
| 7 | `animation-on-scroll` | Conventional scroll entrances for the sections after the hero |
| 8 | `landing-page` + `tailwindcss` | Full-page structure and implementation conventions |
| 9 | (reference) `threejs-weather` | If the rain migrates to Three.js: anchor particles inside the camera frustum, never scatter them in world space |

**Usage**: before implementing each block, read the corresponding SKILL.md first (start with `head -80`) and respect its Guardrails.

---

## 2. Asset Inventory & Processing Pipeline

### 2.1 Existing layers (7 files, all with alpha)

| File | Content | Source size | Role |
|---|---|---|---|
| `1-A.png` | Scene 1 sky + moon dome | 1897×1079 | S1 background, opaque |
| `1-B.png` | City / lake / bridge | 1897×1079 | S1 far ground |
| `1-C.png` | Temple + stone steps | 1897×1079 | S1 subject |
| `1-D.png` | Right-side autumn trees / cypress | 1897×1079 | S1 foreground |
| `2-A.png` | Scene 2 sky | 1721×1286 | S2 background, opaque |
| `2-B.png` | Lake, mountains + flanking trees | 1721×1286 | S2 far ground (vegetation merged in) |
| `2-C.png` | Arch frame + columns + floor | 1721×1286 | S2 foreground frame |

### 2.2 Processing steps

1. **(Optional, recommended)** If the source art still exists: re-export all 7 layers at 2× (≈3800px wide) — 1-C scales up to 135% and the current resolution goes soft on 1440px+ screens.
2. PNG → WebP: start at quality 82, target 200–400KB per layer, ≤3MB total.
3. Naming convention: `hero-s1-a-sky.webp` … `hero-s2-c-arch.webp`.
4. Produce two static composites (S1 fully stacked, S2 fully stacked) as reduced-motion and poster fallbacks.
5. Note: digital rain and dither grain are code-generated — no image assets needed.

### 2.3 Aspect-ratio caveats

- Scene 1 layers are 16:9; Scene 2 layers are 1.34:1 (squarer). On wide screens the S2 group needs an overall scale of ≈1.3 to cover (cropping top/bottom); "scale down to 100%" for 2-C in the script means down to this cover baseline.
- All layers have **zero bleed margin** on all four edges → already mitigated in the script: sky layers are pre-scaled at rest (1-A 108% / 2-A 106%), and every moving layer travels "off-canvas" only. Re-check for exposed edges whenever a new movement is added.

---

## 3. Stage Structure

```
<section class="hero">  ← pinned for 300vh, containing a 100vh sticky stage
  [S1 group]
    z1  1-A sky            (pre-scaled 108%)
    z2  canvas digital rain · back band
    z3  1-B city
    z4  1-C temple
    z5  canvas digital rain · front band
    z6  1-D autumn trees
    z7  DOM headline + subcopy
  [S2 group]
    z8  2-A sky
    z9  2-B lake & mountains
    z10 2-C arch frame
    z11 DOM mission statement
  [global]
    z12 bottom gradient handoff strip (hero → next section)
    z13 nav (progressive blur)
</section>
```

- Normalized progress `p ∈ [0,1]` maps to the 300vh travel. It is the single driving source; every layer derives from p.
- The digital rain runs in **two depth bands** (behind the buildings / in front of them), never disappears, and is the world anchor that stitches the two scenes together.

---

## 4. Scroll Script (single source of truth)

| p range | Layer | Action (start → end) | Easing |
|---|---|---|---|
| 0–0.15 | All S1 | Idle stage; mouse parallax only (A ±0.5% / B ±1% / C ±2% / D ±3%); rain at normal speed | — |
| 0.15–0.40 | 1-D | scale 1→1.6, x +25%, opacity→0 by p=0.35 | ease-in |
| | 1-C | scale 1→1.35, x +18%, y −8%, fully exits right edge by p=0.42 | ease-in |
| | 1-B | y +10%, scale 1→1.12, fades out 0.38–0.45 | ease-in |
| | 1-A | scale 1.08→1.18, steady slow push | linear |
| | Headline | Moves up 60px and fades, done by p=0.30; subcopy trails by 0.05 | ease-in |
| 0.40–0.60 | 1-A→2-A | At p=0.45 only sky + rain remain; 0.45–0.58 Bayer dither dissolve (6–8px cells) | linear |
| | Rain | Density ×1.5, slight speed-up; back to normal at p=0.60 | — |
| | 2-A | Takes over at scale 1.12 → settles to 1.06 | ease-out |
| 0.60–0.85 | 2-B | Rises from y +18% below, scale 1.15→1.0, settles by p=0.78 | ease-out |
| | 2-C | **Hero move**: scale 1.8→1.0 (= cover baseline), opacity 0→1 across 0.60–0.68; edge vignette deepens | ease-out |
| 0.85–1.0 | Mission copy | Word-by-word reveal inside the central arch (0.07s cadence, p-driven); pin releases at p=1 | — |

**Global easing principle**: exits use ease-in (accelerating away), entrances use ease-out (decelerating into place), the dissolve stays linear — the "single continuous shot" illusion depends on this.

---

## 5. Digital Rain & Dissolve Specs

### Digital rain
- One canvas drawn twice (back/front band) or two canvases; columnar golden streaks/glyphs (`#E9E2D0` shifted toward gold; brightness differentiates the depth bands).
- Density and speed are functions of p; rain keeps falling during the idle stage (requestAnimationFrame independent of scroll).
- Particle budget: ≤600 desktop, ≤300 mobile; DPR capped at 2.

### Bayer dissolve
- 4×4 Bayer matrix threshold map, 6–8px cell size (matches the brand halftone grain).
- Dissolve progress t = remap(p, 0.45, 0.58); per pixel: `t > bayer(x,y) ? show 2-A : show 1-A`.
- Both skies stay resident in memory during the dissolve; decode ahead of time (see performance).

---

## 6. Responsive & Degradation

| Scenario | Strategy |
|---|---|
| Phone portrait | S2's squarer ratio adapts naturally; recompose S1 around the temple as focal point (crop sides); movement amplitudes ×0.5; particles ×0.5 |
| `prefers-reduced-motion` | Degrades to a crossfade between the S1/S2 static composites; text shown directly; rain off |
| Low-end devices (frame-rate probe <40fps for 2s) | Disable front rain band; dissolve degrades to a plain crossfade |
| Loading | Preload the four S1 layers (LCP = 1-A); idle-preload the three S2 layers before p reaches 0.3; call `img.decode()` ahead of first paint |

---

## 7. Implementation Phases & Acceptance Criteria

### Phase 1 — Stage + S1 parallax (0.5 day)
- 300vh pin + Lenis wired up; four S1 layers idle + mouse parallax.
- ✅ Accept: scroll pinning is solid; reverse scrubbing has no frame jumps; no exposed edges.

### Phase 2 — S1 exit + headline choreography (0.5 day)
- All curves for 0.15–0.40 + staggered headline exit.
- ✅ Accept: the "gliding past the temple" sensation lands (blind-test with 2–3 people); scrolling up plays fully in reverse.

### Phase 3 — Dissolve band (1 day, highest risk — prototype first)
- Dual skies + Bayer shader + rain density coupling.
- ✅ Accept: no white/black flash during dissolve; grain size matches the background halftone; dropped frames <5%.

### Phase 4 — S2 entrance + mission copy (0.5 day)
- Pull-back convergence + vignette + word-by-word reveal; pin-release handoff.
- ✅ Accept: the "stepping back into the loggia" sensation lands; no hitch when scrolling continues past p=1.

### Phase 5 — Degradation / performance / QA (0.5 day)
- reduced-motion, mobile composition, frame-rate probe, preloading.
- ✅ Accept: Lighthouse Perf ≥85 (mobile); usable under 4× CPU throttle; see QA checklist.

---

## 8. Cautions (common pitfalls)

1. **Lenis × ScrollTrigger**: you must drive Lenis via `lenis.on('scroll', ScrollTrigger.update)` + the `gsap.ticker`, otherwise the pin jitters.
2. **Animate transform/opacity only**; never animate top/left/width. `will-change: transform` per layer, but on **no more than 8 elements** to avoid memory blowups.
3. **Scrub reversibility is a hard constraint**: everything derives from p. No one-shot `onEnter`-triggered tweens inside the main timeline (even the word-by-word mission reveal must be written as a mapping of p).
4. **iOS viewport**: use `svh`/`dvh` for address-bar resizing; compute the pin distance in px via JS to avoid vh jitter.
5. **Image decode**: first paint of large images can jank the main thread — call `decode()` on 2-A before the dissolve; keep WebP under 4096px (decode limit on some Android devices).
6. **Edge-exposure re-check**: after any addition or parameter change, outline every layer (debug mode) and scrub the full range.
7. **Canvas vs DOM z-order**: the front rain band must sit above 1-C and below 1-D; don't let a filter/opacity accidentally flatten the stacking context (mind `isolation: isolate`).
8. **Dissolve grain must align to device pixels** or moiré appears; cell size = `round(base × DPR) / DPR`.
9. **Text contrast** (webgl-landing-steering Lane A red line): the white headline must hold ≥4.5:1 contrast on every frame of the dissolve band; add a local scrim where it falls short.
10. **Nav and CTA stay clickable throughout**: during the pin, the nav lives outside the stage at the highest z; Contact Us takes part in no animation.
11. Palette roles: olive `#596B4A` = CTA/dark sections; beige `#E9E2D0` = base; steel blue `#A5BDD7` background blocks only; rust `#683A22` = accent; body ink `#26211A`. Steel blue is forbidden as text on the beige base.
12. **Travel feel**: start at 300vh; if the "slow cinema" feel is lacking, raise to 350–400vh — the script's p values stay unchanged (that is the point of normalization).

---

## 9. QA Checklist

- [ ] Scroll down/up 3× each across the full range: no frame jumps, no exposed edges, no flicker
- [ ] Capture 5 frames of the dissolve band; grain matches the brand halftone
- [ ] iPhone Safari / Android Chrome / three desktop browsers
- [ ] reduced-motion mode is fully readable
- [ ] Slow-3G first paint: poster appears first, motion assets arrive progressively
- [ ] Keyboard PgDn/PgUp, trackpad, and mouse wheel all feel right
- [ ] Frame-sampled contrast checks on headline and mission copy
- [ ] Memory curve: S1 layers are releasable (removed from the render tree) after the dissolve