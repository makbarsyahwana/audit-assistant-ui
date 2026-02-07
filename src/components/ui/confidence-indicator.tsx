"use client";

import { cn } from "@/lib/utils";
import { formatConfidence, getConfidenceBgColor } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface ConfidenceIndicatorProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ConfidenceIndicator({
  value,
  showLabel = true,
  size = "md",
  className,
}: ConfidenceIndicatorProps) {
  const label = formatConfidence(value);
  const barColor = getConfidenceBgColor(value);

  const heightMap = { sm: "h-1.5", md: "h-2", lg: "h-3" };
  const textMap = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" };

  const labelColorMap: Record<string, string> = {
    High: "text-emerald-600",
    Medium: "text-amber-600",
    Low: "text-rose-600",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-2", className)}>
            <div className={cn("w-16 rounded-full bg-secondary overflow-hidden", heightMap[size])}>
              <div
                className={cn("h-full rounded-full transition-all duration-500", barColor)}
                style={{ width: `${Math.round(value * 100)}%` }}
              />
            </div>
            {showLabel && (
              <span className={cn("font-medium", textMap[size], labelColorMap[label])}>
                {label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Confidence: {(value * 100).toFixed(0)}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
