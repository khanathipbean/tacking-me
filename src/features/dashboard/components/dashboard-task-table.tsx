"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Task, Project, Category } from "@/types";
import { formatDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";

type DashboardTaskTableProps = {
  tasks: Task[];
  projects: Project[];
  categories: Category[];
};

const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
const statusOrder = { IN_PROGRESS: 0, DRAFT: 1, DONE: 2, CANCEL: 3 };

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  MEDIUM: "bg-blue-50 text-blue-600 ring-1 ring-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:ring-blue-700",
  HIGH: "bg-orange-50 text-orange-600 ring-1 ring-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:ring-orange-700",
  URGENT: "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900 dark:text-red-300 dark:ring-red-700",
};

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-50 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700",
  IN_PROGRESS: "bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:ring-amber-700",
  DONE: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:ring-emerald-700",
  CANCEL: "bg-red-50 text-red-500 ring-1 ring-red-200 dark:bg-red-900 dark:text-red-300 dark:ring-red-700",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCEL: "Cancel",
};

export function DashboardTaskTable({
  tasks,
  projects,
  categories,
}: DashboardTaskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const projectMap = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [projects]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3"
          >
            Title
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-medium line-clamp-1">{row.getValue("title")}</span>
        ),
      },
      {
        accessorKey: "project_id",
        header: "Project",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {projectMap.get(row.getValue("project_id")) ?? "—"}
          </span>
        ),
        meta: { hideOnMobile: true },
      },
      {
        accessorKey: "category_id",
        header: "Category",
        cell: ({ row }) => {
          const val = row.getValue("category_id") as string | null;
          return (
            <span className="text-muted-foreground text-xs">
              {val ? categoryMap.get(val) ?? "—" : "—"}
            </span>
          );
        },
        meta: { hideOnMobile: true },
      },
      {
        accessorKey: "priority",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3"
          >
            Priority
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const priority = row.getValue("priority") as string;
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${priorityStyles[priority] ?? ""}`}>
              {priority}
            </span>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = priorityOrder[rowA.getValue("priority") as keyof typeof priorityOrder] ?? 4;
          const b = priorityOrder[rowB.getValue("priority") as keyof typeof priorityOrder] ?? 4;
          return a - b;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3"
          >
            Status
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyles[status] ?? ""}`}>
              {statusLabels[status] ?? status}
            </span>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = statusOrder[rowA.getValue("status") as keyof typeof statusOrder] ?? 4;
          const b = statusOrder[rowB.getValue("status") as keyof typeof statusOrder] ?? 4;
          return a - b;
        },
      },
      {
        accessorKey: "start_date",
        header: "Start",
        cell: ({ row }) => {
          const val = row.getValue("start_date") as string | null;
          return <span className="text-xs text-muted-foreground">{val ? formatDate(val) : "—"}</span>;
        },
        meta: { hideOnMobile: true },
      },
      {
        accessorKey: "end_date",
        header: "End",
        cell: ({ row }) => {
          const val = row.getValue("end_date") as string | null;
          return <span className="text-xs text-muted-foreground">{val ? formatDate(val) : "—"}</span>;
        },
        meta: { hideOnMobile: true },
      },
    ],
    [projectMap, categoryMap]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (tasks.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground shadow-sm">
        No tasks found
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border/50 bg-muted/40">
                {headerGroup.headers.map((header) => {
                  const hideOnMobile = (header.column.columnDef.meta as { hideOnMobile?: boolean })?.hideOnMobile;
                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 ${hideOnMobile ? "hidden md:table-cell" : ""}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/40">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => {
                  const hideOnMobile = (cell.column.columnDef.meta as { hideOnMobile?: boolean })?.hideOnMobile;
                  return (
                    <td
                      key={cell.id}
                      className={`px-4 py-3 ${hideOnMobile ? "hidden md:table-cell" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            <span className="ml-2 text-muted-foreground/60">
              ({tasks.length} {tasks.length === 1 ? "task" : "tasks"})
            </span>
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
