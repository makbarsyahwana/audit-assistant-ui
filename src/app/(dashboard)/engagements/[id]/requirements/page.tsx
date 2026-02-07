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
import type { MappingStatus, RequirementStatus, ControlEffectiveness } from "@/types/requirement";

const reqStatusConfig: Record<RequirementStatus, { label: string; icon: React.ElementType; color: string }> = {
  completed: { label: "Completed", icon: CheckCircle2, color: "text-emerald-600" },
  tested: { label: "Tested", icon: CheckCircle2, color: "text-blue-600" },
  in_progress: { label: "In Progress", icon: Circle, color: "text-amber-600" },
  not_started: { label: "Not Started", icon: Circle, color: "text-muted-foreground" },
};

const mappingStatusConfig: Record<MappingStatus, { label: string; bg: string; border: string }> = {
  mapped: { label: "Mapped", bg: "bg-emerald-500", border: "border-emerald-200" },
  partial: { label: "Partial", bg: "bg-amber-500", border: "border-amber-200" },
  gap: { label: "Gap", bg: "bg-rose-500", border: "border-rose-200" },
};

const effectivenessConfig: Record<ControlEffectiveness, { label: string; color: string }> = {
  effective: { label: "Effective", color: "text-emerald-600" },
  partially_effective: { label: "Partial", color: "text-amber-600" },
  ineffective: { label: "Ineffective", color: "text-rose-600" },
  not_tested: { label: "Not Tested", color: "text-muted-foreground" },
};

export default function RequirementsPage() {
  const params = useParams();
  const engagementId = params.id as string;
  const { requirements, controls, mappings, loading, getCoveragePercent, getGaps } =
    useRequirements(engagementId);

  const [searchReq, setSearchReq] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequirementStatus | "all">("all");

  const coveragePercent = getCoveragePercent();
  const gaps = getGaps();

  const filteredReqs = requirements.filter((r) => {
    const matchesSearch =
      r.clauseId.toLowerCase().includes(searchReq.toLowerCase()) ||
      r.title.toLowerCase().includes(searchReq.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getMappingStatus = (reqId: string, ctrlId: string): MappingStatus | null => {
    const mapping = mappings.find(
      (m) => m.requirementId === reqId && m.controlId === ctrlId
    );
    return mapping?.status ?? null;
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
              {requirements.filter((r) => r.status === "completed").length} completed
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
        <div className="flex gap-1.5">
          {(["all", "not_started", "in_progress", "tested", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {s === "all" ? "All" : reqStatusConfig[s].label}
            </button>
          ))}
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
                  Status
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
                        <p className={cn("text-xs mt-1 font-medium", effectivenessConfig[ctrl.effectiveness].color)}>
                          {effectivenessConfig[ctrl.effectiveness].label}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReqs.map((req) => {
                const statusCfg = reqStatusConfig[req.status];
                const StatusIcon = statusCfg.icon;
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
                      <div className={cn("flex items-center gap-1 text-xs", statusCfg.color)}>
                        <StatusIcon className="h-3 w-3" />
                        <span>{statusCfg.label}</span>
                      </div>
                    </td>
                    {controls.map((ctrl) => {
                      const status = getMappingStatus(req.id, ctrl.id);
                      if (!status) {
                        return (
                          <td key={ctrl.id} className="px-2 py-3 text-center">
                            <span className="text-muted-foreground/30">—</span>
                          </td>
                        );
                      }
                      const cfg = mappingStatusConfig[status];
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
        {Object.entries(mappingStatusConfig).map(([key, cfg]) => (
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
