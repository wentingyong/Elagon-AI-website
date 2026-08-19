"use client";

import { useLayoutEffect, useRef } from "react";
import { buildEntrance, buildHover } from "@/components/work/caseChoreography";

/** Client shell for the case-page hero artwork: plays the same per-case
 *  entrance choreography once when the hero enters view, and one light
 *  hover cycle. The inlined SVG arrives server-rendered as children. */
export function CaseHeroArt({ art, children }: { art: string; children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = root.current;
    if (!host) return;

    let cancelled = false;
    let mm: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const artRoot = host.querySelector<SVGSVGElement>(".swr-art-svg");
      if (!artRoot) return;

      const matcher = gsap.matchMedia();
      mm = matcher;
      matcher.add("(prefers-reduced-motion: no-preference)", () => {
        let entranceDone = false;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: host, start: "top 85%", once: true },
          onComplete: () => { entranceDone = true; },
        });
        tl.add(buildEntrance(gsap, artRoot, art), 0.1);

        const hover = buildHover(gsap, artRoot, art);
        const onEnter = (event: PointerEvent) => {
          if (entranceDone && event.pointerType !== "touch" && !hover.isActive()) hover.restart();
        };
        host.addEventListener("pointerenter", onEnter);
        return () => host.removeEventListener("pointerenter", onEnter);
      });
    });

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, [art]);

  return (
    <div className="case-hero-art" ref={root}>
      {children}
    </div>
  );
}
