"use client";

import { useState, useEffect, useCallback } from "react";
import type { Requirement, Control, RequirementControlMapping } from "@/types/requirement";
import { apiClient } from "@/lib/api";
import { normalizeRecords } from "@/lib/normalize";

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
      const query = engagementId ? `?engagementId=${engagementId}` : "";
      const [reqs, ctrls, maps] = await Promise.all([
        apiClient.get<Requirement[]>(`/requirements${query}`),
        apiClient.get<Control[]>(`/controls${query}`),
        apiClient.get<RequirementControlMapping[]>(`/requirement-control-mappings${query}`),
      ]);
      setRequirements(normalizeRecords(reqs, ["priority"]));
      setControls(normalizeRecords(ctrls, ["controlType", "status"]));
      setMappings(normalizeRecords(maps, ["coverageLevel"]));
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
    const mapped = mappings.filter((m) => m.coverageLevel === "full" || m.coverageLevel === "partial").length;
    const total = requirements.length;
    return Math.round((mapped / total) * 100);
  }, [requirements, mappings]);

  const getGaps = useCallback(() => {
    return mappings.filter((m) => m.coverageLevel === "none");
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
