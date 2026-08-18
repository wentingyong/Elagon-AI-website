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

export const heroMission =
  "Elagon redesigns important work and builds production AI around the people, data and decisions that make it work.";

export const services = [
  {
    number: "01",
    title: "Choose the workflow",
    offer: "AI Workflow Sprint",
    line: "Make one informed production decision in ten business days.",
    for: "A team with a material operating problem, an accountable owner and several possible ways to solve it.",
    action: "We frame the constraint, map the work as it really happens, establish the baseline and design the most credible production path.",
    deliverables: ["Current and redesigned workflow", "Value case and baseline", "Production concept and validation plan"],
    result: "A go, revise, defer or stop decision grounded in the operation—not in a generic AI demo.",
    duration: "10 business days",
    decision: "Is this the right production opportunity?",
    tone: "moss",
  },
  {
    number: "02",
    title: "Prove the path",
    offer: "Production Validation",
    line: "Test what could make the investment fail before committing to a full build.",
    for: "A defined opportunity with unresolved questions about data, performance, integration, security, cost or user behaviour.",
    action: "We test the riskiest assumptions with real users, real workflow conditions and representative data.",
    deliverables: ["Working solution slice", "Evaluation and user evidence", "Refined business case and implementation plan"],
    result: "Evidence for a production investment—and a clear record of what still has to be true.",
    duration: "Typically 3–6 weeks",
    decision: "Does the evidence justify production?",
    tone: "sky",
  },
  {
    number: "03",
    title: "Put it to work",
    offer: "Production Build + Launch",
    line: "Build the minimum complete system required for dependable operation.",
    for: "An approved use case with a business owner, acceptance criteria and access to the people and systems the work depends on.",
    action: "We redesign the workflow, integrate the system, evaluate it, launch it and stabilize performance with the operating team.",
    deliverables: ["Working production system", "Integrations, controls and evaluation evidence", "Runbooks, training and transition package"],
    result: "A system operating inside the business, with named owners and a defined way to run and improve it.",
    duration: "Milestone based",
    decision: "Is the system ready to operate and transition?",
    tone: "rust",
  },
] as const;

export const operatingModes = [
  {
    number: "01",
    title: "Client-operated",
    line: "Your team runs the system with transferred access, documentation, evaluations, monitoring and training.",
    fit: "Best for organizations with mature product, engineering, security and AI operations capability.",
  },
  {
    number: "02",
    title: "Co-managed",
    line: "You own the business operation. Elagon runs the specialized AI layer, evaluation and technical improvement cycle.",
    fit: "The recommended starting mode for most organizations.",
  },
  {
    number: "03",
    title: "Elagon-operated",
    line: "Elagon operates the technical system under a defined service agreement while your team retains business accountability.",
    fit: "Best when speed and reliability matter more than building an internal operating team immediately.",
  },
] as const;

export const playbookSteps = [
  { number: "01", title: "Frame the problem", line: "Define the operating constraint, baseline, value at stake and accountable owner.", gate: "Is the problem material and measurable?", tone: "moss" },
  { number: "02", title: "Learn the work", line: "Map decisions, handoffs, exceptions, systems, data and expert judgment.", gate: "Do we understand how the work really happens?", tone: "sky" },
  { number: "03", title: "Redesign the workflow", line: "Decide what should stay human, what should be assisted and what can be automated.", gate: "Is the future workflow viable and accountable?", tone: "rust" },
  { number: "04", title: "Prove the risk", line: "Test the assumptions most likely to invalidate the investment.", gate: "Does the evidence justify production?", tone: "moss" },
  { number: "05", title: "Build the system", line: "Integrate, evaluate and launch the complete operating system around the model.", gate: "Does it meet the agreed production standard?", tone: "sky" },
  { number: "06", title: "Establish ownership", line: "Stabilize performance, train owners and set the operating and improvement rhythm.", gate: "Can the system be run responsibly after launch?", tone: "rust" },
] as const;

export const systemLayers = [
  { number: "01", title: "Business measure", line: "A baseline, owner and result worth changing." },
  { number: "02", title: "Workflow + context", line: "The data, rules, systems, exceptions and expert judgment the work depends on." },
  { number: "03", title: "Controlled AI system", line: "The smallest dependable combination of software, models and integrations." },
  { number: "04", title: "Human control + learning", line: "Review, escalation, evaluation, monitoring and improvement built into daily use." },
] as const;

export const cases: CaseStudy[] = [
  {
    slug: "contract-intelligence",
    code: "ELG-001",
    title: "Enterprise contract intelligence",
    verb: "Rebuild contract review.",
    headline: "From one hour to 40 seconds per contract.",
    industry: "High-volume contract operations",
    category: "Contract intelligence",
    summary: "An unreliable AI extraction process rebuilt as a controlled, explainable and self-improving review system.",
    challenge: "An existing agentic workflow was slow, difficult to control and hard to improve. Documents could go missing, values were sometimes unsupported, definitions changed without reliable version tracking and reviewers corrected outputs manually in spreadsheets.",
    system: "Elagon replaced open-ended orchestration with a controlled extraction pipeline that combines deterministic processing with targeted AI. Extracted values carry explanations and source references; field definitions are versioned; corrections are captured by field and batch.",
    implementation: "The team tested the highest-risk extraction patterns first, separated training and validation contracts, introduced evaluation sets and integrated the production pipeline around the specialists responsible for review.",
    operatingModel: "Legal and contract specialists remain accountable for review. Their corrections become governed proposals for system improvement rather than disappearing into a spreadsheet.",
    outcomes: [
      { value: "~1 hr → 40 sec", label: "Automated processing", context: "Per contract" },
      { value: "~60% → 90%", label: "Measured accuracy", context: "On the evaluated extraction set" },
      { value: "$0.30 → $0.10", label: "Reported model cost", context: "Per contract" },
    ],
    workflow: ["Ingest", "Extract", "Review", "Learn"],
    delivered: ["Controlled extraction pipeline", "Source-linked explanations", "Versioned field definitions", "Evaluation and reviewer feedback loop"],
    measurementNote: "Figures are approximate and reflect the evaluated workflow and reported model cost at the time of project review.",
    accent: "sky",
  },
  {
    slug: "communications-automation",
    code: "ELG-002",
    title: "High-volume communications automation",
    verb: "Return time to the team.",
    headline: "An estimated 750 hours returned each year.",
    industry: "Content distribution operations",
    category: "Workflow automation",
    summary: "Structured Jira data turned into accurate, personalized and ready-to-send communications in one governed workflow.",
    challenge: "For every release, employees repeatedly opened Jira tickets, found the fields relevant to their role, moved information into another document, drafted channel-specific messages and reproduced exact formatting before sending.",
    system: "Elagon connected an internal communications platform directly to Jira. It retrieves eligible tickets, generates several communications in one action, applies configurable templates and personal preferences, and preserves required formatting.",
    implementation: "The workflow was built around the team’s existing Jira states and writing practices. Scoped cloud permissions limit access, while missing information is flagged instead of being invented.",
    operatingModel: "Employees edit, regenerate and approve every final communication. Content owners govern templates, field order and exceptions.",
    outcomes: [
      { value: "~750 hrs", label: "Annual capacity", context: "Estimated across five users" },
      { value: "~3 hrs", label: "Per user, weekly", context: "Estimated repetitive work removed" },
      { value: "~$37.5k", label: "Illustrative value", context: "Using a $50 hourly assumption" },
    ],
    workflow: ["Jira", "Compose", "Review", "Distribute"],
    delivered: ["Jira-connected workflow", "Template and style system", "Batch communications generation", "Least-privilege access and human approval"],
    measurementNote: "Time and labour-value figures are estimates based on five users, three hours saved per user per week and an illustrative $50 hourly cost.",
    accent: "moss",
  },
  {
    slug: "digital-rights-operations",
    code: "ELG-003",
    title: "Digital rights operations",
    verb: "Unify rights operations.",
    headline: "An estimated 80–90% less manual work.",
    industry: "Digital rights operations",
    category: "Operations platform",
    summary: "Discovery, prioritization and claims work consolidated into one platform for a three-person specialist team.",
    challenge: "Specialists searched channels individually, opened videos one by one, relied on years of memory, checked existing claims in another system and maintained a large, changing subscription list.",
    system: "Elagon created one discovery and claims-operations platform spanning three rights portfolios. It monitors channels, improves recency filtering, surfaces high-value work, shows claim history and supports review and claim initiation in one place.",
    implementation: "The interface was tuned to the speed of expert users with configurable classifications, exclusions, blocked keywords, keyboard shortcuts and clear queues.",
    operatingModel: "The specialist team owns portfolio rules, prioritization and claim decisions. External-platform authorization remained the gate for production claim activation.",
    outcomes: [
      { value: "80–90%", label: "Manual work reduced", context: "Estimated across the observed workflow" },
      { value: "~1,400", label: "Channels monitored", context: "Across three rights portfolios" },
      { value: "~10 min", label: "Content recency", context: "Improved from daily-level filtering" },
    ],
    workflow: ["Monitor", "Detect", "Review", "Claim"],
    delivered: ["Unified monitoring platform", "Portfolio and prioritization controls", "Expert review queues", "Claim initiation workflow"],
    measurementNote: "The reduction is a technical-team estimate based on observation of the prior workflow and direct employee feedback.",
    accent: "rust",
  },
  {
    slug: "performance-intelligence",
    code: "ELG-004",
    title: "Operational performance intelligence",
    verb: "Turn reporting into one living view.",
    headline: "Ten spreadsheets became one living report.",
    industry: "Release and portfolio operations",
    category: "Performance intelligence",
    summary: "Data collection, normalization, analysis and reporting turned into one continuously updated operating workflow.",
    challenge: "Operations managers searched internal databases, reviewed third-party and social data, moved across approximately ten spreadsheets and rebuilt visual reports as new performance data arrived.",
    system: "Elagon built a centralized platform that generates a structured report from one release identifier. It combines daily, platform, geographic and social performance, identifies risks and opportunities, and creates and files operational documents automatically.",
    implementation: "The system normalizes inconsistent outputs, records recurring errors for improvement and alerts administrators when new data issues appear. Reports continue updating during the critical post-release window.",
    operatingModel: "Operations managers review one source of truth and retain the decisions about promotion and monetization. Administrators own data issues, access and report rules.",
    outcomes: [
      { value: "~10 → 1", label: "Reporting surfaces", context: "Spreadsheets consolidated into one report" },
      { value: "1 click", label: "Report creation", context: "After entering a release identifier" },
      { value: "Up to 30 days", label: "Daily collection", context: "With document updates during the first seven days" },
    ],
    workflow: ["Collect", "Normalize", "Analyze", "Report"],
    delivered: ["Central performance platform", "Multi-source normalization", "Automated document creation", "Continuous reporting and issue alerts"],
    measurementNote: "The spreadsheet count and update windows describe the reviewed operating workflow and configured system behaviour.",
    accent: "sky",
  },
];

export const secondaryProof = [
  {
    code: "ELG-005",
    title: "Audience and growth intelligence",
    headline: "Nearly 100 billion records turned into growth signals.",
    text: "An intelligence layer across approximately 22 terabytes of behavioural data surfaced retention, breakout momentum, under-promoted opportunities and high-value audience sources.",
    proof: "~22 TB · nearly 100B records",
  },
  {
    code: "ELG-006",
    title: "AI intake and routing",
    headline: "A fragmented application process became one guided workflow.",
    text: "A conversational intake and matching platform guided applicants through 46 baseline and up to approximately 100 industry-specific questions for a national innovation network.",
    proof: "46 baseline · up to ~100 adaptive questions",
    note: "At project review, the system was entering pilot validation. Network figures describe the design context, not confirmed production adoption.",
  },
] as const;

export const companyRoles = [
  { title: "Advisor", text: "Frame the business problem, value case and operating choices before technology decisions are made." },
  { title: "Builder", text: "Design and integrate the complete production system around the people responsible for the work." },
  { title: "Operating partner", text: "Establish measurement, ownership and improvement after launch—or operate the specialist AI layer with you." },
] as const;

export const teamMembers = [
  {
    number: "01",
    name: "Jordan King",
    role: "Chief Executive Officer",
    bio: "Founder and CEO. Jordan sets Elagon’s strategic direction and builds the partnerships and enterprise relationships that turn market opportunities into engagements.",
    accountable: "Strategy · Partnerships · Growth",
    photo: "/team/jordan.webp",
  },
  {
    number: "02",
    name: "Umar Ahmed",
    role: "Chief Strategy Officer",
    bio: "Umar leads market strategy and solution direction from first diagnosis through implementation, connecting business priorities to practical delivery.",
    accountable: "Market Strategy · Solution Shaping · Engagements",
    photo: "/team/umar.webp",
  },
  {
    number: "03",
    name: "Amine Hammoud",
    role: "Chief Technology Officer",
    bio: "Amine architects secure, scalable AI systems and leads the technical decisions required to move complex work into dependable production.",
    accountable: "Architecture · Security · Production Delivery",
    photo: "/team/amine.webp",
  },
  {
    number: "04",
    name: "Wenting Yong",
    role: "Chief Marketing Officer",
    bio: "Wenting leads brand, design and digital experience, translating Elagon’s strategy into a coherent and accessible market presence.",
    accountable: "Brand · Design System · Digital Experience",
    photo: "/team/wenting.webp",
  },
] as const;

export const fitSignals = [
  "The workflow matters to revenue, margin, capacity, service, decision quality or risk.",
  "The work depends on information, repeated decisions, exceptions and experienced judgment.",
  "A business owner can define what should improve and stay accountable for the result.",
  "The organization is ready to give the team access to real users, data and operating conditions.",
] as const;
