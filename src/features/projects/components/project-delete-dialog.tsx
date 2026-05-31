"use client";

import { useState } from "react";
import { toast } from "sonner";
import { projectService } from "@/services/project-service";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

type ProjectDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  onSuccess: () => void;
};

export function ProjectDeleteDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  onSuccess,
}: ProjectDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await projectService.delete(projectId);
      toast.success("Project deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Project"
      description={`Are you sure you want to delete "${projectName}"? This will also delete all categories and tasks within this project. This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={handleDelete}
      loading={isLoading}
      variant="destructive"
    />
  );
}
