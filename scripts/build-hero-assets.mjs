/**
 * Scroll-stage asset pipeline (doc/Hero_Scroll_Transition_Implementation_Plan.md §2).
 * PNG layers in public/hero → WebP + static scene composites for reduced-motion/poster fallbacks,
 * plus the single "where we work" frame plate (components/where/whereSequence.ts).
 *
 *   node scripts/build-hero-assets.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(import.meta.dirname, "../public");
const HERO_DIR = path.join(PUBLIC_DIR, "hero");
const QUALITY = 82;

/** [source, output, opts?]. `width` supersamples the source before encoding; `quality`
 *  overrides QUALITY. The arch is the only layer that earns both: it is the scene-2
 *  foreground, it is held at rest under the mission copy, and the entrance dollies it
 *  from 1.8x — so it is the one layer where the browser's own upscaling is visible.
 *  1.5x lanczos plus a light unsharp is a resample, not new detail (the render is soft
 *  at 1:1), but it keeps the dolly and retina from adding a second layer of mush. */
const LAYERS = [
  ["1-A.png", "hero-s1-a-sky.webp"],
  ["1-B.png", "hero-s1-b-city.webp"],
  ["1-C.png", "hero-s1-c-temple.webp"],
  ["1-D.png", "hero-s1-d-trees.webp"],
  ["2-A.png", "hero-s2-a-sky.webp"],
  ["2-B.png", "hero-s2-b-lake.webp"],
  ["2-C.png", "hero-s2-c-arch.webp", { width: 2582, quality: 88, sharpen: true }],
];

const COMPOSITES = [
  { out: "hero-s1-poster.webp", stack: ["1-A.png", "1-B.png", "1-C.png", "1-D.png"] },
  { out: "hero-s2-poster.webp", stack: ["2-A.png", "2-B.png", "2-C.png"] },
];

/** Single plates that live outside public/hero. Source dir keeps the delivered name; the
 *  shipped URL gets the convention one (the source folder is misspelled `servies`). */
const PLATES = [
  ["servies/3-A.png", "where/where-frame.webp"],
  ["servies/3-A-small.png", "where/where-frame-small.webp"], // portrait plate for the small-screen stage
  ["servies/4-A.png", "cta/cta-frame.webp"], // home final-CTA background (components/Editorial.tsx HomeFinalCTA)
];

let total = 0;

for (const [src, out, opts = {}] of LAYERS) {
  let pipe = sharp(path.join(HERO_DIR, src));
  if (opts.width) pipe = pipe.resize({ width: opts.width, kernel: "lanczos3" });
  if (opts.sharpen) pipe = pipe.sharpen({ sigma: 0.7, m1: 0.4, m2: 0.9 });
  // alphaQuality 100: these are cut-out layers, a soft alpha edge reads as a halo
  const buffer = await pipe.webp({ quality: opts.quality ?? QUALITY, effort: 6, alphaQuality: 100 }).toBuffer();
  await writeFile(path.join(HERO_DIR, out), buffer);
  total += buffer.length;
  const { width, height } = await sharp(buffer).metadata();
  console.log(`${out}  ${(buffer.length / 1024).toFixed(0)}KB  ${width}x${height}`);
}

for (const { out, stack } of COMPOSITES) {
  const [base, ...rest] = stack;
  const buffer = await sharp(path.join(HERO_DIR, base))
    .composite(await Promise.all(rest.map(async (file) => ({ input: await readFile(path.join(HERO_DIR, file)) }))))
    .webp({ quality: QUALITY })
    .toBuffer();
  await writeFile(path.join(HERO_DIR, out), buffer);
  total += buffer.length;
  console.log(`${out}  ${(buffer.length / 1024).toFixed(0)}KB`);
}

for (const [src, out] of PLATES) {
  const buffer = await sharp(path.join(PUBLIC_DIR, src)).webp({ quality: QUALITY }).toBuffer();
  await mkdir(path.dirname(path.join(PUBLIC_DIR, out)), { recursive: true });
  await writeFile(path.join(PUBLIC_DIR, out), buffer);
  total += buffer.length;
  console.log(`${out}  ${(buffer.length / 1024).toFixed(0)}KB`);
}

console.log(`total ${(total / 1024 / 1024).toFixed(2)}MB`);
