export type WorkpaperStatus = "draft" | "in_review" | "approved" | "final";
export type WorkpaperTemplate = "general" | "criteria_condition" | "financial_memo" | "walkthrough";

export interface Workpaper {
  id: string;
  engagementId: string;
  title: string;
  templateType?: WorkpaperTemplate;
  status: WorkpaperStatus;
  criteria?: string;
  condition?: string;
  testing?: string;
  result?: string;
  conclusion?: string;
  draftContent?: string;
  citations?: unknown;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}
