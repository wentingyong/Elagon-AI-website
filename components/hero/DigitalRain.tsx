"use client";

import { useEffect, useRef, type RefObject } from "react";
import { RAIN_SURGE, type HeroMotion } from "@/components/hero/heroSequence";

const GLYPHS = "ELAGON01×+·—".split("");

type Column = { x: number; y: number; v: number; size: number; cell: number; head: string };

/** 0→1 inside the dissolve band, ramping over RAIN_SURGE.ramp at both edges. */
function surge(p: number): number {
  const [a, b] = RAIN_SURGE.band;
  if (p <= a || p >= b) return 0;
  if (p < a + RAIN_SURGE.ramp) return (p - a) / RAIN_SURGE.ramp;
  if (p > b - RAIN_SURGE.ramp) return (b - p) / RAIN_SURGE.ramp;
  return 1;
}

/**
 * Columnar golden glyph rain (plan §5) — the world anchor stitching both scenes.
 * Two depth bands: "back" sits behind the city/lake layers, "front" between the
 * temple and the foreground trees. Runs on its own rAF, independent of scroll;
 * density and speed are functions of p. Trails fade via destination-out so the
 * canvas stays transparent over the layers beneath.
 */
export function DigitalRain({ band, motionRef }: { band: "back" | "front"; motionRef: RefObject<HeroMotion> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const motion = motionRef.current;
    if (!canvas || !ctx || !motion) return;

    const front = band === "front";
    const spacing = front ? 26 : 32;
    const fontPx = front ? 18 : 13;
    const baseSpeed = front ? 170 : 110; // px/s
    // gold-shifted from brand cream so the streaks read against both sky blue and cloud beige.
    // Dialled well back: the rain should stitch the two scenes together at the edge of
    // perception, not compete with the plate or the copy sitting on it.
    const ink = front ? "rgba(232, 204, 132, 0.42)" : "rgba(214, 196, 148, 0.26)";
    const headInk = front ? "rgba(248, 240, 214, 0.58)" : "rgba(238, 230, 206, 0.4)";

    let w = 0;
    let h = 0;
    let cols: Column[] = [];
    let raf = 0;
    let last = 0;
    let cleared = false;

    const respawn = (c: Column, x: number) => {
      c.x = x + (Math.random() - 0.5) * 10;
      c.y = -20 - Math.random() * h * 0.6;
      c.v = baseSpeed * (0.6 + Math.random() * 0.8);
      c.size = fontPx * (0.85 + Math.random() * 0.3);
      c.cell = -1;
      c.head = GLYPHS[(Math.random() * GLYPHS.length) | 0];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // DPR cap §5
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // column pool holds surge headroom (density ×1.5)
      const count = Math.ceil((w / spacing) * (1 + RAIN_SURGE.density));
      cols = Array.from({ length: count }, (_, i) => {
        const c: Column = { x: 0, y: 0, v: 0, size: 0, cell: -1, head: GLYPHS[0] };
        respawn(c, (i % Math.ceil(w / spacing)) * spacing);
        c.y = Math.random() * h * 1.4 - h * 0.4; // pre-seed mid-fall
        return c;
      });
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const step = (ts: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      if (!motion.visible || !w) return;
      if (front && !motion.quality.frontRain) {
        if (!cleared) {
          ctx.clearRect(0, 0, w, h);
          cleared = true;
        }
        return;
      }
      cleared = false;

      const s = surge(motion.p);
      // slow fade → long readable trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.055)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      const density = (1 + RAIN_SURGE.density * s) / (1 + RAIN_SURGE.density);
      const active = Math.floor(cols.length * density * motion.factor);
      const speedMult = 1 + RAIN_SURGE.speed * s;

      for (let i = 0; i < active; i++) {
        const c = cols[i];
        c.y += c.v * speedMult * dt;
        if (c.y > h + 40) respawn(c, c.x);
        const cell = Math.floor(c.y / c.size);
        ctx.font = `${c.size}px ui-monospace, Menlo, monospace`;
        if (cell !== c.cell) {
          // trail glyph stamped once per step, then left to fade
          c.cell = cell;
          ctx.fillStyle = Math.random() < 0.15 ? headInk : ink;
          ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], c.x, cell * c.size);
          c.head = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        // bright head redrawn every frame so each column stays clearly visible
        ctx.fillStyle = headInk;
        ctx.fillText(c.head, c.x, (cell + 1) * c.size);
      }
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [band, motionRef]);

  return <canvas ref={canvasRef} className={`hs-canvas hs-rain-${band}`} aria-hidden="true" />;
}
