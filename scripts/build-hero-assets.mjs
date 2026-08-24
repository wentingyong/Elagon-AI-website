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

/** The scene-1 canvas. 1-A came back from its re-export at 1922x1072 while 1-A-1/1-B/1-C/1-D
 *  are all 1897x1079 — and every S1 layer is `object-fit: cover` in the same box, so two
 *  aspect ratios means the sky and the moon crop differently and the moon slides off the spot
 *  it was drawn on (worse on mobile, where the sky carries `object-position: 35% center`).
 *  A cover-crop back to the shared canvas is a 0.65% upscale and ~19px off each side. */
const S1_CANVAS = [1897, 1079];

/** [source, output, opts?]. `width` supersamples the source before encoding; `quality`
 *  overrides QUALITY; `canvas` cover-crops to S1_CANVAS first; `flatten` drops a dead alpha
 *  channel. Two layers earn a supersample:
 *
 *  The arch is the scene-2 foreground, it is held at rest under the mission copy, and the
 *  entrance dollies it from 1.8x — so it is the one full-frame layer where the browser's own
 *  upscaling is visible. 1.5x lanczos plus a light unsharp is a resample, not new detail (the
 *  render is soft at 1:1), but it keeps the dolly and retina from adding a second layer of mush.
 *
 *  The moon is the same argument on a small object: the disc is only 430px of the 1897 plate,
 *  which paints ~353 CSS px on a 1440 stage — ~706 device px on retina, a 1.64x upscale of a
 *  hard-edged crater-detailed body. At 1.5x the disc is 645px and that drops to ~1.09x. It keeps
 *  the full S1 canvas rather than being cropped to its bbox so it inherits the sky's cover
 *  geometry for free; the transparent 78% of the plate costs ~16KB, which is cheaper than the
 *  CSS placement math a cropped plate would need. */
const LAYERS = [
  ["1-A.png", "hero-s1-a-sky.webp", { canvas: true, flatten: true, quality: 86 }], // re-export is opaque: the moon moved to 1-A-1
  ["1-A-1.png", "hero-s1-a1-moon.webp", { width: 2846, quality: 88, sharpen: true }],
  ["1-B.png", "hero-s1-b-city.webp"],
  ["1-C.png", "hero-s1-c-temple.webp"],
  ["1-D.png", "hero-s1-d-trees.webp"],
  ["2-A.png", "hero-s2-a-sky.webp"],
  ["2-B.png", "hero-s2-b-lake.webp"],
  ["2-C.png", "hero-s2-c-arch.webp", { width: 2582, quality: 88, sharpen: true }],
];

const COMPOSITES = [
  { out: "hero-s1-poster.webp", stack: ["1-A.png", "1-A-1.png", "1-B.png", "1-C.png", "1-D.png"] },
  { out: "hero-s2-poster.webp", stack: ["2-A.png", "2-B.png", "2-C.png"] },
];

/** Raw PNG → the shared S1 canvas. Both the layer loop and the poster composite need it:
 *  sharp refuses a composite whose input is larger than its base. */
const onCanvas = (file) =>
  sharp(path.join(HERO_DIR, file)).resize(S1_CANVAS[0], S1_CANVAS[1], { fit: "cover", position: "center", kernel: "lanczos3" });

/** Single plates that live outside public/hero. Source dir keeps the delivered name; the
 *  shipped URL gets the convention one (the source folder is misspelled `servies`).
 *  `avif: true` also emits an .avif twin: the two where-plates are art-directed through a
 *  hand-written <picture> and so never touch next/image's optimizer, which is where every other
 *  image gets its AVIF. At 1200x2304 the portrait plate is 566KB as WebP and 246KB as AVIF. */
const PLATES = [
  ["servies/3-A.png", "where/where-frame.webp", { avif: true }],
  ["servies/3-A-small.png", "where/where-frame-small.webp", { avif: true }], // portrait plate for the small-screen stage
  ["servies/4-A.png", "cta/cta-frame.webp"], // home final-CTA background (Editorial.tsx) — goes through next/image
];

/** The social card. Source is the 1200x630 master export; the shipped file is JPEG because
 *  WhatsApp will not fetch a link preview over ~600KB and the 1.5MB PNG bought nothing at card
 *  size (q90 measures 35.4dB and holds the headline's edges). lib/seo.ts SOCIAL_IMAGE_PATH. */
const SOCIAL_CARD = ["brand/meta.png", "brand/meta.jpg"];

let total = 0;

for (const [src, out, opts = {}] of LAYERS) {
  let pipe = opts.canvas ? onCanvas(src) : sharp(path.join(HERO_DIR, src));
  if (opts.width) pipe = pipe.resize({ width: opts.width, kernel: "lanczos3" });
  if (opts.sharpen) pipe = pipe.sharpen({ sigma: 0.7, m1: 0.4, m2: 0.9 });
  if (opts.flatten) pipe = pipe.removeAlpha();
  // alphaQuality 100: these are cut-out layers, a soft alpha edge reads as a halo
  const buffer = await pipe.webp({ quality: opts.quality ?? QUALITY, effort: 6, alphaQuality: 100 }).toBuffer();
  await writeFile(path.join(HERO_DIR, out), buffer);
  total += buffer.length;
  const { width, height } = await sharp(buffer).metadata();
  console.log(`${out}  ${(buffer.length / 1024).toFixed(0)}KB  ${width}x${height}`);
}

for (const { out, stack } of COMPOSITES) {
  const [base, ...rest] = stack;
  const baseBuffer = base === "1-A.png" ? await onCanvas(base).png().toBuffer() : path.join(HERO_DIR, base);
  const buffer = await sharp(baseBuffer)
    .composite(await Promise.all(rest.map(async (file) => ({ input: await readFile(path.join(HERO_DIR, file)) }))))
    .webp({ quality: QUALITY })
    .toBuffer();
  await writeFile(path.join(HERO_DIR, out), buffer);
  total += buffer.length;
  console.log(`${out}  ${(buffer.length / 1024).toFixed(0)}KB`);
}

for (const [src, out, opts = {}] of PLATES) {
  await mkdir(path.dirname(path.join(PUBLIC_DIR, out)), { recursive: true });
  const emit = async (name, buffer) => {
    await writeFile(path.join(PUBLIC_DIR, name), buffer);
    total += buffer.length;
    const { width, height } = await sharp(buffer).metadata();
    console.log(`${name}  ${(buffer.length / 1024).toFixed(0)}KB  ${width}x${height}`);
  };
  await emit(out, await sharp(path.join(PUBLIC_DIR, src)).webp({ quality: QUALITY, effort: 6, alphaQuality: 100 }).toBuffer());
  if (opts.avif) await emit(out.replace(/\.webp$/, ".avif"), await sharp(path.join(PUBLIC_DIR, src)).avif({ quality: 58, effort: 5 }).toBuffer());
}

{
  const [src, out] = SOCIAL_CARD;
  const buffer = await sharp(path.join(PUBLIC_DIR, src)).removeAlpha().jpeg({ quality: 90, mozjpeg: true }).toBuffer();
  await writeFile(path.join(PUBLIC_DIR, out), buffer);
  total += buffer.length;
  const { width, height } = await sharp(buffer).metadata();
  console.log(`${out}  ${(buffer.length / 1024).toFixed(0)}KB  ${width}x${height}`);
}

console.log(`total ${(total / 1024 / 1024).toFixed(2)}MB`);
