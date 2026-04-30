"use client";

import { useState, useEffect, useCallback } from "react";
import type { ModelCard, KillSwitchState, KillSwitchLevel, GoalDriftAlert } from "@/types/admin";
import { apiClient } from "@/lib/api";

export function useGovernance() {
  const [modelCards, setModelCards] = useState<ModelCard[]>([]);
  const [killSwitch, setKillSwitch] = useState<KillSwitchState>({ level: "active" });
  const [goalDriftAlerts, setGoalDriftAlerts] = useState<GoalDriftAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [models, ks, drift] = await Promise.all([
        apiClient.get<ModelCard[]>("/governance/models"),
        apiClient.get<KillSwitchState>("/governance/kill-switch"),
        apiClient.get<GoalDriftAlert[]>("/governance/drift-alerts"),
      ]);
      setModelCards(models);
      setKillSwitch(ks);
      setGoalDriftAlerts(drift);
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
