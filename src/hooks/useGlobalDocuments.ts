"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditDocument } from "@/types/document";
import { apiClient } from "@/lib/api";

export function useGlobalDocuments() {
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<{ data: AuditDocument[] }>("/documents?corpusScope=GLOBAL");
      setDocuments(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch global documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadGlobal = useCallback(async (dto: {
    title: string;
    docType?: string;
    framework?: string;
    sourceSystem?: string;
    sourceUri?: string;
  }) => {
    const created = await apiClient.post<AuditDocument>("/documents/global", {
      ...dto,
      corpusScope: "GLOBAL",
    });
    setDocuments((prev) => [created, ...prev]);
    return created;
  }, []);

  const removeGlobal = useCallback(async (id: string) => {
    await apiClient.delete(`/documents/global/${id}`);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { documents, loading, error, refetch: fetchDocuments, uploadGlobal, removeGlobal };
}
