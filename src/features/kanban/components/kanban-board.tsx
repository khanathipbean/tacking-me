"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import type { Task, TaskStatus, Project, Category } from "@/types";
import { taskService } from "@/services/task-service";
import { projectService } from "@/services/project-service";
import { categoryService } from "@/services/category-service";
import { KANBAN_COLUMNS, defaultKanbanFilters, type KanbanFilterValues } from "../types";
import { KanbanColumn } from "./kanban-column";
import { KanbanTaskCardOverlay } from "./kanban-task-card";
import { KanbanFilters } from "./kanban-filters";
import { KanbanSkeleton } from "./kanban-skeleton";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<KanbanFilterValues>(defaultKanbanFilters);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Sensors with activation constraints to prevent accidental drags
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // Fetch data
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

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

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
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    return result;
  }, [tasks, filters]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      DRAFT: [],
      IN_PROGRESS: [],
      DONE: [],
      CANCEL: [],
    };
    filteredTasks.forEach((task) => {
      map[task.status].push(task);
    });
    return map;
  }, [filteredTasks]);

  // DnD handlers
  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleDragOver(_event: DragOverEvent) {
    // Actual move handled in dragEnd
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Determine target column
    let targetStatus: TaskStatus | null = null;

    // Check if dropped over a column directly
    const isColumn = KANBAN_COLUMNS.some((col) => col.id === over.id);
    if (isColumn) {
      targetStatus = over.id as TaskStatus;
    } else {
      // Dropped over another task - find that task's column
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (!targetStatus || targetStatus === task.status) return;

    // Optimistic update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      await taskService.update(taskId, { status: targetStatus });
      toast.success(`Task moved to ${KANBAN_COLUMNS.find((c) => c.id === targetStatus)?.title}`);
    } catch (err) {
      // Rollback
      setTasks(previousTasks);
      const message = err instanceof Error ? err.message : "Failed to update task status";
      toast.error(`${message}. Changes reverted.`);
    }
  }

  if (loading) {
    return <KanbanSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-lg font-medium">Something went wrong</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <KanbanFilters
        filters={filters}
        onChange={setFilters}
        projects={projects}
        categories={categories}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 300px)" }}>
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id]}
              projectMap={projectMap}
              categoryMap={categoryMap}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <KanbanTaskCardOverlay
              task={activeTask}
              projectName={projectMap.get(activeTask.project_id)}
              categoryName={activeTask.category_id ? categoryMap.get(activeTask.category_id) : undefined}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
