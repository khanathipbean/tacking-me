"use client";

import { useSidebar } from "@/providers/sidebar-provider";
import { AuthGuard } from "@/components/shared/auth-guard";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <AuthGuard>
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          collapsed ? "md:pl-16" : "md:pl-64"
        }`}
      >
        {children}
      </div>
    </AuthGuard>
  );
}
