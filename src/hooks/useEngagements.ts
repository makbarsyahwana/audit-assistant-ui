"use client";

import { useState, useEffect, useCallback } from "react";
import type { Engagement } from "@/types/engagement";
import { apiClient } from "@/lib/api";
import { mockEngagements } from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useEngagements() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEngagements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setEngagements(mockEngagements);
      } else {
        const data = await apiClient.get<Engagement[]>("/engagements");
        setEngagements(data);
      }
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
