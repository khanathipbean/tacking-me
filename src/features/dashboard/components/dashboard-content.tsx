"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight, List, Grid3X3 } from "lucide-react";
import { dashboardService, type DashboardData } from "@/services/dashboard-service";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "./summary-cards";
import {
  DashboardFilters,
  defaultDashboardFilters,
  type DashboardFilterValues,
} from "./dashboard-filters";
import { CalendarMonthView } from "@/features/calendar/components/calendar-month-view";
import { CalendarListView } from "@/features/calendar/components/calendar-list-view";
import { TaskDetailDialog } from "@/features/calendar/components/task-detail-dialog";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardError } from "./dashboard-error";

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilterValues>(defaultDashboardFilters);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "list">("month");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = useMemo(() => {
    if (!data) return [];

    let tasks: Task[] = data.tasks;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(search));
    }
    if (filters.projectId) {
      tasks = tasks.filter((t) => t.project_id === filters.projectId);
    }
    if (filters.categoryId) {
      tasks = tasks.filter((t) => t.category_id === filters.categoryId);
    }
    if (filters.status) {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    if (filters.priority) {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }
    if (filters.startDate) {
      tasks = tasks.filter((t) => t.end_date && t.end_date >= filters.startDate);
    }
    if (filters.endDate) {
      tasks = tasks.filter((t) => t.start_date && t.start_date <= filters.endDate);
    }

    return tasks;
  }, [data, filters]);

  // Tasks with dates for calendar
  const calendarTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.start_date || t.end_date);
  }, [filteredTasks]);

  // Recompute summary based on filtered tasks
  const filteredSummary = useMemo(() => {
    if (!data) return undefined;

    const today = new Date().toISOString().split("T")[0];
    const hasFilters =
      filters.search ||
      filters.projectId ||
      filters.categoryId ||
      filters.status ||
      filters.priority ||
      filters.startDate ||
      filters.endDate;

    if (!hasFilters) return data.summary;

    return {
      totalProjects: data.projects.length,
      totalTasks: filteredTasks.length,
      draftTasks: filteredTasks.filter((t) => t.status === "DRAFT").length,
      inProgressTasks: filteredTasks.filter((t) => t.status === "IN_PROGRESS").length,
      doneTasks: filteredTasks.filter((t) => t.status === "DONE").length,
      cancelTasks: filteredTasks.filter((t) => t.status === "CANCEL").length,
      highPriorityTasks: filteredTasks.filter(
        (t) =>
          (t.priority === "HIGH" || t.priority === "URGENT") &&
          t.status !== "DONE" &&
          t.status !== "CANCEL"
      ).length,
      overdueTasks: filteredTasks.filter(
        (t) =>
          t.end_date &&
          t.end_date < today &&
          t.status !== "DONE" &&
          t.status !== "CANCEL"
      ).length,
    };
  }, [data, filteredTasks, filters]);

  // Maps for dialog
  const projectMap = useMemo(() => {
    if (!data) return new Map<string, string>();
    const map = new Map<string, string>();
    data.projects.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [data]);

  const categoryMap = useMemo(() => {
    if (!data) return new Map<string, string>();
    const map = new Map<string, string>();
    data.categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [data]);

  function handleSelectTask(task: Task) {
    setSelectedTask(task);
    setDialogOpen(true);
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <DashboardError
        error={error ?? "Failed to load data"}
        onRetry={fetchData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {filteredSummary && <SummaryCards summary={filteredSummary} />}

      {/* Filters */}
      <DashboardFilters
        filters={filters}
        onChange={setFilters}
        projects={data.projects}
        categories={data.categories}
      />

      {/* Calendar Section */}
      <div className="space-y-4">
        {/* Calendar Navigation & View Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="min-w-[160px] text-center text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="ml-2">
              Today
            </Button>
          </div>

          <div className="flex items-center gap-1 rounded-md border p-0.5">
            <Button
              variant={calendarView === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCalendarView("month")}
              className="h-7"
            >
              <Grid3X3 className="mr-1 h-3 w-3" />
              Month
            </Button>
            <Button
              variant={calendarView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCalendarView("list")}
              className="h-7"
            >
              <List className="mr-1 h-3 w-3" />
              List
            </Button>
          </div>
        </div>

        {/* Month View */}
        {calendarView === "month" ? (
          <div className="hidden sm:block">
            <CalendarMonthView
              currentDate={currentDate}
              tasks={calendarTasks}
              onSelectTask={handleSelectTask}
            />
          </div>
        ) : null}

        {/* List view - shown on mobile always, or when list is selected */}
        {calendarView === "list" || calendarView === "month" ? (
          <div className={calendarView === "month" ? "block sm:hidden" : ""}>
            <CalendarListView
              currentDate={currentDate}
              tasks={calendarTasks}
              onSelectTask={handleSelectTask}
            />
          </div>
        ) : null}
      </div>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectMap={projectMap}
        categoryMap={categoryMap}
      />
    </div>
  );
}
