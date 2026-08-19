/** Per-case entrance/hover choreography for the case artworks
 *  (doc: user storyboards, 2026-08-19). Style law: monochrome line art;
 *  draw (clip reveal) / position / scale / rotation only. Entrance plays
 *  once when the art enters view; hover is one light yoyo cycle.
 *
 *  All entrance motion is .from()/.fromTo()-based and the clip rects are
 *  server-rendered full-size, so with no GSAP (reduced motion, no-JS) the
 *  finished artwork is what paints. Rotations/scales use svgOrigin
 *  (viewBox coords), never CSS transform-origin. */

type GSAPCore = typeof import("gsap").default;
type Timeline = ReturnType<GSAPCore["timeline"]>;

const el = (root: Element, name: string) => root.querySelector<SVGGElement>(`[data-el="${name}"]`);
const els = (root: Element, names: string[]) => names.map((n) => el(root, n)).filter(Boolean) as SVGGElement[];
const clipRect = (root: Element, name: string) => root.querySelector<SVGRectElement>(`rect[data-clip="${name}"]`);

type Dir = "ltr" | "rtl" | "ttb" | "btt";

function reveal(gsap: GSAPCore, tl: Timeline, root: Element, name: string, dir: Dir, duration: number, at: number, ease = "power1.inOut") {
  const rect = clipRect(root, name);
  if (!rect) return;
  const x = Number(rect.getAttribute("x"));
  const y = Number(rect.getAttribute("y"));
  const w = Number(rect.getAttribute("width"));
  const h = Number(rect.getAttribute("height"));
  const from: Record<string, number> =
    dir === "ltr" ? { width: 0 } :
    dir === "rtl" ? { x: x + w, width: 0 } :
    dir === "ttb" ? { height: 0 } :
    { y: y + h, height: 0 };
  const to: Record<string, number> =
    dir === "ltr" ? { width: w } :
    dir === "rtl" ? { x, width: w } :
    dir === "ttb" ? { height: h } :
    { y, height: h };
  // immediateRender: collapse at build time so a card scrolling into view is
  // hidden before its trigger fires (no drawn→snap-hidden→redraw flash)
  tl.fromTo(rect, { attr: from }, { attr: to, duration, ease, immediateRender: true }, at);
}

/** .from() with the start state applied at build time (see reveal()). */
function enterFrom(tl: Timeline, targets: gsap.TweenTarget, vars: Record<string, unknown>, at: number) {
  tl.from(targets, { ...vars, immediateRender: true }, at);
}

/** Entrance master timeline for one artwork root (the inlined <svg>'s wrapper). */
export function buildEntrance(gsap: GSAPCore, root: Element, art: string): Timeline {
  const tl = gsap.timeline();
  switch (art) {
    case "case-01": {
      // Collect → Compress → Structure → Output (~1.75s)
      enterFrom(tl, el(root, "planes12"), { x: -90, opacity: 0, duration: 0.55, ease: "back.out(1.3)" }, 0);
      enterFrom(tl, el(root, "planes34"), { x: -90, opacity: 0, duration: 0.55, ease: "back.out(1.3)" }, 0.18);
      reveal(gsap, tl, root, "frameL", "ltr", 0.4, 0.5, "power2.out");
      reveal(gsap, tl, root, "frameR", "rtl", 0.4, 0.5, "power2.out");
      reveal(gsap, tl, root, "leftDash", "ttb", 0.25, 0.8);
      enterFrom(tl, el(root, "frameInner"), { opacity: 0, scale: 0.92, svgOrigin: "647 272", duration: 0.3, ease: "power2.out" }, 0.9);
      enterFrom(tl, els(root, ["bar1", "bar2", "bar3"]), { x: -60, opacity: 0, duration: 0.45, ease: "power3.out", stagger: 0.1 }, 1.15);
      break;
    }
    case "case-02": {
      // Batch → Process → Distribute (~1.9s, snappiest)
      reveal(gsap, tl, root, "sweep", "ltr", 0.5, 0);
      reveal(gsap, tl, root, "ring", "ltr", 0.3, 0.45, "power2.out");
      enterFrom(tl, el(root, "ringDetail"), { rotation: -18, svgOrigin: "535 285", duration: 0.5, ease: "power2.out" }, 0.55);
      reveal(gsap, tl, root, "branchTop", "ltr", 0.35, 0.85, "power2.out");
      reveal(gsap, tl, root, "branchMid", "ltr", 0.35, 0.95, "power2.out");
      reveal(gsap, tl, root, "branchBot", "ltr", 0.35, 1.05, "power2.out");
      break;
    }
    case "case-03": {
      // Scan → Compare → Surface (~2.15s, slowest). The orbit1 sweep passes the
      // three cubes left→centre→right, which reads as candidates appearing.
      reveal(gsap, tl, root, "orbit3", "ltr", 0.45, 0);
      reveal(gsap, tl, root, "orbit2", "ltr", 0.5, 0.3);
      reveal(gsap, tl, root, "orbit1", "ltr", 0.6, 0.6);
      enterFrom(tl, el(root, "raisedCube"), { y: 22, autoAlpha: 0, duration: 0.55, ease: "power2.out" }, 1.5);
      reveal(gsap, tl, root, "dashLine", "ttb", 0.35, 1.55);
      break;
    }
    case "case-04": {
      // Fragment → Fold → Consolidate (~1.65s)
      const planes = els(root, ["plane1", "plane2", "plane3", "plane4", "plane5"]);
      const travel = [-70, -55, -40, -28, -16];
      enterFrom(tl, planes, {
        x: (index: number) => travel[index] ?? 0,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.08,
      }, 0);
      enterFrom(tl, el(root, "planeEdges"), { opacity: 0, duration: 0.4 }, 0.3);
      reveal(gsap, tl, root, "convUp", "ltr", 0.4, 0.55, "power2.out");
      reveal(gsap, tl, root, "convLo", "ltr", 0.4, 0.65, "power2.out");
      enterFrom(tl, el(root, "block"), { scale: 0.95, opacity: 0, svgOrigin: "821 350", duration: 0.45, ease: "back.out(1.7)" }, 0.9);
      break;
    }
  }
  return tl;
}

/** One light hover cycle; every tween yoyos so the art always returns to rest. */
export function buildHover(gsap: GSAPCore, root: Element, art: string): Timeline {
  const tl = gsap.timeline({ paused: true });
  const cycle = { repeat: 1, yoyo: true } as const;
  switch (art) {
    case "case-01": {
      tl.to(els(root, ["planes12", "planes34"]), { x: 4, duration: 0.22, ease: "power2.inOut", ...cycle }, 0);
      tl.to(els(root, ["frameOuter", "frameInner"]), { scale: 0.98, svgOrigin: "647 272", duration: 0.22, ease: "power2.inOut", ...cycle }, 0.1);
      tl.to(els(root, ["bar1", "bar2", "bar3"]), { x: 4, duration: 0.22, ease: "power2.inOut", stagger: 0.04, ...cycle }, 0.2);
      break;
    }
    case "case-02": {
      tl.to(el(root, "ringDetail"), { rotation: 10, svgOrigin: "535 285", duration: 0.3, ease: "power2.inOut", ...cycle }, 0);
      break;
    }
    case "case-03": {
      tl.to(el(root, "orbit1"), { rotation: 2, svgOrigin: "462 447", duration: 0.35, ease: "sine.inOut", ...cycle }, 0);
      tl.to(el(root, "orbit2"), { rotation: -2, svgOrigin: "417 412", duration: 0.35, ease: "sine.inOut", ...cycle }, 0);
      tl.to(el(root, "orbit3"), { rotation: 1, svgOrigin: "446 427", duration: 0.35, ease: "sine.inOut", ...cycle }, 0);
      tl.to(el(root, "raisedCube"), { y: -5, duration: 0.3, ease: "power2.inOut", ...cycle }, 0.1);
      break;
    }
    case "case-04": {
      tl.to(els(root, ["plane1", "plane2", "plane3", "plane4", "plane5"]), { x: -4, duration: 0.28, ease: "power2.inOut", stagger: 0.04, ...cycle }, 0);
      tl.to(el(root, "block"), { scale: 1.005, svgOrigin: "821 350", duration: 0.28, ease: "power2.inOut", ...cycle }, 0.1);
      break;
    }
  }
  return tl;
}
