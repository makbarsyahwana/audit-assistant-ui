"use client";

import { useState, useEffect, useCallback } from "react";
import type { ModelCard, KillSwitchState, KillSwitchLevel, GoalDriftAlert } from "@/types/admin";
import { mockModelCards, mockKillSwitch, mockGoalDriftAlerts } from "@/lib/mock-data-phase3";

export function useGovernance() {
  const [modelCards, setModelCards] = useState<ModelCard[]>([]);
  const [killSwitch, setKillSwitch] = useState<KillSwitchState>(mockKillSwitch);
  const [goalDriftAlerts, setGoalDriftAlerts] = useState<GoalDriftAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setModelCards(mockModelCards);
      setKillSwitch(mockKillSwitch);
      setGoalDriftAlerts(mockGoalDriftAlerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch governance data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setKillSwitchLevel = useCallback((level: KillSwitchLevel, reason?: string) => {
    setKillSwitch({
      level,
      reason,
      activatedBy: "Current User",
      activatedAt: new Date().toISOString(),
    });
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setGoalDriftAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  }, []);

  return {
    modelCards,
    killSwitch,
    goalDriftAlerts,
    loading,
    error,
    refetch: fetchData,
    setKillSwitchLevel,
    resolveAlert,
  };
}
