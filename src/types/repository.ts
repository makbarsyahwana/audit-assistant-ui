import type { AppMode } from "@/types/mode";

export interface RepositoryCollection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  totalSizeMb: number;
  lastUpdated: string;
  mode: AppMode;
  tags: string[];
  shared: boolean;
}

export interface RepositoryExtractRow {
  id: string;
  documentTitle: string;
  pageNumber: number;
  extractedField: string;
  value: string;
}

export interface RepositoryExtract {
  id: string;
  name: string;
  collectionId: string;
  mode: AppMode;
  columns: string[];
  rows: RepositoryExtractRow[];
  createdAt: string;
}
