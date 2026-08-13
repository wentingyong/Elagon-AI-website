export type MotionPreset =
  | "hero-renaissance"
  | "editorial-reveal"
  | "process-sequence"
  | "case-system-map";

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface VisualStageProps {
  desktopMedia: MediaAsset;
  mobileMedia: MediaAsset;
  foregroundMedia?: MediaAsset;
  maskMedia?: MediaAsset;
  focalPoint: { x: number; y: number };
  motionPreset: MotionPreset;
  reducedMotionFallback: MediaAsset;
}

export interface SplitHeadlineData {
  primaryTop: string;
  connectorTop: string;
  primaryBottom: string;
  connectorBottom: string;
}

export interface CaseStudy {
  slug: string;
  code: string;
  title: string;
  industry: string;
  category: string;
  summary: string;
  challenge: string;
  system: string;
  implementation: string;
  operatingModel: string;
  outcomes: Array<{ value: string; label: string; context: string }>;
  workflow: string[];
  delivered: string[];
  accent: "moss" | "rust" | "sky";
}
