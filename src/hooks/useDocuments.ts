"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditDocument } from "@/types/document";
import { apiClient } from "@/lib/api";

interface PaginatedResponse<T> {
  data: T[];
}

export function useDocuments(engagementId?: string) {
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (engagementId) {
        params.set("engagementId", engagementId);
      }
      const query = params.toString();
      const response = await apiClient.get<PaginatedResponse<AuditDocument>>(
        `/documents${query ? `?${query}` : ""}`
      );
      setDocuments(response.data);
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
