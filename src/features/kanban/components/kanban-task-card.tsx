"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar } from "lucide-react";
import type { Task } from "@/types";
import { formatDate } from "@/lib/dates";

type KanbanTaskCardProps = {
  task: Task;
  projectName?: string;
  categoryName?: string;
  isDragging?: boolean;
};

const priorityStyles: Record<string, string> = {
  LOW: "border-l-slate-400",
  MEDIUM: "border-l-blue-500",
  HIGH: "border-l-orange-500",
  URGENT: "border-l-red-500",
};

const priorityBadgeStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function KanbanTaskCard({
  task,
  projectName,
  categoryName,
  isDragging,
}: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border border-l-4 bg-card p-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        priorityStyles[task.priority] ?? "border-l-gray-300"
      } ${dragging ? "opacity-50 shadow-lg ring-2 ring-primary/30" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
          aria-label="Drag handle"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-sm font-medium leading-tight line-clamp-2">
            {task.title}
          </p>

          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                priorityBadgeStyles[task.priority] ?? ""
              }`}
            >
              {task.priority}
            </span>

            {projectName && (
              <span className="inline-flex rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {projectName}
              </span>
            )}

            {categoryName && (
              <span className="inline-flex rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {categoryName}
              </span>
            )}
          </div>

          {(task.start_date || task.end_date) && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {task.start_date && <span>{formatDate(task.start_date)}</span>}
              {task.start_date && task.end_date && <span>→</span>}
              {task.end_date && <span>{formatDate(task.end_date)}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Overlay version for drag overlay (no sortable hooks)
export function KanbanTaskCardOverlay({
  task,
  projectName,
}: Omit<KanbanTaskCardProps, "isDragging">) {
  return (
    <div
      className={`rounded-lg border border-l-4 bg-card p-3 shadow-xl ring-2 ring-primary/20 ${
        priorityStyles[task.priority] ?? "border-l-gray-300"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-sm font-medium leading-tight line-clamp-2">
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                priorityBadgeStyles[task.priority] ?? ""
              }`}
            >
              {task.priority}
            </span>

            {projectName && (
              <span className="inline-flex rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {projectName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
