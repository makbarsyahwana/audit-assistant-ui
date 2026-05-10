"use client";

import { useState, useEffect, useCallback } from "react";
import type { Workpaper } from "@/types/workpaper";
import { apiClient } from "@/lib/api";

interface PaginatedResponse<T> {
  data: T[];
}

export function useWorkpapers(engagementId?: string) {
  const [workpapers, setWorkpapers] = useState<Workpaper[]>([]);
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
      const response = await apiClient.get<PaginatedResponse<Workpaper>>(
        `/workpapers${query ? `?${query}` : ""}`
      );
      setWorkpapers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch workpapers");
    } finally {
      setLoading(false);
    }
  }, [engagementId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateField = useCallback(
    (workpaperId: string, field: keyof Workpaper, value: string) => {
      setWorkpapers((prev) =>
        prev.map((w) =>
          w.id === workpaperId
            ? { ...w, [field]: value, updatedAt: new Date().toISOString() }
            : w
        )
      );
    },
    []
  );

  const getWorkpaper = useCallback(
    (id: string) => workpapers.find((w) => w.id === id),
    [workpapers]
  );

  return {
    workpapers,
    loading,
    error,
    refetch: fetchData,
    updateField,
    getWorkpaper,
  };
}
