"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PenTool,
  Plus,
  Sparkles,
  Save,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { useFindings } from "@/hooks/useFindings";
import { cn, formatDate } from "@/lib/utils";
import type { FindingSeverity, FindingStatus } from "@/types/finding";

const severityConfig: Record<FindingSeverity, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: "text-rose-700", bg: "bg-rose-100 border-rose-200" },
  high: { label: "High", color: "text-orange-700", bg: "bg-orange-100 border-orange-200" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-100 border-amber-200" },
  low: { label: "Low", color: "text-blue-700", bg: "bg-blue-100 border-blue-200" },
  informational: { label: "Info", color: "text-slate-700", bg: "bg-slate-100 border-slate-200" },
};

const findingStatusConfig: Record<FindingStatus, { label: string; variant: "default" | "secondary" | "outline" | "active" | "review" }> = {
  draft: { label: "Draft", variant: "secondary" },
  in_review: { label: "In Review", variant: "review" },
  open: { label: "Open", variant: "default" },
  remediation: { label: "Remediation", variant: "active" },
  closed: { label: "Closed", variant: "outline" },
};

interface FindingField {
  key: "criteria" | "condition" | "cause" | "effect" | "recommendation" | "managementResponse";
  label: string;
  required: boolean;
}

const findingFields: FindingField[] = [
  { key: "criteria", label: "Criteria", required: true },
  { key: "condition", label: "Condition", required: true },
  { key: "cause", label: "Cause", required: true },
  { key: "effect", label: "Effect", required: true },
  { key: "recommendation", label: "Recommendation", required: true },
  { key: "managementResponse", label: "Management Response", required: false },
];

export default function FindingsPage() {
  const params = useParams();
  const engagementId = params.id as string;
  const { findings, loading } = useFindings(engagementId);

  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set(["criteria", "condition"]));
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<FindingSeverity | "all">("all");

  const selectedFinding = findings.find((f) => f.id === selectedFindingId);

  const filteredFindings = findings.filter(
    (f) => severityFilter === "all" || f.severity === severityFilter
  );

  const toggleField = (key: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const generateFieldDraft = async (fieldKey: string) => {
    setGenerating(fieldKey);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
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
              Findings
            </VerticalCutReveal>
          </h1>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Finding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Finding</DialogTitle>
                <DialogDescription>
                  Create a new audit finding with structured fields.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Finding title" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(severityConfig).map(([value, cfg]) => (
                          <SelectItem key={value} value={value}>
                            {cfg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Control ID</label>
                    <Input placeholder="e.g. HR-SCR-01" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => setShowCreate(false)}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={findings.length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        {(["critical", "high", "medium"] as FindingSeverity[]).map((sev) => {
          const count = findings.filter((f) => f.severity === sev).length;
          const cfg = severityConfig[sev];
          return (
            <Card key={sev}>
              <CardHeader className="pb-2">
                <CardTitle className={cn("text-sm font-medium", cfg.color)}>
                  {cfg.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn("text-2xl font-bold", cfg.color)}>
                  <BasicNumberTicker value={count} delay={0.2} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Severity Filter */}
      <div className="flex gap-1.5">
        {(["all", "critical", "high", "medium", "low", "informational"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              severityFilter === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {s === "all" ? "All" : severityConfig[s].label}
          </button>
        ))}
      </div>

      {/* Two-column: Finding list + Editor */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Finding List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Findings ({filteredFindings.length})
          </h2>
          {filteredFindings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PenTool className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No findings match your filter</p>
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const sevCfg = severityConfig[finding.severity];
              const stCfg = findingStatusConfig[finding.status];
              const isSelected = selectedFindingId === finding.id;
              return (
                <Card
                  key={finding.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-sm",
                    isSelected && "ring-2 ring-primary border-primary"
                  )}
                  onClick={() => {
                    setSelectedFindingId(isSelected ? null : finding.id);
                    setExpandedFields(new Set(["criteria", "condition"]));
                  }}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight">{finding.title}</p>
                      <div
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold border",
                          sevCfg.bg,
                          sevCfg.color
                        )}
                      >
                        {sevCfg.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={stCfg.variant as any} className="text-[10px]">
                        {stCfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>
                        {finding.createdBy?.name || finding.createdBy?.email
                          ? `By ${finding.createdBy.name ?? finding.createdBy.email}`
                          : ""}
                      </span>
                      <span>{formatDate(finding.updatedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Finding Editor */}
        <div className="lg:col-span-2">
          {selectedFinding ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{selectedFinding.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={cn(
                          "rounded px-2 py-0.5 text-xs font-semibold border",
                          severityConfig[selectedFinding.severity].bg,
                          severityConfig[selectedFinding.severity].color
                        )}
                      >
                        {severityConfig[selectedFinding.severity].label}
                      </div>
                      <Badge variant={findingStatusConfig[selectedFinding.status].variant as any}>
                        {findingStatusConfig[selectedFinding.status].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {findingFields.map((field) => {
                  const isExpanded = expandedFields.has(field.key);
                  const content = selectedFinding[field.key] || "";
                  const isEmpty = !content.trim();
                  const isGenerating = generating === field.key;

                  return (
                    <div key={field.key} className="rounded-lg border">
                      <button
                        onClick={() => toggleField(field.key)}
                        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{field.label}</span>
                          {field.required && (
                            <span className="text-rose-500 text-xs">*</span>
                          )}
                          {isEmpty && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Empty
                            </Badge>
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t px-4 py-3 space-y-3">
                          {isEmpty ? (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground mb-3">
                                No content yet
                              </p>
                              <Button
                                size="sm"
                                onClick={() => generateFieldDraft(field.key)}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                )}
                                AI Suggest
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {content}
                              </div>
                              <Separator />
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={isGenerating}>
                                  {isGenerating ? (
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                  )}
                                  Regenerate
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <PenTool className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">Select a finding</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Click on a finding to view and edit its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
