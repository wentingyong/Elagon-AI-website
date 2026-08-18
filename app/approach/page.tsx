import { FinalCTA, PageHero, SectionIntro } from "@/components/Editorial";
import { playbookSteps, systemLayers } from "@/content/site";

export const metadata = { title: "The Elagon Playbook", description: "The operating method Elagon uses to move one material workflow from evidence to dependable production." };

const standards = [
  { title: "Value is explicit", text: "Every system begins with a baseline, an accountable owner and a business result worth changing." },
  { title: "Judgment has a place", text: "Human review, escalation and decision rights remain wherever the work requires accountability." },
  { title: "Performance is tested", text: "Quality, cost, speed and failure behaviour are evaluated before launch and monitored after it." },
  { title: "Ownership starts early", text: "Operators shape the system throughout delivery; documentation and training do not wait for handover." },
];

export default function ApproachPage() {
  return (
    <>
      <PageHero eyebrow="The Elagon Playbook" title={<>The work around<br /><em>the model.</em></>} intro="A repeatable operating method for turning one material problem into a dependable system that people can govern, use and improve." tone="blue" />

      <section className="architecture section-pad">
        <SectionIntro eyebrow="The complete system" title={<>Production is more<br /><em>than technology.</em></>} text="The model is one component. The operating result depends on how every layer works together." />
        <div className="architecture-line">{systemLayers.map((layer) => <article key={layer.number}><span>{layer.number}</span><h3>{layer.title}</h3><p>{layer.line}</p></article>)}</div>
      </section>

      <section className="approach-track section-pad">
        <aside><p className="eyebrow">Six decisions</p>{playbookSteps.map((step) => <a href={`#approach-${step.number}`} key={step.number}>{step.number}<span>{step.title}</span></a>)}</aside>
        <div>{playbookSteps.map((step) => <article id={`approach-${step.number}`} key={step.number} className={`tone-${step.tone}`}><span>{step.number}</span><h2>{step.title}</h2><p>{step.line}</p><dl><dt>Decision gate</dt><dd>{step.gate}</dd></dl></article>)}</div>
      </section>

      <section className="governance section-pad">
        <SectionIntro eyebrow="Non-negotiables" title={<>Four standards<br /><em>in every engagement.</em></>} />
        <div>{standards.map((standard, index) => <article key={standard.title}><span>0{index + 1}</span><h3>{standard.title}</h3><p>{standard.text}</p></article>)}</div>
      </section>

      <section className="ownership-statement section-pad">
        <p className="eyebrow">Capability by Design</p>
        <h2>The system should keep working<br /><em>without hidden dependency.</em></h2>
        <p>Client-specific access, documentation, evaluation evidence, operating procedures and training are built into delivery. Elagon can stay involved—but because the partnership keeps creating value, not because knowledge was withheld.</p>
      </section>

      <FinalCTA title="Start with the operation, not the technology." text="Bring one workflow, one owner and one result that should be different." />
    </>
  );
}
