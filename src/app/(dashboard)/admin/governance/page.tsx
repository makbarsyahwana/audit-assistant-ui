"use client";

import { useState } from "react";
import {
  Brain,
  Power,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Eye,
  ChevronDown,
  ChevronRight,
  Zap,
  StopCircle,
  XOctagon,
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { useGovernance } from "@/hooks/useGovernance";
import { cn, formatDateTime } from "@/lib/utils";
import type { KillSwitchLevel } from "@/types/admin";

const killSwitchConfig: Record<KillSwitchLevel, { label: string; icon: React.ElementType; color: string; bg: string; description: string }> = {
  active: { label: "Active", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-100 border-emerald-200", description: "All agent graphs are running normally" },
  soft_stop: { label: "Soft Stop", icon: StopCircle, color: "text-amber-600", bg: "bg-amber-100 border-amber-200", description: "Agents complete current tasks, no new executions" },
  hard_stop: { label: "Hard Stop", icon: XOctagon, color: "text-rose-600", bg: "bg-rose-100 border-rose-200", description: "All agent executions immediately terminated" },
};

export default function GovernancePage() {
  const { modelCards, killSwitch, goalDriftAlerts, loading, setKillSwitchLevel, resolveAlert } =
    useGovernance();

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showKillSwitchDialog, setShowKillSwitchDialog] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<KillSwitchLevel>("active");
  const [killReason, setKillReason] = useState("");

  const ksCfg = killSwitchConfig[killSwitch.level];
  const KsIcon = ksCfg.icon;

  const unresolvedAlerts = goalDriftAlerts.filter((a) => !a.resolved);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <VerticalCutReveal splitBy="words" staggerDuration={0.05}>
            AI Governance
          </VerticalCutReveal>
        </h1>
      </div>

      {/* Kill Switch */}
      <Card className={cn("border-2", ksCfg.bg)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", ksCfg.bg)}>
                <KsIcon className={cn("h-6 w-6", ksCfg.color)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agent Kill Switch</p>
                <p className={cn("text-xl font-bold", ksCfg.color)}>{ksCfg.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ksCfg.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {(["active", "soft_stop", "hard_stop"] as KillSwitchLevel[]).map((level) => {
                const cfg = killSwitchConfig[level];
                const isActive = killSwitch.level === level;
                return (
                  <Button
                    key={level}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={cn(isActive && level === "hard_stop" && "bg-rose-600 hover:bg-rose-700")}
                    disabled={isActive}
                    onClick={() => {
                      if (level !== "active") {
                        setPendingLevel(level);
                        setShowKillSwitchDialog(true);
                      } else {
                        setKillSwitchLevel("active");
                      }
                    }}
                  >
                    {cfg.label}
                  </Button>
                );
              })}
            </div>
          </div>
          {killSwitch.reason && (
            <div className="mt-3 rounded-lg bg-background/80 px-3 py-2 text-xs">
              <span className="text-muted-foreground">Reason: </span>
              <span>{killSwitch.reason}</span>
              {killSwitch.activatedBy && (
                <span className="text-muted-foreground"> — by {killSwitch.activatedBy} at {killSwitch.activatedAt ? formatDateTime(killSwitch.activatedAt) : ""}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kill Switch Confirmation Dialog */}
      <Dialog open={showKillSwitchDialog} onOpenChange={setShowKillSwitchDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Confirm {killSwitchConfig[pendingLevel].label}
            </DialogTitle>
            <DialogDescription>
              {killSwitchConfig[pendingLevel].description}. This action will affect all running agent graphs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason (required)</label>
              <Input
                value={killReason}
                onChange={(e) => setKillReason(e.target.value)}
                placeholder="Provide a reason for this action"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!killReason.trim()}
              onClick={() => {
                setKillSwitchLevel(pendingLevel, killReason);
                setKillReason("");
                setShowKillSwitchDialog(false);
              }}
            >
              Confirm {killSwitchConfig[pendingLevel].label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Drift Alerts */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Goal Drift Alerts
          {unresolvedAlerts.length > 0 && (
            <Badge variant="destructive" className="text-[10px]">
              {unresolvedAlerts.length} unresolved
            </Badge>
          )}
        </h2>
        {goalDriftAlerts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
              <p className="text-sm">No goal drift alerts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {goalDriftAlerts.map((alert) => (
              <Card key={alert.id} className={cn(!alert.resolved && alert.severity === "critical" && "border-rose-200")}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={cn(
                        "h-4 w-4 shrink-0",
                        alert.resolved
                          ? "text-muted-foreground"
                          : alert.severity === "critical"
                          ? "text-rose-600"
                          : "text-amber-600"
                      )}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{alert.agentGraph}</p>
                        <Badge variant="secondary" className="text-[10px]">{alert.metric}</Badge>
                        {alert.resolved && <Badge variant="outline" className="text-[10px]">Resolved</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Expected: {alert.expected} — Actual: {alert.actual} — {formatDateTime(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                      Resolve
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Model Cards */}
      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          Model Cards
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {modelCards.map((card) => {
            const isExpanded = expandedCard === card.id;
            return (
              <Card key={card.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold">{card.name}</p>
                      <p className="text-xs text-muted-foreground">{card.provider}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono">{card.version}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{card.purpose}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>Context: {(card.contextWindow / 1000).toFixed(0)}K tokens</span>
                    <span>Updated: {formatDateTime(card.lastUpdated)}</span>
                  </div>

                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    Known Limitations ({card.knownLimitations.length})
                  </button>

                  {isExpanded && (
                    <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
                      {card.knownLimitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Governance Framework */}
      <div>
        <h2 className="text-base font-semibold mb-3">AI Agent Governance Framework — 5 Pillars</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { title: "Alignment", description: "Goals match audit objectives", icon: "🎯", status: "active" },
            { title: "Control", description: "Kill switch & HITL gates", icon: "🛡️", status: "active" },
            { title: "Visibility", description: "Agent traces & explainability", icon: "👁️", status: "active" },
            { title: "Security", description: "RBAC, data isolation", icon: "🔒", status: "active" },
            { title: "Societal", description: "Bias audit & fairness", icon: "⚖️", status: "monitoring" },
          ].map((pillar) => (
            <Card key={pillar.title}>
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-2xl">{pillar.icon}</div>
                <p className="text-sm font-semibold">{pillar.title}</p>
                <p className="text-[10px] text-muted-foreground">{pillar.description}</p>
                <Badge
                  variant={pillar.status === "active" ? "active" : "secondary"}
                  className="text-[10px]"
                >
                  {pillar.status === "active" ? "Active" : "Monitoring"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
