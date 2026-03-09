import type { AppMode } from "@/types/mode";

export interface RepositoryCollection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  totalSizeMb: number;
  lastUpdated: string;
  mode: AppMode;
  tags: string[];
  shared: boolean;
}

export interface RepositoryExtractRow {
  id: string;
  documentTitle: string;
  pageNumber: number;
  extractedField: string;
  value: string;
}

export interface RepositoryExtract {
  id: string;
  name: string;
  collectionId: string;
  mode: AppMode;
  columns: string[];
  rows: RepositoryExtractRow[];
  createdAt: string;
}

export const mockRepositoryCollections: RepositoryCollection[] = [
  // Audit collections
  {
    id: "col_001",
    name: "ISO 27001 ISMS Audit 2025",
    description: "All workpapers, evidence, and standards for the annual ISMS audit",
    documentCount: 47,
    totalSizeMb: 184,
    lastUpdated: "2025-06-10T14:30:00Z",
    mode: "audit",
    tags: ["ISO 27001", "ISMS", "2025"],
    shared: false,
  },
  {
    id: "col_002",
    name: "SOX IT Controls — Globex FY2025",
    description: "IT general controls evidence and testing documentation",
    documentCount: 92,
    totalSizeMb: 412,
    lastUpdated: "2025-06-09T11:00:00Z",
    mode: "audit",
    tags: ["SOX", "ITGC", "Globex"],
    shared: true,
  },
  {
    id: "col_003",
    name: "Prior Year Audit Files — Archive",
    description: "Archived workpapers from FY2022–FY2024 audits",
    documentCount: 318,
    totalSizeMb: 1240,
    lastUpdated: "2025-01-15T08:00:00Z",
    mode: "audit",
    tags: ["Archive", "Prior Year"],
    shared: false,
  },
  // Legal collections
  {
    id: "col_004",
    name: "Acme M&A — Transaction Documents",
    description: "SPA drafts, disclosure schedules, and due diligence reports",
    documentCount: 214,
    totalSizeMb: 876,
    lastUpdated: "2025-06-10T14:30:00Z",
    mode: "legal",
    tags: ["M&A", "Acme", "Due Diligence"],
    shared: true,
  },
  {
    id: "col_005",
    name: "Contract Precedent Library",
    description: "Firm-approved standard contract templates and negotiated precedents",
    documentCount: 89,
    totalSizeMb: 234,
    lastUpdated: "2025-05-20T09:00:00Z",
    mode: "legal",
    tags: ["Precedents", "Templates"],
    shared: true,
  },
  {
    id: "col_006",
    name: "TechCo v. InnovateCo — Case Files",
    description: "Pleadings, discovery documents, expert reports, and deposition transcripts",
    documentCount: 156,
    totalSizeMb: 623,
    lastUpdated: "2025-06-09T11:00:00Z",
    mode: "legal",
    tags: ["Litigation", "IP", "Patent"],
    shared: false,
  },
  // Compliance collections
  {
    id: "col_007",
    name: "GDPR Policy Library",
    description: "All GDPR-related policies, procedures, and data processing records",
    documentCount: 63,
    totalSizeMb: 218,
    lastUpdated: "2025-06-10T14:30:00Z",
    mode: "compliance",
    tags: ["GDPR", "Policies", "Data Protection"],
    shared: false,
  },
  {
    id: "col_008",
    name: "SOC 2 Evidence Repository",
    description: "Control evidence, system descriptions, and audit correspondence",
    documentCount: 108,
    totalSizeMb: 445,
    lastUpdated: "2025-06-09T11:00:00Z",
    mode: "compliance",
    tags: ["SOC 2", "Evidence", "Controls"],
    shared: true,
  },
  {
    id: "col_009",
    name: "Regulatory Guidance Archive",
    description: "Regulatory guidance, circulars, and enforcement actions by jurisdiction",
    documentCount: 241,
    totalSizeMb: 892,
    lastUpdated: "2025-06-01T08:00:00Z",
    mode: "compliance",
    tags: ["Regulatory", "Guidance", "Archive"],
    shared: false,
  },
];

export const mockRepositoryExtracts: RepositoryExtract[] = [
  {
    id: "ext_001",
    name: "Change-of-Control Clauses — M&A Contracts",
    collectionId: "col_004",
    mode: "legal",
    columns: ["Document", "Clause Reference", "Trigger Event", "Consequence", "Carve-outs"],
    rows: [
      { id: "r1", documentTitle: "SPA Draft v4", pageNumber: 31, extractedField: "Trigger Event", value: "Acquisition of >50% voting shares" },
      { id: "r2", documentTitle: "SPA Draft v4", pageNumber: 31, extractedField: "Consequence", value: "Accelerated vesting + assumption of obligations" },
      { id: "r3", documentTitle: "Disclosure Schedule A", pageNumber: 8, extractedField: "Carve-outs", value: "Internal restructuring excluded" },
    ],
    createdAt: "2025-06-05T10:00:00Z",
  },
  {
    id: "ext_002",
    name: "Control Testing Results — SOX ITGC",
    collectionId: "col_002",
    mode: "audit",
    columns: ["Control ID", "Control Description", "Test Result", "Exceptions", "Remediation"],
    rows: [
      { id: "r4", documentTitle: "CHG-01 Testing Workpaper", pageNumber: 3, extractedField: "Test Result", value: "Effective" },
      { id: "r5", documentTitle: "ACC-04 Testing Workpaper", pageNumber: 5, extractedField: "Test Result", value: "Deficiency — 3 exceptions noted" },
      { id: "r6", documentTitle: "LOG-02 Testing Workpaper", pageNumber: 2, extractedField: "Test Result", value: "Effective" },
    ],
    createdAt: "2025-06-08T14:00:00Z",
  },
  {
    id: "ext_003",
    name: "GDPR Obligations Gap Register",
    collectionId: "col_007",
    mode: "compliance",
    columns: ["Article", "Obligation", "Current Status", "Gap", "Owner"],
    rows: [
      { id: "r7", documentTitle: "GDPR Data Processing Register", pageNumber: 18, extractedField: "Gap", value: "No defined escalation path for 72-hr notification" },
      { id: "r8", documentTitle: "Privacy Policy v2.1", pageNumber: 4, extractedField: "Gap", value: "Cookie consent mechanism non-compliant with ePrivacy" },
      { id: "r9", documentTitle: "DPA Template", pageNumber: 12, extractedField: "Gap", value: "Missing sub-processor list in standard DPA" },
    ],
    createdAt: "2025-06-09T09:00:00Z",
  },
];
