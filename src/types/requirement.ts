export type RequirementStatus = "not_started" | "in_progress" | "tested" | "completed";

export interface Requirement {
  id: string;
  engagementId: string;
  clauseId: string;
  title: string;
  description: string;
  framework: string;
  category?: string;
  status: RequirementStatus;
  controlIds: string[];
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ControlEffectiveness = "effective" | "partially_effective" | "ineffective" | "not_tested";

export interface Control {
  id: string;
  controlId: string;
  engagementId: string;
  title: string;
  description: string;
  category: string;
  owner?: string;
  frequency?: string;
  effectiveness: ControlEffectiveness;
  testingStatus: "pending" | "in_progress" | "completed";
  requirementIds: string[];
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type MappingStatus = "mapped" | "partial" | "gap";

export interface RequirementControlMapping {
  id: string;
  requirementId: string;
  controlId: string;
  status: MappingStatus;
  notes?: string;
  lastVerified?: string;
}
