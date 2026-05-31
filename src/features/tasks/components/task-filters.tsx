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
    filters.search ||
    filters.projectId ||
    filters.categoryId ||
    filters.status ||
    filters.priority ||
    filters.startDate ||
    filters.endDate;

  function clearFilters() {
    onChange({
      search: "",
      projectId: "",
      categoryId: "",
      status: "",
      priority: "",
      startDate: "",
      endDate: "",
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-[200px]">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Search</label>
        <SearchInput
          value={filters.search}
          onChange={(search) => onChange({ ...filters, search })}
          placeholder="Find tasks..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Project</label>
        <select
          value={filters.projectId}
          onChange={(e) =>
            onChange({ ...filters, projectId: e.target.value, categoryId: "" })
          }
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Category</label>
        <select
          value={filters.categoryId}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value })}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          disabled={!filters.projectId}
        >
          <option value="">All</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All</option>
          <option value="DRAFT">Draft</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="CANCEL">Cancel</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">From</label>
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
          className="h-8 w-[130px] text-xs shadow-sm"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">To</label>
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
          className="h-8 w-[130px] text-xs shadow-sm"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="mb-0.5 shrink-0 gap-1 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
