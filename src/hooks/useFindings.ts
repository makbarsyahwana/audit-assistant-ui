"use client";

import { useState, useEffect, useCallback } from "react";
import type { Finding } from "@/types/finding";
import { mockFindings } from "@/lib/mock-data-phase2";

export function useFindings(engagementId?: string) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const filtered = engagementId
        ? mockFindings.filter((f) => f.engagementId === engagementId)
        : mockFindings;
      setFindings(filtered);
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
