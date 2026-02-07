"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Shield,
  FileSearch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrambleHover } from "@/components/fancy/scramble-hover";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Chat", href: "/chat", icon: MessageSquare },
];

const auditNav: NavItem[] = [
  { label: "Engagements", href: "/engagements", icon: Briefcase },
];

const adminNav: NavItem[] = [
  { label: "Audit Trail", href: "/admin/audit-trail", icon: FileSearch },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <ScrambleHover className="truncate" scrambleSpeed={30} maxIterations={8}>
            {item.label}
          </ScrambleHover>
        )}
      </Link>
    );
  };

  const renderSection = (label: string, items: NavItem[]) => (
    <div className="space-y-1">
      {!collapsed && (
        <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          {label}
        </p>
      )}
      {items.map(renderNavItem)}
    </div>
  );

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <Shield className="h-6 w-6 shrink-0 text-blue-400" />
        {!collapsed && (
          <span className="font-heading text-sm font-bold text-sidebar-foreground">
            Audit Assistant
          </span>
        )}
      </div>

      <Separator className="bg-sidebar-border" />

      <nav className="flex-1 space-y-4 overflow-y-auto p-3 scrollbar-thin">
        {renderSection("Main", mainNav)}
        {renderSection("Audit", auditNav)}
        {renderSection("Admin", adminNav)}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
