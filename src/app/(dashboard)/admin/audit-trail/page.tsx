"use client";

import { useState } from "react";
import {
  FileSearch,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Activity,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  SkipForward,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { useAuditTrail } from "@/hooks/useAuditTrail";
import { cn, formatDateTime } from "@/lib/utils";
import type { AuditEventType, AgentStep } from "@/types/admin";

const eventTypeConfig: Record<AuditEventType, { label: string; color: string }> = {
  query: { label: "Query", color: "bg-blue-100 text-blue-700 border-blue-200" },
  retrieval: { label: "Retrieval", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  document_upload: { label: "Upload", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  document_delete: { label: "Delete", color: "bg-rose-100 text-rose-700 border-rose-200" },
  engagement_create: { label: "Eng. Create", color: "bg-teal-100 text-teal-700 border-teal-200" },
  engagement_update: { label: "Eng. Update", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  finding_create: { label: "Finding", color: "bg-amber-100 text-amber-700 border-amber-200" },
  workpaper_update: { label: "Workpaper", color: "bg-purple-100 text-purple-700 border-purple-200" },
  evidence_pack_export: { label: "Export", color: "bg-orange-100 text-orange-700 border-orange-200" },
  user_login: { label: "Login", color: "bg-slate-100 text-slate-700 border-slate-200" },
  user_logout: { label: "Logout", color: "bg-slate-100 text-slate-700 border-slate-200" },
  permission_change: { label: "Permission", color: "bg-rose-100 text-rose-700 border-rose-200" },
};

const stepStatusIcon: Record<AgentStep["status"], { icon: React.ElementType; color: string }> = {
  success: { icon: CheckCircle2, color: "text-emerald-600" },
  skipped: { icon: SkipForward, color: "text-muted-foreground" },
  error: { icon: XCircle, color: "text-rose-600" },
};

export default function AuditTrailPage() {
  const { entries, queryLogs, loading, exportCsv } = useAuditTrail();
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredEntries = entries.filter((e) => {
    const matchesType = eventFilter === "all" || e.eventType === eventFilter;
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.userName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <VerticalCutReveal splitBy="words" staggerDuration={0.05}>
            Audit Trail
          </VerticalCutReveal>
        </h1>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={entries.length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Queries Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <BasicNumberTicker value={queryLogs.length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {queryLogs.length > 0
                ? `${((queryLogs.reduce((s, q) => s + q.confidence, 0) / queryLogs.length) * 100).toFixed(0)}%`
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">
            <Activity className="mr-1.5 h-3.5 w-3.5" />
            Events ({entries.length})
          </TabsTrigger>
          <TabsTrigger value="queries">
            <Zap className="mr-1.5 h-3.5 w-3.5" />
            Query Logs ({queryLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[170px]">
                <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {Object.entries(eventTypeConfig).map(([value, cfg]) => (
                  <SelectItem key={value} value={value}>{cfg.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => {
                    const cfg = eventTypeConfig[entry.eventType];
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDateTime(entry.timestamp)}
                        </TableCell>
                        <TableCell>
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold border", cfg.color)}>
                            {cfg.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{entry.userName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {entry.engagementName ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm max-w-md truncate">
                          {entry.description}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Query Logs Tab */}
        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                    <TableHead className="text-right">Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queryLogs.map((log) => {
                    const isExpanded = expandedLog === log.id;
                    return (
                      <>
                        <TableRow
                          key={log.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                        >
                          <TableCell>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDateTime(log.timestamp)}
                          </TableCell>
                          <TableCell className="text-sm">{log.userName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.engagementName}
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">{log.query}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] capitalize">
                              {log.retrievalMode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            <span
                              className={cn(
                                "font-medium",
                                log.confidence >= 0.85
                                  ? "text-emerald-600"
                                  : log.confidence >= 0.7
                                  ? "text-amber-600"
                                  : "text-rose-600"
                              )}
                            >
                              {(log.confidence * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {log.latencyMs}ms
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${log.id}-detail`}>
                            <TableCell colSpan={8} className="bg-muted/30 p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono">Run ID: {log.runId}</span>
                                  <Separator orientation="vertical" className="h-3" />
                                  <span>{log.citationCount} citations</span>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold mb-2">Agent Trace</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {log.agentSteps.map((step, idx) => {
                                      const sCfg = stepStatusIcon[step.status];
                                      const StepIcon = sCfg.icon;
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs"
                                        >
                                          <StepIcon className={cn("h-3.5 w-3.5 shrink-0", sCfg.color)} />
                                          <div>
                                            <p className="font-medium">{step.node}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                              {step.durationMs}ms{step.detail ? ` — ${step.detail}` : ""}
                                            </p>
                                          </div>
                                          {idx < log.agentSteps.length - 1 && (
                                            <span className="text-muted-foreground/40 ml-1">→</span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
