import { readFile } from "node:fs/promises";
import path from "node:path";
import { groupCaseSvg } from "@/components/work/svgGrouping";

/** Inlines a case geometry SVG from public/cases so paths tint via currentColor
 *  and stay GSAP-targetable, without ever entering the client bundle. Paths are
 *  wrapped into named <g data-el> groups with full-size clip rects so the
 *  per-case choreography can stage them (see caseChoreography.ts). */
export async function CaseArtwork({
  art,
  idPrefix = "swr",
  className = "swr-art",
}: {
  art: string;
  idPrefix?: string;
  className?: string;
}) {
  const raw = await readFile(path.join(process.cwd(), "public", "cases", `${art}.svg`), "utf8");
  const svg = groupCaseSvg(
    raw
      .replace(/<svg([^>]*?)\s+width="\d+"\s+height="\d+"/, "<svg$1")
      .replaceAll('fill="black"', 'fill="currentColor"')
      .replace("<svg", '<svg class="swr-art-svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"'),
    art,
    idPrefix,
  );
  return (
    <div className={className} aria-hidden="true">
      <div className="swr-art-float" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
