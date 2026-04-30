"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Circle,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { useRequirements } from "@/hooks/useRequirements";
import { cn } from "@/lib/utils";
import type { CoverageLevel, ControlStatus } from "@/types/requirement";

const coverageConfig: Record<CoverageLevel, { label: string; bg: string; border: string }> = {
  full: { label: "Full", bg: "bg-emerald-500", border: "border-emerald-200" },
  partial: { label: "Partial", bg: "bg-amber-500", border: "border-amber-200" },
  none: { label: "Gap", bg: "bg-rose-500", border: "border-rose-200" },
};

const controlStatusConfig: Record<ControlStatus, { label: string; color: string }> = {
  effective: { label: "Effective", color: "text-emerald-600" },
  ineffective: { label: "Ineffective", color: "text-rose-600" },
  not_tested: { label: "Not Tested", color: "text-muted-foreground" },
  not_applicable: { label: "N/A", color: "text-slate-500" },
};

export default function RequirementsPage() {
  const params = useParams();
  const engagementId = params.id as string;
  const { requirements, controls, mappings, loading, getCoveragePercent, getGaps } =
    useRequirements(engagementId);

  const [searchReq, setSearchReq] = useState("");

  const coveragePercent = getCoveragePercent();
  const gaps = getGaps();

  const filteredReqs = requirements.filter((r) => {
    const matchesSearch =
      r.clauseId.toLowerCase().includes(searchReq.toLowerCase()) ||
      r.title.toLowerCase().includes(searchReq.toLowerCase());
    return matchesSearch;
  });

  const getMappingCoverage = (reqId: string, ctrlId: string): CoverageLevel | null => {
    const mapping = mappings.find(
      (m) => m.requirementId === reqId && m.controlId === ctrlId
    );
    return mapping?.coverageLevel ?? null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/engagements/${engagementId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to Engagement
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <VerticalCutReveal splitBy="words" staggerDuration={0.05}>
              Requirements & Controls
            </VerticalCutReveal>
          </h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Matrix
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Coverage</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={coveragePercent} delay={0.2} />%
            </div>
            <Progress value={coveragePercent} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={requirements.length} delay={0.2} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              across {controls.length} controls
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              <BasicNumberTicker value={gaps.length} delay={0.2} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchReq}
            onChange={(e) => setSearchReq(e.target.value)}
            placeholder="Search by clause or title..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Mapping Matrix */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-medium text-muted-foreground min-w-[280px]">
                  Requirement
                </th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground w-24">
                  Priority
                </th>
                {controls.map((ctrl) => (
                  <th key={ctrl.id} className="px-2 py-3 text-center font-medium min-w-[80px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-help">
                          {ctrl.controlId}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="font-medium">{ctrl.title}</p>
                        <p className="text-xs mt-1">{ctrl.description}</p>
                        {ctrl.status && (
                          <p className={cn("text-xs mt-1 font-medium", controlStatusConfig[ctrl.status].color)}>
                            {controlStatusConfig[ctrl.status].label}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReqs.map((req) => {
                return (
                  <tr key={req.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-card px-4 py-3">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0 mt-0.5">
                          {req.clauseId}
                        </Badge>
                        <div className="min-w-0">
                          <p className="font-medium text-xs leading-tight truncate">
                            {req.title}
                          </p>
                          {req.category && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {req.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs capitalize text-muted-foreground">
                        {req.priority ?? "—"}
                      </span>
                    </td>
                    {controls.map((ctrl) => {
                      const coverage = getMappingCoverage(req.id, ctrl.id);
                      if (!coverage) {
                        return (
                          <td key={ctrl.id} className="px-2 py-3 text-center">
                            <span className="text-muted-foreground/30">—</span>
                          </td>
                        );
                      }
                      const cfg = coverageConfig[coverage];
                      return (
                        <td key={ctrl.id} className="px-2 py-3 text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={cn("mx-auto h-4 w-4 rounded-full cursor-pointer", cfg.bg)} />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="font-medium text-xs">{cfg.label}</p>
                              <p className="text-[10px]">{req.clauseId} → {ctrl.controlId}</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium">Legend:</span>
        {Object.entries(coverageConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn("h-3 w-3 rounded-full", cfg.bg)} />
            <span>{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground/30">—</span>
          <span>Not applicable</span>
        </div>
      </div>
    </div>
  );
}
