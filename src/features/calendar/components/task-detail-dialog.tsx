"use client";

import type { Task } from "@/types";
import { formatDate } from "@/lib/dates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, FolderKanban, Tag, Flag, Activity } from "lucide-react";

type TaskDetailDialogProps = {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectMap: Map<string, string>;
  categoryMap: Map<string, string>;
};

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  CANCEL: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCEL: "Cancel",
};

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  projectMap,
  categoryMap,
}: TaskDetailDialogProps) {
  if (!task) return null;

  const projectName = projectMap.get(task.project_id);
  const categoryName = task.category_id ? categoryMap.get(task.category_id) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          {task.description && (
            <DialogDescription>{task.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-3">
          {/* Status & Priority */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-muted-foreground" />
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  statusStyles[task.status] ?? ""
                }`}
              >
                {statusLabels[task.status] ?? task.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-muted-foreground" />
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  priorityStyles[task.priority] ?? ""
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          {/* Project & Category */}
          <div className="space-y-2">
            {projectName && (
              <div className="flex items-center gap-2 text-sm">
                <FolderKanban className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Project:</span>
                <span className="font-medium">{projectName}</span>
              </div>
            )}
            {categoryName && (
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{categoryName}</span>
              </div>
            )}
          </div>

          {/* Dates */}
          {(task.start_date || task.end_date) && (
            <div className="space-y-1.5 rounded-md border bg-muted/30 p-3">
              {task.start_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Start:</span>
                  <span className="font-medium">{formatDate(task.start_date)}</span>
                </div>
              )}
              {task.end_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">End:</span>
                  <span className="font-medium">{formatDate(task.end_date)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
