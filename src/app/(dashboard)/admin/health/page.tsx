"use client";

import {
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Server,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import { cn, formatDateTime } from "@/lib/utils";
import type { ServiceStatus } from "@/types/admin";

const statusConfig: Record<ServiceStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  healthy: { label: "Healthy", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  degraded: { label: "Degraded", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
  down: { label: "Down", icon: XCircle, color: "text-rose-600", bg: "bg-rose-100" },
  unknown: { label: "Unknown", icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted" },
};

const trendIcon: Record<string, React.ElementType> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export default function HealthPage() {
  const { services, metrics, loading, refetch, overallStatus } = useSystemHealth();

  const overall = overallStatus();
  const overallCfg = statusConfig[overall];
  const OverallIcon = overallCfg.icon;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
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
            System Health
          </VerticalCutReveal>
        </h1>
        <Button variant="outline" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Overall Status Banner */}
      <Card className={cn("border-2", overall === "healthy" ? "border-emerald-200" : overall === "degraded" ? "border-amber-200" : "border-rose-200")}>
        <CardContent className="flex items-center gap-4 p-6">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", overallCfg.bg)}>
            <OverallIcon className={cn("h-6 w-6", overallCfg.color)} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Overall System Status</p>
            <p className={cn("text-xl font-bold", overallCfg.color)}>{overallCfg.label}</p>
          </div>
          <div className="ml-auto text-right text-xs text-muted-foreground">
            <p>{services.filter((s) => s.status === "healthy").length} / {services.length} services healthy</p>
            <p>Last checked: {services[0] ? formatDateTime(services[0].lastChecked) : "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div>
        <h2 className="text-base font-semibold mb-3">Key Metrics</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => {
            const TrendIcon = metric.trend ? trendIcon[metric.trend] : Minus;
            return (
              <Card key={metric.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    {metric.trend && metric.changePercent !== undefined && (
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs font-medium",
                          metric.trend === "up" && metric.label.includes("Error")
                            ? "text-rose-600"
                            : metric.trend === "up"
                            ? "text-emerald-600"
                            : metric.trend === "down" && metric.label.includes("Error")
                            ? "text-emerald-600"
                            : metric.trend === "down"
                            ? "text-rose-600"
                            : "text-muted-foreground"
                        )}
                      >
                        <TrendIcon className="h-3 w-3" />
                        <span>{Math.abs(metric.changePercent)}%</span>
                      </div>
                    )}
                  </div>
                  <p className="text-2xl font-bold mt-1">
                    {metric.unit === "ms"
                      ? `${metric.value}ms`
                      : metric.unit === "%"
                      ? `${metric.value}%`
                      : metric.value < 1 && metric.value > 0
                      ? `${(metric.value * 100).toFixed(0)}%`
                      : metric.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Service Details */}
      <div>
        <h2 className="text-base font-semibold mb-3">Services</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const cfg = statusConfig[service.status];
            const StatusIcon = cfg.icon;
            return (
              <Card key={service.name} className={cn(service.status !== "healthy" && "border-amber-200")}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">{service.name}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", cfg.color)}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{cfg.label}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {service.version && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Version</p>
                        <p className="font-mono">{service.version}</p>
                      </div>
                    )}
                    {service.uptime && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Uptime</p>
                        <p>{service.uptime}</p>
                      </div>
                    )}
                    {service.latencyMs !== undefined && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Latency</p>
                        <p className={cn(service.latencyMs > 100 ? "text-amber-600 font-medium" : "")}>
                          {service.latencyMs}ms
                        </p>
                      </div>
                    )}
                  </div>
                  {service.details && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                        {Object.entries(service.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-muted-foreground/60">{key}: </span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
