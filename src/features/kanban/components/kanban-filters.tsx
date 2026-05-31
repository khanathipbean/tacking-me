"use client";

import type { Project, Category } from "@/types";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { KanbanFilterValues } from "../types";
import { defaultKanbanFilters } from "../types";

type KanbanFiltersProps = {
  filters: KanbanFilterValues;
  onChange: (filters: KanbanFilterValues) => void;
  projects: Project[];
  categories: Category[];
};

export function KanbanFilters({
  filters,
  onChange,
  projects,
  categories,
}: KanbanFiltersProps) {
  const filteredCategories = filters.projectId
    ? categories.filter((c) => c.project_id === filters.projectId)
    : categories;

  const hasActiveFilters =
    filters.search || filters.projectId || filters.categoryId || filters.priority;

  function clearFilters() {
    onChange(defaultKanbanFilters);
  }

  function updateFilter(key: keyof KanbanFilterValues, value: string) {
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
          className="h-8 w-[140px] rounded-md border border-input bg-background px-2.5 text-sm text-foreground/80 shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
          className="h-8 w-[140px] rounded-md border border-input bg-background px-2.5 text-sm text-foreground/80 shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => updateFilter("priority", e.target.value)}
          className="h-8 w-[140px] rounded-md border border-input bg-background px-2.5 text-sm text-foreground/80 shadow-sm transition-colors hover:border-ring focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
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
