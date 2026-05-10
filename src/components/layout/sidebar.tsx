"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  BookOpen,
  Briefcase,
  FileSearch,
  Users,
  Activity,
  Brain,
  CheckSquare,
  Plus,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { useModeContext } from "@/contexts/ModeContext";
import { ModeSelector } from "./mode-selector";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const platformNav: NavItem[] = [
  { label: "Counsel", href: "/chat", icon: MessageSquare },
  { label: "Repository", href: "/repository", icon: FolderOpen },
  { label: "Playbooks", href: "/playbooks", icon: BookOpen },
];

const adminNav: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Knowledge Base", href: "/admin/knowledge-base", icon: BookOpen },
  { label: "Audit Trail", href: "/admin/audit-trail", icon: FileSearch },
  { label: "System Health", href: "/admin/health", icon: Activity },
  { label: "AI Governance", href: "/admin/governance", icon: Brain },
  { label: "Approvals", href: "/admin/approvals", icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { config } = useModeContext();
  const isAdmin = session?.user?.role === "ADMIN";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-sidebar-border bg-sidebar">
      {/* User block */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">
          {session?.user?.name ? getInitials(session.user.name) : <Shield className="h-3.5 w-3.5" />}
        </div>
        <span className="truncate text-sm font-medium text-sidebar-foreground">
          {session?.user?.name || "Audit Assistant"}
        </span>
      </div>

      {/* Mode selector */}
      <div className="px-3 pb-2">
        <ModeSelector />
      </div>

      {/* New Chat button */}
      <div className="px-3 pb-3">
        <Link href="/chat">
          <button className="flex w-full items-center justify-center gap-2 rounded-md border border-sidebar-border bg-white px-3 py-1.5 text-sm font-medium text-sidebar-foreground shadow-sm hover:bg-sidebar-accent/40 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            New Chat
          </button>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 scrollbar-thin space-y-0.5">
        {platformNav.map(renderNavItem)}

        <div className="my-3 border-t border-sidebar-border" />

        {renderNavItem({
          label: config.terminology.topLevelEntityPlural,
          href: "/engagements",
          icon: Briefcase,
        })}
        {renderNavItem({
          label: "Dashboard",
          href: "/",
          icon: LayoutDashboard,
        })}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-sidebar-border" />
            <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/35">
              Admin
            </p>
            {adminNav.map(renderNavItem)}
          </>
        )}
      </nav>
    </aside>
  );
}
