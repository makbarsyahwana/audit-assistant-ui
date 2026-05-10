import type { EngagementStatus } from "@/types/engagement";

export const statusVariantMap: Record<
  EngagementStatus,
  "active" | "closed" | "draft" | "planning" | "archived"
> = {
  active: "active",
  closed: "closed",
  planning: "planning",
  archived: "archived",
};
