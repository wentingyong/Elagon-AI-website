import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA, SectionIntro } from "@/components/Editorial";
import { HeroStage } from "@/components/HeroStage";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { cases, companyRoles, services } from "@/content/site";

export default function Home() {
  return (
    <>
      <HeroStage />

      <section id="positioning" className="positioning-section section-pad">
        <p className="eyebrow" data-reveal>AI systems for complex operations</p>
        <h2 data-reveal>From a valuable workflow<br />to a capability <em>your team owns.</em></h2>
        <p data-reveal>Elagon finds where AI can create material value, builds the production system around the work, and establishes how it will run and improve.</p>
      </section>

      <section className="home-services section-pad">
        <SectionIntro eyebrow="What we do" title={<>Three moves.<br /><em>One working system.</em></>} />
        <div className="service-triptych">
          {services.map((service) => (
            <article key={service.number} className={`service-panel tone-${service.tone}`} data-reveal>
              <span>{service.number}</span><div><h3>{service.title}</h3><p>{service.line}</p><Link href={`/services#service-${service.number}`}>Explore <ArrowIcon /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="selected-work section-pad">
        <SectionIntro eyebrow="Selected work" title={<>Proof lives in<br /><em>the operation.</em></>} text="Production systems measured in time, accuracy, capacity and control." />
        <div className="home-work-grid"><CaseCard item={cases[0]} featured /><div>{cases.slice(1).map((item) => <CaseCard key={item.slug} item={item} />)}</div></div>
        <PrimaryCTA href="/work">View all work</PrimaryCTA>
      </section>

      <section className="playbook-preview section-pad">
        <SectionIntro eyebrow="The playbook" title={<>Value first.<br /><em>Ownership always.</em></>} />
        <div className="playbook-steps">
          {services.map((service) => <article key={service.number} data-reveal><span>{service.number}</span><h3>{service.title}</h3><p>{service.result}</p></article>)}
        </div>
        <PrimaryCTA href="/approach" inverse>Explore the playbook</PrimaryCTA>
      </section>

      <section className="company-preview section-pad">
        <div className="company-image" data-reveal><Image src="/images/arcade-dither.png" alt="Pixel-dithered classical arcade overlooking a mountain and sea" fill sizes="(max-width: 767px) 100vw, 56vw" /></div>
        <div className="company-copy" data-reveal><p className="eyebrow">How we work</p><h2>Advisor.<br />Builder.<br /><em>Operating partner.</em></h2><p>{companyRoles.map((role) => role.text).join(" ")}</p><PrimaryCTA href="/company">Meet Elagon</PrimaryCTA></div>
      </section>

      <FinalCTA />
    </>
  );
}
