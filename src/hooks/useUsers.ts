"use client";

import { useState, useEffect, useCallback } from "react";
import type { ManagedUser, UserRole, UserStatus } from "@/types/admin";
import { mockManagedUsers } from "@/lib/mock-data-phase3";

export function useUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUsers(mockManagedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateRole = useCallback((userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role, updatedAt: new Date().toISOString() } : u))
    );
  }, []);

  const updateStatus = useCallback((userId: string, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status, updatedAt: new Date().toISOString() } : u))
    );
  }, []);

  return { users, loading, error, refetch: fetchData, updateRole, updateStatus };
}
