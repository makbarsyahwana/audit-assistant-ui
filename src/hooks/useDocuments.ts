"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditDocument } from "@/types/document";
import { mockDocuments } from "@/lib/mock-data";

export function useDocuments(engagementId?: string) {
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // MVP: use mock data filtered by engagement
      await new Promise((resolve) => setTimeout(resolve, 200));
      const filtered = engagementId
        ? mockDocuments.filter((d) => d.engagementId === engagementId)
        : mockDocuments;
      setDocuments(filtered);
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
