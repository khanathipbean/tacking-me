"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types";
import type { Category } from "@/types";
import { projectService } from "@/services/project-service";
import { categoryService } from "@/services/category-service";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCard } from "@/features/categories/components/category-card";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { CategoryDeleteDialog } from "@/features/categories/components/category-delete-dialog";

export function ProjectDetail() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [projectData, categoriesData] = await Promise.all([
        projectService.getById(projectId),
        categoryService.getAll(projectId),
      ]);
      setProject(projectData);
      setCategories(categoriesData);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleCreateCategory() {
    setEditCategory(null);
    setFormOpen(true);
  }

  function handleEditCategory(category: Category) {
    setEditCategory(category);
    setFormOpen(true);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState title="Project not found" description="This project may have been deleted." />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <PageHeader
          heading={project.name}
          description={project.description ?? undefined}
        >
          <Button onClick={handleCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </PageHeader>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories"
          description="Create categories to organize tasks within this project"
        >
          <Button onClick={handleCreateCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Create Category
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={setDeleteCategory}
            />
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editCategory}
        projectId={projectId}
        onSuccess={fetchData}
      />

      {deleteCategory && (
        <CategoryDeleteDialog
          open={!!deleteCategory}
          onOpenChange={(open) => !open && setDeleteCategory(null)}
          categoryId={deleteCategory.id}
          categoryName={deleteCategory.name}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
