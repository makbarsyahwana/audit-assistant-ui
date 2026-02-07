"use client";

import { useState, useEffect, useCallback } from "react";
import type { Workpaper } from "@/types/workpaper";
import { mockWorkpapers } from "@/lib/mock-data-phase2";

export function useWorkpapers(engagementId?: string) {
  const [workpapers, setWorkpapers] = useState<Workpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const filtered = engagementId
        ? mockWorkpapers.filter((w) => w.engagementId === engagementId)
        : mockWorkpapers;
      setWorkpapers(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch workpapers");
    } finally {
      setLoading(false);
    }
  }, [engagementId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSection = useCallback(
    (workpaperId: string, sectionId: string, content: string) => {
      setWorkpapers((prev) =>
        prev.map((w) =>
          w.id === workpaperId
            ? {
                ...w,
                sections: w.sections.map((s) =>
                  s.id === sectionId ? { ...s, content } : s
                ),
                updatedAt: new Date().toISOString(),
              }
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
    updateSection,
    getWorkpaper,
  };
}
