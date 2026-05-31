"use client";

import { useState } from "react";
import type { Project, Category } from "@/types";
import { SearchInput } from "@/components/shared/search-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";

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
  const [expanded, setExpanded] = useState(false);

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
    onChange({ ...defaultDashboardFilters, search: filters.search });
  }

  function updateFilter(key: keyof DashboardFilterValues, value: string) {
    const updated = { ...filters, [key]: value };
    if (key === "projectId") {
      updated.categoryId = "";
    }
    onChange(updated);
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
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
          Filters
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="CANCEL">Cancel</option>
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

          <div className="flex gap-2">
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilter("startDate", e.target.value)}
              className="h-8 text-xs"
              aria-label="Start date"
            />
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilter("endDate", e.target.value)}
              className="h-8 text-xs"
              aria-label="End date"
            />
          </div>
        </div>
      )}
    </div>
  );
}
