"use client";

import { useMemo, useState } from "react";
import { CaseCard } from "@/components/CaseCard";
import { FinalCTA, PageHero } from "@/components/Editorial";
import { cases } from "@/content/site";

export default function WorkPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...Array.from(new Set(cases.map((item) => item.category)))];
  const visible = useMemo(() => filter === "All" ? cases : cases.filter((item) => item.category === filter), [filter]);
  return (
    <>
      <PageHero eyebrow="Selected work" title={<>Measured in<br /><em>the operation.</em></>} intro="Anonymous by design. Specific where it matters: the workflow, production system and measurable business result." tone="green" />
      <section className="work-index section-pad">
        <div className="work-filters" aria-label="Filter case studies"><label htmlFor="case-filter">Filter</label><select id="case-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>{filters.map((item) => <option key={item}>{item}</option>)}</select><div>{filters.map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
        <div className="work-list">{visible.map((item, index) => <CaseCard key={item.slug} item={item} featured={index === 0 && filter === "All"} />)}</div>
      </section>
      <section className="work-principle section-pad"><p className="eyebrow">The standard</p><h2>Real users. Real data.<br /><em>Accountable people in control.</em></h2></section>
      <FinalCTA />
    </>
  );
}
