"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  Download,
  GripVertical,
  Star,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
import { Input } from "@/components/ui/input";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { useEvidencePacks } from "@/hooks/useEvidencePacks";
import { cn, formatDate, truncate } from "@/lib/utils";
import type { EvidencePackStatus } from "@/types/evidence";

const packStatusConfig: Record<EvidencePackStatus, { label: string; variant: "default" | "secondary" | "outline" | "active" }> = {
  draft: { label: "Draft", variant: "secondary" },
  in_review: { label: "In Review", variant: "default" },
  approved: { label: "Approved", variant: "active" },
  exported: { label: "Exported", variant: "outline" },
};

export default function EvidencePage() {
  const params = useParams();
  const engagementId = params.id as string;
  const { packs, candidates, loading, addItemToPack, removeItemFromPack } =
    useEvidencePacks(engagementId);

  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedPack = packs.find((p) => p.id === selectedPackId);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.documentId.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      (c.controlId?.toLowerCase().includes(candidateSearch.toLowerCase()) ?? false);
    const notAlreadyAdded = selectedPack
      ? !(selectedPack.items ?? []).some((i) => i.documentId === c.documentId)
      : true;
    return matchesSearch && notAlreadyAdded;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 lg:grid-cols-3">
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
              Evidence Packs
            </VerticalCutReveal>
          </h1>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Pack
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Evidence Pack</DialogTitle>
                <DialogDescription>
                  Create a new evidence pack to organize evidence for a control.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pack Name</label>
                  <Input placeholder="e.g. Access Review - Q2 2025" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input placeholder="Brief description" />
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
                <Button onClick={() => setShowCreateDialog(false)}>Create Pack</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Packs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={packs.length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              <BasicNumberTicker value={packs.filter((p) => p.status === "approved").length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evidence Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={packs.reduce((sum, p) => sum + (p.items ?? []).length, 0)} delay={0.2} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-column layout: Pack list + Pack detail / Evidence finder */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pack List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Packs ({packs.length})
          </h2>
          {packs.map((pack) => {
            const statusCfg = packStatusConfig[pack.status];
            const isSelected = selectedPackId === pack.id;
            return (
              <Card
                key={pack.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-sm",
                  isSelected && "ring-2 ring-primary border-primary"
                )}
                onClick={() => setSelectedPackId(isSelected ? null : pack.id)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight">{pack.name}</p>
                    <Badge variant={statusCfg.variant as any} className="text-[10px] shrink-0">
                      {statusCfg.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{(pack.items ?? []).length} item{(pack.items ?? []).length !== 1 ? "s" : ""}</span>
                    <span>{formatDate(pack.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pack Detail + Evidence Finder */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPack ? (
            <>
              {/* Pack Items */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{selectedPack.name}</CardTitle>
                    {selectedPack.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedPack.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(selectedPack.items ?? []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium">No evidence items yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Search and add evidence from the finder below
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(selectedPack.items ?? []).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 rounded-lg border p-3 group hover:bg-muted/50 transition-colors"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 cursor-grab shrink-0" />
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <p className="text-sm font-medium truncate">
                                {item.documentId}
                              </p>
                              {item.controlId && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                  {item.controlId}
                                </Badge>
                              )}
                            </div>
                            {item.rationale && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.rationale}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItemFromPack(selectedPack.id, item.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Evidence Finder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Evidence Finder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                      placeholder="Search evidence candidates..."
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2">
                    {filteredCandidates.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No matching evidence candidates
                      </p>
                    ) : (
                      filteredCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-start gap-3 rounded-lg border border-dashed p-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <p className="text-sm font-medium truncate">
                                {candidate.documentId}
                              </p>
                              {candidate.controlId && (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize shrink-0">
                                  {candidate.controlId}
                                </Badge>
                              )}
                            </div>
                            {candidate.rationale && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {candidate.rationale}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => addItemToPack(selectedPack.id, candidate)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold">Select an evidence pack</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Click on a pack to view its contents and add evidence
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
