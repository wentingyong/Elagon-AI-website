import type { CaseStudy, SplitHeadlineData } from "@/types/content";

export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Playbook", href: "/approach" },
  { label: "Company", href: "/company" },
] as const;

export const heroHeadline: SplitHeadlineData = {
  primaryTop: "AI",
  connectorTop: "that works.",
  primaryBottom: "Value",
  connectorBottom: "that lasts.",
};

export const services = [
  {
    number: "01",
    title: "Find the value",
    line: "Prioritize the workflows where AI can create material, measurable business value.",
    problem: "AI activity is scattered across tools and teams, with no shared definition of value.",
    action: "We map the operation, baseline performance and select one constraint worth solving.",
    deliverables: ["Operating map", "Prioritized opportunity roadmap", "Business case and measures"],
    result: "A validated starting point with an accountable owner and evidence for the next investment.",
    tone: "moss",
  },
  {
    number: "02",
    title: "Build the system",
    line: "Redesign the workflow and integrate a production-ready AI system around it.",
    problem: "A promising prototype still lacks the controls, integrations and reliability required for real work.",
    action: "We design the future workflow, test its riskiest assumptions and build into your environment.",
    deliverables: ["Solution architecture", "Production system", "Evaluations and controls"],
    result: "A dependable capability inside the workflow—not another isolated AI demo.",
    tone: "sky",
  },
  {
    number: "03",
    title: "Run and improve",
    line: "Establish the operating model so the capability keeps working after launch.",
    problem: "Without owners, feedback loops and operating controls, production systems decay after launch.",
    action: "We establish governance, monitoring, runbooks and the team rhythms required to improve it.",
    deliverables: ["Operating dashboard", "Runbooks and governance", "Trained owners and transfer package"],
    result: "A system your organization can operate, improve and own.",
    tone: "rust",
  },
] as const;

export const cases: CaseStudy[] = [
  {
    slug: "contract-intelligence",
    code: "ELG-001",
    title: "Enterprise contract intelligence",
    industry: "Contract operations",
    category: "Workflow intelligence",
    summary: "A controlled, self-improving review system for a high-volume contract archive.",
    challenge: "An existing AI workflow took about an hour per contract and produced outputs reviewers could not consistently trust or trace back to source language.",
    system: "Elagon redesigned ingestion, extraction and human review as one controlled system. Every value is explained, linked to its source and fed back into a governed improvement loop.",
    implementation: "The team validated the highest-risk extraction patterns first, introduced evaluation sets, then integrated the production pipeline around the review team rather than around the model.",
    operatingModel: "Review corrections become governed system improvements. Named operators own exceptions, evaluation thresholds and releases.",
    outcomes: [
      { value: "~1 hr → 40 sec", label: "Automated processing", context: "Per contract" },
      { value: "~60% → 90%", label: "Measured accuracy", context: "On the evaluated extraction set" },
      { value: "$0.30 → $0.10", label: "Model cost", context: "Per contract" },
    ],
    workflow: ["Ingest", "Extract", "Review", "Learn"],
    delivered: ["Controlled extraction pipeline", "Source-linked explanations", "Evaluation suite", "Reviewer feedback loop"],
    accent: "sky",
  },
  {
    slug: "communications-automation",
    code: "ELG-002",
    title: "High-volume communications automation",
    industry: "Content operations",
    category: "Workflow automation",
    summary: "One governed action turns existing workflow data into channel-ready drafts.",
    challenge: "Specialists repeatedly extracted, rewrote and reformatted the same information across several communication destinations.",
    system: "Elagon connected directly to the existing Jira workflow, assembled approved templates and writing rules, and kept employees in control of every final communication.",
    implementation: "The system flags missing inputs rather than inventing them and operates with scoped cloud permissions and observable handoffs.",
    operatingModel: "Content owners govern templates and exceptions while operators approve every destination before release.",
    outcomes: [
      { value: "+750 hrs", label: "Annual capacity", context: "Estimated team time returned" },
      { value: "3 hrs", label: "Per user, weekly", context: "Estimated repetitive work removed" },
    ],
    workflow: ["Jira", "Compose", "Review", "Distribute"],
    delivered: ["Workflow integration", "Template and style system", "Exception handling", "Least-privilege access model"],
    accent: "moss",
  },
  {
    slug: "digital-rights-operations",
    code: "ELG-003",
    title: "Digital rights operations",
    industry: "Media rights",
    category: "Operations platform",
    summary: "A unified monitoring and claims workflow for a three-person specialist team.",
    challenge: "A fragmented manual process made it difficult to monitor a large channel portfolio, review matches quickly and initiate claims consistently.",
    system: "Elagon connected three rights portfolios in one platform, increased monitoring frequency and put the full review-to-claim workflow in one operating surface.",
    implementation: "The platform was shaped around a small specialist team, with clear queues, review decisions and claim initiation built into a single daily rhythm.",
    operatingModel: "The team owns portfolio rules, claim thresholds and exception review without depending on Elagon for routine operation.",
    outcomes: [
      { value: "80–90%", label: "Manual work reduced", context: "Estimated across the workflow" },
      { value: "~1,400", label: "Channels monitored", context: "Across three portfolios" },
      { value: "24 hr → 10 min", label: "Monitoring recency", context: "From daily to near-continuous results" },
    ],
    workflow: ["Monitor", "Detect", "Review", "Claim"],
    delivered: ["Unified monitoring platform", "Portfolio controls", "Review queues", "Claim initiation workflow"],
    accent: "rust",
  },
];

export const companyRoles = [
  { title: "Advisor", text: "Frame the opportunity, evidence and operating choices before the build begins." },
  { title: "Builder", text: "Design and integrate the production system around the work that matters." },
  { title: "Operating partner", text: "Establish ownership, measurement and improvement after launch." },
] as const;
