"use client";

import { useState, useEffect, useCallback } from "react";
import type { Requirement, Control, RequirementControlMapping } from "@/types/requirement";
import { mockRequirements, mockControls, mockMappings } from "@/lib/mock-data-phase2";

export function useRequirements(engagementId?: string) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [mappings, setMappings] = useState<RequirementControlMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const reqs = engagementId
        ? mockRequirements.filter((r) => r.engagementId === engagementId)
        : mockRequirements;
      const ctrls = engagementId
        ? mockControls.filter((c) => c.engagementId === engagementId)
        : mockControls;
      setRequirements(reqs);
      setControls(ctrls);
      setMappings(mockMappings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch requirements");
    } finally {
      setLoading(false);
    }
  }, [engagementId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCoveragePercent = useCallback(() => {
    if (requirements.length === 0) return 0;
    const mapped = mappings.filter((m) => m.status === "mapped").length;
    const total = requirements.length;
    return Math.round((mapped / total) * 100);
  }, [requirements, mappings]);

  const getGaps = useCallback(() => {
    return mappings.filter((m) => m.status === "gap");
  }, [mappings]);

  return {
    requirements,
    controls,
    mappings,
    loading,
    error,
    refetch: fetchData,
    getCoveragePercent,
    getGaps,
  };
}
