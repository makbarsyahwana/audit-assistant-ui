export type DocumentType =
  | "policy"
  | "framework"
  | "workpaper"
  | "evidence"
  | "report"
  | "ticket"
  | "standard"
  | "regulation"
  | "contract"
  | "brief"
  | "precedent"
  | "pleading"
  | "obligation"
  | "guidance"
  | "other";

export type ConfidentialityLevel =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type CorpusScope = "global" | "engagement";

export type IngestionStatus = "pending" | "processing" | "completed" | "failed";

export interface AuditDocument {
  id: string;
  title: string;
  docType: DocumentType;
  sourceSystem?: string;
  sourceUri?: string;
  confidentiality: ConfidentialityLevel;
  corpusScope?: CorpusScope;
  ingestionStatus?: IngestionStatus;
  engagementId: string;
  entityId?: string;
  owner?: string;
  businessUnit?: string;
  framework?: string;
  clauseId?: string;
  controlId?: string;
  periodStart?: string;
  periodEnd?: string;
  sizeBytes?: number;
  mimeType?: string;
  ragDocumentId?: string;
  uploadedById?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
