import { readFile } from "node:fs/promises";
import path from "node:path";

/** Inlines a case geometry SVG from public/cases so paths tint via currentColor
 *  and stay GSAP-targetable, without ever entering the client bundle. */
export async function CaseArtwork({ art }: { art: string }) {
  const raw = await readFile(path.join(process.cwd(), "public", "cases", `${art}.svg`), "utf8");
  const svg = raw
    .replace(/<svg([^>]*?)\s+width="\d+"\s+height="\d+"/, "<svg$1")
    .replaceAll('fill="black"', 'fill="currentColor"')
    .replace("<svg", '<svg class="swr-art-svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"');
  return (
    <div className="swr-art" aria-hidden="true">
      <div className="swr-art-float" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
