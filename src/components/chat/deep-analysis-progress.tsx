"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeepAnalysisProgressProps {
  isActive: boolean;
}

const ANALYSIS_STAGES = [
  { id: "planning", label: "Planning analysis strategy", duration: 800 },
  { id: "retrieve", label: "Retrieving relevant documents", duration: 1200 },
  { id: "rlm", label: "Running deep analysis", duration: 2000 },
  { id: "critique", label: "Evaluating answer quality", duration: 600 },
  { id: "synthesize", label: "Synthesizing final response", duration: 400 },
];

export function DeepAnalysisProgress({ isActive }: DeepAnalysisProgressProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!isActive) {
      setCurrentStage(0);
      return;
    }

    const totalDuration = ANALYSIS_STAGES.reduce((acc, s) => acc + s.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 50;
      let accumulatedDuration = 0;
      for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
        accumulatedDuration += ANALYSIS_STAGES[i].duration;
        if (elapsed < accumulatedDuration) {
          setCurrentStage(i);
          break;
        }
      }
      if (elapsed >= totalDuration) elapsed = 0;
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="space-y-1.5 animate-fade-in">
      {/* Harvey "Working… ▾" header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        Working…
        <ChevronDown className={cn("h-3 w-3 transition-transform", expanded ? "rotate-0" : "-rotate-90")} />
      </button>

      {expanded && (
        <div className="space-y-1 pl-0.5">
          {ANALYSIS_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStage;
            const isCurrent = idx === currentStage;
            const isPending = idx > currentStage;

            return (
              <div key={stage.id} className="flex items-center gap-2.5 text-xs">
                {/* Harvey-style bullet indicator */}
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0 transition-all",
                  isCompleted && "bg-foreground/50",
                  isCurrent && "bg-foreground animate-pulse",
                  isPending && "bg-border"
                )} />
                <span className={cn(
                  "transition-colors",
                  isCompleted && "text-muted-foreground line-through",
                  isCurrent && "text-foreground font-medium",
                  isPending && "text-muted-foreground/50"
                )}>
                  {stage.label}
                </span>
                {isCurrent && (
                  <span className="text-muted-foreground/60">…</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
