"use client";

import { useState, useEffect, useCallback } from "react";
import type { EvidencePack, EvidencePackItem } from "@/types/evidence";
import { apiClient } from "@/lib/api";
import { normalizeRecords } from "@/lib/normalize";

export function useEvidencePacks(engagementId?: string) {
  const [packs, setPacks] = useState<EvidencePack[]>([]);
  const [candidates, setCandidates] = useState<EvidencePackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = engagementId ? `?engagementId=${engagementId}` : "";
      const data = await apiClient.get<EvidencePack[]>(`/evidence-packs${query}`);
      setPacks(normalizeRecords(data, ["status"]));
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
