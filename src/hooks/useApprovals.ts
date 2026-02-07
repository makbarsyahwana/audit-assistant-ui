"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApprovalRequest, ApprovalStatus } from "@/types/admin";
import { mockApprovalRequests } from "@/lib/mock-data-phase3";

export function useApprovals() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setRequests(mockApprovalRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = useCallback(
    (requestId: string, status: ApprovalStatus, comment?: string) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status,
                reviewedBy: "Current User",
                reviewedAt: new Date().toISOString(),
                comment: comment ?? r.comment,
              }
            : r
        )
      );
    },
    []
  );

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return { requests, loading, error, refetch: fetchData, updateStatus, pendingCount };
}
