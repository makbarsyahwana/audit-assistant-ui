export type FindingSeverity = "critical" | "high" | "medium" | "low" | "informational";
export type FindingStatus = "draft" | "in_review" | "accepted" | "remediated" | "closed";

export interface Finding {
  id: string;
  engagementId: string;
  title: string;
  severity: FindingSeverity;
  status: FindingStatus;
  controlId?: string;
  controlTitle?: string;
  criteria: string;
  condition: string;
  cause: string;
  effect: string;
  recommendation: string;
  managementResponse?: string;
  targetDate?: string;
  citationIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
