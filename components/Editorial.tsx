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

export function FinalCTA({ title = "Bring us the workflow that matters.", text = "We’ll help you find the value, build the system, and put the capability in your team’s hands." }: { title?: string; text?: string }) {
  return <section className="final-cta"><p className="eyebrow">A considered first step</p><h2>{title}</h2><div><p>{text}</p><PrimaryCTA href="/contact" inverse>Start a conversation</PrimaryCTA></div></section>;
}
