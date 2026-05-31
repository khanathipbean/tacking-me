"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarNavItems, siteConfig } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LogoutButton } from "@/features/auth";
import { useAuth } from "@/providers/auth-provider";
import { useSidebar } from "@/providers/sidebar-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 border-r bg-sidebar/80 backdrop-blur-sm transition-all duration-300 relative",
        collapsed ? "md:w-16" : "md:w-64"
      )}
    >
      {/* Toggle button on border-right */}
      <button
        onClick={toggle}
        className="absolute top-1/2 -right-3 z-50 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeft className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
      </button>

      <div className="flex h-14 items-center border-b px-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <span className="text-sm font-bold">T</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg tracking-tight truncate">{siteConfig.name}</span>
          )}
        </Link>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger
                    render={
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground/70"
                        )}
                      />
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User section */}
      <div className={cn("flex items-center p-3", collapsed ? "justify-center" : "justify-between")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium cursor-default">
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </TooltipTrigger>
            <TooltipContent side="right">{user?.email ?? "User"}</TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {user?.email?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <span className="truncate text-sm text-muted-foreground">
                {user?.email ?? ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <LogoutButton showText={false} />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
