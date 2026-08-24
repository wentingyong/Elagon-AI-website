"use client";

import Image from "next/image";
import { Fragment, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { heroHeadline, heroInterlude, heroLede, heroMission } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowIcon } from "@/components/ArrowIcon";
import { DigitalRain } from "@/components/hero/DigitalRain";
import { DitherDissolve } from "@/components/hero/DitherDissolve";
import { stageHeight } from "@/lib/viewport";
import {
  createHeroMotion,
  HERO_ASSETS,
  HERO_SIZES,
  HERO_TRAVEL_VH,
  heroScript,
  IDLE_PARALLAX,
  MOBILE_QUERY,
} from "@/components/hero/heroSequence";

const SCENE_LABEL =
  "Pixel-dithered classical landscape: a temple above a lake city, dissolving into a colonnade interior overlooking the water";

/** Left-anchored copy block: big word + inline connector per line, lede paragraph below. */
export function SplitHeadline() {
  return (
    <div className="hero-copy">
      <h1 className="split-headline" aria-label={`${heroHeadline.primaryTop} ${heroHeadline.connectorTop} ${heroHeadline.primaryBottom} ${heroHeadline.connectorBottom}`}>
        <span className="hero-line">
          <span className="hero-word word-ai" aria-hidden="true">{heroHeadline.primaryTop}</span>
          <span className="hero-connector connector-works" aria-hidden="true">{heroHeadline.connectorTop}</span>
        </span>
        <span className="hero-line">
          <span className="hero-word word-value" aria-hidden="true">{heroHeadline.primaryBottom}</span>
          <span className="hero-connector connector-lasts" aria-hidden="true">{heroHeadline.connectorBottom}</span>
        </span>
      </h1>
      <p className="hero-lede" aria-label={heroLede}>
        <span aria-hidden="true">{words(heroLede, "hero-lede-word")}</span>
      </p>
    </div>
  );
}

/** Word spans: every hero text block is split so each word can carry its own frosted lozenge.
 *  The parent holds the real text as an aria-label and the spans are hidden from AT. */
const words = (text: string, className: string) =>
  text.split(" ").map((word, index) => (
    <Fragment key={index}><span className={className}>{word}</span>{" "}</Fragment>
  ));

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** Reduced-motion fallback (§6): both scene composites as static panels, text shown directly, rain off. */
function HeroStatic() {
  return (
    <section className="hero-stage hero-stage-static">
      <div className="hs-static-panel">
        <Image src={HERO_ASSETS.s1Poster} alt={SCENE_LABEL} fill preload sizes={HERO_SIZES.s1Poster} quality={90} />
        <SiteHeader overlay />
        <SplitHeadline />
      </div>
      <div className="hs-static-panel">
        <Image src={HERO_ASSETS.s2Poster} alt="" fill sizes={HERO_SIZES.s2Poster} quality={90} />
        <h2 className="hs-interlude hs-interlude-static">
          <span>{heroInterlude[0]}</span>
          <span>{heroInterlude[1]}</span>
        </h2>
        <p className="hs-mission hs-mission-static" aria-label={heroMission}>
          <span aria-hidden="true">{words(heroMission, "hs-word")}</span>
        </p>
      </div>
    </section>
  );
}

export function HeroScroll() {
  const root = useRef<HTMLElement>(null);
  const motionRef = useRef(createHeroMotion());
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const stage = root.current;
    if (!stage || window.matchMedia(REDUCED_QUERY).matches) return;
    const motion = motionRef.current;
    const mobile = window.matchMedia(MOBILE_QUERY);
    const readFactor = () => { motion.factor = mobile.matches ? 0.5 : 1; };
    readFactor();
    mobile.addEventListener("change", readFactor); // a rotate used to leave the desktop amplitudes in place

    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const factor = motion.factor;
      // mobile: halve travel amplitudes; scales are pulled toward 1 (§6)
      const amp = (vars: Record<string, number>) => {
        const out: Record<string, number> = {};
        for (const [key, value] of Object.entries(vars)) {
          if (key === "scale") out[key] = 1 + (value - 1) * factor;
          else if (key === "xPercent" || key === "yPercent" || key === "y") out[key] = value * factor;
          else out[key] = value;
        }
        return out;
      };

      context = gsap.context(() => {
        // ——— one-shot intro, strictly sequential: AI → that works. → Value → that lasts. → lede.
        // Clip-wipes, not opacity — the scrubbed exit owns opacity/autoAlpha on all of these
        // (conflicting writers strand the scrub state).
        // the wipe must not outlive the intro — its end state is inset(0), a visual no-op, and a
        // stale clip-path on these nodes only costs compositing
        const clearWipe = () =>
          gsap.set(".word-ai, .connector-works, .word-value, .connector-lasts, .hero-lede", { clearProps: "clipPath" });
        const intro = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: clearWipe });
        intro
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 1, ease: "none" }, 0)
          .fromTo(".word-ai", { clipPath: "inset(100% 0 0 0)", y: 44 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.85 }, 0.35)
          .fromTo(".connector-works", { x: -30, clipPath: "inset(0 100% 0 0)" }, { x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.65 }, 0.9)
          .fromTo(".word-value", { clipPath: "inset(100% 0 0 0)", y: 44 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.85 }, 1.2)
          .fromTo(".connector-lasts", { x: -30, clipPath: "inset(0 100% 0 0)" }, { x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.65 }, 1.75)
          .fromTo(".hero-lede", { y: 24, clipPath: "inset(0 0 100% 0)" }, { y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.8 }, 2.15)
          .fromTo(".site-header", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 2.3)
          .fromTo(".hero-scroll", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 2.5);

        // ——— the scrubbed master timeline: duration 1 ≡ p, pinned for HERO_TRAVEL_VH
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.round(stageHeight() * (HERO_TRAVEL_VH / 100))}`, // px off the LARGE viewport, so the iOS toolbar cannot move it (caution §4)
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 3, // hero 3 > rail 2 > where 1 — three pins must refresh in document order
            onToggle: (self) => stage.classList.toggle("is-live", self.isActive), // scopes will-change
            onUpdate: (self) => {
              motion.p = self.progress;
              if (self.progress > 0.05 && intro.isActive()) { intro.progress(1); clearWipe(); }
            },
          },
        });

        for (const step of heroScript) {
          timeline.fromTo(
            step.target,
            amp(step.from),
            { ...amp(step.to), ease: step.ease, duration: step.at[1] - step.at[0], immediateRender: false },
            step.at[0],
          );
        }

        // word-by-word headline exit in reading order, lede trailing last (§4, staggered-word-reveal)
        timeline.fromTo(
          [".word-ai", ".connector-works", ".word-value", ".connector-lasts", ".hero-lede"],
          { y: 0, autoAlpha: 1 },
          { y: -60, autoAlpha: 0, duration: 0.11, stagger: 0.0125, ease: "power2.in", immediateRender: false },
          0.15,
        );

        // interlude word-by-word reveal riding the sky dissolve
        timeline.fromTo(
          ".hs-il-word",
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.045, stagger: 0.014, ease: "power2.out", immediateRender: false },
          0.44,
        );

        // mission statement reveal inside the arch, p-driven cadence (§4 row 5);
        // the longer copy starts as the arch settles so the last word lands at p=1
        timeline.fromTo(
          ".hs-word",
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.033, stagger: 0.0042, ease: "power2.out", immediateRender: false },
          0.82,
        );

        // ——— idle-stage mouse parallax, fading out by p=0.15 (§4 row 1)
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          const movers = IDLE_PARALLAX.map(({ target, amp: amplitude }) => {
            const el = stage.querySelector<HTMLElement>(`[data-hsp="${target}"]`);
            return el
              ? {
                  amplitude,
                  x: gsap.quickTo(el, "xPercent", { duration: 0.7, ease: "power2.out" }),
                  y: gsap.quickTo(el, "yPercent", { duration: 0.7, ease: "power2.out" }),
                }
              : null;
          });
          stage.addEventListener("pointermove", (event) => {
            const idle = Math.max(0, 1 - motion.p / 0.15);
            if (!idle) return;
            const nx = (event.clientX / window.innerWidth - 0.5) * 2;
            const ny = (event.clientY / window.innerHeight - 0.5) * 2;
            for (const mover of movers) {
              if (!mover) continue;
              mover.x(nx * mover.amplitude * idle);
              mover.y(ny * mover.amplitude * 0.6 * idle);
            }
          });
        }
      }, stage);
    });

    return () => {
      cancelled = true;
      mobile.removeEventListener("change", readFactor);
      context?.revert();
    };
  }, []);

  // frame-rate probe (§6): <40fps sustained → drop front rain band + dither
  useEffect(() => {
    const stage = root.current;
    if (!stage || window.matchMedia(REDUCED_QUERY).matches) return;
    const motion = motionRef.current;

    const visibility = new IntersectionObserver(([entry]) => {
      motion.visible = entry.isIntersecting;
    });
    visibility.observe(stage);

    if (window.location.search.includes("heroDebug")) stage.classList.add("hs-debug");

    // a coarse pointer is a phone or tablet: the front rain band never survived the probe there,
    // so pay the cost up front rather than four seconds of jank before it self-corrects
    if (window.matchMedia("(pointer: coarse)").matches) {
      motion.quality.frontRain = false;
      stage.classList.add("hs-lite");
    }

    const probeDelay = window.setTimeout(() => {
      let frames = 0;
      const start = performance.now();
      const tick = () => {
        frames += 1;
        const elapsed = performance.now() - start;
        if (elapsed < 2000) requestAnimationFrame(tick);
        else if (!document.hidden && frames / (elapsed / 1000) < 40) {
          motion.quality.frontRain = false;
          motion.quality.dither = false;
          stage.classList.add("hs-lite");
        }
      };
      requestAnimationFrame(tick);
    }, 1800);

    return () => {
      window.clearTimeout(probeDelay);
      visibility.disconnect();
    };
  }, []);

  if (reduced) return <HeroStatic />;

  return (
    <section className="hero-stage" ref={root}>
      <div className="hs-scene" role="img" aria-label={SCENE_LABEL}>
        <div className="hs-layer hs-move" data-hs="s1-a">
          <div className="hs-inner" data-hsp="s1-a"><Image src={HERO_ASSETS.s1Sky} alt="" fill preload sizes={HERO_SIZES.s1Sky} quality={90} /></div>
        </div>
        <div className="hs-layer hs-s2 hs-move" data-hs="s2-a">
          <div className="hs-inner"><Image src={HERO_ASSETS.s2Sky} alt="" fill sizes={HERO_SIZES.s2Sky} quality={90} /></div>
        </div>
        <DitherDissolve motionRef={motionRef} />
        <DigitalRain band="back" motionRef={motionRef} />
        <div className="hs-layer hs-s2 hs-move" data-hs="s2-b">
          <div className="hs-inner"><Image src={HERO_ASSETS.s2Lake} alt="" fill sizes={HERO_SIZES.s2Lake} quality={90} /></div>
        </div>
        <div className="hs-layer hs-move" data-hs="s1-b">
          <div className="hs-inner" data-hsp="s1-b"><Image src={HERO_ASSETS.s1City} alt="" fill loading="eager" sizes={HERO_SIZES.s1City} quality={90} /></div>
        </div>
        <div className="hs-layer hs-move" data-hs="s1-c">
          <div className="hs-inner" data-hsp="s1-c"><Image src={HERO_ASSETS.s1Temple} alt="" fill loading="eager" sizes={HERO_SIZES.s1Temple} quality={90} /></div>
        </div>
        <DigitalRain band="front" motionRef={motionRef} />
        <div className="hs-layer hs-move" data-hs="s1-d">
          <div className="hs-inner" data-hsp="s1-d"><Image src={HERO_ASSETS.s1Trees} alt="" fill loading="eager" sizes={HERO_SIZES.s1Trees} quality={90} /></div>
        </div>
        <div className="hs-layer hs-s2 hs-move" data-hs="s2-c">
          <div className="hs-inner"><Image src={HERO_ASSETS.s2Arch} alt="" fill sizes={HERO_SIZES.s2Arch} quality={90} /></div>
        </div>
        <div className="hs-vignette hs-s2" aria-hidden="true" />
      </div>

      <SplitHeadline />

      <h2 className="hs-interlude" aria-label={`${heroInterlude[0]} ${heroInterlude[1]}`}>
        {heroInterlude.map((line, lineIndex) => (
          <span key={lineIndex} className={`hs-il hs-il-${lineIndex + 1}`} aria-hidden="true">
            {words(line, "hs-il-word")}
          </span>
        ))}
      </h2>

      <div className="hs-mission">
        <p aria-label={heroMission}>
          <span aria-hidden="true">
            {words(heroMission, "hs-word")}
          </span>
        </p>
      </div>

      <div className="hs-handoff hs-s2" aria-hidden="true" />
      <div className="hs-nav-blur" aria-hidden="true"><i /><i /></div>
      <SiteHeader overlay />
      <a className="hero-scroll" href="#work"><span>Scroll to explore</span><i><ArrowIcon direction="down" /></i></a>
    </section>
  );
}
