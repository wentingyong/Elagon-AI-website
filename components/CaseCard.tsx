import Link from "next/link";
import type { CaseStudy } from "@/types/content";
import { ArrowIcon } from "@/components/ArrowIcon";

export function CaseCard({ item, featured = false }: { item: CaseStudy; featured?: boolean }) {
  return (
    <article className={`case-card tone-${item.accent} ${featured ? "is-featured" : ""}`} data-reveal>
      <div className="case-visual" aria-hidden="true"><span>{item.code}</span><div className="system-lines">{item.workflow.map((step, index) => <i key={step} style={{ "--i": index } as React.CSSProperties}>{step}</i>)}</div></div>
      <div className="case-copy"><p className="eyebrow">{item.industry} · {item.category}</p><h3>{item.title}</h3><p>{item.summary}</p><Link href={`/work/${item.slug}`}>Read case study <span><ArrowIcon /></span></Link></div>
    </article>
  );
}
