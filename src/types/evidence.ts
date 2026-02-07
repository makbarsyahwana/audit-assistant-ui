export type EvidencePackStatus = "draft" | "in_review" | "approved" | "exported";

export interface EvidenceItem {
  id: string;
  documentId: string;
  documentTitle: string;
  docType: string;
  controlId?: string;
  relevanceScore: number;
  snippet?: string;
  pageNumber?: number;
  addedAt: string;
  addedBy: string;
}

export interface EvidencePack {
  id: string;
  engagementId: string;
  name: string;
  description?: string;
  controlId?: string;
  controlTitle?: string;
  status: EvidencePackStatus;
  items: EvidenceItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
