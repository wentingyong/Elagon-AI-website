import { notFound } from "next/navigation";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA } from "@/components/Editorial";
import { SiteHeader } from "@/components/SiteHeader";
import { SystemDiagram } from "@/components/SystemDiagram";
import { cases } from "@/content/site";

export function generateStaticParams() { return cases.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = cases.find((entry) => entry.slug === slug);
  return item ? { title: item.title, description: item.summary } : {};
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = cases.find((entry) => entry.slug === slug);
  if (!item) notFound();
  const related = cases.filter((entry) => entry.slug !== slug).slice(0, 2);
  return (
    <>
      <SiteHeader />
      <article className="case-page">
        <header className={`case-hero tone-${item.accent}`}><div><p className="eyebrow">{item.code} · {item.industry}</p><h1>{item.title}</h1></div><p>{item.summary}</p></header>
        <section className="case-summary section-pad"><aside><p className="eyebrow">At a glance</p><dl><div><dt>Industry</dt><dd>{item.industry}</dd></div><div><dt>Capability</dt><dd>{item.category}</dd></div><div><dt>Engagement</dt><dd>Production system</dd></div></dl></aside><div className="case-metrics">{item.outcomes.map((metric) => <article key={metric.label}><strong>{metric.value}</strong><h2>{metric.label}</h2><p>{metric.context}</p></article>)}</div></section>
        <section className="case-narrative section-pad"><div><p className="eyebrow">01 · Challenge</p><h2>The work before the system.</h2><p>{item.challenge}</p></div><div><p className="eyebrow">02 · The system</p><h2>Redesign around the operation.</h2><p>{item.system}</p></div></section>
        <section className="case-system section-pad"><p className="eyebrow">Workflow transformation</p><SystemDiagram item={item} /></section>
        <section className="case-narrative section-pad"><div><p className="eyebrow">03 · Implementation</p><h2>Evidence before scale.</h2><p>{item.implementation}</p></div><div><p className="eyebrow">04 · Operating model</p><h2>Ownership after launch.</h2><p>{item.operatingModel}</p></div></section>
        <section className="case-delivered section-pad"><p className="eyebrow">What moved into the operation</p><ul>{item.delivered.map((entry, index) => <li key={entry}><span>0{index + 1}</span>{entry}</li>)}</ul></section>
        <section className="related-cases section-pad"><h2>Related work</h2><div>{related.map((entry) => <CaseCard key={entry.slug} item={entry} />)}</div></section>
      </article>
      <FinalCTA title="What should work differently in your operation?" />
    </>
  );
}
