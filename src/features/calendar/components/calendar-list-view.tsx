"use client";

import { useMemo } from "react";
import {
  format,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isWithinInterval,
  parseISO,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Task } from "@/types";

type CalendarListViewProps = {
  currentDate: Date;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
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

function getTasksForDate(tasks: Task[], date: Date): Task[] {
  return tasks.filter((task) => {
    if (task.start_date && isSameDay(parseISO(task.start_date), date)) return true;
    if (task.end_date && isSameDay(parseISO(task.end_date), date)) return true;
    if (task.start_date && task.end_date) {
      const start = parseISO(task.start_date);
      const end = parseISO(task.end_date);
      if (isWithinInterval(date, { start, end })) return true;
    }
    return false;
  });
}

export function CalendarListView({
  currentDate,
  tasks,
  onSelectTask,
}: CalendarListViewProps) {
  // Show current month days that have tasks
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const daysWithTasks = useMemo(() => {
    return days
      .map((day) => ({
        date: day,
        tasks: getTasksForDate(tasks, day),
      }))
      .filter((d) => d.tasks.length > 0);
  }, [days, tasks]);

  if (daysWithTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <CalendarIcon className="h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-3 text-sm font-medium">No tasks this month</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Tasks with dates will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {daysWithTasks.map(({ date, tasks: dayTasks }) => {
        const today = isToday(date);
        return (
          <div key={date.toISOString()} className="rounded-lg border bg-card overflow-hidden">
            {/* Day header */}
            <div
              className={`flex items-center gap-2 border-b px-3 py-2 ${
                today ? "bg-primary/10" : "bg-muted/50"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                  today ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {format(date, "d")}
              </span>
              <div>
                <span className="text-sm font-medium">{format(date, "EEEE")}</span>
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {format(date, "MMM yyyy")}
                </span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">
                {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Tasks */}
            <div className="divide-y">
              {dayTasks.map((task) => (
                <button
                  key={`${task.id}-${date.toISOString()}`}
                  onClick={() => onSelectTask(task)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                        priorityStyles[task.priority] ?? ""
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                        statusStyles[task.status] ?? ""
                      }`}
                    >
                      {statusLabels[task.status] ?? task.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
