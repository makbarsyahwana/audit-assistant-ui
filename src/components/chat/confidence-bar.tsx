"use client";

import { cn } from "@/lib/utils";
import { formatConfidence, getConfidenceBgColor } from "@/lib/utils";
import { Clock, Zap } from "lucide-react";

interface ConfidenceBarProps {
  confidence: number;
  latencyMs?: number;
  retrievalMode?: string;
  explanation?: string;
}

export function ConfidenceBar({
  confidence,
  latencyMs,
  retrievalMode,
  explanation,
}: ConfidenceBarProps) {
  const label = formatConfidence(confidence);
  const barColor = getConfidenceBgColor(confidence);

  const labelColorMap: Record<string, string> = {
    High: "text-emerald-600",
    Medium: "text-amber-600",
    Low: "text-rose-600",
  };

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", barColor)}
            style={{ width: `${Math.round(confidence * 100)}%` }}
          />
        </div>
        <span className={cn("font-medium", labelColorMap[label])}>
          {(confidence * 100).toFixed(0)}%
        </span>
      </div>

      {latencyMs && (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{latencyMs}ms</span>
        </div>
      )}

      {retrievalMode && (
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          <span className="capitalize">{retrievalMode}</span>
        </div>
      )}

      {explanation && (
        <span className="text-[10px] text-muted-foreground/70 hidden lg:inline">
          {explanation}
        </span>
      )}
    </div>
  );
}
