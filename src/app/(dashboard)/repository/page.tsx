"use client";

import { useState } from "react";
import { FolderOpen, Upload, Search, Share2, TableProperties, MoreHorizontal, FileText, Users } from "lucide-react";
import { useModeContext } from "@/contexts/ModeContext";
import { useEngagements } from "@/hooks/useEngagements";
import type { RepositoryCollection, RepositoryExtract } from "@/types/repository";
import type { Engagement } from "@/types/engagement";
import { cn } from "@/lib/utils";

function engagementToCollection(e: Engagement): RepositoryCollection {
  return {
    id: e.id,
    name: e.name,
    description: e.description ?? "",
    documentCount: e.stats?.documentCount ?? 0,
    totalSizeMb: 0,
    lastUpdated: e.updatedAt,
    mode: (e.mode ?? "audit") as RepositoryCollection["mode"],
    tags: e.framework ? [e.framework] : [],
    shared: (e.members?.length ?? 0) > 1,
  };
}

function formatSize(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CollectionCard({ collection }: { collection: RepositoryCollection }) {
  return (
    <div className="group rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{collection.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{collection.description}</p>
          </div>
        </div>
        <button className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {collection.documentCount.toLocaleString()} docs
        </span>
        <span>{formatSize(collection.totalSizeMb)}</span>
        {collection.shared && (
          <span className="flex items-center gap-1 text-blue-600">
            <Users className="h-3 w-3" />
            Shared
          </span>
        )}
        <span className="ml-auto">Updated {formatDate(collection.lastUpdated)}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {collection.tags.map((tag) => (
          <span key={tag} className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RepositoryPage() {
  const { mode, config } = useModeContext();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"collections" | "extracts">("collections");
  const { engagements, loading: engagementsLoading } = useEngagements();

  const collections = engagements.filter((e) => !e.mode || e.mode === mode).map(engagementToCollection);
  const extracts: RepositoryExtract[] = [];

  const filteredCollections = collections.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-normal text-foreground">Repository</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Securely store, organize, and analyze your {config.terminology.documentPlural.toLowerCase()}.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors">
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex items-center gap-1">
          {(["collections", "extracts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors capitalize",
                activeTab === tab
                  ? "bg-foreground/5 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "collections" ? "Collections" : "Extracts"}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-border">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${activeTab}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {activeTab === "collections" && (
          <>
            {!engagementsLoading && (
              <p className="mb-3 text-xs text-muted-foreground">
                {filteredCollections.length} collection{filteredCollections.length !== 1 ? "s" : ""}
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {engagementsLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-md bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 w-1/2 rounded bg-muted" />
                          <div className="h-3 w-3/4 rounded bg-muted" />
                        </div>
                      </div>
                      <div className="mt-3 flex gap-4">
                        <div className="h-3 w-16 rounded bg-muted" />
                        <div className="h-3 w-12 rounded bg-muted" />
                      </div>
                    </div>
                  ))
                : filteredCollections.map((col) => (
                    <CollectionCard key={col.id} collection={col} />
                  ))}
              {!engagementsLoading && filteredCollections.length === 0 && (
                <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
                  No collections found.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "extracts" && (
          <>
            <p className="mb-3 text-xs text-muted-foreground">
              {extracts.length} extract{extracts.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              {extracts.map((extract) => (
                <div
                  key={extract.id}
                  className="rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                        <TableProperties className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{extract.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {extract.rows.length} rows · {extract.columns.length} columns · Created {formatDate(extract.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                        <Share2 className="h-3 w-3" />
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Preview table */}
                  <div className="mt-3 overflow-x-auto rounded-md border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          {extract.columns.slice(0, 4).map((col) => (
                            <th key={col} className="px-3 py-2 text-left font-medium text-muted-foreground">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {extract.rows.slice(0, 3).map((row) => (
                          <tr key={row.id} className="border-b border-border last:border-0">
                            <td className="px-3 py-2 text-foreground truncate max-w-[160px]">{row.documentTitle}</td>
                            <td className="px-3 py-2 text-muted-foreground">p.{row.pageNumber}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.extractedField}</td>
                            <td className="px-3 py-2 text-foreground truncate max-w-[200px]">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {extracts.length === 0 && (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  No extracts yet. Run an extract from a collection to get started.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
