import { CaseCard } from "@/components/CaseCard";
import { FinalCTA, PageHero, SectionIntro } from "@/components/Editorial";
import { cases, fitSignals, operatingModes, services } from "@/content/site";

export const metadata = { title: "Services", description: "Start with one material workflow, prove the path, then put a complete AI system into production." };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title={<>Start with<br /><em>one workflow.</em></>} intro="Choose a material operating problem. Prove the assumptions that matter. Build only when the evidence supports it." tone="cream" />

      <section className="service-index section-pad">
        <p className="eyebrow">Choose your starting point</p>
        {services.map((service) => <a key={service.number} href={`#service-${service.number}`}><span>{service.number}</span>{service.offer}<i>↓</i></a>)}
      </section>

      <section className="service-detail-wrap section-pad">
        <aside><p className="eyebrow">Engagements</p>{services.map((service) => <a key={service.number} href={`#service-${service.number}`}>{service.number} — {service.offer}</a>)}</aside>
        <div className="service-chapters">
          {services.map((service) => (
            <article id={`service-${service.number}`} key={service.number} className={`service-chapter tone-${service.tone}`}>
              <span>{service.number}</span><p className="service-offer">{service.offer}</p><h2>{service.title}</h2><p className="chapter-lede">{service.line}</p>
              <dl>
                <div><dt>Best for</dt><dd>{service.for}</dd></div>
                <div><dt>What happens</dt><dd>{service.action}</dd></div>
                <div><dt>You leave with</dt><dd><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></dd></div>
                <div><dt>Decision</dt><dd>{service.decision}</dd></div>
                <div><dt>Typical shape</dt><dd>{service.duration}</dd></div>
                <div><dt>Result</dt><dd>{service.result}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="engagement-model operating-modes section-pad">
        <SectionIntro eyebrow="After launch" title={<>Choose how<br /><em>the system runs.</em></>} text="Every mode keeps business accountability with the client. The difference is who operates the specialist technical layer." />
        <div>{operatingModes.map((mode) => <article key={mode.number}><span>{mode.number}</span><h3>{mode.title}</h3><p>{mode.line}</p><p className="mode-fit">{mode.fit}</p></article>)}</div>
      </section>

      <section className="service-fit section-pad">
        <SectionIntro eyebrow="A strong starting point" title={<>The workflow matters<br /><em>before the AI does.</em></>} />
        <ol>{fitSignals.map((signal, index) => <li key={signal}><span>0{index + 1}</span><p>{signal}</p></li>)}</ol>
      </section>

      <section className="related-cases section-pad"><SectionIntro eyebrow="Related proof" title="Built where the work happens." /><div>{cases.slice(0, 2).map((item) => <CaseCard key={item.slug} item={item} />)}</div></section>
      <FinalCTA title="Which workflow is worth changing?" text="The AI Workflow Sprint ends with one clear production decision—not a generic roadmap." />
    </>
  );
}
