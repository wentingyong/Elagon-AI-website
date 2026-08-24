"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

const ctaTone = (path: string) =>
  CTA_TONES.find(([href]) => path === href || path.startsWith(`${href}/`))?.[1] ?? (path === "/" ? "moss" : "rust");

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", closeOnEscape); };
  }, [open]);

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
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
          <span /><span />
        </button>
      </header>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-inner">
          <p className="eyebrow">Navigate</p>
          <nav aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <Link key={item.href} href={item.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</Link>
            ))}
            <Link href="/contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><span>05</span>Contact</Link>
          </nav>
          <p>One critical workflow.<br />One measurable change.</p>
        </div>
      </div>
    </>
  );
}
