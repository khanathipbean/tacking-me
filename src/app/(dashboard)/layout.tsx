import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { DashboardContent } from "@/components/layout/dashboard-content";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-full min-h-screen bg-muted/30">
        <Sidebar />
        <DashboardContent>
          <Header />
          <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
        </DashboardContent>
      </div>
    </SidebarProvider>
  );
}
