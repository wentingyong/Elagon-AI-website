"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
