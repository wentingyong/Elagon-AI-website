import { FinalCTA, PageHero, SectionIntro } from "@/components/Editorial";
import { services } from "@/content/site";

export const metadata = { title: "Playbook", description: "Elagon’s playbook for production AI systems and organizational ownership." };

const architecture = ["Existing tools + data", "Controlled AI system", "Human decision", "Measurement + learning"];

export default function ApproachPage() {
  return (
    <>
      <PageHero eyebrow="The Playbook" title={<>Build the system.<br /><em>Enable the team.</em></>} intro="One operating playbook carries a valuable use case from evidence to production, adoption and ownership." tone="blue" />
      <section className="approach-track section-pad">
        <aside><p className="eyebrow">Three moves</p>{services.map((step) => <a href={`#approach-${step.number}`} key={step.number}>{step.number}<span>{step.title}</span></a>)}</aside>
        <div>{services.map((step) => <article id={`approach-${step.number}`} key={step.number} className={`tone-${step.tone}`}><span>{step.number}</span><h2>{step.title}</h2><p>{step.action}</p><dl><dt>Stage gate</dt><dd>{["Value defined", "System reliable", "Control transferred"][Number(step.number) - 1]}</dd></dl></article>)}</div>
      </section>
      <section className="architecture section-pad"><SectionIntro eyebrow="Production system architecture" title={<>Technology belongs<br /><em>inside an operating system.</em></>} text="Models are one layer. The capability also needs data, controls, integration, human decisions, evaluation and a learning loop." /><div className="architecture-line">{architecture.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>)}</div></section>
      <section className="governance section-pad"><SectionIntro eyebrow="Run and improve" title="Governance is designed, not added." /><div>{["Ownership", "Measurement", "Controls", "Improvement"].map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{["Named business and technical owners hold the decisions.", "A shared operating dashboard tracks value, quality and adoption.", "Access, evaluations, releases and exceptions follow explicit rules.", "User feedback and corrections move through a governed learning loop."][index]}</p></article>)}</div></section>
      <section className="timeline section-pad"><SectionIntro eyebrow="Typical engagement" title="Evidence earns the next investment." /><ol>{["Assess", "Validate", "Implement", "Transfer"].map((item, index) => <li key={item}><span>0{index + 1}</span><h3>{item}</h3><p>{["2–4 weeks", "4–8 weeks", "Milestone based", "Designed throughout"][index]}</p></li>)}</ol></section>
      <FinalCTA />
    </>
  );
}
