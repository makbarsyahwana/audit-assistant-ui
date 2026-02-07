export type EngagementStatus =
  | "planning"
  | "active"
  | "review"
  | "closed"
  | "archived";

export interface EngagementMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface EngagementStats {
  documentCount: number;
  queryCount: number;
  findingCount: number;
  coveragePercent: number;
}

export interface Engagement {
  id: string;
  name: string;
  description?: string;
  status: EngagementStatus;
  entityName: string;
  entityId: string;
  periodStart: string;
  periodEnd: string;
  framework?: string;
  members: EngagementMember[];
  stats: EngagementStats;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}
