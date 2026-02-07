"use client";

import { useState, useEffect, useCallback } from "react";
import type { Engagement } from "@/types/engagement";
import { mockEngagements } from "@/lib/mock-data";

export function useEngagements() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEngagements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // MVP: use mock data — swap to apiClient.get("/api/v1/engagements") when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 300));
      setEngagements(mockEngagements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch engagements");
    } finally {
      setLoading(false);
    }
  }, []);

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
