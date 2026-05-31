"use client";

import { useState } from "react";
import { toast } from "sonner";
import { categoryService } from "@/services/category-service";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

type CategoryDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  onSuccess: () => void;
};

export function CategoryDeleteDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  onSuccess,
}: CategoryDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      await categoryService.delete(categoryId);
      toast.success("Category deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Category"
      description={`Are you sure you want to delete "${categoryName}"? Tasks in this category will become uncategorized. This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={handleDelete}
      loading={isLoading}
      variant="destructive"
    />
  );
}
