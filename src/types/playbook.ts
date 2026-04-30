import type { AppMode } from "@/types/mode";

export interface PlaybookStep {
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  counselPrompt?: string;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  mode: AppMode;
  category: string;
  estimatedHours: number;
  stepCount: number;
  steps: PlaybookStep[];
  tags: string[];
  usageCount: number;
  lastUsed?: string;
}
