import type { MetadataRoute } from "next";
import { cases } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

const staticPaths = [
  "/",
  "/services",
  "/work",
  "/approach",
  "/company",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path) })),
    ...cases.map((item) => ({ url: absoluteUrl(`/work/${item.slug}`) })),
  ];
}
