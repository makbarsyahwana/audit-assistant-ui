"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Plus,
  Sparkles,
  Save,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  PenLine,
  ChevronDown,
  ChevronRight,
  Loader2,
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
import { useWorkpapers } from "@/hooks/useWorkpapers";
import { cn, formatDate } from "@/lib/utils";
import type { WorkpaperStatus, WorkpaperTemplate, Workpaper } from "@/types/workpaper";

const statusConfig: Record<WorkpaperStatus, { label: string; variant: "default" | "secondary" | "outline" | "active" | "review" }> = {
  draft: { label: "Draft", variant: "secondary" },
  in_review: { label: "In Review", variant: "review" },
  approved: { label: "Approved", variant: "active" },
  final: { label: "Final", variant: "outline" },
};

const templateConfig: Record<WorkpaperTemplate, string> = {
  general: "General",
  criteria_condition: "Criteria & Condition",
  financial_memo: "Financial Memo",
  walkthrough: "Walkthrough",
};

interface WpField {
  key: "criteria" | "condition" | "testing" | "result" | "conclusion";
  label: string;
}

const wpFields: WpField[] = [
  { key: "criteria", label: "Criteria" },
  { key: "condition", label: "Condition" },
  { key: "testing", label: "Testing" },
  { key: "result", label: "Result" },
  { key: "conclusion", label: "Conclusion" },
];

export default function WorkpapersPage() {
  const params = useParams();
  const engagementId = params.id as string;
  const { workpapers, loading, updateField } = useWorkpapers(engagementId);

  const [selectedWpId, setSelectedWpId] = useState<string | null>(null);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const selectedWp = workpapers.find((w) => w.id === selectedWpId);

  const toggleField = (fieldKey: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldKey)) {
        next.delete(fieldKey);
      } else {
        next.add(fieldKey);
      }
      return next;
    });
  };

  const startEditing = (fieldKey: string, content: string) => {
    setEditingField(fieldKey);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingField && selectedWpId) {
      updateField(selectedWpId, editingField as keyof Workpaper, editContent);
      setEditingField(null);
      setEditContent("");
    }
  };

  const generateDraft = async (fieldKey: string) => {
    setGenerating(fieldKey);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (selectedWpId) {
      const mockDraft =
        "Based on the available evidence and framework requirements, the following observations were noted during the testing procedures.\n\nThe control was evaluated against the defined criteria and tested using a sample-based approach. Results indicate compliance with the stated requirements, with minor observations noted below.\n\n[AI-generated draft — review and customize as needed]";
      updateField(selectedWpId, fieldKey as keyof Workpaper, mockDraft);
    }
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
              Workpapers
            </VerticalCutReveal>
          </h1>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Workpaper
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Workpaper</DialogTitle>
                <DialogDescription>
                  Create a new workpaper for documenting audit work.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="Workpaper title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(templateConfig).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Control ID</label>
                  <Input placeholder="e.g. AC-01" />
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
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={workpapers.length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              <BasicNumberTicker
                value={workpapers.filter((w) => w.status === "approved" || w.status === "final").length}
                delay={0.2}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              <BasicNumberTicker
                value={workpapers.filter((w) => w.status === "draft").length}
                delay={0.2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column: List + Editor */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workpaper List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Workpapers ({workpapers.length})
          </h2>
          {workpapers.map((wp) => {
            const sCfg = statusConfig[wp.status];
            const isSelected = selectedWpId === wp.id;
            return (
              <Card
                key={wp.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-sm",
                  isSelected && "ring-2 ring-primary border-primary"
                )}
                onClick={() => {
                  setSelectedWpId(isSelected ? null : wp.id);
                  setEditingField(null);
                  setExpandedFields(new Set());
                }}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight">{wp.title}</p>
                    <Badge variant={sCfg.variant as any} className="text-[10px] shrink-0">
                      {sCfg.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {wp.templateType && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {templateConfig[wp.templateType]}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{wp.createdById ? `By ${wp.createdById}` : ""}</span>
                    <span>{formatDate(wp.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Workpaper Editor */}
        <div className="lg:col-span-2">
          {selectedWp ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{selectedWp.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {selectedWp.templateType && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {templateConfig[selectedWp.templateType]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant={statusConfig[selectedWp.status].variant as any}>
                    {statusConfig[selectedWp.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {wpFields.map((field) => {
                  const isExpanded = expandedFields.has(field.key);
                  const isEditing = editingField === field.key;
                  const isGenerating = generating === field.key;
                  const content = selectedWp[field.key] || "";
                  const isEmpty = !content.trim();

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
                          {isEmpty && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Empty
                            </Badge>
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t px-4 py-3 space-y-3">
                          {isEditing ? (
                            <>
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={8}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y scrollbar-thin"
                                placeholder={`Enter ${field.label.toLowerCase()} content...`}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={saveEdit}>
                                  <Save className="mr-1.5 h-3.5 w-3.5" />
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingField(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              {isEmpty ? (
                                <div className="text-center py-4">
                                  <p className="text-sm text-muted-foreground mb-3">
                                    This section is empty
                                  </p>
                                  <div className="flex justify-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => startEditing(field.key, "")}
                                    >
                                      <PenLine className="mr-1.5 h-3.5 w-3.5" />
                                      Write
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => generateDraft(field.key)}
                                      disabled={isGenerating}
                                    >
                                      {isGenerating ? (
                                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                      )}
                                      AI Draft
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {content}
                                  </div>
                                  <Separator />
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => startEditing(field.key, content)}
                                    >
                                      <PenLine className="mr-1.5 h-3.5 w-3.5" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateDraft(field.key)}
                                      disabled={isGenerating}
                                    >
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
              <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">Select a workpaper</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Click on a workpaper to view and edit its sections
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
