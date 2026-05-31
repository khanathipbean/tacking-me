"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ChevronRight, FolderKanban, Tag, ArrowLeft } from "lucide-react";
import type { Task, Project, Category } from "@/types";
import { taskService } from "@/services/task-service";
import { projectService } from "@/services/project-service";
import { categoryService } from "@/services/category-service";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskTable } from "./task-table";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskDeleteDialog } from "./task-delete-dialog";

type ViewState =
  | { level: "projects" }
  | { level: "categories"; project: Project }
  | { level: "tasks"; project: Project; category: Category | null };

export function TaskList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [view, setView] = useState<ViewState>({ level: "projects" });
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const fetchMeta = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsData, categoriesData] = await Promise.all([
        projectService.getAll(),
        categoryService.getAll(),
      ]);
      setProjects(projectsData);
      setCategories(categoriesData);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  const fetchTasks = useCallback(async (projectId: string, categoryId?: string) => {
    try {
      setTasksLoading(true);
      const data = await taskService.getAll({
        projectId,
        categoryId: categoryId || undefined,
      });
      setTasks(data);
    } catch {
      // handled
    } finally {
      setTasksLoading(false);
    }
  }, []);

  function handleSelectProject(project: Project) {
    const projectCategories = categories.filter((c) => c.project_id === project.id);
    if (projectCategories.length === 0) {
      // No categories, go directly to tasks
      setView({ level: "tasks", project, category: null });
      fetchTasks(project.id);
    } else {
      setView({ level: "categories", project });
    }
  }

  function handleSelectCategory(category: Category) {
    if (view.level === "categories") {
      setView({ level: "tasks", project: view.project, category });
      fetchTasks(view.project.id, category.id);
    }
  }

  function handleBack() {
    if (view.level === "tasks") {
      const projectCategories = categories.filter(
        (c) => c.project_id === view.project.id
      );
      if (projectCategories.length === 0) {
        setView({ level: "projects" });
      } else {
        setView({ level: "categories", project: view.project });
      }
      setTasks([]);
    } else if (view.level === "categories") {
      setView({ level: "projects" });
    }
  }

  function handleCreate() {
    setEditTask(null);
    setFormOpen(true);
  }

  function handleEdit(task: Task) {
    setEditTask(task);
    setFormOpen(true);
  }

  function handleSuccess() {
    if (view.level === "tasks") {
      fetchTasks(view.project.id, view.category?.id);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="space-y-2">
        <PageHeader
          heading="Tasks"
          description={
            view.level === "projects"
              ? "Select a project to view tasks"
              : view.level === "categories"
              ? `Select a category in ${view.project.name}`
              : view.category
              ? `${view.project.name} / ${view.category.name}`
              : view.project.name
          }
        >
          {view.level === "tasks" && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          )}
        </PageHeader>

        {/* Breadcrumb navigation */}
        {view.level !== "projects" && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        )}
      </div>

      {/* Project cards */}
      {view.level === "projects" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projectTaskCount = categories
              .filter((c) => c.project_id === project.id).length;
            return (
              <button
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className="group relative flex flex-col items-start rounded-xl border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <FolderKanban className="h-5 w-5" style={{ color: project.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {projectTaskCount} {projectTaskCount === 1 ? "category" : "categories"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                {project.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Category cards */}
      {view.level === "categories" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((c) => c.project_id === view.project.id)
            .map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                className="group relative flex flex-col items-start rounded-xl border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </button>
            ))}

          {/* "All tasks" card for uncategorized */}
          <button
            onClick={() => {
              setView({ level: "tasks", project: view.project, category: null });
              fetchTasks(view.project.id);
            }}
            className="group relative flex flex-col items-start rounded-xl border border-dashed bg-card p-5 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FolderKanban className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">All Tasks</h3>
                  <p className="text-xs text-muted-foreground">View all tasks in this project</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </button>
        </div>
      )}

      {/* Task table */}
      {view.level === "tasks" && (
        <>
          {tasksLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : tasks.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed text-center">
              <p className="text-sm text-muted-foreground">No tasks found</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleCreate}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Create Task
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border bg-card shadow-sm">
              <TaskTable
                tasks={tasks}
                projects={projects}
                categories={categories}
                onEdit={handleEdit}
                onDelete={setDeleteTask}
              />
            </div>
          )}
        </>
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editTask}
        onSuccess={handleSuccess}
      />

      {deleteTask && (
        <TaskDeleteDialog
          open={!!deleteTask}
          onOpenChange={(open) => !open && setDeleteTask(null)}
          taskId={deleteTask.id}
          taskTitle={deleteTask.title}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
