import type { TaskStatus } from "@/types";

export type KanbanColumn = {
  id: TaskStatus;
  title: string;
  color: string;
};

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "DRAFT", title: "Draft", color: "bg-gray-500" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-amber-500" },
  { id: "DONE", title: "Done", color: "bg-green-500" },
  { id: "CANCEL", title: "Cancel", color: "bg-red-500" },
];

export type KanbanFilterValues = {
  search: string;
  projectId: string;
  categoryId: string;
  priority: string;
};

export const defaultKanbanFilters: KanbanFilterValues = {
  search: "",
  projectId: "",
  categoryId: "",
  priority: "",
};
