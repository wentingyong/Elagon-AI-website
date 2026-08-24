import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://elagon.ai";

export const SITE_NAME = "Elagon";
export const SITE_LOCALE = "en_CA";
export const SITE_LANGUAGE = "en-CA";
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL,
).origin;

export const SOCIAL_IMAGE_PATH = "/brand/FB.png";
export const SOCIAL_IMAGE_ALT = "Elagon — AI that works. Value that lasts.";

export const seoCopy = {
  home: {
    title: "Production AI Systems for Complex Operations",
    description:
      "Elagon redesigns critical workflows and builds production AI systems that improve speed, accuracy, capacity, and control across complex operations.",
    path: "/",
  },
  services: {
    title: "Enterprise AI Services for Production Systems",
    description:
      "Explore Elagon’s enterprise AI services: workflow discovery, production validation, and the build and launch of dependable AI systems for complex operations.",
    path: "/services",
  },
  work: {
    title: "Production AI Case Studies",
    description:
      "Explore production AI case studies in contract intelligence, communications automation, digital rights operations, and performance intelligence.",
    path: "/work",
  },
  approach: {
    title: "Production AI Delivery Playbook",
    description:
      "See how Elagon frames, maps, designs, validates, builds, and embeds production AI systems around measurable business outcomes and human control.",
    path: "/approach",
  },
  company: {
    title: "Senior Enterprise AI Systems Team",
    description:
      "Meet Elagon’s senior Toronto-based team designing, building, and operating production AI systems for enterprises and PE-backed companies.",
    path: "/company",
  },
  contact: {
    title: "Discuss a Production AI Workflow",
    description:
      "Discuss a critical workflow with Elagon. Start with the operating constraint, accountable owner, and measurable result your team wants to improve.",
    path: "/contact",
  },
} as const;

const caseSeoCopy: Record<string, { title: string; description: string }> = {
  "contract-intelligence": {
    title: "Contract Intelligence AI Case Study",
    description:
      "See how Elagon rebuilt enterprise contract review into a controlled AI system, reducing processing from about one hour to 40 seconds per contract.",
  },
  "communications-automation": {
    title: "Communications Automation AI Case Study",
    description:
      "See how a governed Jira-connected AI workflow automated high-volume communications and returned an estimated 750 hours of annual team capacity.",
  },
  "digital-rights-operations": {
    title: "Digital Rights Operations AI Case Study",
    description:
      "See how Elagon unified digital rights discovery, prioritization, and claims work in one platform, reducing estimated manual work by 80–90%.",
  },
  "performance-intelligence": {
    title: "Operational Performance AI Case Study",
    description:
      "See how Elagon consolidated about ten spreadsheets into one continuously updated operational performance intelligence workflow.",
  },
};

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function getCaseSeo(slug: string) {
  const copy = caseSeoCopy[slug];
  return copy ? { ...copy, path: `/work/${slug}` } : undefined;
}

export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const socialImageUrl = absoluteUrl(SOCIAL_IMAGE_PATH);
  const socialTitle = `${title} — ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: socialTitle } : title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: socialTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: SOCIAL_IMAGE_ALT,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: socialImageUrl, alt: SOCIAL_IMAGE_ALT }],
    },
  };
}
