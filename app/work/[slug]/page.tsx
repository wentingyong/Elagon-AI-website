import { notFound } from "next/navigation";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA } from "@/components/Editorial";
import { SiteHeader } from "@/components/SiteHeader";
import { SystemDiagram } from "@/components/SystemDiagram";
import { CaseArtwork } from "@/components/work/CaseArtwork";
import { CaseHeroArt } from "@/components/work/CaseHeroArt";
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
        <header className={`case-hero tone-${item.accent}`}>
          <div className="case-hero-copy"><p className="eyebrow">{item.code} · {item.industry}</p><h1>{item.headline}</h1><div className="case-hero-summary"><strong>{item.title}</strong><p>{item.summary}</p></div></div>
          <CaseHeroArt art={item.art}><CaseArtwork art={item.art} idPrefix="hero" className="case-hero-art-inner" /></CaseHeroArt>
        </header>
        <section className="case-summary section-pad"><aside><p className="eyebrow">At a glance</p><dl><div><dt>Operation</dt><dd>{item.industry}</dd></div><div><dt>System</dt><dd>{item.category}</dd></div><div><dt>Status</dt><dd>Production system</dd></div></dl></aside><div className="case-metrics">{item.outcomes.map((metric) => <article key={metric.label}><strong>{metric.value}</strong><h2>{metric.label}</h2><p>{metric.context}</p></article>)}</div></section>
        <section className="case-narrative section-pad"><div><p className="eyebrow">01 · The constraint</p><h2>What was getting in the way.</h2><p>{item.challenge}</p></div><div><p className="eyebrow">02 · The intervention</p><h2>The work was redesigned first.</h2><p>{item.implementation}</p></div></section>
        <section className="case-system section-pad"><p className="eyebrow">03 · The operating system</p><h2 className="case-system-title">One workflow.<br /><em>Every handoff visible.</em></h2><SystemDiagram item={item} /></section>
        <section className="case-narrative section-pad"><div><p className="eyebrow">04 · What Elagon built</p><h2>A complete system around the model.</h2><p>{item.system}</p></div><div><p className="eyebrow">05 · Human control</p><h2>Accountability stayed with the team.</h2><p>{item.operatingModel}</p></div></section>
        <section className="case-delivered section-pad"><p className="eyebrow">What moved into the operation</p><ul>{item.delivered.map((entry, index) => <li key={entry}><span>0{index + 1}</span>{entry}</li>)}</ul><p className="measurement-note"><strong>Measurement note</strong>{item.measurementNote}</p></section>
        <section className="related-cases section-pad"><h2>Related work</h2><div>{related.map((entry) => <CaseCard key={entry.slug} item={entry} />)}</div></section>
      </article>
      <FinalCTA title="Discuss a similar workflow." text="Start with the operating constraint and the result that should change." />
    </>
  );
}
