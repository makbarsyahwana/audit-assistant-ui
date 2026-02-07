"use client";

import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import type { Citation } from "@/types/chat";
import { truncate } from "@/lib/utils";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
  return (
    <Card className="border-border/60 hover:border-border transition-colors">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
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
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                p.{citation.pageNumber}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {citation.retrievalType}
            </Badge>
          </div>
        </div>

        <blockquote className="border-l-2 border-muted-foreground/20 pl-3 text-xs text-muted-foreground leading-relaxed">
          {truncate(citation.snippet, 200)}
        </blockquote>

        <div className="flex items-center justify-between pt-1">
          <ConfidenceIndicator value={citation.score} size="sm" />
          <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="h-3 w-3" />
            View source
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
