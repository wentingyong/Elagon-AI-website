import { CaseCard } from "@/components/CaseCard";
import { FinalCTA, PageHero, SectionIntro } from "@/components/Editorial";
import { cases, services } from "@/content/site";

export const metadata = { title: "Services", description: "Find the value, build the system, and establish the operating model." };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title={<>Make AI part of<br /><em>how the work works.</em></>} intro="We start with a material operational constraint, build the production capability around it, and make ownership part of delivery." tone="cream" />
      <section className="service-index section-pad"><p className="eyebrow">The engagement arc</p>{services.map((service) => <a key={service.number} href={`#service-${service.number}`}><span>{service.number}</span>{service.title}<i>↓</i></a>)}</section>
      <section className="service-detail-wrap section-pad">
        <aside><p className="eyebrow">Services</p>{services.map((service) => <a key={service.number} href={`#service-${service.number}`}>{service.number} — {service.title}</a>)}</aside>
        <div className="service-chapters">
          {services.map((service) => (
            <article id={`service-${service.number}`} key={service.number} className={`service-chapter tone-${service.tone}`}>
              <span>{service.number}</span><h2>{service.title}</h2><p className="chapter-lede">{service.line}</p>
              <dl><div><dt>The problem</dt><dd>{service.problem}</dd></div><div><dt>What Elagon does</dt><dd>{service.action}</dd></div><div><dt>You receive</dt><dd><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></dd></div><div><dt>The result</dt><dd>{service.result}</dd></div></dl>
            </article>
          ))}
        </div>
      </section>
      <section className="engagement-model section-pad"><SectionIntro eyebrow="Engagement model" title={<>Reduce risk before<br /><em>committing to production.</em></>} /><div>{["Assess", "Validate", "Implement"].map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{["Map the operation, baseline value and select one production use case.", "Test the riskiest assumptions with real users, workflows and data.", "Build, integrate, launch and transfer the production capability."][index]}</p></article>)}</div></section>
      <section className="related-cases section-pad"><SectionIntro eyebrow="Related proof" title="Built where the work happens." /><div>{cases.slice(0, 2).map((item) => <CaseCard key={item.slug} item={item} />)}</div></section>
      <FinalCTA />
    </>
  );
}
