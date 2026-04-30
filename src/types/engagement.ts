export type EngagementStatus =
  | "planning"
  | "active"
  | "closed"
  | "archived";

export interface EngagementMemberUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface EngagementMember {
  id: string;
  userId: string;
  engagementId: string;
  role: string;
  joinedAt: string;
  user: EngagementMemberUser;
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
  mode?: "audit" | "legal" | "compliance";
  status: EngagementStatus;
  entityName?: string;
  entityId?: string;
  periodStart?: string;
  periodEnd?: string;
  framework?: string;
  members?: EngagementMember[];
  stats?: EngagementStats;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  archivedAt?: string;
  lastActivityAt?: string;
}
