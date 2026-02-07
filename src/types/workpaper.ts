export type WorkpaperStatus = "draft" | "in_review" | "reviewed" | "approved" | "final";
export type WorkpaperType = "standard" | "memo" | "walkthrough" | "test_of_controls";

export interface WorkpaperSection {
  id: string;
  label: string;
  content: string;
  citations?: string[];
}

export interface Workpaper {
  id: string;
  engagementId: string;
  title: string;
  type: WorkpaperType;
  status: WorkpaperStatus;
  controlId?: string;
  controlTitle?: string;
  preparedBy: string;
  reviewedBy?: string;
  sections: WorkpaperSection[];
  createdAt: string;
  updatedAt: string;
}
