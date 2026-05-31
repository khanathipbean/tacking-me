import { PageHeader } from "@/components/shared/page-header";
import { KanbanBoard } from "@/features/kanban";

export default function BoardPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        heading="Board"
        description="Drag and drop tasks between columns to update status"
      />
      <KanbanBoard />
    </div>
  );
}
