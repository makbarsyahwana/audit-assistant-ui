export type AppMode = "audit" | "legal" | "compliance";

export interface ModeTerminology {
  topLevelEntity: string;       // Engagement / Matter / Program
  topLevelEntityPlural: string; // Engagements / Matters / Programs
  workItem: string;             // Finding / Issue / Obligation
  workItemPlural: string;       // Findings / Issues / Obligations
  document: string;             // Workpaper / Brief / Policy
  documentPlural: string;       // Workpapers / Briefs / Policies
  reviewOutput: string;         // Control Matrix / Clause Extract / Gap Register
  playbookLabel: string;        // Audit Playbook / Legal Playbook / Compliance Playbook
  counselGreeting: string;      // Mode-specific empty-state heading
  counselSubtitle: string;      // Mode-specific empty-state subtitle
}

export interface ModeSuggestion {
  label: string;
  query: string;
}

export interface ModeConfig {
  mode: AppMode;
  label: string;
  description: string;
  color: string;           // Tailwind text color class
  bgColor: string;         // Tailwind bg color class
  borderColor: string;     // Tailwind border color class
  badgeColor: string;      // Tailwind badge bg class
  terminology: ModeTerminology;
  suggestions: ModeSuggestion[];
  deepResearchSources: string[]; // Knowledge source labels for this mode
  frameworks: string[];
}

export const MODE_CONFIGS: Record<AppMode, ModeConfig> = {
  audit: {
    mode: "audit",
    label: "Audit",
    description: "IT & financial audit engagements, evidence review, control testing",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    badgeColor: "bg-blue-100 text-blue-700",
    terminology: {
      topLevelEntity: "Engagement",
      topLevelEntityPlural: "Engagements",
      workItem: "Finding",
      workItemPlural: "Findings",
      document: "Workpaper",
      documentPlural: "Workpapers",
      reviewOutput: "Control Matrix",
      playbookLabel: "Audit Playbook",
      counselGreeting: "How can I assist your audit?",
      counselSubtitle: "Ask questions about controls, evidence, and standards — with cited sources.",
    },
    suggestions: [
      { label: "Review Evidence", query: "Show me the latest access review evidence for Q2 2025" },
      { label: "Risk Assessment", query: "What are the ISO 27001 requirements for risk assessment?" },
      { label: "Control Testing", query: "List all change management controls and their testing status" },
      { label: "Compliance Gap", query: "Identify compliance gaps in our current GDPR documentation" },
    ],
    deepResearchSources: ["ISO 27001:2022", "SOX / COSO", "COBIT 2019", "NIST CSF", "ISAE 3402"],
    frameworks: ["ISO 27001", "SOX", "COBIT", "NIST", "ISAE 3402"],
  },
  legal: {
    mode: "legal",
    label: "Legal",
    description: "Contract analysis, due diligence, case preparation, regulatory research",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeColor: "bg-amber-100 text-amber-700",
    terminology: {
      topLevelEntity: "Matter",
      topLevelEntityPlural: "Matters",
      workItem: "Issue",
      workItemPlural: "Issues",
      document: "Brief",
      documentPlural: "Briefs",
      reviewOutput: "Clause Extract",
      playbookLabel: "Legal Playbook",
      counselGreeting: "What legal question can I research?",
      counselSubtitle: "Analyze contracts, research case law, and draft memos — with cited sources.",
    },
    suggestions: [
      { label: "Contract Review", query: "Identify key risk clauses in this service agreement" },
      { label: "Due Diligence", query: "Summarize the change-of-control provisions across all contracts" },
      { label: "Regulatory Research", query: "What are the disclosure obligations under SEC Rule 10b-5?" },
      { label: "Precedent Search", query: "Find precedent language for limitation of liability clauses" },
    ],
    deepResearchSources: ["Case Law Database", "Statutes & Regulations", "SEC EDGAR", "EUR-Lex", "Contract Precedents"],
    frameworks: ["Corporate", "M&A", "Litigation", "IP", "Employment"],
  },
  compliance: {
    mode: "compliance",
    label: "Compliance",
    description: "Regulatory compliance, policy management, gap analysis, monitoring",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
    terminology: {
      topLevelEntity: "Program",
      topLevelEntityPlural: "Programs",
      workItem: "Obligation",
      workItemPlural: "Obligations",
      document: "Policy",
      documentPlural: "Policies",
      reviewOutput: "Gap Register",
      playbookLabel: "Compliance Playbook",
      counselGreeting: "What compliance area should we review?",
      counselSubtitle: "Research obligations, map gaps, and review policies — with cited sources.",
    },
    suggestions: [
      { label: "Gap Analysis", query: "Identify gaps in our GDPR data processing documentation" },
      { label: "Obligation Mapping", query: "What are our obligations under CCPA for data subject requests?" },
      { label: "Policy Review", query: "Does our data retention policy meet SOC 2 requirements?" },
      { label: "Incident Response", query: "What are the breach notification timelines under GDPR Article 33?" },
    ],
    deepResearchSources: ["GDPR / EUR-Lex", "CCPA / CPRA", "SOC 2 Trust Criteria", "PCI-DSS v4.0", "AML/KYC Regulations"],
    frameworks: ["GDPR", "CCPA", "SOC 2", "PCI-DSS", "AML/KYC"],
  },
};
