"use client";

import { useState } from "react";
import {
  BookOpen,
  Upload,
  Trash2,
  Search,
  FileText,
  Globe,
  ShieldCheck,
  Scale,
  BookMarked,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { useGlobalDocuments } from "@/hooks/useGlobalDocuments";
import { formatDateTime } from "@/lib/utils";
import type { AuditDocument } from "@/types/document";

const DOC_TYPE_OPTIONS = [
  { value: "framework", label: "Framework" },
  { value: "regulation", label: "Regulation" },
  { value: "standard", label: "Standard" },
  { value: "guidance", label: "Guidance" },
  { value: "policy", label: "Policy" },
];

const typeIcon: Record<string, React.ElementType> = {
  framework: BookOpen,
  regulation: Scale,
  standard: ShieldCheck,
  guidance: BookMarked,
  policy: FileText,
};

const typeColor: Record<string, string> = {
  framework: "text-blue-600",
  regulation: "text-purple-600",
  standard: "text-emerald-600",
  guidance: "text-amber-600",
  policy: "text-sky-600",
};

function DocTypeBadge({ docType }: { docType: string }) {
  const Icon = typeIcon[docType] ?? FileText;
  const color = typeColor[docType] ?? "text-muted-foreground";
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="h-3 w-3" />
      {docType.charAt(0).toUpperCase() + docType.slice(1)}
    </span>
  );
}

export default function KnowledgeBasePage() {
  const { documents, loading, error, uploadGlobal, removeGlobal } = useGlobalDocuments();
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AuditDocument | null>(null);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [form, setForm] = useState({ title: "", docType: "framework", framework: "", sourceUri: "" });

  const filtered = documents.filter(
    (d) =>
      search === "" ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.framework?.toLowerCase().includes(search.toLowerCase())
  );

  // KPI counts
  const byType = (type: string) => documents.filter((d) => d.docType === type).length;

  async function handleUpload() {
    if (!form.title.trim()) return;
    setUploading(true);
    try {
      await uploadGlobal({
        title: form.title,
        docType: form.docType,
        framework: form.framework || undefined,
        sourceUri: form.sourceUri || undefined,
        sourceSystem: "admin-upload",
      });
      setShowUpload(false);
      setForm({ title: "", docType: "framework", framework: "", sourceUri: "" });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await removeGlobal(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <VerticalCutReveal splitBy="words" staggerDuration={0.05}>
              Knowledge Base
            </VerticalCutReveal>
          </h1>
          <p className="text-muted-foreground mt-1">
            External knowledge sources shared across all engagements
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sources</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-7 w-12" /> : <BasicNumberTicker value={documents.length} />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Shared externally</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Standards</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-7 w-12" /> : <BasicNumberTicker value={byType("standard") + byType("framework")} />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ISO, COBIT, NIST…</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Regulations</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-7 w-12" /> : <BasicNumberTicker value={byType("regulation")} />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">GDPR, SOX, PDP…</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Guidance</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-7 w-12" /> : <BasicNumberTicker value={byType("guidance")} />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Best practices</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sources…"
          className="pl-9"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Framework / Name</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell />
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    {search ? "No sources match your search" : "No external sources yet — add one to get started"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium text-sm">{doc.title}</TableCell>
                    <TableCell><DocTypeBadge docType={doc.docType} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{doc.framework ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDateTime(doc.updatedAt)}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => setDeleteTarget(doc)}
                        className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add External Source</DialogTitle>
            <DialogDescription>
              Add a public standard, regulation, or guidance document to the shared knowledge base.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="e.g. ISO 27001:2022"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <Select value={form.docType} onValueChange={(v) => setForm((f) => ({ ...f, docType: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Framework / Name</label>
              <Input
                placeholder="e.g. ISO 27001"
                value={form.framework}
                onChange={(e) => setForm((f) => ({ ...f, framework: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source URL <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input
                placeholder="https://iso.org/…"
                value={form.sourceUri}
                onChange={(e) => setForm((f) => ({ ...f, sourceUri: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpload} disabled={!form.title.trim() || uploading}>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Adding…" : "Add Source"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Source</DialogTitle>
            <DialogDescription>
              Remove <span className="font-medium">{deleteTarget?.title}</span> from the global knowledge base?
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
