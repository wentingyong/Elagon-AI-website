import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export function PageHero({ eyebrow, title, intro, tone = "cream" }: { eyebrow: string; title: React.ReactNode; intro: string; tone?: "cream" | "green" | "blue" | "rust" }) {
  return (
    <>
      <SiteHeader />
      <section className={`page-hero tone-${tone}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero-intro">{intro}</p>
      </section>
    </>
  );
}

export function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: React.ReactNode; text?: string }) {
  return <header className="section-intro" data-reveal><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</header>;
}

export function FinalCTA({ title = "Bring us the workflow that matters.", text = "We’ll help determine whether it is material, measurable and ready for a focused production decision." }: { title?: string; text?: string }) {
  return <section className="final-cta"><p className="eyebrow">Start focused</p><h2>{title}</h2><div><p>{text}</p><PrimaryCTA href="/contact" inverse>Discuss a workflow</PrimaryCTA></div></section>;
}

/* Homepage-only closing: the 4-A plate carries the scroll story's last frame. Motion is the
   declarative kind MotionProvider already scans for — no ScrollTrigger to order against the pins. */
export function HomeFinalCTA() {
  const scenarios = [
    "A process buried in documents.",
    "A team spending hours reconciling information.",
    "A critical decision dependent on fragmented systems.",
    "An AI initiative that never made it beyond the pilot.",
  ];
  return (
    <section className="home-cta">
      <div className="cta-media" data-parallax aria-hidden="true"><Image src="/cta/cta-frame.webp" alt="" fill sizes="100vw" /></div>
      <div className="cta-scrim" aria-hidden="true" />
      <p className="eyebrow" data-reveal>Start with the operation</p>
      <h2 data-reveal>Bring us one workflow<br /><em>that matters.</em></h2>
      <ul className="cta-scenarios" data-reveal>{scenarios.map((scenario) => <li key={scenario}>{scenario}</li>)}</ul>
      <div data-reveal>
        <p>We will help determine where AI can create material value and what it will take to put that capability into production.</p>
        <div className="cta-actions">
          <PrimaryCTA href="/contact" inverse>Discuss a Workflow</PrimaryCTA>
          <PrimaryCTA href="/work" inverse ghost>Explore Our Work</PrimaryCTA>
        </div>
      </div>
    </section>
  );
}
