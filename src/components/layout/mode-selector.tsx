"use client";

import { useModeContext } from "@/contexts/ModeContext";
import type { AppMode } from "@/types/mode";
import { cn } from "@/lib/utils";

const MODES: { mode: AppMode; label: string }[] = [
  { mode: "audit", label: "Audit" },
  { mode: "legal", label: "Legal" },
  { mode: "compliance", label: "Compliance" },
];

export function ModeSelector() {
  const { mode, setMode } = useModeContext();

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-sidebar-border bg-sidebar-accent/30 p-0.5">
      {MODES.map(({ mode: m, label }) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn(
            "flex-1 rounded px-2 py-1 text-[11px] font-medium transition-colors",
            mode === m
              ? "bg-white text-foreground shadow-sm"
              : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
