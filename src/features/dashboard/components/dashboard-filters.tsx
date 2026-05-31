"use client";

import type { Project, Category } from "@/types";
import { SearchInput } from "@/components/shared/search-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type DashboardFilterValues = {
  search: string;
  projectId: string;
  categoryId: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
};

export const defaultDashboardFilters: DashboardFilterValues = {
  search: "",
  projectId: "",
  categoryId: "",
  status: "",
  priority: "",
  startDate: "",
  endDate: "",
};

type DashboardFiltersProps = {
  filters: DashboardFilterValues;
  onChange: (filters: DashboardFilterValues) => void;
  projects: Project[];
  categories: Category[];
};

export function DashboardFilters({
  filters,
  onChange,
  projects,
  categories,
}: DashboardFiltersProps) {
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
    onChange(defaultDashboardFilters);
  }

  function updateFilter(key: keyof DashboardFilterValues, value: string) {
    const updated = { ...filters, [key]: value };
    if (key === "projectId") {
      updated.categoryId = "";
    }
    onChange(updated);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[160px] flex-1 max-w-[220px]">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Search</label>
        <SearchInput
          value={filters.search}
          onChange={(value) => updateFilter("search", value)}
          placeholder="Find tasks..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Project</label>
        <select
          value={filters.projectId}
          onChange={(e) => updateFilter("projectId", e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm text-foreground/80 shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
          onChange={(e) => updateFilter("categoryId", e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm text-foreground/80 shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
          onChange={(e) => updateFilter("status", e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm text-foreground/80 shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
          onChange={(e) => updateFilter("priority", e.target.value)}
          className="h-8 rounded-md border border-input bg-background px-2.5 text-sm text-foreground/80 shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
          onChange={(e) => updateFilter("startDate", e.target.value)}
          className="h-8 w-[130px] text-xs shadow-sm"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">To</label>
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => updateFilter("endDate", e.target.value)}
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
