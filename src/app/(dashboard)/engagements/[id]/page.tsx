"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Shield,
  Package,
  ClipboardList,
  PenTool,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { useEngagements } from "@/hooks/useEngagements";
import { formatDate, getInitials } from "@/lib/utils";
import type { EngagementStatus } from "@/types/engagement";

const statusVariantMap: Record<EngagementStatus, "active" | "closed" | "draft" | "planning" | "archived"> = {
  active: "active",
  closed: "closed",
  planning: "planning",
  archived: "archived",
};

interface QuickLink {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
  count?: number;
}

export default function EngagementDetailPage() {
  const params = useParams();
  const engagementId = params.id as string;
  const { getEngagement, loading: engLoading } = useEngagements();

  const engagement = getEngagement(engagementId);

  if (engLoading) {
    return <EngagementDetailSkeleton />;
  }

  if (!engagement) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h2 className="text-lg font-semibold">Engagement not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          The engagement you are looking for does not exist.
        </p>
        <Link href="/engagements">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Engagements
          </Button>
        </Link>
      </div>
    );
  }

  const quickLinks: QuickLink[] = [
    {
      label: "Documents",
      href: `/engagements/${engagementId}/documents`,
      icon: FileText,
      description: "Browse, search and upload documents",
      ...(engagement.stats != null
        ? { count: engagement.stats.documentCount ?? 0 }
        : {}),
    },
    {
      label: "Requirements",
      href: `/engagements/${engagementId}/requirements`,
      icon: Shield,
      description: "Requirement–control mapping matrix",
    },
    {
      label: "Evidence",
      href: `/engagements/${engagementId}/evidence`,
      icon: Package,
      description: "Evidence pack builder",
    },
    {
      label: "Workpapers",
      href: `/engagements/${engagementId}/workpapers`,
      icon: ClipboardList,
      description: "Workpaper editor with AI drafting",
    },
    {
      label: "Findings",
      href: `/engagements/${engagementId}/findings`,
      icon: PenTool,
      description: "Finding drafting and tracking",
      ...(engagement.stats != null ? { count: engagement.stats.findingCount ?? 0 } : {}),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back & Header */}
      <div>
        <Link
          href="/engagements"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to Engagements
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                <VerticalCutReveal splitBy="words" staggerDuration={0.04}>
                  {engagement.name}
                </VerticalCutReveal>
              </h1>
              <Badge variant={statusVariantMap[engagement.status]} className="capitalize">
                {engagement.status}
              </Badge>
            </div>
            {engagement.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {engagement.description}
              </p>
            )}
          </div>
          <Link href={`/chat?engagement=${engagementId}`}>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {engagement.entityName && <span className="font-medium text-foreground">{engagement.entityName}</span>}
        <Separator orientation="vertical" className="h-4" />
        {engagement.framework && (
          <>
            <span>{engagement.framework}</span>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {engagement.periodStart ? formatDate(engagement.periodStart) : "—"} — {engagement.periodEnd ? formatDate(engagement.periodEnd) : "—"}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Documents"
          value={engagement.stats?.documentCount ?? 0}
          icon={FileText}
        />
        <StatCard
          title="Queries"
          value={engagement.stats?.queryCount ?? 0}
          icon={MessageSquare}
        />
        <StatCard
          title="Findings"
          value={engagement.stats?.findingCount ?? 0}
          icon={AlertTriangle}
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Coverage
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <BasicNumberTicker value={engagement.stats?.coveragePercent ?? 0} delay={0.2} />%
            </div>
            <Progress
              value={engagement.stats?.coveragePercent ?? 0}
              className="mt-2 h-1.5"
            />
          </CardContent>
        </Card>
      </div>

      {/* Workflow Quick Links */}
      <div>
        <h2 className="text-base font-semibold mb-3">Workflow</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 cursor-pointer group">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                          {link.label}
                        </p>
                        {link.count !== undefined && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {link.count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {link.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-base font-semibold mb-3">
          <Users className="inline mr-1.5 h-4 w-4" />
          Team ({(engagement.members ?? []).length})
        </h2>
        <div className="flex flex-wrap gap-3">
          {(engagement.members ?? []).map((member) => {
            const displayName = member.user?.name ?? member.user?.email ?? "Member";
            return (
            <div
              key={member.id}
              className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {member.role.replace("_", " ")}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
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
      </CardContent>
    </Card>
  );
}

function EngagementDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
