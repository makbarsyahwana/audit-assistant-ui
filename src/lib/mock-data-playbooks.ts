import type { AppMode } from "@/types/mode";

export interface PlaybookStep {
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  counselPrompt?: string; // Pre-populated Counsel query for this step
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  mode: AppMode;
  category: string;
  estimatedHours: number;
  stepCount: number;
  steps: PlaybookStep[];
  tags: string[];
  usageCount: number;
  lastUsed?: string;
}

export const mockPlaybooks: Playbook[] = [
  // Audit playbooks
  {
    id: "pb_001",
    name: "IT General Controls Testing",
    description: "End-to-end playbook for testing IT general controls across change management, access, and operations",
    mode: "audit",
    category: "Control Testing",
    estimatedHours: 8,
    stepCount: 6,
    tags: ["ITGC", "SOX", "ISO 27001"],
    usageCount: 34,
    lastUsed: "2025-06-09T11:00:00Z",
    steps: [
      { order: 1, title: "Define scope and control universe", description: "Identify in-scope systems, applications, and control objectives", estimatedMinutes: 30, counselPrompt: "List all in-scope IT systems and their associated ITGC control objectives" },
      { order: 2, title: "Request evidence from control owners", description: "Generate evidence request list and send to IT teams", estimatedMinutes: 20, counselPrompt: "Generate an evidence request list for change management controls CHG-01 through CHG-05" },
      { order: 3, title: "Review change management controls", description: "Test change approval, testing, and implementation controls", estimatedMinutes: 90, counselPrompt: "Analyze the change management evidence and identify any exceptions or deficiencies" },
      { order: 4, title: "Review access controls", description: "Test user provisioning, de-provisioning, and access review controls", estimatedMinutes: 90, counselPrompt: "Review the access control evidence and compare against the access control policy" },
      { order: 5, title: "Document findings", description: "Write up any deficiencies, exceptions, and recommendations", estimatedMinutes: 60, counselPrompt: "Draft a finding write-up for the access control deficiency identified in step 4" },
      { order: 6, title: "Prepare testing summary", description: "Summarize results across all controls for the audit report", estimatedMinutes: 45, counselPrompt: "Summarize the ITGC testing results across all controls tested this period" },
    ],
  },
  {
    id: "pb_002",
    name: "Risk Assessment Walkthrough",
    description: "Structured walkthrough for evaluating an organization's risk assessment process against ISO 27001 Clause 6.1",
    mode: "audit",
    category: "Risk Assessment",
    estimatedHours: 4,
    stepCount: 4,
    tags: ["ISO 27001", "Risk", "Clause 6.1"],
    usageCount: 21,
    lastUsed: "2025-06-05T10:00:00Z",
    steps: [
      { order: 1, title: "Review risk assessment methodology", description: "Evaluate the documented risk assessment process and criteria", estimatedMinutes: 45, counselPrompt: "What are the ISO 27001 requirements for risk assessment methodology?" },
      { order: 2, title: "Sample risk register entries", description: "Select a sample of risks and trace through the assessment process", estimatedMinutes: 60, counselPrompt: "Review the risk register and identify any risks that appear under-assessed" },
      { order: 3, title: "Evaluate risk treatment plans", description: "Assess whether treatment plans are appropriate and implemented", estimatedMinutes: 45, counselPrompt: "Analyze the risk treatment plans and identify any that lack implementation evidence" },
      { order: 4, title: "Document observations", description: "Summarize findings and recommendations for the audit report", estimatedMinutes: 30, counselPrompt: "Draft observations for the risk assessment section of the audit report" },
    ],
  },
  {
    id: "pb_003",
    name: "Evidence Collection Pack",
    description: "Systematic evidence collection for a compliance audit engagement",
    mode: "audit",
    category: "Evidence Collection",
    estimatedHours: 6,
    stepCount: 5,
    tags: ["Evidence", "Workpapers", "Documentation"],
    usageCount: 47,
    lastUsed: "2025-06-10T14:00:00Z",
    steps: [
      { order: 1, title: "Define evidence requirements", description: "Map control objectives to required evidence types", estimatedMinutes: 30 },
      { order: 2, title: "Issue evidence requests", description: "Send formal evidence requests to control owners", estimatedMinutes: 20 },
      { order: 3, title: "Validate received evidence", description: "Check completeness, relevance, and authenticity of evidence", estimatedMinutes: 60 },
      { order: 4, title: "Index and organize in Repository", description: "Upload and tag evidence in the appropriate Repository collection", estimatedMinutes: 30 },
      { order: 5, title: "Confirm coverage", description: "Verify all required evidence has been collected and indexed", estimatedMinutes: 20 },
    ],
  },
  // Legal playbooks
  {
    id: "pb_004",
    name: "Contract Due Diligence Review",
    description: "Systematic review of contracts in an M&A transaction for key risk clauses and obligations",
    mode: "legal",
    category: "Due Diligence",
    estimatedHours: 12,
    stepCount: 5,
    tags: ["M&A", "Contracts", "Due Diligence"],
    usageCount: 18,
    lastUsed: "2025-06-08T09:00:00Z",
    steps: [
      { order: 1, title: "Upload contracts to Repository", description: "Organize all target company contracts into a Repository collection", estimatedMinutes: 30 },
      { order: 2, title: "Run clause extraction", description: "Use Repository Extract to pull key clauses across all contracts", estimatedMinutes: 20, counselPrompt: "Extract all change-of-control, termination, and assignment clauses from the contract collection" },
      { order: 3, title: "Identify high-risk provisions", description: "Flag unusual or high-risk clauses for detailed review", estimatedMinutes: 120, counselPrompt: "Identify any non-standard or high-risk provisions in the extracted clauses" },
      { order: 4, title: "Research applicable law", description: "Use Deep Research to verify enforceability of key provisions", estimatedMinutes: 60, counselPrompt: "Research the enforceability of the limitation of liability clause under New York law" },
      { order: 5, title: "Draft due diligence memo", description: "Summarize findings in a structured due diligence memorandum", estimatedMinutes: 90, counselPrompt: "Draft a due diligence memo summarizing the key contract risks identified" },
    ],
  },
  {
    id: "pb_005",
    name: "Regulatory Briefing",
    description: "Synthesize internal policies and external regulations into a cited action memo for leadership",
    mode: "legal",
    category: "Regulatory Research",
    estimatedHours: 3,
    stepCount: 4,
    tags: ["Regulatory", "Memo", "Research"],
    usageCount: 29,
    lastUsed: "2025-06-07T14:00:00Z",
    steps: [
      { order: 1, title: "Define regulatory scope", description: "Identify the regulation, jurisdiction, and applicable business activities", estimatedMinutes: 15 },
      { order: 2, title: "Deep Research on regulation", description: "Run Deep Research to pull key obligations and recent guidance", estimatedMinutes: 30, counselPrompt: "Research the key obligations and recent enforcement trends for [regulation]" },
      { order: 3, title: "Compare against internal policies", description: "Cross-reference regulatory requirements with existing internal policies", estimatedMinutes: 45, counselPrompt: "Compare our internal policies against the regulatory requirements identified" },
      { order: 4, title: "Draft action memo", description: "Produce a cited action memo with gaps and recommended next steps", estimatedMinutes: 45, counselPrompt: "Draft a regulatory briefing memo with identified gaps and recommended actions" },
    ],
  },
  {
    id: "pb_006",
    name: "Deposition Preparation",
    description: "Turn transcripts and exhibits into key admissions grouped by case theme",
    mode: "legal",
    category: "Litigation",
    estimatedHours: 6,
    stepCount: 4,
    tags: ["Litigation", "Deposition", "Discovery"],
    usageCount: 12,
    lastUsed: "2025-05-28T10:00:00Z",
    steps: [
      { order: 1, title: "Upload transcripts and exhibits", description: "Add all deposition transcripts and exhibits to the case Repository collection", estimatedMinutes: 20 },
      { order: 2, title: "Extract key admissions", description: "Use Repository Extract to identify admissions by case theme", estimatedMinutes: 30, counselPrompt: "Extract all admissions related to the defendant's knowledge of the alleged infringement" },
      { order: 3, title: "Identify contradictions", description: "Find inconsistencies between deposition testimony and documentary evidence", estimatedMinutes: 60, counselPrompt: "Identify any contradictions between the deposition testimony and the emails in the case file" },
      { order: 4, title: "Prepare examination outline", description: "Draft a structured examination outline with cited references", estimatedMinutes: 90, counselPrompt: "Draft a cross-examination outline for the damages expert witness" },
    ],
  },
  // Compliance playbooks
  {
    id: "pb_007",
    name: "GDPR Gap Analysis",
    description: "Systematic gap analysis of an organization's GDPR compliance posture",
    mode: "compliance",
    category: "Gap Analysis",
    estimatedHours: 10,
    stepCount: 6,
    tags: ["GDPR", "Gap Analysis", "Data Protection"],
    usageCount: 26,
    lastUsed: "2025-06-09T09:00:00Z",
    steps: [
      { order: 1, title: "Map data processing activities", description: "Review and validate the data processing register", estimatedMinutes: 60, counselPrompt: "Review the data processing register and identify any missing or incomplete entries" },
      { order: 2, title: "Research GDPR obligations", description: "Use Deep Research to pull all applicable GDPR obligations", estimatedMinutes: 30, counselPrompt: "What are the key GDPR obligations for a data controller processing employee data?" },
      { order: 3, title: "Review existing policies", description: "Assess current policies against GDPR requirements", estimatedMinutes: 90, counselPrompt: "Compare our privacy policy and data retention policy against GDPR requirements" },
      { order: 4, title: "Identify gaps", description: "Document gaps between current state and GDPR requirements", estimatedMinutes: 60, counselPrompt: "Identify and prioritize the compliance gaps found in the policy review" },
      { order: 5, title: "Build Gap Register", description: "Create a structured gap register with owners and remediation timelines", estimatedMinutes: 45 },
      { order: 6, title: "Draft remediation roadmap", description: "Produce a prioritized remediation plan for leadership", estimatedMinutes: 45, counselPrompt: "Draft a GDPR remediation roadmap prioritized by risk level" },
    ],
  },
  {
    id: "pb_008",
    name: "Incident Response Review",
    description: "Post-incident review and regulatory notification assessment",
    mode: "compliance",
    category: "Incident Response",
    estimatedHours: 4,
    stepCount: 5,
    tags: ["Incident", "Breach", "Notification"],
    usageCount: 8,
    lastUsed: "2025-05-15T16:00:00Z",
    steps: [
      { order: 1, title: "Document incident details", description: "Capture the nature, scope, and timing of the incident", estimatedMinutes: 30 },
      { order: 2, title: "Assess notification obligations", description: "Determine regulatory notification requirements and timelines", estimatedMinutes: 30, counselPrompt: "What are our breach notification obligations under GDPR and CCPA for this incident?" },
      { order: 3, title: "Assess materiality", description: "Evaluate whether the incident meets materiality thresholds", estimatedMinutes: 30, counselPrompt: "Assess whether this incident is likely to result in high risk to data subjects under GDPR Article 34" },
      { order: 4, title: "Draft notifications", description: "Prepare supervisory authority and data subject notifications", estimatedMinutes: 60, counselPrompt: "Draft a GDPR supervisory authority notification for this incident" },
      { order: 5, title: "Document in breach register", description: "Record the incident and response actions in the breach register", estimatedMinutes: 20 },
    ],
  },
  {
    id: "pb_009",
    name: "Regulatory Change Tracking",
    description: "Monitor and assess the impact of new regulatory developments on the compliance program",
    mode: "compliance",
    category: "Regulatory Monitoring",
    estimatedHours: 3,
    stepCount: 4,
    tags: ["Regulatory Change", "Monitoring", "Impact Assessment"],
    usageCount: 15,
    lastUsed: "2025-06-01T09:00:00Z",
    steps: [
      { order: 1, title: "Identify new regulatory developments", description: "Review regulatory updates relevant to the compliance program", estimatedMinutes: 30, counselPrompt: "Summarize recent regulatory developments in data protection law in the EU and US" },
      { order: 2, title: "Assess applicability", description: "Determine which regulations apply to the organization's activities", estimatedMinutes: 30 },
      { order: 3, title: "Impact assessment", description: "Evaluate the impact on existing policies, procedures, and controls", estimatedMinutes: 60, counselPrompt: "Assess the impact of [new regulation] on our current compliance program" },
      { order: 4, title: "Update obligation register", description: "Add new obligations to the register and assign owners", estimatedMinutes: 30 },
    ],
  },
];
