"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Shield,
  MoreHorizontal,
  UserCheck,
  UserX,
  Lock,
  Mail,
  Building,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { VerticalCutReveal } from "@/components/fancy/vertical-cut-reveal";
import { BasicNumberTicker } from "@/components/fancy/basic-number-ticker";
import { useUsers } from "@/hooks/useUsers";
import { cn, formatDateTime, getInitials } from "@/lib/utils";
import type { UserRole, UserStatus } from "@/types/admin";

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  admin: { label: "Admin", color: "text-rose-600" },
  audit_manager: { label: "Audit Manager", color: "text-blue-600" },
  auditor: { label: "Auditor", color: "text-emerald-600" },
  viewer: { label: "Viewer", color: "text-muted-foreground" },
};

const statusConfig: Record<UserStatus, { label: string; icon: React.ElementType; color: string }> = {
  active: { label: "Active", icon: UserCheck, color: "text-emerald-600" },
  inactive: { label: "Inactive", icon: UserX, color: "text-muted-foreground" },
  locked: { label: "Locked", icon: Lock, color: "text-rose-600" },
};

export default function UsersPage() {
  const { users, loading, updateRole, updateStatus } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          <VerticalCutReveal splitBy="words" staggerDuration={0.05}>
            User Management
          </VerticalCutReveal>
        </h1>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Invite a new user to the audit platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="email@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([value, cfg]) => (
                        <SelectItem key={value} value={value}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input placeholder="Department" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => setShowCreate(false)}>Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"><BasicNumberTicker value={users.length} delay={0.2} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              <BasicNumberTicker value={users.filter((u) => u.status === "active").length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Managers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              <BasicNumberTicker value={users.filter((u) => u.role === "audit_manager" || u.role === "admin").length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              <BasicNumberTicker value={users.filter((u) => u.status === "locked").length} delay={0.2} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "admin", "audit_manager", "auditor", "viewer"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                roleFilter === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {r === "all" ? "All" : roleConfig[r].label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Engagements</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => {
                const roleCfg = roleConfig[user.role];
                const stCfg = statusConfig[user.status];
                const StIcon = stCfg.icon;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", roleCfg.color)}>
                        {roleCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1 text-xs", stCfg.color)}>
                        <StIcon className="h-3 w-3" />
                        <span>{stCfg.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.department ?? "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {user.engagementCount}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Shield className="mr-2 h-3.5 w-3.5" />
                              Change Role
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {Object.entries(roleConfig).map(([value, cfg]) => (
                                <DropdownMenuItem
                                  key={value}
                                  onClick={() => updateRole(user.id, value as UserRole)}
                                  disabled={user.role === value}
                                >
                                  {cfg.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem onClick={() => updateStatus(user.id, "locked")}>
                              <Lock className="mr-2 h-3.5 w-3.5" />
                              Lock Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => updateStatus(user.id, "active")}>
                              <UserCheck className="mr-2 h-3.5 w-3.5" />
                              Activate Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
