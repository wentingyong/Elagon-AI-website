import type { CaseStudy } from "@/types/content";

export function SystemDiagram({ item }: { item: CaseStudy }) {
  return (
    <div className={`system-diagram tone-${item.accent}`} role="img" aria-label={`Workflow sequence: ${item.workflow.join(" to ")}`}>
      <div className="diagram-track">{item.workflow.map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < item.workflow.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div>
      <div className="diagram-feedback"><span>Measure</span><span>Review</span><span>Improve</span></div>
    </div>
  );
}
