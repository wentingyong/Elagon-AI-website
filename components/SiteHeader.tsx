"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { navigation } from "@/content/site";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Logo } from "@/components/Logo";

/** The header CTA takes the colour of the section it sits on. Longest-prefix match, so
 *  /work/<case> inherits work's blue. Blue gets dark ink — cream on blue fails AA (§5.3). */
const CTA_TONES = [
  ["/services", "rust"],
  ["/work", "sky"],
  ["/approach", "moss"],
  ["/company", "rust"],
] as const;

/** false on the server, true once hydrated — the portal needs a real <body> to target. */
const subscribeNever = () => () => {};
const useHydrated = () => useSyncExternalStore(subscribeNever, () => true, () => false);

const ctaTone = (path: string) =>
  CTA_TONES.find(([href]) => path === href || path.startsWith(`${href}/`))?.[1] ?? (path === "/" ? "moss" : "rust");

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // close on navigation, adjusted during render rather than in an effect: the per-link onClick
  // misses browser back/forward and anything programmatic
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

  /* The panel covers the toggle, so focus is handed over and handed back explicitly.
     Opening needs both halves of this dance: .mobile-menu is visibility:hidden until .is-open
     lands and focus() on a hidden element is a silent no-op, React flushes this effect inside
     the click (still hidden), and rAF callbacks run BEFORE the frame's style recalc — so the
     next frame is not enough on its own. Reading offsetHeight forces the recalc first. */
  const wasOpen = useRef(false);
  useEffect(() => {
    let frame = 0;
    if (open) frame = requestAnimationFrame(() => {
      void closeRef.current?.offsetHeight;
      closeRef.current?.focus();
    });
    else if (wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
    return () => { if (frame) cancelAnimationFrame(frame); };
  }, [open]);

  /* Portalled to <body> on purpose. On the homepage SiteHeader renders inside .hero-stage,
     which sets `isolation: isolate` — so --z-menu: 100 only ranked the panel inside the hero,
     and .selected-work / .where-work / .playbook-preview (root z-index: 1) painted over it. */
  const panel = (
    <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="mobile-menu-inner" data-lenis-prevent>
        <button ref={closeRef} className="menu-close" type="button" aria-label="Close menu" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <span /><span />
        </button>
        <p className="eyebrow">Navigate</p>
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link key={item.href} href={item.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link>
          ))}
          <Link href="/contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><span>0{navigation.length + 1}</span>Contact</Link>
        </nav>
        <p>One critical workflow.<br />One measurable change.</p>
      </div>
    </div>
  );

  return (
    <>
      <header className={`site-header ${overlay ? "is-overlay" : ""}`}>
        <div className="header-brand"><Logo inverse={overlay} /></div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>
          ))}
        </nav>
        <Link className={`contact-pill tone-${ctaTone(pathname)}`} href="/contact">Discuss a workflow <span><ArrowIcon /></span></Link>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label="Open menu" onClick={() => setOpen(true)}>
          <span /><span />
        </button>
      </header>
      {hydrated ? createPortal(panel, document.body) : null}
    </>
  );
}
