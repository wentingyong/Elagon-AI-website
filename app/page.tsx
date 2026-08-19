import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { FinalCTA, SectionIntro } from "@/components/Editorial";
import { HeroScroll } from "@/components/hero/HeroScroll";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { CaseArtwork } from "@/components/work/CaseArtwork";
import { SelectedWorkRail } from "@/components/work/SelectedWorkRail";
import { WorkRailCard } from "@/components/work/WorkRailCard";
import { cases, services, systemLayers } from "@/content/site";

export default function Home() {
  return (
    <>
      <HeroScroll />

      <SelectedWorkRail
        intro={<SectionIntro eyebrow="Selected work" title={<>The outcome<br /><em>is the story.</em></>} text="Measured in time, accuracy and capacity—not demonstrations." />}
        cta={<PrimaryCTA href="/work">View all work</PrimaryCTA>}
      >
        {cases.map((item) => <WorkRailCard key={item.slug} item={item} art={<CaseArtwork art={item.art} />} />)}
      </SelectedWorkRail>

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
