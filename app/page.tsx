import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA, SectionIntro } from "@/components/Editorial";
import { HeroStage } from "@/components/HeroStage";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { cases, services, systemLayers } from "@/content/site";

export default function Home() {
  return (
    <>
      <HeroStage />

      <section id="positioning" className="positioning-section section-pad">
        <p className="eyebrow" data-reveal>Built for the real world</p>
        <h2 data-reveal>One critical workflow.<br /><em>One measurable change.</em></h2>
        <p data-reveal>Elagon redesigns important work and builds production AI around the people, data and decisions that make it work.</p>
      </section>

      <section className="selected-work section-pad">
        <SectionIntro eyebrow="Selected work" title={<>The outcome<br /><em>is the story.</em></>} text="Measured in time, accuracy and capacity—not demonstrations." />
        <div className="home-work-grid"><CaseCard item={cases[0]} featured /><div>{cases.slice(1).map((item) => <CaseCard key={item.slug} item={item} />)}</div></div>
        <PrimaryCTA href="/work">View all work</PrimaryCTA>
      </section>

      <section className="home-services section-pad">
        <SectionIntro eyebrow="How to begin" title={<>Find the value.<br /><em>Prove the path. Put it to work.</em></>} />
        <div className="service-triptych">
          {services.map((service) => (
            <article key={service.number} className={`service-panel tone-${service.tone}`} data-reveal>
              <span>{service.number}</span><div><p className="service-offer">{service.offer}</p><h3>{service.title}</h3><p>{service.line}</p><Link href={`/services#service-${service.number}`}>See the engagement <ArrowIcon /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="playbook-preview section-pad">
        <SectionIntro eyebrow="The Elagon Playbook" title={<>The model is<br /><em>only one part.</em></>} text="A production system also needs a business measure, operating context, controls, accountable people and a learning loop." />
        <div className="playbook-steps">
          {systemLayers.map((layer) => <article key={layer.number} data-reveal><span>{layer.number}</span><h3>{layer.title}</h3><p>{layer.line}</p></article>)}
        </div>
        <PrimaryCTA href="/approach" inverse>Explore the playbook</PrimaryCTA>
      </section>

      <FinalCTA title="Bring us the workflow that matters." text="We’ll determine whether it is material, measurable and ready for a focused production decision." />
    </>
  );
}
