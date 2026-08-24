"use client";

import { useEffect, useRef, type RefObject } from "react";
import { DISSOLVE, HERO_ASSETS, type HeroMotion } from "@/components/hero/heroSequence";

/** 4×4 Bayer thresholds, normalized to (0,1) — matches the brand halftone grain (§5). */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t); // = gsap "power2.out", keeps canvas in step with the DOM tween

async function loadBitmap(src: string): Promise<ImageBitmap> {
  const res = await fetch(src);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

/** `ox` is the horizontal half of CSS `object-position`, as a fraction. It has to be passed
 *  rather than assumed centred: under 767px globals.css shifts the S1 plates to `35% center`, and
 *  a canvas that keeps drawing at 50% slides the sky ~165px sideways the frame it takes over. That
 *  was survivable on a cloud field; with the moon on the plate it is a body teleporting. */
const S1_MOBILE = "(max-width: 767px)"; // must track the S1 recompose breakpoint in globals.css

function drawCover(ctx: CanvasRenderingContext2D, bmp: ImageBitmap, cw: number, ch: number, scale: number, ox = 0.5) {
  const s = Math.max(cw / bmp.width, ch / bmp.height) * scale;
  const dw = bmp.width * s;
  const dh = bmp.height * s;
  ctx.drawImage(bmp, (cw - dw) * ox, (ch - dh) / 2, dw, dh);
}

/**
 * Bayer ordered-dither dissolve between the two skies (plan §5).
 * Only active inside DISSOLVE.band; at both band edges it renders a pure
 * single-sky frame identical to the DOM layers beneath, so toggling the canvas
 * is invisible. If the bitmaps are not ready (or the quality probe degraded us),
 * the DOM opacity crossfade beneath simply shows through — graceful fallback.
 */
export function DitherDissolve({ motionRef }: { motionRef: RefObject<HeroMotion> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const motion = motionRef.current;
    if (!canvas || !ctx || !motion) return;

    let s1: ImageBitmap | undefined;
    let s1Moon: ImageBitmap | undefined;
    let s2: ImageBitmap | undefined;
    let loading = false;
    let raf = 0;
    let lastT = -1;
    let wasActive = false;
    let w = 0;
    let h = 0;

    const mask = document.createElement("canvas");
    const temp = document.createElement("canvas");

    const narrow = window.matchMedia(S1_MOBILE);
    let originX = narrow.matches ? 0.35 : 0.5;
    const readOrigin = () => {
      originX = narrow.matches ? 0.35 : 0.5;
      lastT = -1; // force a redraw at the new framing
    };
    narrow.addEventListener("change", readOrigin);

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      w = rect.width;
      h = rect.height;
      lastT = -1; // force redraw at new size
    });
    observer.observe(canvas);

    // decode ahead of the band (§6 loading, caution §5)
    const ensureBitmaps = () => {
      if (loading) return;
      loading = true;
      void Promise.all([loadBitmap(HERO_ASSETS.s1Sky), loadBitmap(HERO_ASSETS.s2Sky)])
        .then(([a, b]) => {
          s1 = a;
          s2 = b;
        })
        .catch(() => {
          motion.quality.dither = false;
        });
      // the moon loads on its own so a miss costs the moon, not the whole dissolve
      void loadBitmap(HERO_ASSETS.s1Moon)
        .then((m) => {
          s1Moon = m;
        })
        .catch(() => {});
    };

    const step = () => {
      raf = requestAnimationFrame(step);
      const p = motion.p;
      if (p > 0.18) ensureBitmaps();

      const [bandStart, bandEnd] = DISSOLVE.band;
      const active = motion.quality.dither && !!s1 && !!s2 && p >= bandStart && p <= bandEnd && w > 0;
      if (!active) {
        if (wasActive) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          wasActive = false;
          lastT = -1;
        }
        return;
      }
      wasActive = true;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const t = clamp01((p - DISSOLVE.sweep[0]) / (DISSOLVE.sweep[1] - DISSOLVE.sweep[0]));
      if (t === lastT && canvas.width === Math.round(w * dpr)) return;
      lastT = t;

      const cw = Math.round(w * dpr);
      const ch = Math.round(h * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      // grain aligned to device pixels to avoid moiré (caution §8)
      const cell = Math.max(4, Math.round(DISSOLVE.cellPx * dpr));
      const cellsX = Math.ceil(cw / cell);
      const cellsY = Math.ceil(ch / cell);
      if (mask.width !== cellsX || mask.height !== cellsY) {
        mask.width = cellsX;
        mask.height = cellsY;
      }
      const maskCtx = mask.getContext("2d")!;
      const image = maskCtx.createImageData(cellsX, cellsY);
      const data = image.data;
      for (let cy = 0; cy < cellsY; cy++) {
        const row = BAYER[cy & 3];
        for (let cx = 0; cx < cellsX; cx++) {
          data[(cy * cellsX + cx) * 4 + 3] = t > row[cx & 3] ? 255 : 0;
        }
      }
      maskCtx.putImageData(image, 0, 0);

      // masked incoming sky, settling 1.12→1.06 in step with the DOM tween
      const settle = clamp01((p - DISSOLVE.s2SkySettle[0]) / (DISSOLVE.s2SkySettle[1] - DISSOLVE.s2SkySettle[0]));
      const raw = DISSOLVE.s2SkyScale[0] + (DISSOLVE.s2SkyScale[1] - DISSOLVE.s2SkyScale[0]) * easeOutQuad(settle);
      const s2Scale = 1 + (raw - 1) * motion.factor;
      if (temp.width !== cw || temp.height !== ch) {
        temp.width = cw;
        temp.height = ch;
      }
      const tempCtx = temp.getContext("2d")!;
      tempCtx.clearRect(0, 0, cw, ch);
      drawCover(tempCtx, s2!, cw, ch, s2Scale, 0.5); // the S2 plates have no object-position override
      tempCtx.globalCompositeOperation = "destination-in";
      tempCtx.imageSmoothingEnabled = false;
      tempCtx.drawImage(mask, 0, 0, cellsX * cell, cellsY * cell);
      tempCtx.globalCompositeOperation = "source-over";

      const s1Scale = 1 + (DISSOLVE.s1SkyScale - 1) * motion.factor;
      drawCover(ctx, s1!, cw, ch, s1Scale, originX);
      if (s1Moon) drawCover(ctx, s1Moon, cw, ch, s1Scale, originX); // same plate canvas, so same cover math
      ctx.drawImage(temp, 0, 0);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      narrow.removeEventListener("change", readOrigin);
      s1?.close();
      s1Moon?.close();
      s2?.close();
    };
  }, [motionRef]);

  return <canvas ref={canvasRef} className="hs-canvas hs-dissolve" aria-hidden="true" />;
}
