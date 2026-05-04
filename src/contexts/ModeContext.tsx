"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AppMode, ModeConfig } from "@/types/mode";
import { MODE_CONFIGS } from "@/types/mode";

interface ModeContextValue {
  mode: AppMode;
  config: ModeConfig;
  setMode: (mode: AppMode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = "audit-assistant-mode";

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("audit");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as AppMode | null;
      if (stored && stored in MODE_CONFIGS) {
        setModeState(stored);
      }
    } catch {
      // private / disabled storage
    }
  }, []);

  const setMode = useCallback((next: AppMode) => {
    setModeState(next);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // quota / private mode
    }
  }, []);

  return (
    <ModeContext.Provider value={{ mode, config: MODE_CONFIGS[mode], setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useModeContext(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useModeContext must be used within ModeProvider");
  return ctx;
}
