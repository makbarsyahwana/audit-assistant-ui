export type DocumentType =
  | "policy"
  | "framework"
  | "workpaper"
  | "evidence"
  | "report"
  | "ticket"
  | "standard"
  | "regulation";

export type ConfidentialityLevel =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export interface AuditDocument {
  id: string;
  title: string;
  docType: DocumentType;
  sourceSystem: string;
  sourceUri?: string;
  confidentialityLevel: ConfidentialityLevel;
  engagementId: string;
  entityId?: string;
  owner?: string;
  businessUnit?: string;
  framework?: string;
  clauseId?: string;
  controlId?: string;
  periodStart?: string;
  periodEnd?: string;
  version: number;
  pageCount?: number;
  fileSize?: number;
  mimeType?: string;
  chunkCount?: number;
  createdAt: string;
  updatedAt: string;
}
