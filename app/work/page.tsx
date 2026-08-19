import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { FinalCTA, PageHero, SectionIntro } from "@/components/Editorial";
import { cases, secondaryProof } from "@/content/site";

export const metadata = { title: "Selected Work", description: "Production AI systems measured in operating results, with human control and clear evidence." };

export default function WorkPage() {
  return (
    <>
      <PageHero eyebrow="Selected work" title={<>Proof, in<br /><em>the work.</em></>} intro="Each case starts with an operating constraint and ends with a specific change in time, accuracy, capacity or control." tone="blue" />

      <section className="work-index section-pad">
        <SectionIntro eyebrow="Production case studies" title={<>What changed<br /><em>after the system.</em></>} text="Client identities remain confidential. The workflow, system and qualified results remain specific." />
        <div className="work-case-index">
          {cases.map((item, index) => (
            <Link className={`work-case-row ${index === 0 ? "is-featured" : ""}`} href={`/work/${item.slug}`} key={item.slug}>
              <div className="work-case-top"><div><span className="work-case-number">{String(index + 1).padStart(2, "0")}</span><span className="work-case-category">{item.industry}</span></div><i><ArrowIcon /></i></div>
              <div className="work-case-main">
                <div className="work-case-title"><p>{item.title}</p><h2>{item.verb}</h2></div>
                <div className="work-case-metrics">{item.outcomes.slice(0, 2).map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.context}</small></div>)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="secondary-proof section-pad">
        <SectionIntro eyebrow="Further proof" title={<>Depth at scale.<br /><em>Complexity made usable.</em></>} />
        <div>{secondaryProof.map((item) => <article key={item.code}><p className="eyebrow">{item.code}</p><h3>{item.headline}</h3><p>{item.text}</p><strong>{item.proof}</strong>{"note" in item && item.note ? <small>{item.note}</small> : null}</article>)}</div>
      </section>

      <section className="work-principle section-pad"><p className="eyebrow">The standard</p><h2>The people who know the work<br /><em>stay in control of it.</em></h2><p>Elagon removes what should not remain manual while preserving accountable judgment where it matters.</p></section>
      <FinalCTA title="What should work differently?" text="Bring us the constraint, the baseline and the people responsible for the outcome." />
    </>
  );
}
