"use client";

import { useState, useEffect, useCallback } from "react";
import type { ManagedUser, UserRole, UserStatus } from "@/types/admin";
import { apiClient } from "@/lib/api";
import { mockManagedUsers } from "@/lib/mock-data-phase3";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setUsers(mockManagedUsers);
      } else {
        const data = await apiClient.get<ManagedUser[]>("/users");
        setUsers(data);
      }
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
