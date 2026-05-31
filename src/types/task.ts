export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "DRAFT" | "IN_PROGRESS" | "DONE" | "CANCEL";

export type Task = {
  id: string;
  user_id: string;
  project_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskInsert = Omit<Task, "id" | "created_at" | "updated_at">;
export type TaskUpdate = Partial<Omit<Task, "id" | "user_id" | "created_at" | "updated_at">>;
