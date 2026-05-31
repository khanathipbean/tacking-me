"use client";

import { useState } from "react";
import type { Project, Category } from "@/types";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);

  const filteredCategories = filters.projectId
    ? categories.filter((c) => c.project_id === filters.projectId)
    : categories;

  const hasActiveFilters =
    filters.projectId || filters.categoryId || filters.priority;

  function clearFilters() {
    onChange({ ...defaultKanbanFilters, search: filters.search });
  }

  function updateFilter(key: keyof KanbanFilterValues, value: string) {
    const updated = { ...filters, [key]: value };
    if (key === "projectId") {
      updated.categoryId = "";
    }
    onChange(updated);
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchInput
            value={filters.search}
            onChange={(value) => updateFilter("search", value)}
            placeholder="Search tasks..."
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="shrink-0"
        >
          <Filter className="mr-1 h-3 w-3" />
          <span className="hidden sm:inline">Filters</span>
          {expanded ? (
            <ChevronUp className="ml-1 h-3 w-3" />
          ) : (
            <ChevronDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0">
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={filters.projectId}
            onChange={(e) => updateFilter("projectId", e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            aria-label="Filter by project"
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
            onChange={(e) => updateFilter("categoryId", e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => updateFilter("priority", e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            aria-label="Filter by priority"
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      )}
    </div>
  );
}
