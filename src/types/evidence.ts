export type EvidencePackStatus = "draft" | "in_review" | "approved" | "exported";

export interface EvidencePackItem {
  id: string;
  evidencePackId: string;
  documentId: string;
  controlId?: string;
  rationale?: string;
  sortOrder?: number;
  createdAt?: string;
}

export interface EvidencePack {
  id: string;
  engagementId: string;
  name: string;
  description?: string;
  status: EvidencePackStatus;
  items?: EvidencePackItem[];
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export type { EvidencePackItem as EvidenceItem };
