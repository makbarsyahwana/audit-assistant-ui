// ── User Management ──────────────────────────────────────────────────
export type UserRole = "admin" | "audit_manager" | "auditor" | "viewer";
export type UserStatus = "active" | "inactive" | "locked";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  ssoProvider?: string;
  lastLoginAt?: string;
  engagementCount: number;
  createdAt: string;
  updatedAt: string;
}

// ── Audit Trail ──────────────────────────────────────────────────────
export type AuditEventType =
  | "query"
  | "retrieval"
  | "document_upload"
  | "document_delete"
  | "engagement_create"
  | "engagement_update"
  | "finding_create"
  | "workpaper_update"
  | "evidence_pack_export"
  | "user_login"
  | "user_logout"
  | "permission_change";

export interface AuditTrailEntry {
  id: string;
  eventType: AuditEventType;
  userId: string;
  userName: string;
  engagementId?: string;
  engagementName?: string;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface QueryLogEntry {
  id: string;
  userId: string;
  userName: string;
  engagementId: string;
  engagementName: string;
  query: string;
  runId: string;
  retrievalMode: string;
  confidence: number;
  latencyMs: number;
  citationCount: number;
  agentSteps: AgentStep[];
  timestamp: string;
}

export interface AgentStep {
  node: string;
  status: "success" | "skipped" | "error";
  durationMs: number;
  detail?: string;
}

// ── System Health ────────────────────────────────────────────────────
export type ServiceStatus = "healthy" | "degraded" | "down" | "unknown";

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  version?: string;
  uptime?: string;
  latencyMs?: number;
  lastChecked: string;
  details?: Record<string, unknown>;
}

export interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  trend?: "up" | "down" | "stable";
  changePercent?: number;
}

// ── AI Governance ────────────────────────────────────────────────────
export interface ModelCard {
  id: string;
  name: string;
  provider: string;
  version: string;
  contextWindow: number;
  purpose: string;
  knownLimitations: string[];
  lastUpdated: string;
}

export type KillSwitchLevel = "active" | "soft_stop" | "hard_stop";

export interface KillSwitchState {
  level: KillSwitchLevel;
  reason?: string;
  activatedBy?: string;
  activatedAt?: string;
}

export interface GoalDriftAlert {
  id: string;
  agentGraph: string;
  metric: string;
  expected: number;
  actual: number;
  severity: "warning" | "critical";
  timestamp: string;
  resolved: boolean;
}

// ── Approval / Human-in-the-loop ─────────────────────────────────────
export type ApprovalStatus = "pending" | "approved" | "rejected" | "revision_requested";

export interface ApprovalRequest {
  id: string;
  entityType: "finding" | "workpaper" | "regulator_response";
  entityId: string;
  entityTitle: string;
  engagementId: string;
  engagementName: string;
  requestedBy: string;
  requestedAt: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  comment?: string;
}
