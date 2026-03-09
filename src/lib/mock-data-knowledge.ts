import type { AppMode } from "@/types/mode";
import type { Citation } from "@/types/chat";

export interface KnowledgeSource {
  id: string;
  name: string;
  description: string;
  mode: AppMode[];
  documentCount: number;
  lastUpdated: string;
  type: "standard" | "regulation" | "caselaw" | "database" | "guidance";
}

export interface DeepResearchResult {
  id: string;
  query: string;
  mode: AppMode;
  summary: string;
  citations: Citation[];
  sources: string[];
  agenticSteps: number;
  latencyMs: number;
  timestamp: string;
}

export const mockKnowledgeSources: KnowledgeSource[] = [
  // Audit sources
  { id: "ks_001", name: "ISO 27001:2022", description: "Information security management systems standard", mode: ["audit"], documentCount: 1, lastUpdated: "2022-10-01T00:00:00Z", type: "standard" },
  { id: "ks_002", name: "COBIT 2019", description: "IT governance and management framework", mode: ["audit"], documentCount: 1, lastUpdated: "2019-11-01T00:00:00Z", type: "standard" },
  { id: "ks_003", name: "NIST CSF 2.0", description: "Cybersecurity framework for critical infrastructure", mode: ["audit"], documentCount: 1, lastUpdated: "2024-02-01T00:00:00Z", type: "standard" },
  { id: "ks_004", name: "SOX / PCAOB Standards", description: "Sarbanes-Oxley Act and PCAOB auditing standards", mode: ["audit"], documentCount: 12, lastUpdated: "2024-01-01T00:00:00Z", type: "standard" },
  { id: "ks_005", name: "ISAE 3402", description: "Assurance reports on controls at service organizations", mode: ["audit"], documentCount: 1, lastUpdated: "2011-06-01T00:00:00Z", type: "standard" },
  // Legal sources
  { id: "ks_006", name: "Case Law Database", description: "US federal and state court decisions", mode: ["legal"], documentCount: 4200000, lastUpdated: "2025-06-01T00:00:00Z", type: "caselaw" },
  { id: "ks_007", name: "US Code & CFR", description: "United States Code and Code of Federal Regulations", mode: ["legal"], documentCount: 52000, lastUpdated: "2025-01-01T00:00:00Z", type: "regulation" },
  { id: "ks_008", name: "SEC EDGAR", description: "SEC filings, rules, and enforcement actions", mode: ["legal"], documentCount: 18000000, lastUpdated: "2025-06-10T00:00:00Z", type: "database" },
  { id: "ks_009", name: "EUR-Lex", description: "European Union law and official journal", mode: ["legal", "compliance"], documentCount: 1200000, lastUpdated: "2025-06-10T00:00:00Z", type: "regulation" },
  // Compliance sources
  { id: "ks_010", name: "GDPR Full Text", description: "General Data Protection Regulation (EU) 2016/679", mode: ["compliance"], documentCount: 1, lastUpdated: "2018-05-25T00:00:00Z", type: "regulation" },
  { id: "ks_011", name: "CCPA / CPRA", description: "California Consumer Privacy Act and Privacy Rights Act", mode: ["compliance"], documentCount: 2, lastUpdated: "2023-01-01T00:00:00Z", type: "regulation" },
  { id: "ks_012", name: "SOC 2 Trust Services Criteria", description: "AICPA Trust Services Criteria for SOC 2 examinations", mode: ["compliance", "audit"], documentCount: 1, lastUpdated: "2022-10-01T00:00:00Z", type: "standard" },
  { id: "ks_013", name: "PCI-DSS v4.0", description: "Payment Card Industry Data Security Standard v4.0", mode: ["compliance"], documentCount: 1, lastUpdated: "2022-03-01T00:00:00Z", type: "standard" },
  { id: "ks_014", name: "FATF Recommendations", description: "Financial Action Task Force AML/CFT recommendations", mode: ["compliance"], documentCount: 1, lastUpdated: "2023-06-01T00:00:00Z", type: "guidance" },
];

export const mockDeepResearchResults: DeepResearchResult[] = [
  {
    id: "dr_001",
    query: "What are the ISO 27001 requirements for access control?",
    mode: "audit",
    summary: "ISO 27001:2022 Annex A.5.15 through A.5.18 define access control requirements. Key controls include: (1) access control policy aligned with business and information security requirements; (2) user registration and de-registration procedures; (3) privileged access rights management with formal authorization; (4) secret authentication information management; and (5) periodic review of access rights. The standard requires organizations to restrict access to information and information processing facilities based on business and security requirements.",
    citations: [
      { id: "dr_cit_001", documentId: "ks_001", documentTitle: "ISO 27001:2022", chunkId: "annex_a_5_15", pageNumber: 28, sectionPath: "Annex A.5.15 — Access Control", snippet: "Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control.", score: 0.97, retrievalType: "hybrid" },
      { id: "dr_cit_002", documentId: "ks_001", documentTitle: "ISO 27001:2022", chunkId: "annex_a_5_16", pageNumber: 29, sectionPath: "Annex A.5.16 — Identity Management", snippet: "The full lifecycle of identities shall be managed.", score: 0.91, retrievalType: "vector" },
    ],
    sources: ["ISO 27001:2022", "NIST CSF 2.0"],
    agenticSteps: 4,
    latencyMs: 3240,
    timestamp: "2025-06-10T14:05:00Z",
  },
  {
    id: "dr_002",
    query: "What are the GDPR breach notification timelines?",
    mode: "compliance",
    summary: "Under GDPR Articles 33 and 34: (1) Controllers must notify the supervisory authority within 72 hours of becoming aware of a breach (Article 33); (2) If notification cannot be made within 72 hours, a reasoned justification must accompany the delayed notification; (3) Where a breach is likely to result in high risk to individuals, those individuals must be notified without undue delay (Article 34); (4) Processors must notify controllers without undue delay after becoming aware of a breach. All breaches must be documented in an internal register regardless of notification obligation.",
    citations: [
      { id: "dr_cit_003", documentId: "ks_010", documentTitle: "GDPR Full Text", chunkId: "art_33", pageNumber: 52, sectionPath: "Article 33 — Notification of a personal data breach to the supervisory authority", snippet: "In the case of a personal data breach, the controller shall without undue delay and, where feasible, not later than 72 hours after having become aware of it, notify the personal data breach to the supervisory authority.", score: 0.98, retrievalType: "hybrid" },
      { id: "dr_cit_004", documentId: "ks_010", documentTitle: "GDPR Full Text", chunkId: "art_34", pageNumber: 53, sectionPath: "Article 34 — Communication of a personal data breach to the data subject", snippet: "When the personal data breach is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall communicate the personal data breach to the data subject without undue delay.", score: 0.94, retrievalType: "hybrid" },
    ],
    sources: ["GDPR Full Text", "EUR-Lex"],
    agenticSteps: 3,
    latencyMs: 2810,
    timestamp: "2025-06-10T11:05:00Z",
  },
  {
    id: "dr_003",
    query: "What are the SEC disclosure requirements for material cybersecurity incidents?",
    mode: "legal",
    summary: "Under SEC Rule 13a-1 (Item 1.05 of Form 8-K, effective December 2023): (1) Public companies must disclose material cybersecurity incidents within 4 business days of determining materiality; (2) Disclosure must describe the nature, scope, timing, and material impact of the incident; (3) Materiality is assessed using the same standard as other securities disclosures — whether a reasonable investor would consider it important; (4) A delay may be granted by the Attorney General if disclosure would pose a substantial risk to national security or public safety.",
    citations: [
      { id: "dr_cit_005", documentId: "ks_008", documentTitle: "SEC EDGAR — Final Rule: Cybersecurity Risk Management", chunkId: "item_1_05", pageNumber: 14, sectionPath: "Item 1.05 — Material Cybersecurity Incidents", snippet: "A registrant shall disclose any cybersecurity incident it experiences that is determined to be material, describing the material aspects of the nature, scope, and timing of the incident.", score: 0.96, retrievalType: "hybrid" },
    ],
    sources: ["SEC EDGAR", "US Code & CFR"],
    agenticSteps: 5,
    latencyMs: 4120,
    timestamp: "2025-06-09T15:30:00Z",
  },
];
