"use client";

import { useState, useEffect, useCallback } from "react";
import type { ServiceHealth, SystemMetric } from "@/types/admin";
import { apiClient } from "@/lib/api";
import { mockServiceHealth, mockSystemMetrics } from "@/lib/mock-data-phase3";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useSystemHealth() {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        setServices(mockServiceHealth);
        setMetrics(mockSystemMetrics);
      } else {
        const data = await apiClient.get<{ services: ServiceHealth[]; metrics: SystemMetric[] }>("/health/status");
        setServices(data.services);
        setMetrics(data.metrics);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch system health");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const overallStatus = useCallback(() => {
    if (services.some((s) => s.status === "down")) return "down";
    if (services.some((s) => s.status === "degraded")) return "degraded";
    if (services.every((s) => s.status === "healthy")) return "healthy";
    return "unknown";
  }, [services]);

  return { services, metrics, loading, error, refetch: fetchData, overallStatus };
}
