export type FindingSeverity = "critical" | "high" | "medium" | "low" | "informational";
export type FindingStatus = "draft" | "in_review" | "open" | "remediation" | "closed";

/** Populated when API includes `createdBy` on the finding (NestJS + Prisma). */
export interface FindingCreator {
  id: string;
  name: string;
  email: string;
}

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
  createdBy?: FindingCreator;
  createdAt: string;
  updatedAt: string;
}
