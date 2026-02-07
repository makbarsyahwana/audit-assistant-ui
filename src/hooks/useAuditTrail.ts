"use client";

import { useState, useEffect, useCallback } from "react";
import type { AuditTrailEntry, QueryLogEntry, AuditEventType } from "@/types/admin";
import { mockAuditTrail, mockQueryLogs } from "@/lib/mock-data-phase3";

export function useAuditTrail() {
  const [entries, setEntries] = useState<AuditTrailEntry[]>([]);
  const [queryLogs, setQueryLogs] = useState<QueryLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setEntries(mockAuditTrail);
      setQueryLogs(mockQueryLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch audit trail");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterByType = useCallback(
    (type: AuditEventType | "all") => {
      if (type === "all") return entries;
      return entries.filter((e) => e.eventType === type);
    },
    [entries]
  );

  const exportCsv = useCallback(() => {
    const header = "ID,Event Type,User,Engagement,Description,Timestamp\n";
    const rows = entries
      .map(
        (e) =>
          `"${e.id}","${e.eventType}","${e.userName}","${e.engagementName ?? ""}","${e.description}","${e.timestamp}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  return { entries, queryLogs, loading, error, refetch: fetchData, filterByType, exportCsv };
}
