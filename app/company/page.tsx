import Image from "next/image";
import { FinalCTA, PageHero, SectionIntro } from "@/components/Editorial";
import { companyRoles, fitSignals, teamMembers } from "@/content/site";

export const metadata = { title: "Company", description: "Senior specialists accountable from the operating problem through production and ownership." };

const principles = [
  { title: "Value before technology", text: "Begin with the operating result, not a model, platform or demonstration." },
  { title: "Evidence before scale", text: "Test the assumptions that can break the investment before expanding the build." },
  { title: "People stay accountable", text: "Keep domain experts in control wherever judgment, policy or risk requires them." },
  { title: "Ownership is designed", text: "Build access, evaluation, documentation and operating skill throughout delivery." },
];

export default function CompanyPage() {
  return (
    <>
      <PageHero eyebrow="Company" title={<>The people who design it<br /><em>stay accountable for it.</em></>} intro="Elagon is a senior, cross-functional practice for established enterprises and PE-backed companies with complex operations." tone="rust" />

      <section className="why-elagon section-pad"><div className="company-image"><Image src="/images/temple-dither.png" alt="Pixel-dithered classical temple overlooking a city" fill sizes="(max-width: 767px) 100vw, 50vw" /></div><div><p className="eyebrow">Why Elagon</p><h2>Built for the distance between ambition and operation.</h2><p>Organizations rarely need another AI idea. They need senior people who can connect business economics, expert workflows, production engineering and accountable operation—without losing the thread between them.</p></div></section>

      <section id="team" className="team-section section-pad">
        <SectionIntro eyebrow="The team" title={<>Senior people.<br /><em>Close to the work.</em></>} text="Elagon’s four core leaders stay involved from first diagnosis through strategy, architecture, production, experience and handover." />
        <div className="team-grid">
          {teamMembers.map((member) => (
            <article className="team-card" key={member.name} data-reveal>
              <div className="team-portrait"><Image src={member.photo} alt={`${member.name}, ${member.role}`} fill loading="eager" sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw" /></div>
              <div className="team-card-copy"><span>{member.number}</span><h2>{member.name}</h2><p className="team-role">{member.role}</p><p>{member.bio}</p><small>Accountable for</small><strong>{member.accountable}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="company-roles section-pad"><SectionIntro eyebrow="How we show up" title="Three roles. One accountable team." /><div>{companyRoles.map((role, index) => <article key={role.title}><span>0{index + 1}</span><h3>{role.title}</h3><p>{role.text}</p></article>)}</div></section>

      <section className="capabilities section-pad"><SectionIntro eyebrow="Who we work best with" title={<>Complex work.<br /><em>Clear responsibility.</em></>} /><ul>{fitSignals.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul></section>

      <section className="principles section-pad"><SectionIntro eyebrow="Working principles" title="Quiet confidence. Explicit accountability." /><div>{principles.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <FinalCTA title="Bring us the workflow that matters." text="One fit conversation is enough to determine whether the problem is material, measurable and ready for a focused first step." />
    </>
  );
}
