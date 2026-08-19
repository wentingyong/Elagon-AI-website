import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import type { CaseStudy } from "@/types/content";

export function WorkRailCard({ item, art }: { item: CaseStudy; art: React.ReactNode }) {
  const { stat } = item;
  return (
    <Link
      href={`/work/${item.slug}`}
      className="swr-card"
      aria-label={`${item.cardTitle} — ${item.code}. ${stat.value}${stat.unit ? ` ${stat.unit}` : ""}, ${stat.label}.`}
    >
      <article className="swr-card-inner">
        <div className="swr-head">
          <p className="swr-code">{item.code}</p>
          <p className="swr-stat">{stat.value}{stat.unit && <span>{stat.unit}</span>}</p>
          <p className="swr-stat-label">{stat.label}</p>
        </div>
        {art}
        <span className="swr-strip" aria-hidden="true" />
        <div className="swr-foot">
          <h3>{item.cardTitle}</h3>
          <span className="swr-arrow"><ArrowIcon /></span>
        </div>
      </article>
    </Link>
  );
}
