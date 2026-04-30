"use client";

import { useState, useEffect, useCallback } from "react";
import type { Workpaper } from "@/types/workpaper";
import { apiClient } from "@/lib/api";
import { normalizeRecords } from "@/lib/normalize";

export function useWorkpapers(engagementId?: string) {
  const [workpapers, setWorkpapers] = useState<Workpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = engagementId ? `?engagementId=${engagementId}` : "";
      const data = await apiClient.get<Workpaper[]>(`/workpapers${query}`);
      setWorkpapers(normalizeRecords(data, ["templateType", "status"]));
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
