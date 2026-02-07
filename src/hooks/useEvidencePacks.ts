"use client";

import { useState, useEffect, useCallback } from "react";
import type { EvidencePack, EvidenceItem } from "@/types/evidence";
import { mockEvidencePacks, mockEvidenceCandidates } from "@/lib/mock-data-phase2";

export function useEvidencePacks(engagementId?: string) {
  const [packs, setPacks] = useState<EvidencePack[]>([]);
  const [candidates, setCandidates] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const filtered = engagementId
        ? mockEvidencePacks.filter((p) => p.engagementId === engagementId)
        : mockEvidencePacks;
      setPacks(filtered);
      setCandidates(mockEvidenceCandidates);
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
    (packId: string, item: EvidenceItem) => {
      setPacks((prev) =>
        prev.map((p) =>
          p.id === packId ? { ...p, items: [...p.items, item], updatedAt: new Date().toISOString() } : p
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
            ? { ...p, items: p.items.filter((i) => i.id !== itemId), updatedAt: new Date().toISOString() }
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
