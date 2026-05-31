import { PageHeader } from "@/components/shared/page-header";
import { DashboardContent } from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Dashboard"
        description="Overview of your projects and tasks"
      />
      <DashboardContent />
    </div>
  );
}
