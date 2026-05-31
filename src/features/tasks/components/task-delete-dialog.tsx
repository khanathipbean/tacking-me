"use client";

import { useState } from "react";
import { toast } from "sonner";
import { taskService } from "@/services/task-service";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

type TaskDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  onSuccess: () => void;
};

export function TaskDeleteDialog({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  onSuccess,
}: TaskDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await taskService.delete(taskId);
      toast.success("Task deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Task"
      description={`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={handleDelete}
      loading={isLoading}
      variant="destructive"
    />
  );
}
