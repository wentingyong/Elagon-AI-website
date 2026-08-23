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

const LAYERS = [
  ["1-A.png", "hero-s1-a-sky.webp"],
  ["1-B.png", "hero-s1-b-city.webp"],
  ["1-C.png", "hero-s1-c-temple.webp"],
  ["1-D.png", "hero-s1-d-trees.webp"],
  ["2-A.png", "hero-s2-a-sky.webp"],
  ["2-B.png", "hero-s2-b-lake.webp"],
  ["2-C.png", "hero-s2-c-arch.webp"],
];

const COMPOSITES = [
  { out: "hero-s1-poster.webp", stack: ["1-A.png", "1-B.png", "1-C.png", "1-D.png"] },
  { out: "hero-s2-poster.webp", stack: ["2-A.png", "2-B.png", "2-C.png"] },
];

/** Single plates that live outside public/hero. Source dir keeps the delivered name; the
 *  shipped URL gets the convention one (the source folder is misspelled `servies`). */
const PLATES = [["servies/3-A.png", "where/where-frame.webp"]];

let total = 0;

for (const [src, out] of LAYERS) {
  const buffer = await sharp(path.join(HERO_DIR, src)).webp({ quality: QUALITY }).toBuffer();
  await writeFile(path.join(HERO_DIR, out), buffer);
  total += buffer.length;
  console.log(`${out}  ${(buffer.length / 1024).toFixed(0)}KB`);
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
