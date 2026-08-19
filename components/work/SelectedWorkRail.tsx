"use client";

import { useLayoutEffect, useRef } from "react";
import { buildEntrance, buildHover } from "@/components/work/caseChoreography";

/** Pinned horizontal rail: vertical scroll scrubs the card track sideways.
 *  Cards passed as children stay server-rendered (inlined SVGs never hydrate).
 *  Each card plays its per-case entrance choreography once when it enters
 *  view; hover replays one light cycle. Below 768px the rail is a vertical
 *  stack whose cards reveal on vertical scroll. Reduced motion registers no
 *  GSAP anywhere — the markup is fully visible by construction. */
export function SelectedWorkRail({ intro, cta, children }: { intro: React.ReactNode; cta: React.ReactNode; children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    let cancelled = false;
    let mm: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const viewport = section.querySelector<HTMLElement>(".swr-viewport");
      const track = section.querySelector<HTMLElement>(".swr-track");
      if (!viewport || !track) return;

      // per-card entrance (card rises, then its choreography) + one-cycle hover.
      // Returns a cleanup for the hover listeners.
      const wireCard = (card: HTMLElement, trigger: ScrollTrigger.Vars, delay = 0) => {
        const art = card.dataset.art ?? "";
        const artRoot = card.querySelector<SVGSVGElement>(".swr-art-svg");
        let entranceDone = false;
        const tl = gsap.timeline({ scrollTrigger: { once: true, ...trigger }, onComplete: () => { entranceDone = true; } });
        tl.from(card.querySelector(".swr-card-inner"), { y: 64, opacity: 0, duration: 0.7, ease: "power3.out" }, delay);
        if (artRoot) tl.add(buildEntrance(gsap, artRoot, art), delay + 0.25);

        if (!artRoot) return () => {};
        const hover = buildHover(gsap, artRoot, art);
        const onEnter = (event: PointerEvent) => {
          if (entranceDone && event.pointerType !== "touch" && !hover.isActive()) hover.restart();
        };
        const onFocus = () => {
          if (entranceDone && !hover.isActive()) hover.restart();
        };
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("focusin", onFocus);
        return () => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("focusin", onFocus);
        };
      };

      const matcher = gsap.matchMedia();
      mm = matcher;

      matcher.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        // sole writer of track x
        const rail = gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(travel())}`, // px, not vh — iOS address bar
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // cards already inside the viewport at pin start would mis-fire
        // containerAnimation triggers on load — give them a normal trigger,
        // cascaded by index so the initial batch doesn't rise as one block
        const cleanups = gsap.utils.toArray<HTMLElement>(".swr-card", track).map((card, index) =>
          card.offsetLeft < viewport.clientWidth - 80
            ? wireCard(card, { trigger: section, start: "top 75%" }, index * 0.14)
            : wireCard(card, { trigger: card, containerAnimation: rail, start: "left 92%" }),
        );

        // transforms create no scroll: tabbing to an off-screen card (or the
        // in-track CTA) must move the pin so focus stays visible
        const onFocusIn = (event: FocusEvent) => {
          const item = (event.target as HTMLElement | null)?.closest<HTMLElement>(".swr-card, .swr-cta");
          const st = rail.scrollTrigger;
          const total = travel();
          if (!item || !st || !total) return;
          const p = gsap.utils.clamp(0, 1, (item.offsetLeft + item.offsetWidth / 2 - viewport.clientWidth / 2) / total);
          window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "auto" });
        };
        track.addEventListener("focusin", onFocusIn);
        return () => {
          track.removeEventListener("focusin", onFocusIn);
          for (const cleanup of cleanups) cleanup();
        };
      });

      // mobile: vertical stack, same full choreography per card on vertical scroll
      matcher.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups = gsap.utils.toArray<HTMLElement>(".swr-card", track).map((card) =>
          wireCard(card, { trigger: card, start: "top 78%" }),
        );
        return () => {
          for (const cleanup of cleanups) cleanup();
        };
      });
    });

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return (
    <section id="work" className="selected-work swr" ref={root}>
      {intro}
      <div className="swr-viewport">
        <div className="swr-track">
          {children}
          <div className="swr-cta">{cta}</div>
        </div>
      </div>
    </section>
  );
}
