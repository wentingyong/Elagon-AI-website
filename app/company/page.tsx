import Image from "next/image";
import { FinalCTA, PageHero, SectionIntro } from "@/components/Editorial";
import { companyRoles } from "@/content/site";

export const metadata = { title: "Company", description: "Elagon works as advisor, builder and operating partner." };

export default function CompanyPage() {
  return (
    <>
      <PageHero eyebrow="Company" title={<>Senior people.<br /><em>One accountable practice.</em></>} intro="Elagon is an AI systems specialist for enterprises and PE-backed companies with complex operations." tone="rust" />
      <section className="why-elagon section-pad"><div className="company-image"><Image src="/images/temple-dither.png" alt="Pixel-dithered classical temple overlooking a city" fill sizes="(max-width: 767px) 100vw, 50vw" /></div><div><p className="eyebrow">Why Elagon</p><h2>Built for the distance between a promising use case and a working capability.</h2><p>Strategy, workflow design, engineering and operating ownership stay connected from first diagnosis through handover.</p></div></section>
      <section className="company-roles section-pad"><SectionIntro eyebrow="How we show up" title="Three roles. One outcome." /><div>{companyRoles.map((role, index) => <article key={role.title}><span>0{index + 1}</span><h3>{role.title}</h3><p>{role.text}</p></article>)}</div></section>
      <section className="capabilities section-pad"><SectionIntro eyebrow="Core capabilities" title={<>Business value meets<br /><em>production craft.</em></>} /><ul>{["Operating model design", "Workflow and service design", "AI system architecture", "Integration and engineering", "Evaluation and governance", "Adoption and capability transfer"].map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul></section>
      <section className="principles section-pad"><SectionIntro eyebrow="Working principles" title="Quiet confidence. Explicit accountability." /><div>{["Value before novelty", "Evidence before scale", "People stay in control", "Ownership by design"].map((item) => <article key={item}><h3>{item}</h3></article>)}</div></section>
      <FinalCTA />
    </>
  );
}
