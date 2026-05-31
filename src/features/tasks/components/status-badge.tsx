"use client";

import type { TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  IN_PROGRESS: { label: "In Progress", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  DONE: { label: "Done", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  CANCEL: { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

type StatusBadgeProps = {
  status: TaskStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
