"use client";

import { useState, useEffect, useCallback } from "react";
import type { Finding } from "@/types/finding";
import { apiClient } from "@/lib/api";

interface PaginatedResponse<T> {
  data: T[];
}

export function useFindings(engagementId?: string) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (engagementId) {
        params.set("engagementId", engagementId);
      }
      const query = params.toString();
      const response = await apiClient.get<PaginatedResponse<Finding>>(
        `/findings${query ? `?${query}` : ""}`
      );
      setFindings(response.data);
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
