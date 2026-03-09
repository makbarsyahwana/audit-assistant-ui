"use client";

import { useState, useEffect, useCallback } from "react";
import type { Engagement } from "@/types/engagement";
import type { AppMode } from "@/types/mode";
import { apiClient } from "@/lib/api";
import { mockEngagements } from "@/lib/mock-data";
import { mockMatters } from "@/lib/mock-data-legal";
import { mockPrograms } from "@/lib/mock-data-compliance";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

function getMockDataForMode(mode: AppMode): Engagement[] {
  switch (mode) {
    case "legal":
      return mockMatters;
    case "compliance":
      return mockPrograms;
    case "audit":
    default:
      return mockEngagements;
  }
}

export function useEngagements(mode: AppMode = "audit") {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEngagements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setEngagements(getMockDataForMode(mode));
      } else {
        const data = await apiClient.get<Engagement[]>("/engagements");
        setEngagements(data);
      }
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
