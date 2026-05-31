"use client";

import { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameMonth,
  differenceInCalendarDays,
  max,
  min,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, X, Clock, Flag, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types";

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCEL: "Cancelled",
};

const statusBarColors: Record<string, string> = {
  DRAFT: "bg-blue-400/80 hover:bg-blue-500/80",
  IN_PROGRESS: "bg-amber-400/80 hover:bg-amber-500/80",
  DONE: "bg-green-400/80 hover:bg-green-500/80",
  CANCEL: "bg-gray-400/80 hover:bg-gray-500/80",
};

const priorityBarColors: Record<string, string> = {
  URGENT: "bg-red-400/80 hover:bg-red-500/80",
};

type BarSegment = {
  task: Task;
  startCol: number;
  span: number;
  row: number;
  isStart: boolean;
  isEnd: boolean;
};

type CalendarPreviewProps = {
  tasks: Task[];
};

export function CalendarPreview({ tasks }: CalendarPreviewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calendarStart.getTime(), calendarEnd.getTime()]
  );

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  const weekBars = useMemo(() => {
    return weeks.map((weekDays) => {
      const weekStart = weekDays[0];
      const weekEnd = weekDays[6];
      const segments: BarSegment[] = [];

      const overlapping = tasks.filter((task) => {
        const tStart = task.start_date ? parseISO(task.start_date) : null;
        const tEnd = task.end_date ? parseISO(task.end_date) : tStart;
        if (!tStart && !tEnd) return false;
        const start = tStart ?? tEnd!;
        const end = tEnd ?? tStart!;
        return start <= weekEnd && end >= weekStart;
      });

      overlapping.sort((a, b) => {
        const aStart = a.start_date ?? a.end_date ?? "";
        const bStart = b.start_date ?? b.end_date ?? "";
        if (aStart !== bStart) return aStart.localeCompare(bStart);
        const aDur = a.start_date && a.end_date ? differenceInCalendarDays(parseISO(a.end_date), parseISO(a.start_date)) : 0;
        const bDur = b.start_date && b.end_date ? differenceInCalendarDays(parseISO(b.end_date), parseISO(b.start_date)) : 0;
        return bDur - aDur;
      });

      const rowEnds: number[] = [];

      overlapping.forEach((task) => {
        const tStart = task.start_date ? parseISO(task.start_date) : parseISO(task.end_date!);
        const tEnd = task.end_date ? parseISO(task.end_date) : tStart;

        const clampedStart = max([tStart, weekStart]);
        const clampedEnd = min([tEnd, weekEnd]);

        const startCol = differenceInCalendarDays(clampedStart, weekStart);
        const span = differenceInCalendarDays(clampedEnd, clampedStart) + 1;

        let row = 0;
        while (row < rowEnds.length && rowEnds[row] > startCol) {
          row++;
        }
        if (row >= rowEnds.length) {
          rowEnds.push(startCol + span);
        } else {
          rowEnds[row] = startCol + span;
        }

        segments.push({
          task,
          startCol,
          span,
          row,
          isStart: tStart >= weekStart,
          isEnd: tEnd <= weekEnd,
        });
      });

      return segments;
    });
  }, [weeks, tasks]);

  const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7">
        {weekDayNames.map((day) => (
          <div
            key={day}
            className="p-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar weeks with bars */}
      <div>
        {weeks.map((weekDays, weekIndex) => {
          const bars = weekBars[weekIndex];
          const maxRow = bars.length > 0 ? Math.max(...bars.map((b) => b.row)) : -1;
          const maxVisible = 2;
          const visibleSlots = Math.min(maxRow + 1, maxVisible);
          const hiddenCount = bars.filter((b) => b.row >= maxVisible).length;
          const barsHeight = visibleSlots * 18;
          const rowHeight = Math.max(52, 28 + barsHeight + (hiddenCount > 0 ? 14 : 6));

          return (
            <div key={weekIndex} className="relative border-t">
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px">
                {weekDays.map((day, colIndex) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const today = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-1 transition-colors ${
                        !isCurrentMonth ? "opacity-30" : ""
                      } ${today ? "bg-primary/10 ring-1 ring-inset ring-primary/30 rounded-md" : ""}`}
                      style={{ height: `${rowHeight}px` }}
                    >
                      <div className="text-center">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                            today
                              ? "bg-primary font-bold text-primary-foreground"
                              : "font-medium text-foreground"
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                      </div>

                      {colIndex === 0 && hiddenCount > 0 && (
                        <div className="absolute bottom-0.5 left-1 text-[8px] text-muted-foreground">
                          +{hiddenCount} more
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bar overlay */}
              {visibleSlots > 0 && (
                <div
                  className="absolute inset-x-0 pointer-events-none"
                  style={{ top: "26px", height: `${barsHeight}px` }}
                >
                  {bars
                    .filter((b) => b.row < maxVisible)
                    .map((bar) => {
                      const leftPercent = (bar.startCol / 7) * 100;
                      const widthPercent = (bar.span / 7) * 100;
                      const topOffset = bar.row * 18;
                      const barColor =
                        bar.task.priority === "URGENT" && bar.task.status !== "DONE"
                          ? priorityBarColors.URGENT
                          : statusBarColors[bar.task.status] ?? statusBarColors.DRAFT;

                      return (
                        <button
                          key={`${bar.task.id}-w${weekIndex}`}
                          type="button"
                          onClick={() => setSelectedTask(bar.task)}
                          className={`pointer-events-auto absolute h-[14px] flex items-center px-1 text-[9px] font-medium text-white truncate cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-px ${barColor} ${
                            bar.isStart ? "rounded-l-full" : ""
                          } ${bar.isEnd ? "rounded-r-full" : ""}`}
                          style={{
                            left: `calc(${leftPercent}% + 3px)`,
                            width: `calc(${widthPercent}% - 6px)`,
                            top: `${topOffset}px`,
                          }}
                          title={`${bar.task.title}${bar.task.start_date ? `\n${bar.task.start_date}` : ""}${bar.task.end_date ? ` → ${bar.task.end_date}` : ""}`}
                        >
                          {bar.isStart && (
                            <span className="truncate">{bar.task.title}</span>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task detail panel */}
      {selectedTask && (
        <div className="mt-3 border-t pt-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-tight">{selectedTask.title}</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 shrink-0 p-0"
              onClick={() => setSelectedTask(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          {selectedTask.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{selectedTask.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3 text-muted-foreground" />
              <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${priorityStyles[selectedTask.priority] ?? ""}`}>
                {selectedTask.priority}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Flag className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                {statusLabels[selectedTask.status] ?? selectedTask.status}
              </span>
            </div>
          </div>
          {(selectedTask.start_date || selectedTask.end_date) && (
            <div className={`mt-2 flex items-center gap-1 text-[10px] ${
              selectedTask.end_date && selectedTask.end_date < new Date().toISOString().split("T")[0] && selectedTask.status !== "DONE" && selectedTask.status !== "CANCEL"
                ? "text-red-500 font-medium"
                : "text-muted-foreground"
            }`}>
              <Clock className="h-3 w-3" />
              <span>
                {selectedTask.start_date && format(parseISO(selectedTask.start_date), "MMM d")}
                {selectedTask.start_date && selectedTask.end_date && " → "}
                {selectedTask.end_date && format(parseISO(selectedTask.end_date), "MMM d, yyyy")}
                {selectedTask.end_date && selectedTask.end_date < new Date().toISOString().split("T")[0] && selectedTask.status !== "DONE" && selectedTask.status !== "CANCEL" && " (Overdue)"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      {!selectedTask && (
        <div className="mt-3 flex flex-wrap gap-3 border-t pt-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-green-400/80" />
            Done
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-amber-400/80" />
            In Progress
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-blue-400/80" />
            Draft
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-4 rounded-full bg-red-400/80" />
            Urgent
          </div>
        </div>
      )}
    </div>
  );
}
