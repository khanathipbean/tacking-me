"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { taskSchema, type TaskFormValues } from "@/validations/task";
import { taskService } from "@/services/task-service";
import { projectService } from "@/services/project-service";
import { categoryService } from "@/services/category-service";
import { useAuth } from "@/providers/auth-provider";
import type { Task, Project, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultProjectId?: string;
  defaultCategoryId?: string;
  onSuccess: () => void;
};

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  defaultProjectId,
  defaultCategoryId,
  onSuccess,
}: TaskFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? null,
      priority: task?.priority ?? "MEDIUM",
      status: task?.status ?? "DRAFT",
      project_id: task?.project_id ?? defaultProjectId ?? "",
      category_id: task?.category_id ?? defaultCategoryId ?? null,
      start_date: task?.start_date ?? null,
      end_date: task?.end_date ?? null,
    },
  });

  const selectedProjectId = watch("project_id");

  useEffect(() => {
    projectService.getAll().then(setProjects).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      categoryService
        .getAll(selectedProjectId)
        .then(setCategories)
        .catch(() => {});
    } else {
      setCategories([]);
    }
  }, [selectedProjectId]);

  // Reset form when task changes
  useEffect(() => {
    if (open) {
      reset({
        title: task?.title ?? "",
        description: task?.description ?? null,
        priority: task?.priority ?? "MEDIUM",
        status: task?.status ?? "DRAFT",
        project_id: task?.project_id ?? defaultProjectId ?? "",
        category_id: task?.category_id ?? defaultCategoryId ?? null,
        start_date: task?.start_date ?? null,
        end_date: task?.end_date ?? null,
      });
    }
  }, [open, task, defaultProjectId, defaultCategoryId, reset]);

  async function onSubmit(data: TaskFormValues) {
    if (!user) return;
    setIsLoading(true);

    try {
      if (isEditing && task) {
        await taskService.update(task.id, {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          project_id: data.project_id,
          category_id: data.category_id,
          start_date: data.start_date,
          end_date: data.end_date,
        });
        toast.success("Task updated successfully");
      } else {
        await taskService.create({
          ...data,
          user_id: user.id,
        });
        toast.success("Task created successfully");
      }
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : isEditing ? "Failed to update task" : "Failed to create task";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Task title"
              disabled={isLoading}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Optional description"
              disabled={isLoading}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <select
                id="task-priority"
                className="flex h-8 w-full rounded-lg border border-border bg-background px-3 text-sm"
                disabled={isLoading}
                {...register("priority")}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-status">Status</Label>
              <select
                id="task-status"
                className="flex h-8 w-full rounded-lg border border-border bg-background px-3 text-sm"
                disabled={isLoading}
                {...register("status")}
              >
                <option value="DRAFT">Draft</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="CANCEL">Cancel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-project">Project</Label>
              <select
                id="task-project"
                className="flex h-8 w-full rounded-lg border border-border bg-background px-3 text-sm"
                disabled={isLoading}
                {...register("project_id")}
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.project_id && (
                <p className="text-sm text-destructive">
                  {errors.project_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-category">Category</Label>
              <select
                id="task-category"
                className="flex h-8 w-full rounded-lg border border-border bg-background px-3 text-sm"
                disabled={isLoading || !selectedProjectId}
                value={watch("category_id") ?? ""}
                onChange={(e) =>
                  setValue("category_id", e.target.value || null)
                }
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-start">Start Date</Label>
              <Input
                id="task-start"
                type="date"
                disabled={isLoading}
                value={watch("start_date") ?? ""}
                onChange={(e) =>
                  setValue("start_date", e.target.value || null)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-end">End Date</Label>
              <Input
                id="task-end"
                type="date"
                disabled={isLoading}
                value={watch("end_date") ?? ""}
                onChange={(e) =>
                  setValue("end_date", e.target.value || null)
                }
              />
              {errors.end_date && (
                <p className="text-sm text-destructive">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
