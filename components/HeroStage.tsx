"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { heroHeadline } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowIcon } from "@/components/ArrowIcon";

export function SplitHeadline() {
  return (
    <h1 className="split-headline" aria-label={`${heroHeadline.primaryTop} ${heroHeadline.connectorTop} ${heroHeadline.primaryBottom} ${heroHeadline.connectorBottom}`}>
      <span className="hero-word word-ai" aria-hidden="true">{heroHeadline.primaryTop}</span>
      <span className="hero-connector connector-works" aria-hidden="true">{heroHeadline.connectorTop}</span>
      <span className="hero-word word-value" aria-hidden="true">{heroHeadline.primaryBottom}</span>
      <span className="hero-connector connector-lasts" aria-hidden="true">{heroHeadline.connectorBottom}</span>
    </h1>
  );
}

export function HeroStage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !root.current) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .fromTo(".hero-media", { scale: 1.08, opacity: 0.35, filter: "contrast(.75) saturate(.75)" }, { scale: 1, opacity: 1, filter: "contrast(1) saturate(1)", duration: 2.1 })
          .fromTo(".hero-pixel-field", { opacity: 0.85, backgroundSize: "18px 18px" }, { opacity: 0.18, backgroundSize: "8px 8px", duration: 1.8 }, 0)
          .fromTo(".hero-word", { clipPath: "inset(100% 0 0 0)", y: 48 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.05, stagger: 0.18 }, 0.55)
          .fromTo(".hero-connector", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.16 }, 1.1)
          .fromTo(".site-header", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.45)
          .fromTo(".hero-scroll", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.65);

        gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 } })
          .to(".hero-media", { yPercent: 9, scale: 1.05, ease: "none" }, 0)
          .to(".split-headline", { yPercent: -7, opacity: 0.2, ease: "none" }, 0)
          .to(".hero-pixel-field", { opacity: 0.75, backgroundSize: "15px 15px", ease: "none" }, 0);
      }, root);
    });
    return () => { cancelled = true; context?.revert(); };
  }, []);

  return (
    <section className="hero-stage" ref={root}>
      <div className="hero-media" data-parallax>
        <Image src="/images/hero-renaissance.png" alt="Pixel-dithered Renaissance marble sculpture before monumental architecture" fill priority sizes="100vw" />
      </div>
      <div className="hero-scrim" />
      <div className="hero-pixel-field" aria-hidden="true" />
      <SiteHeader overlay />
      <SplitHeadline />
      <a className="hero-scroll" href="#positioning"><span>Scroll to explore</span><i><ArrowIcon direction="down" /></i></a>
    </section>
  );
}
