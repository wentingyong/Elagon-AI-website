"use client";

import Link from "next/link";
import { Fragment, useLayoutEffect, useRef } from "react";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { stageHeight } from "@/lib/viewport";
import {
  BOX_SETTLE,
  FRAME,
  BOX_WINDOWS,
  CLOSE_OPEN,
  CLOSE_SETTLE,
  panToBottomPct,
  PLATE,
  type Plate,
  WHERE_QUERY,
  WHERE_QUERY_SMALL,
  WHERE_TRAVEL_VH,
  whereScript,
} from "@/components/where/whereSequence";
import { frictions, whereWeWork } from "@/content/site";

/** Word spans for a p-driven stagger; the parent carries the real text as an aria-label. */
/** WHERE_QUERY minus its motion clause: reduced motion keeps the same plate, it only unwinds
 *  the stage around it. Must stay complementary to WHERE_QUERY_SMALL — see whereSequence. */
const PLATE_MEDIA = "(min-width: 768px), (orientation: landscape)";

const words = (text: string, className: string) =>
  text.split(" ").map((word, index) => (
    <Fragment key={index}><span className={className}>{word}</span>{" "}</Fragment>
  ));

/** Pinned frame stage: the camera dollies into the ruin plate and tilts down, the scene-1 copy
 *  leaves, three friction blocks land in a diagonal staircase, and the closing statement takes
 *  the opening. Everything derives from normalized progress p (components/where/whereSequence.ts).
 *
 *  Below 900px, squarer than 5:4, on touch, or under reduced motion no GSAP registers at all —
 *  CSS unwinds the stage into normal flow and the markup is complete by construction. */
export function WhereScroll() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    const stage = section?.querySelector<HTMLElement>(".wf-stage");
    if (!stage) return;
    if (window.location.search.includes("whereDebug")) stage.classList.add("wf-debug");

    let cancelled = false;
    let mm: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const matcher = gsap.matchMedia();
      mm = matcher;

      // one builder, two branches: the script and every p value are shared, only the plate
      // geometry (and the CSS skin around it) differs between the wide and portrait cuts
      const build = (plate: Plate) => () => {
        // the frame's pan and dolly both come from the active plate: the pan is re-resolved on
        // every refresh so the plate's bottom edge lands exactly on the stage bottom
        // (whereSequence: scene 2 is bottom-anchored). Other planes keep their static values.
        const fit = (target: string, vars: Record<string, number>): Record<string, unknown> => {
          if (target !== '[data-wf="frame"]') return vars;
          const out: Record<string, unknown> = { ...vars };
          if (vars.yPercent) out.yPercent = () => panToBottomPct(plate, stage.clientWidth, stage.clientHeight);
          if (vars.scale && vars.scale > FRAME.idle) out.scale = plate.dolly;
          return out;
        };

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.round(stageHeight() * (WHERE_TRAVEL_VH / 100))}`, // px off the LARGE viewport, so the iOS toolbar cannot move it
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1, // hero 3 > rail 2 > here 1 — three pins must refresh in document order
            onToggle: (self) => stage.classList.toggle("is-live", self.isActive), // scopes will-change
            onUpdate: (self) => {
              // is-open gates pointer-events: the blocks stay tabbable at every p (they animate
              // on opacity, not autoAlpha) so nothing invisible is ever clickable.
              BOX_WINDOWS.forEach(([open, shut], index) => {
                stage
                  .querySelector(`[data-wb="${index + 1}"]`)
                  ?.classList.toggle("is-open", self.progress >= open && self.progress <= shut);
              });
              stage.classList.toggle("is-outro", self.progress >= CLOSE_OPEN);
            },
          },
        });

        for (const step of whereScript) {
          timeline.fromTo(
            step.target,
            fit(step.target, step.from),
            { ...fit(step.target, step.to), ease: step.ease, duration: step.at[1] - step.at[0], immediateRender: false },
            step.at[0],
          );
        }

        // scene-1 copy exits in reading order. opacity, NOT autoAlpha: the h2 must stay in the
        // accessibility tree after it leaves the frame (.wf-copy is pointer-events:none anyway)
        timeline.fromTo(
          [".wf-eyebrow", ".wf-h2-word", ".wf-lede"],
          { y: 0, opacity: 1 },
          { y: -56, opacity: 0, duration: 0.1, stagger: 0.012, ease: "power2.in", immediateRender: false },
          0.12,
        );

        // closing statement word by word, the last word landing as the pill settles
        timeline.fromTo(
          ".wf-cl-word",
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.03, stagger: 0.005, ease: "power2.out", immediateRender: false },
          0.94,
        );

        // idle-stage pointer parallax on the plate, fading out by p=0.12 (mice only — on touch
        // there is no pointermove to ride, and the scrub already carries the whole story)
        const inner = stage.querySelector<HTMLElement>('[data-wfp="frame"]');
        const drift = inner
          ? {
              x: gsap.quickTo(inner, "xPercent", { duration: 0.8, ease: "power2.out" }),
              y: gsap.quickTo(inner, "yPercent", { duration: 0.8, ease: "power2.out" }),
            }
          : null;
        const onPointerMove = (event: PointerEvent) => {
          const progress = timeline.scrollTrigger?.progress ?? 0;
          const idle = Math.max(0, 1 - progress / 0.12);
          if (!drift || !idle) return;
          // % of the stage-sized shift plane now; stays inside the plate's horizontal bleed
          drift.x((event.clientX / window.innerWidth - 0.5) * 1.6 * idle);
          drift.y((event.clientY / window.innerHeight - 0.5) * 1 * idle);
        };
        stage.addEventListener("pointermove", onPointerMove);

        // transforms create no scroll: tabbing to a block or the pill must move the pin
        const onFocusIn = (event: FocusEvent) => {
          const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".wf-box, .primary-cta");
          const trigger = timeline.scrollTrigger;
          if (!target || !trigger) return;
          const settle = target.dataset.wb ? BOX_SETTLE[Number(target.dataset.wb) - 1] : CLOSE_SETTLE;
          window.scrollTo({ top: trigger.start + settle * (trigger.end - trigger.start), behavior: "auto" });
        };
        stage.addEventListener("focusin", onFocusIn);

        return () => {
          stage.removeEventListener("pointermove", onPointerMove);
          stage.removeEventListener("focusin", onFocusIn);
          stage.classList.remove("is-live", "is-outro");
          stage.querySelectorAll(".is-open").forEach((box) => box.classList.remove("is-open"));
          gsap.set(
            '.wf-ground, .wf-boxes, [data-wf="frame"], .wf-frame-shift, .wf-box, .wf-card-rot, .wf-eyebrow, .wf-h2-word, .wf-lede, .wf-cl-word, .wf-close .primary-cta, .wf-handoff',
            { clearProps: "all" },
          );
        };
      };

      matcher.add(WHERE_QUERY, build(PLATE.wide));
      matcher.add(WHERE_QUERY_SMALL, build(PLATE.small));
    });

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return (
    <section className="where-work" id="where" ref={root}>
      <div className="wf-stage">
        <div className="wf-plane wf-ground wf-move" aria-hidden="true" />
        <p className="wf-eyebrow eyebrow">{whereWeWork.eyebrow}</p>
        <div className="wf-copy">
          <h2 aria-label={whereWeWork.title}><span aria-hidden="true">{words(whereWeWork.title, "wf-h2-word")}</span></h2>
          <p className="wf-lede">{whereWeWork.lede}</p>
        </div>
        <div className="wf-plane wf-boxes wf-move">
          {frictions.map((item, index) => (
            <Link key={item.number} className="wf-box" data-wb={index + 1} href={`/services#service-${item.number}`}>
              <div className="wf-box-card">
                <div className="wf-card-rot">
                  <div className="wf-face wf-front"><span className="wf-num" aria-hidden="true">{item.number}</span><h3>{item.title}</h3></div>
                  <div className="wf-face wf-back"><span className="wf-num" aria-hidden="true">{item.number}</span><p>{item.detail}</p></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="wf-plane wf-frame wf-move" data-wf="frame" aria-hidden="true">
          {/* three levels, one transform writer each (the hero's .hs-layer/.hs-inner pattern):
              scrub → .wf-frame, parallax → .wf-frame-shift, and .wf-frame-inner keeps its
              translate-based centring with GSAP never touching it */}
          <div className="wf-frame-shift" data-wfp="frame">
            <div className="wf-frame-inner">
              {/* genuine art direction — two different crops of the plate, not one image at two
                  sizes — so this is <picture>/media rather than next/image's srcSet. */}
              {/* AVIF first in each branch: these two plates never reach next/image's optimizer,
                  which is where the rest of the site gets its AVIF, and the portrait cut is
                  272KB as AVIF against 566KB as WebP. The <img> is the universal fallback. */}
              <picture>
                <source media={PLATE_MEDIA} type="image/avif" srcSet={PLATE.wide.avif} width={PLATE.wide.w} height={PLATE.wide.h} />
                <source media={PLATE_MEDIA} srcSet={PLATE.wide.src} width={PLATE.wide.w} height={PLATE.wide.h} />
                <source type="image/avif" srcSet={PLATE.small.avif} width={PLATE.small.w} height={PLATE.small.h} />
                <img src={PLATE.small.src} alt="" width={PLATE.small.w} height={PLATE.small.h} loading="lazy" decoding="async" />
              </picture>
            </div>
          </div>
        </div>
        <div className="wf-close">
          <p aria-label={whereWeWork.close}><span aria-hidden="true">{words(whereWeWork.close, "wf-cl-word")}</span></p>
          <PrimaryCTA href="/services">Explore Services</PrimaryCTA>
        </div>
        <div className="wf-handoff" aria-hidden="true" />
      </div>
    </section>
  );
}
