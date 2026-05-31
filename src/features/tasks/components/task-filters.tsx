"use client";

import type { Project, Category } from "@/types";
import { SearchInput } from "@/components/shared/search-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type TaskFilterValues = {
  search: string;
  projectId: string;
  categoryId: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
};

type TaskFiltersProps = {
  filters: TaskFilterValues;
  onChange: (filters: TaskFilterValues) => void;
  projects: Project[];
  categories: Category[];
};

export function TaskFilters({
  filters,
  onChange,
  projects,
  categories,
}: TaskFiltersProps) {
  const filteredCategories = filters.projectId
    ? categories.filter((c) => c.project_id === filters.projectId)
    : categories;

  const hasActiveFilters =
    filters.projectId ||
    filters.categoryId ||
    filters.status ||
    filters.priority ||
    filters.startDate ||
    filters.endDate;

  function clearFilters() {
    onChange({
      search: filters.search,
      projectId: "",
      categoryId: "",
      status: "",
      priority: "",
      startDate: "",
      endDate: "",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={filters.search}
            onChange={(search) => onChange({ ...filters, search })}
            placeholder="Search tasks..."
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.projectId}
          onChange={(e) =>
            onChange({ ...filters, projectId: e.target.value, categoryId: "" })
          }
          className="flex h-8 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={filters.categoryId}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value })}
          className="flex h-8 rounded-lg border border-border bg-background px-3 text-sm"
          disabled={!filters.projectId}
        >
          <option value="">All Categories</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="flex h-8 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="CANCEL">Cancelled</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="flex h-8 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
            className="h-8 w-auto text-sm"
            placeholder="From"
          />
          <span className="text-muted-foreground text-xs">—</span>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
            className="h-8 w-auto text-sm"
            placeholder="To"
          />
        </div>
      </div>
    </div>
  );
}
