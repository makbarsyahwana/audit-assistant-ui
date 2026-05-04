"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditDocument } from "@/types/document";
import { apiClient } from "@/lib/api";

export function useDocuments(engagementId?: string) {
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = engagementId ? `?engagementId=${engagementId}` : "";
      const data = await apiClient.get<AuditDocument[]>(`/documents${query}`);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  }, [engagementId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
  };
}
