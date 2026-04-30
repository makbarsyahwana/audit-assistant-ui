export type FindingSeverity = "critical" | "high" | "medium" | "low" | "informational";
export type FindingStatus = "draft" | "in_review" | "open" | "remediation" | "closed";

export interface Finding {
  id: string;
  engagementId: string;
  title: string;
  severity: FindingSeverity;
  status: FindingStatus;
  criteria?: string;
  condition?: string;
  cause?: string;
  effect?: string;
  recommendation?: string;
  managementResponse?: string;
  citations?: unknown;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}
