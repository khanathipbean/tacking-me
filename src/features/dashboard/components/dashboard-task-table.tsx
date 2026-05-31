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
  LOW: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  DONE: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  CANCEL: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
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
            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityStyles[priority] ?? ""}`}>
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
            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[status] ?? ""}`}>
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
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-muted/30">
                {headerGroup.headers.map((header) => {
                  const hideOnMobile = (header.column.columnDef.meta as { hideOnMobile?: boolean })?.hideOnMobile;
                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground ${hideOnMobile ? "hidden md:table-cell" : ""}`}
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
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0 transition-colors hover:bg-muted/20">
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
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
