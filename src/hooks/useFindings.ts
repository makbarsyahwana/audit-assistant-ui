"use client";

import { useState, useEffect, useCallback } from "react";
import type { Finding } from "@/types/finding";
import { apiClient } from "@/lib/api";

export function useFindings(engagementId?: string) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = engagementId ? `?engagementId=${engagementId}` : "";
      const data = await apiClient.get<Finding[]>(`/findings${query}`);
      setFindings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch findings");
    } finally {
      setLoading(false);
    }
  }, [engagementId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getFinding = useCallback(
    (id: string) => findings.find((f) => f.id === id),
    [findings]
  );

  return {
    findings,
    loading,
    error,
    refetch: fetchData,
    getFinding,
  };
}
