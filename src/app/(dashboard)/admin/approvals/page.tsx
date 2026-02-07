"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  MessageSquare,
  FileText,
  PenTool,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { useApprovals } from "@/hooks/useApprovals";
import { cn, formatDateTime, getInitials } from "@/lib/utils";
import type { ApprovalStatus } from "@/types/admin";

const statusConfig: Record<ApprovalStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-100 border-amber-200" },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 border-emerald-200" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-rose-600", bg: "bg-rose-100 border-rose-200" },
  revision_requested: { label: "Revision", icon: RotateCcw, color: "text-blue-600", bg: "bg-blue-100 border-blue-200" },
};

const entityTypeIcon: Record<string, React.ElementType> = {
  finding: PenTool,
  workpaper: FileText,
  regulator_response: AlertTriangle,
};

export default function ApprovalsPage() {
  const { requests, loading, updateStatus, pendingCount } = useApprovals();
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "all">("all");
  const [reviewDialog, setReviewDialog] = useState<{ id: string; action: "approved" | "rejected" | "revision_requested" } | null>(null);
  const [reviewComment, setReviewComment] = useState("");

  const filtered = requests.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  const handleReview = () => {
    if (reviewDialog) {
      updateStatus(reviewDialog.id, reviewDialog.action, reviewComment || undefined);
      setReviewDialog(null);
      setReviewComment("");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          <VerticalCutReveal splitBy="words" staggerDuration={0.05}>
            Approval Queue
          </VerticalCutReveal>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Human-in-the-loop review for findings, workpapers, and formal responses
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={requests.length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              <BasicNumberTicker value={pendingCount} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              <BasicNumberTicker value={requests.filter((r) => r.status === "approved").length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Revision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <BasicNumberTicker value={requests.filter((r) => r.status === "revision_requested").length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5">
        {(["all", "pending", "approved", "rejected", "revision_requested"] as const).map((s) => (
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
            {s === "all" ? "All" : statusConfig[s].label}
          </button>
        ))}
      </div>

      {/* Approval Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500/40 mb-4" />
            <h3 className="text-lg font-semibold">No requests match your filter</h3>
          </div>
        ) : (
          filtered.map((req) => {
            const stCfg = statusConfig[req.status];
            const StIcon = stCfg.icon;
            const EntityIcon = entityTypeIcon[req.entityType] || FileText;

            return (
              <Card key={req.id} className={cn(req.status === "pending" && "border-amber-200")}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", stCfg.bg)}>
                        <EntityIcon className={cn("h-4 w-4", stCfg.color)} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">{req.entityTitle}</p>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {req.entityType.replace("_", " ")}
                          </Badge>
                          <div className={cn("flex items-center gap-1 text-xs font-medium", stCfg.color)}>
                            <StIcon className="h-3 w-3" />
                            <span>{stCfg.label}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {req.engagementName}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span>Requested by <span className="font-medium text-foreground">{req.requestedBy}</span></span>
                          <span>{formatDateTime(req.requestedAt)}</span>
                        </div>
                        {req.reviewedBy && (
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span>Reviewed by <span className="font-medium text-foreground">{req.reviewedBy}</span></span>
                            <span>{req.reviewedAt ? formatDateTime(req.reviewedAt) : ""}</span>
                          </div>
                        )}
                        {req.comment && (
                          <div className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
                            <MessageSquare className="inline h-3 w-3 mr-1 text-muted-foreground" />
                            {req.comment}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {req.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => setReviewDialog({ id: req.id, action: "revision_requested" })}
                        >
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          Revise
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:text-rose-700"
                          onClick={() => setReviewDialog({ id: req.id, action: "rejected" })}
                        >
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => setReviewDialog({ id: req.id, action: "approved" })}
                        >
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={(open) => !open && setReviewDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewDialog?.action === "approved"
                ? "Approve Request"
                : reviewDialog?.action === "rejected"
                ? "Reject Request"
                : "Request Revision"}
            </DialogTitle>
            <DialogDescription>
              Add a comment to explain your decision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment {reviewDialog?.action !== "approved" ? "(required)" : "(optional)"}</label>
              <Input
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Add your review comment..."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant={reviewDialog?.action === "rejected" ? "destructive" : "default"}
              className={cn(reviewDialog?.action === "approved" && "bg-emerald-600 hover:bg-emerald-700")}
              disabled={reviewDialog?.action !== "approved" && !reviewComment.trim()}
              onClick={handleReview}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
