"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight, List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task, Project, Category } from "@/types";
import { taskService } from "@/services/task-service";
import { projectService } from "@/services/project-service";
import { categoryService } from "@/services/category-service";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarListView } from "./calendar-list-view";
import { CalendarFilters } from "./calendar-filters";
import { TaskDetailDialog } from "./task-detail-dialog";
import { CalendarSkeleton } from "./calendar-skeleton";
import type { CalendarView, CalendarFilterValues } from "../types";
import { defaultCalendarFilters } from "../types";

export function CalendarContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [filters, setFilters] = useState<CalendarFilterValues>(defaultCalendarFilters);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, projectsData, categoriesData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        categoryService.getAll(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Maps for lookup
  const projectMap = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [projects]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  // Filter tasks (only those with dates)
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => t.start_date || t.end_date);

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(search));
    }
    if (filters.projectId) {
      result = result.filter((t) => t.project_id === filters.projectId);
    }
    if (filters.categoryId) {
      result = result.filter((t) => t.category_id === filters.categoryId);
    }
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    return result;
  }, [tasks, filters]);

  function handleSelectTask(task: Task) {
    setSelectedTask(task);
    setDialogOpen(true);
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  if (loading) {
    return <CalendarSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-lg font-medium">Something went wrong</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchData} className="mt-4">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Navigation & View Toggle */}
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
          <Button variant="ghost" size="sm" onClick={goToToday} className="ml-2">
            Today
          </Button>
        </div>

        <div className="flex items-center gap-1 rounded-md border p-0.5">
          <Button
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("month")}
            className="h-7"
          >
            <Grid3X3 className="mr-1 h-3 w-3" />
            Month
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            className="h-7"
          >
            <List className="mr-1 h-3 w-3" />
            List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CalendarFilters
        filters={filters}
        onChange={setFilters}
        projects={projects}
        categories={categories}
      />

      {/* Calendar View */}
      {view === "month" ? (
        <div className="hidden sm:block">
          <CalendarMonthView
            currentDate={currentDate}
            tasks={filteredTasks}
            onSelectTask={handleSelectTask}
          />
        </div>
      ) : null}

      {/* List view - shown on mobile always, or when list is selected */}
      {view === "list" || view === "month" ? (
        <div className={view === "month" ? "block sm:hidden" : ""}>
          <CalendarListView
            currentDate={currentDate}
            tasks={filteredTasks}
            onSelectTask={handleSelectTask}
          />
        </div>
      ) : null}

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
