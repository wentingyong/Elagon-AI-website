import { HomeFinalCTA, SectionIntro } from "@/components/Editorial";
import { HeroScroll } from "@/components/hero/HeroScroll";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { WhereScroll } from "@/components/where/WhereScroll";
import { CaseArtwork } from "@/components/work/CaseArtwork";
import { SelectedWorkRail } from "@/components/work/SelectedWorkRail";
import { WorkRailCard } from "@/components/work/WorkRailCard";
import { cases, playbookSteps } from "@/content/site";

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

      <WhereScroll />

      <section className="playbook-preview section-pad">
        <SectionIntro eyebrow="The Elagon Playbook" title={<>From business problem<br /><em>to production performance.</em></>} text="The Elagon Playbook is our repeatable method for understanding the operation, identifying where AI belongs, proving the opportunity, and putting a dependable system into production." />
        <div className="playbook-steps">
          {playbookSteps.map((step) => <article key={step.number} data-reveal><span>{step.number}</span><h3>{step.title}</h3><p>{step.line}</p></article>)}
        </div>
        <PrimaryCTA href="/approach" inverse>Explore the Playbook</PrimaryCTA>
      </section>

      <HomeFinalCTA />
    </>
  );
}
