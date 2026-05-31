"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "@/types";
import type { KanbanColumn as KanbanColumnType } from "../types";
import { KanbanTaskCard } from "./kanban-task-card";

type KanbanColumnProps = {
  column: KanbanColumnType;
  tasks: Task[];
  projectMap: Map<string, string>;
  categoryMap: Map<string, string>;
};

export function KanbanColumn({
  column,
  tasks,
  projectMap,
  categoryMap,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      className={`flex h-full min-w-[300px] flex-col rounded-xl border bg-muted/20 shadow-sm transition-all duration-200 ${
        isOver ? "border-primary/50 bg-primary/5 shadow-md" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-2.5 overflow-y-auto p-3"
        style={{ minHeight: "100px" }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
              No tasks
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                projectName={projectMap.get(task.project_id)}
                categoryName={task.category_id ? categoryMap.get(task.category_id) : undefined}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
