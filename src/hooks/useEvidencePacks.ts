"use client";

import { useState, useEffect, useCallback } from "react";
import type { EvidencePack, EvidencePackItem } from "@/types/evidence";
import { apiClient } from "@/lib/api";

interface PaginatedResponse<T> {
  data: T[];
}

export function useEvidencePacks(engagementId?: string) {
  const [packs, setPacks] = useState<EvidencePack[]>([]);
  const [candidates, setCandidates] = useState<EvidencePackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (engagementId) {
        params.set("engagementId", engagementId);
      }
      const query = params.toString();
      const response = await apiClient.get<PaginatedResponse<EvidencePack>>(
        `/evidence-packs${query ? `?${query}` : ""}`
      );
      setPacks(response.data);
      setCandidates([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch evidence packs");
    } finally {
      setLoading(false);
    }
  }, [engagementId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItemToPack = useCallback(
    (packId: string, item: EvidencePackItem) => {
      setPacks((prev) =>
        prev.map((p) =>
          p.id === packId ? { ...p, items: [...(p.items ?? []), item], updatedAt: new Date().toISOString() } : p
        )
      );
    },
    []
  );

  const removeItemFromPack = useCallback(
    (packId: string, itemId: string) => {
      setPacks((prev) =>
        prev.map((p) =>
          p.id === packId
            ? { ...p, items: (p.items ?? []).filter((i) => i.id !== itemId), updatedAt: new Date().toISOString() }
            : p
        )
      );
    },
    []
  );

  return {
    packs,
    candidates,
    loading,
    error,
    refetch: fetchData,
    addItemToPack,
    removeItemFromPack,
  };
}
