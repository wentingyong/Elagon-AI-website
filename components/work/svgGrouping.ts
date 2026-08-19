import { caseGroups } from "@/components/work/caseGroups";

/** Server-only string transform: wraps a case SVG's paths into named
 *  <g data-el> groups and emits full-size <clipPath><rect data-clip> defs
 *  so GSAP can stage per-element reveals. Whole paths only — compound
 *  paths are never split (holes must stay fused with their contours).
 *  Rects are authored at full size: the no-JS / reduced-motion / pre-GSAP
 *  paint is always the complete artwork. */
const cache = new Map<string, string>();

export function groupCaseSvg(svg: string, art: string, idPrefix: string): string {
  const spec = caseGroups[art];
  if (!spec) return svg;
  const key = `${art}:${idPrefix}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const pathEls: string[] = [];
  let out = svg.replace(/<path\b[^>]*\/>/g, (m) => {
    pathEls.push(m);
    return "";
  });

  const clipId = (group: string) => `${idPrefix}-${art}-${group}`;
  const clippedGroups = new Set(Object.values(spec.clipOwner));

  const used = new Set<number>();
  const groupMarkup = spec.groups
    .map(({ name, refs }) => {
      const clipAttr = clippedGroups.has(name) ? ` clip-path="url(#${clipId(name)})"` : "";
      const body = refs
        .map((i) => {
          used.add(i);
          return pathEls[i] ?? "";
        })
        .join("");
      return `<g data-el="${name}"${clipAttr}>${body}</g>`;
    })
    .join("");
  const rest = pathEls.filter((_, i) => !used.has(i));
  const restMarkup = rest.length ? `<g data-el="rest">${rest.join("")}</g>` : "";

  const rectsByGroup = new Map<string, string[]>();
  for (const clip of spec.clips) {
    const owner = spec.clipOwner[clip.name];
    const rects = rectsByGroup.get(owner) ?? [];
    rects.push(`<rect data-clip="${clip.name}" x="${clip.x}" y="${clip.y}" width="${clip.w}" height="${clip.h}"/>`);
    rectsByGroup.set(owner, rects);
  }
  const defs = [...rectsByGroup]
    .map(([group, rects]) => `<clipPath id="${clipId(group)}" clipPathUnits="userSpaceOnUse">${rects.join("")}</clipPath>`)
    .join("");

  const content = groupMarkup + restMarkup;
  const wrapper = out.match(/<g clip-path="url\(#clip0[^"]*\)">/);
  out = wrapper
    ? out.replace(wrapper[0], `${wrapper[0]}${content}`)
    : out.replace(/(<svg[^>]*>)/, `$1${content}`);
  out = out.includes("<defs>")
    ? out.replace("<defs>", `<defs>${defs}`)
    : out.replace("</svg>", `<defs>${defs}</defs></svg>`);

  cache.set(key, out);
  return out;
}
