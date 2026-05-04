"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ConfidenceIndicator } from "@/components/ui/confidence-indicator";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { useModeContext } from "@/contexts/ModeContext";
import { useEngagements } from "@/hooks/useEngagements";
import { useAuditTrail } from "@/hooks/useAuditTrail";
import { formatDateTime, getInitials, truncate } from "@/lib/utils";
import type { EngagementStatus } from "@/types/engagement";

const statusVariantMap: Record<EngagementStatus, "active" | "closed" | "draft" | "planning" | "archived"> = {
  active: "active",
  closed: "closed",
  planning: "planning",
  archived: "archived",
};

/** Local Monday 00:00:00 for the calendar week containing *ref* (default: now). */
function startOfLocalWeek(ref: Date = new Date()): Date {
  const d = new Date(ref);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function countQueryLogsThisWeek(
  logs: { timestamp: string }[],
  now: Date = new Date()
): number {
  const weekStart = startOfLocalWeek(now);
  return logs.filter((l) => {
    const t = new Date(l.timestamp);
    return !Number.isNaN(t.getTime()) && t >= weekStart;
  }).length;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { mode, config } = useModeContext();
  const { engagements } = useEngagements(mode);
  const { queryLogs } = useAuditTrail();

  const stats = {
    totalEngagements: engagements.length,
    activeEngagements: engagements.filter((e) => e.status === "active").length,
    documentsIndexed: engagements.reduce((sum, e) => sum + (e.stats?.documentCount ?? 0), 0),
    queriesThisWeek: countQueryLogsThisWeek(queryLogs),
  };

  const recentQueries = queryLogs;

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-serif text-3xl font-normal text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s an overview of your {config.terminology.topLevelEntityPlural.toLowerCase()} and recent activity.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title={`Total ${config.terminology.topLevelEntityPlural}`}
          value={stats.totalEngagements}
          icon={Briefcase}
          description={`All ${config.terminology.topLevelEntityPlural.toLowerCase()}`}
        />
        <KpiCard
          title={`Active ${config.terminology.topLevelEntityPlural}`}
          value={stats.activeEngagements}
          icon={TrendingUp}
          description="Currently in progress"
        />
        <KpiCard
          title="Documents Indexed"
          value={stats.documentsIndexed}
          icon={FileText}
          description={`Across all ${config.terminology.topLevelEntityPlural.toLowerCase()}`}
        />
        <KpiCard
          title="Queries This Week"
          value={stats.queriesThisWeek}
          icon={MessageSquare}
          description="AI-assisted queries"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Engagements Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Active {config.terminology.topLevelEntityPlural}</CardTitle>
            <Link href="/engagements">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="text-right">Docs</TableHead>
                  <TableHead>Team</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagements
                  .filter((e) => e.status === "active")
                  .slice(0, 5)
                  .map((engagement) => (
                    <TableRow key={engagement.id}>
                      <TableCell>
                        <Link
                          href={`/engagements/${engagement.id}`}
                          className="font-medium hover:underline"
                        >
                          {engagement.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {engagement.framework}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[engagement.status]}>
                          {engagement.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {engagement.entityName ?? "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {engagement.stats?.documentCount ?? 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {(engagement.members ?? []).slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-[10px] bg-foreground text-background">
                                {getInitials(member.user.name)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {(engagement.members ?? []).length > 3 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                              +{(engagement.members ?? []).length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Recent Queries</CardTitle>
            <Link href="/admin/audit-trail">
              <Button variant="ghost" size="sm" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentQueries.slice(0, 5).map((query) => (
              <div key={query.id} className="space-y-1.5">
                <p className="text-sm font-medium leading-snug">
                  {truncate(query.query, 60)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {query.engagementName}
                  </span>
                  <ConfidenceIndicator value={query.confidence} size="sm" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(query.timestamp)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/chat">
          <Button className="bg-foreground text-background hover:bg-foreground/85">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
        <Link href="/engagements">
          <Button variant="outline">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse {config.terminology.topLevelEntityPlural}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <BasicNumberTicker value={value} delay={0.2} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
