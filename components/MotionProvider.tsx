"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lenis smooth scrolling driven by the gsap ticker — required for jitter-free
  // ScrollTrigger pinning (hero plan §8 caution 1). Created once per mount.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis")]).then(([gsapModule, triggerModule, lenisModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      const Lenis = lenisModule.default;
      gsap.registerPlugin(ScrollTrigger);
      // iOS fires `resize` every time the toolbar collapses, which was fully refreshing all
      // three pinned triggers mid-scroll — the hero's lag. Safe only because every stage is
      // now sized in lvh (lib/viewport.ts), so a toolbar move changes no measurement.
      ScrollTrigger.config({ ignoreMobileResize: true });
      // one refresh once the editorial serif is in: every pin is measured against text metrics,
      // and the rail's own copy of this only ran in its >=768px branch, so phones never got it
      void document.fonts?.ready.then(() => ScrollTrigger.refresh());
      const lenis = new Lenis({ anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(element, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          gsap.fromTo(element, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        });
      });
    });
    return () => { cancelled = true; context?.revert(); };
  }, [pathname]);

  return children;
}
