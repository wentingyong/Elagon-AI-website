"use client";

import { useLayoutEffect, useRef } from "react";

/** Pinned horizontal rail: vertical scroll scrubs the card track sideways.
 *  Cards passed as children stay server-rendered (inlined SVGs never hydrate).
 *  Below 768px / with reduced motion, no GSAP registers and CSS provides a
 *  native horizontal scroller instead. */
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

        // one-shot entrance: card rises, then its SVG paths assemble.
        // stagger.amount, not each — 2-path and 148-path artworks finish alike.
        const enter = (card: HTMLElement, trigger: ScrollTrigger.Vars, delay = 0) => {
          gsap.timeline({ scrollTrigger: { once: true, ...trigger } })
            .from(card.querySelector(".swr-card-inner"), { y: 64, opacity: 0, duration: 0.7, ease: "power3.out" }, delay)
            .from(card.querySelectorAll(".swr-art-svg path"), {
              opacity: 0,
              y: 18,
              duration: 0.45,
              ease: "power2.out",
              stagger: { amount: 0.55, from: "start" },
            }, delay + 0.15);
        };

        // cards already inside the viewport at pin start would mis-fire
        // containerAnimation triggers on load — give them a normal trigger,
        // cascaded by index so the initial batch doesn't rise as one block
        gsap.utils.toArray<HTMLElement>(".swr-card", track).forEach((card, index) => {
          if (card.offsetLeft < viewport.clientWidth - 80) enter(card, { trigger: section, start: "top 75%" }, index * 0.14);
          else enter(card, { trigger: card, containerAnimation: rail, start: "left 92%" });
        });

        // transforms create no scroll: tabbing to an off-screen card must move
        // the pin so focus stays visible (instant per WCAG)
        const onFocusIn = (event: FocusEvent) => {
          const card = (event.target as HTMLElement | null)?.closest<HTMLElement>(".swr-card");
          const st = rail.scrollTrigger;
          const total = travel();
          if (!card || !st || !total) return;
          const p = gsap.utils.clamp(0, 1, (card.offsetLeft + card.offsetWidth / 2 - viewport.clientWidth / 2) / total);
          window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "auto" });
        };
        track.addEventListener("focusin", onFocusIn);
        return () => track.removeEventListener("focusin", onFocusIn);
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
      <div className="swr-viewport" data-lenis-prevent>
        <div className="swr-track">{children}</div>
      </div>
      {cta}
    </section>
  );
}
