"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import type { Citation } from "@/types/chat";
import { truncate } from "@/lib/utils";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
  return (
    <Card className="border-border hover:border-foreground/20 hover:shadow-sm transition-all">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-foreground text-[10px] font-semibold text-background">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {citation.documentTitle}
              </p>
              {citation.sectionPath && (
                <p className="text-[11px] text-muted-foreground truncate">
                  {citation.sectionPath}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {citation.pageNumber && (
              <span className="text-[10px] text-muted-foreground">
                p.{citation.pageNumber}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground capitalize">{citation.retrievalType}</span>
          </div>
        </div>

        <blockquote className="border-l-2 border-border pl-3 text-xs text-muted-foreground leading-relaxed font-serif italic">
          {truncate(citation.snippet, 200)}
        </blockquote>

        <div className="flex items-center justify-between pt-1">
          <ConfidenceIndicator value={citation.score} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
