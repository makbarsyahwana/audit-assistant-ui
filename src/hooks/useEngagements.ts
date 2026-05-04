"use client";

import { useState, useEffect, useCallback } from "react";
import type { Engagement } from "@/types/engagement";
import type { AppMode } from "@/types/mode";
import { apiClient } from "@/lib/api";

export function useEngagements(mode: AppMode = "audit") {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEngagements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // API expects Prisma enum casing (AUDIT | LEGAL | COMPLIANCE); UI uses lowercase AppMode
      const modeParam = mode ? `?mode=${encodeURIComponent(mode.toUpperCase())}` : "";
      const data = await apiClient.get<Engagement[]>(`/engagements${modeParam}`);
      setEngagements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch engagements");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchEngagements();
  }, [fetchEngagements]);

  const getEngagement = useCallback(
    (id: string): Engagement | undefined => {
      return engagements.find((e) => e.id === id);
    },
    [engagements]
  );

  return {
    engagements,
    loading,
    error,
    refetch: fetchEngagements,
    getEngagement,
  };
}
