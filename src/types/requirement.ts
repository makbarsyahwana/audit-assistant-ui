export type RequirementPriority = "high" | "medium" | "low";

export interface Requirement {
  id: string;
  engagementId: string;
  clauseId: string;
  title: string;
  description?: string;
  framework: string;
  category?: string;
  priority?: RequirementPriority;
  controlMappings?: RequirementControlMapping[];
  createdAt: string;
  updatedAt: string;
}

export type ControlType = "manual" | "automated" | "it_dependent";
export type ControlStatus = "not_tested" | "effective" | "ineffective" | "not_applicable";

export interface Control {
  id: string;
  controlId: string;
  engagementId: string;
  title: string;
  description?: string;
  controlType?: ControlType;
  status?: ControlStatus;
  owner?: string;
  frequency?: string;
  requirementMappings?: RequirementControlMapping[];
  createdAt: string;
  updatedAt: string;
}

export type CoverageLevel = "full" | "partial" | "none";

export interface RequirementControlMapping {
  id: string;
  requirementId: string;
  controlId: string;
  coverageLevel?: CoverageLevel;
  notes?: string;
  createdAt?: string;
}
