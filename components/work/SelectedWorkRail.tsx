"use client";

import { useLayoutEffect, useRef } from "react";
import { buildEntrance, buildHover } from "@/components/work/caseChoreography";
import { cardOffsetY, cardScale, RAIL, railBounds } from "@/components/work/railMotion";

/** Pinned horizontal rail: vertical scroll drags the card track sideways.
 *  Cards passed as children stay server-rendered (inlined SVGs never hydrate).
 *
 *  Desktop: each card's scale follows its own X position, so cards grow as they
 *  are dragged in, and each card's storyboard fires once when it crosses the
 *  focus line — the cards therefore animate at different scroll depths rather
 *  than all at once. Below 768px the rail is a vertical stack whose cards
 *  reveal on vertical scroll. Reduced motion registers no GSAP anywhere — the
 *  markup is fully visible by construction. */
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

      const stage = section.querySelector<HTMLElement>(".swr-stage");
      const viewport = section.querySelector<HTMLElement>(".swr-viewport");
      const track = section.querySelector<HTMLElement>(".swr-track");
      if (!stage || !viewport || !track) return;

      /** Builds a card's paused entrance + its hover cycle. Returns the controls
       *  the caller needs plus a listener cleanup. */
      const wireCard = (card: HTMLElement, { rise = false } = {}) => {
        const art = card.dataset.art ?? "";
        const artRoot = card.querySelector<SVGSVGElement>(".swr-art-svg");
        let entranceDone = false;
        const tl = gsap.timeline({ paused: true, onComplete: () => { entranceDone = true; } });
        if (rise) tl.from(card.querySelector(".swr-card-inner"), { y: 64, opacity: 0, duration: 0.7, ease: "power3.out" }, 0);
        if (artRoot) tl.add(buildEntrance(gsap, artRoot, art), rise ? 0.25 : 0);

        if (!artRoot) return { play: () => tl.play(), cleanup: () => {} };
        const hover = buildHover(gsap, artRoot, art);
        const onEnter = (event: PointerEvent) => {
          if (entranceDone && event.pointerType !== "touch" && !hover.isActive()) hover.restart();
        };
        const onFocus = () => {
          if (entranceDone && !hover.isActive()) hover.restart();
        };
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("focusin", onFocus);
        return {
          play: () => tl.play(),
          cleanup: () => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("focusin", onFocus);
          },
        };
      };

      const matcher = gsap.matchMedia();
      mm = matcher;

      matcher.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".swr-card", track);
        const items = [...cards, ...gsap.utils.toArray<HTMLElement>(".swr-cta", track)];
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const wired = cards.map((card) => wireCard(card));
        const fired = cards.map(() => false);

        let bounds = railBounds(items, viewport.clientWidth, gap);
        // must run before ScrollTrigger re-evaluates the tween's function values,
        // otherwise a resize leaves the track anchored to stale geometry
        const measure = () => { bounds = railBounds(items, viewport.clientWidth, gap); };

        /** Sole writer of .swr-card transforms, and the storyboard gate.
         *  Reads the *rendered* x so scale tracks where a card actually is,
         *  not where the scroll wants it to be. */
        const positionPass = () => {
          const x = Number(gsap.getProperty(track, "x")) || 0;
          const stageW = viewport.clientWidth;
          const stageH = viewport.clientHeight;
          const fireLine = stageW * RAIL.FIRE_X;
          cards.forEach((card, index) => {
            const centre = card.offsetLeft + x + card.offsetWidth / 2;
            gsap.set(card, { y: cardOffsetY(index, stageH), scale: cardScale(centre, card.offsetWidth, stageW) });
            if (!fired[index] && centre < fireLine) {
              fired[index] = true;
              wired[index].play();
            }
          });
        };

        const rail = gsap.fromTo(
          track,
          { x: () => bounds.startX },
          {
            x: () => bounds.endX,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              // px, not vh — iOS address bar. Long runway so cards arrive one at a time.
              end: () => `+=${Math.round(window.innerHeight * (RAIL.RUNWAY_VH_PER_CARD / 100) * cards.length)}`,
              pin: true,
              scrub: RAIL.SCRUB,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefreshInit: measure,
              onRefresh: positionPass,
              onUpdate: positionPass,
            },
          },
        );

        // the stage is on screen for a viewport before the pin engages —
        // let the framed cards settle and fire during that approach
        const approach = ScrollTrigger.create({ trigger: stage, start: "top 75%", onEnter: positionPass });

        positionPass();
        // card widths shift when the display face swaps in, which moves every
        // offset the geometry above is measured from
        void document.fonts?.ready.then(() => ScrollTrigger.refresh());

        // transforms create no scroll: tabbing to an off-screen card (or the
        // in-track CTA) must move the pin so focus stays visible
        const onFocusIn = (event: FocusEvent) => {
          const item = (event.target as HTMLElement | null)?.closest<HTMLElement>(".swr-card, .swr-cta");
          const st = rail.scrollTrigger;
          const travel = bounds.startX - bounds.endX;
          if (!item || !st || travel <= 0) return;
          // x that centres this item, expressed as progress along the track
          const targetX = viewport.clientWidth / 2 - (item.offsetLeft + item.offsetWidth / 2);
          const p = gsap.utils.clamp(0, 1, (bounds.startX - targetX) / travel);
          window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "auto" });
        };
        track.addEventListener("focusin", onFocusIn);

        return () => {
          track.removeEventListener("focusin", onFocusIn);
          approach.kill();
          for (const card of cards) gsap.set(card, { clearProps: "transform" });
          for (const item of wired) item.cleanup();
        };
      });

      // mobile: vertical stack, same choreography per card on vertical scroll
      matcher.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".swr-card", track);
        const wired = cards.map((card) => wireCard(card, { rise: true }));
        const fired = cards.map(() => false);

        // live rects rather than ScrollTrigger positions: this effect runs before
        // the hero has finished sizing the page, and a trigger measured then would
        // think every card is already in view and fire the lot at once
        const check = () => {
          const line = window.innerHeight * 0.78;
          cards.forEach((card, index) => {
            if (fired[index]) return;
            const { top, bottom } = card.getBoundingClientRect();
            if (top < line && bottom > 0) {
              fired[index] = true;
              wired[index].play();
            }
          });
        };
        window.addEventListener("scroll", check, { passive: true });
        check();

        return () => {
          window.removeEventListener("scroll", check);
          for (const item of wired) item.cleanup();
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
      <div className="swr-intro">{intro}</div>
      {/* the stage is what pins, so the cards get the whole viewport */}
      <div className="swr-stage">
        <div className="swr-viewport">
          <div className="swr-track">
            {children}
            <div className="swr-cta">{cta}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
