"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { categorySchema, type CategoryFormValues } from "@/validations/category";
import { categoryService } from "@/services/category-service";
import { useAuth } from "@/providers/auth-provider";
import type { Category } from "@/types";
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

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  projectId: string;
  onSuccess: () => void;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  projectId,
  onSuccess,
}: CategoryFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? null,
      project_id: projectId,
    },
  });

  async function onSubmit(data: CategoryFormValues) {
    if (!user) return;
    setIsLoading(true);

    try {
      if (isEditing && category) {
        await categoryService.update(category.id, {
          name: data.name,
          description: data.description,
        });
        toast.success("Category updated successfully");
      } else {
        await categoryService.create({
          ...data,
          user_id: user.id,
          project_id: projectId,
        });
        toast.success("Category created successfully");
      }
      reset();
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error(
        isEditing ? "Failed to update category" : "Failed to create category"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              placeholder="Category name"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-description">Description</Label>
            <Textarea
              id="cat-description"
              placeholder="Optional description"
              disabled={isLoading}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
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
