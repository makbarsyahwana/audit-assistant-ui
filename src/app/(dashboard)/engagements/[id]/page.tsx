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
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { useEngagements } from "@/hooks/useEngagements";
import { useDocuments } from "@/hooks/useDocuments";
import { formatDate, formatDateTime, getInitials } from "@/lib/utils";
import type { EngagementStatus } from "@/types/engagement";

const statusVariantMap: Record<EngagementStatus, "active" | "review" | "closed" | "draft" | "planning" | "archived"> = {
  active: "active",
  review: "review",
  closed: "closed",
  planning: "planning",
  archived: "archived",
};

export default function EngagementDetailPage() {
  const params = useParams();
  const engagementId = params.id as string;
  const { getEngagement, loading: engLoading } = useEngagements();
  const { documents, loading: docsLoading } = useDocuments(engagementId);

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
        <span className="font-medium text-foreground">{engagement.entityName}</span>
        <Separator orientation="vertical" className="h-4" />
        {engagement.framework && (
          <>
            <span>{engagement.framework}</span>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(engagement.periodStart)} — {formatDate(engagement.periodEnd)}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Documents"
          value={engagement.stats.documentCount}
          icon={FileText}
        />
        <StatCard
          title="Queries"
          value={engagement.stats.queryCount}
          icon={MessageSquare}
        />
        <StatCard
          title="Findings"
          value={engagement.stats.findingCount}
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
              <BasicNumberTicker value={engagement.stats.coveragePercent} delay={0.2} />%
            </div>
            <Progress
              value={engagement.stats.coveragePercent}
              className="mt-2 h-1.5"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Documents & Team */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Team ({engagement.members.length})
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardContent className="p-0">
              {docsLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm font-medium">No documents yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload documents to start querying
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Pages</TableHead>
                      <TableHead className="text-right">Chunks</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium text-sm">
                              {doc.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {doc.docType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {doc.sourceSystem}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {doc.pageCount ?? "—"}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {doc.chunkCount ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(doc.updatedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {engagement.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">
                            {member.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {member.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
