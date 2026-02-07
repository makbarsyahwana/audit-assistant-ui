"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Plus,
  Calendar,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { useEngagements } from "@/hooks/useEngagements";
import { formatDate, getInitials } from "@/lib/utils";
import type { EngagementStatus } from "@/types/engagement";

const statusVariantMap: Record<EngagementStatus, "active" | "review" | "closed" | "draft" | "planning" | "archived"> = {
  active: "active",
  review: "review",
  closed: "closed",
  planning: "planning",
  archived: "archived",
};

const statusFilters: { label: string; value: EngagementStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Review", value: "review" },
  { label: "Planning", value: "planning" },
  { label: "Closed", value: "closed" },
  { label: "Archived", value: "archived" },
];

export default function EngagementsPage() {
  const { engagements, loading } = useEngagements();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EngagementStatus | "all">("all");

  const filtered = engagements.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.entityName.toLowerCase().includes(search.toLowerCase()) ||
      (e.framework?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <VerticalCutReveal splitBy="words" staggerDuration={0.05}>
              Engagements
            </VerticalCutReveal>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your audit engagements and their documents
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Engagement
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search engagements..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Engagement Cards */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold">No engagements found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first engagement to get started"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((engagement) => (
            <Link
              key={engagement.id}
              href={`/engagements/${engagement.id}`}
            >
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 cursor-pointer group">
                <CardContent className="p-5 space-y-4">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors truncate">
                        {engagement.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {engagement.entityName}
                      </p>
                    </div>
                    <Badge
                      variant={statusVariantMap[engagement.status]}
                      className="shrink-0"
                    >
                      {engagement.status}
                    </Badge>
                  </div>

                  {/* Framework & Period */}
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {engagement.framework && (
                      <p className="font-medium text-foreground/80">
                        {engagement.framework}
                      </p>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(engagement.periodStart)} — {formatDate(engagement.periodEnd)}
                      </span>
                    </div>
                  </div>

                  {/* Coverage Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Coverage</span>
                      <span className="font-medium">
                        {engagement.stats.coveragePercent}%
                      </span>
                    </div>
                    <Progress value={engagement.stats.coveragePercent} className="h-1.5" />
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {engagement.stats.documentCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {engagement.members.length}
                      </span>
                    </div>

                    {/* Team Avatars */}
                    <div className="flex -space-x-1.5">
                      {engagement.members.slice(0, 3).map((member) => (
                        <Avatar
                          key={member.id}
                          className="h-5 w-5 border-2 border-background"
                        >
                          <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {engagement.members.length > 3 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-muted text-[8px] font-medium">
                          +{engagement.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
