import type { TaskStatus, TaskPriority } from "@/types";

export type CalendarView = "month" | "list";

export type CalendarFilterValues = {
  search: string;
  projectId: string;
  categoryId: string;
  status: string;
  priority: string;
};

export const defaultCalendarFilters: CalendarFilterValues = {
  search: "",
  projectId: "",
  categoryId: "",
  status: "",
  priority: "",
};

export type CalendarTask = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  project_id: string;
  category_id: string | null;
  start_date: string | null;
  end_date: string | null;
};
