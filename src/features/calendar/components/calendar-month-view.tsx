"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  differenceInCalendarDays,
  max,
  min,
  parseISO,
} from "date-fns";
import type { Task } from "@/types";

type CalendarMonthViewProps = {
  currentDate: Date;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
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
  startCol: number; // 0-based column within the week row
  span: number; // number of columns to span
  row: number; // vertical slot index within the cell
  isStart: boolean; // bar starts in this week
  isEnd: boolean; // bar ends in this week
};

export function CalendarMonthView({
  currentDate,
  tasks,
  onSelectTask,
}: CalendarMonthViewProps) {
  const [morePopup, setMorePopup] = useState<{ day: Date; tasks: Task[]; x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setMorePopup(null);
      }
    }
    if (morePopup) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [morePopup]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calendarStart.getTime(), calendarEnd.getTime()]
  );

  // Split days into week rows
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  // Compute bar segments for each week
  const weekBars = useMemo(() => {
    return weeks.map((weekDays) => {
      const weekStart = weekDays[0];
      const weekEnd = weekDays[6];
      const segments: BarSegment[] = [];

      // Find tasks that overlap this week
      const overlapping = tasks.filter((task) => {
        const tStart = task.start_date ? parseISO(task.start_date) : null;
        const tEnd = task.end_date ? parseISO(task.end_date) : tStart;
        if (!tStart && !tEnd) return false;
        const start = tStart ?? tEnd!;
        const end = tEnd ?? tStart!;
        return start <= weekEnd && end >= weekStart;
      });

      // Sort by start date then by duration (longer first)
      overlapping.sort((a, b) => {
        const aStart = a.start_date ?? a.end_date ?? "";
        const bStart = b.start_date ?? b.end_date ?? "";
        if (aStart !== bStart) return aStart.localeCompare(bStart);
        const aDur = a.start_date && a.end_date ? differenceInCalendarDays(parseISO(a.end_date), parseISO(a.start_date)) : 0;
        const bDur = b.start_date && b.end_date ? differenceInCalendarDays(parseISO(b.end_date), parseISO(b.start_date)) : 0;
        return bDur - aDur;
      });

      // Assign rows (slots) to avoid overlaps
      const rowEnds: number[] = []; // tracks the end column of each row

      overlapping.forEach((task) => {
        const tStart = task.start_date ? parseISO(task.start_date) : parseISO(task.end_date!);
        const tEnd = task.end_date ? parseISO(task.end_date) : tStart;

        const clampedStart = max([tStart, weekStart]);
        const clampedEnd = min([tEnd, weekEnd]);

        const startCol = differenceInCalendarDays(clampedStart, weekStart);
        const span = differenceInCalendarDays(clampedEnd, clampedStart) + 1;

        // Find first available row
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
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7">
        {weekDayNames.map((day) => (
          <div
            key={day}
            className="p-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar weeks */}
      <div>
        {weeks.map((weekDays, weekIndex) => {
          const bars = weekBars[weekIndex];
          const maxRow = bars.length > 0 ? Math.max(...bars.map((b) => b.row)) : -1;
          const barSlots = maxRow + 1;
          const maxVisible = 3;
          const visibleSlots = Math.min(barSlots, maxVisible);
          const hiddenCount = bars.filter((b) => b.row >= maxVisible).length;
          const barsHeight = visibleSlots * 22;
          // Consistent row height: at least 100px, or enough for date + bars + padding
          const rowHeight = Math.max(100, 36 + barsHeight + (hiddenCount > 0 ? 18 : 12));

          return (
            <div key={weekIndex} className="relative border-t">
              {/* Day cells grid */}
              <div className="grid grid-cols-7 gap-px">
                {weekDays.map((day, colIndex) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const today = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`relative p-2 transition-colors ${
                        !isCurrentMonth ? "opacity-30" : ""
                      } ${today ? "bg-primary/10 ring-1 ring-inset ring-primary/30 rounded-lg" : ""}`}
                      style={{ height: `${rowHeight}px` }}
                    >
                      {/* Date number */}
                      <div className="text-center">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                            today
                              ? "bg-primary font-bold text-primary-foreground"
                              : "font-medium text-foreground"
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                      </div>

                      {/* +N more indicator per day */}
                      {(() => {
                        const dayStr = format(day, "yyyy-MM-dd");
                        // Get tasks on this specific day that are hidden
                        const hiddenTasksForDay = bars
                          .filter((b) => {
                            if (b.row < maxVisible) return false;
                            const tStart = b.task.start_date ?? b.task.end_date!;
                            const tEnd = b.task.end_date ?? b.task.start_date!;
                            return dayStr >= tStart && dayStr <= tEnd;
                          })
                          .map((b) => b.task);
                        if (hiddenTasksForDay.length === 0) return null;
                        return (
                          <button
                            type="button"
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded px-1.5 py-0.5 text-[9px] font-medium text-primary hover:bg-primary/10 transition-colors"
                            onClick={(e) => {
                              const rect = (e.target as HTMLElement).getBoundingClientRect();
                              setMorePopup({ day, tasks: hiddenTasksForDay, x: rect.left, y: rect.bottom + 4 });
                            }}
                          >
                            +{hiddenTasksForDay.length} more
                          </button>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>

              {/* Bar overlay - positioned over the cells */}
              {visibleSlots > 0 && (
                <div
                  className="absolute inset-x-0 pointer-events-none"
                  style={{ top: "36px", height: `${barsHeight}px` }}
                >
                  {bars
                    .filter((b) => b.row < maxVisible)
                    .map((bar) => {
                      const leftPercent = (bar.startCol / 7) * 100;
                      const widthPercent = (bar.span / 7) * 100;
                      const topOffset = bar.row * 22;
                      const barColor =
                        bar.task.priority === "URGENT" && bar.task.status !== "DONE"
                          ? priorityBarColors.URGENT
                          : statusBarColors[bar.task.status] ?? statusBarColors.DRAFT;

                      return (
                        <button
                          key={`${bar.task.id}-w${weekIndex}`}
                          type="button"
                          onClick={() => onSelectTask(bar.task)}
                          className={`pointer-events-auto absolute h-[18px] flex items-center px-1.5 text-[10px] font-medium text-white truncate cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-px ${barColor} ${
                            bar.isStart ? "rounded-l-full" : ""
                          } ${bar.isEnd ? "rounded-r-full" : ""}`}
                          style={{
                            left: `calc(${leftPercent}% + 4px)`,
                            width: `calc(${widthPercent}% - 8px)`,
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

      {/* More popup */}
      {morePopup && (
        <div
          ref={popupRef}
          className="fixed z-50 min-w-[200px] max-w-[280px] rounded-lg border bg-card p-3 shadow-lg"
          style={{ left: `${morePopup.x}px`, top: `${morePopup.y}px` }}
        >
          <div className="mb-2 text-xs font-semibold text-foreground">
            {format(morePopup.day, "MMM d, yyyy")}
          </div>
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {morePopup.tasks.map((task) => {
              const barColor =
                task.priority === "URGENT" && task.status !== "DONE"
                  ? "bg-red-400"
                  : task.status === "DONE"
                  ? "bg-green-400"
                  : task.status === "IN_PROGRESS"
                  ? "bg-amber-400"
                  : "bg-blue-400";
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    setMorePopup(null);
                    onSelectTask(task);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                >
                  <div className={`h-2 w-2 shrink-0 rounded-full ${barColor}`} />
                  <span className="truncate font-medium">{task.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 border-t px-4 py-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-5 rounded-full bg-green-400/80" />
          Done
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-5 rounded-full bg-amber-400/80" />
          In Progress
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-5 rounded-full bg-blue-400/80" />
          Draft
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-5 rounded-full bg-red-400/80" />
          Urgent
        </div>
      </div>
    </div>
  );
}
