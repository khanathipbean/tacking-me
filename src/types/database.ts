import type { Profile } from "./user";
import type { Project } from "./project";
import type { Category } from "./category";
import type { Task } from "./task";

// Database schema type mapping (matches Supabase generated types)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Project, "id" | "user_id" | "created_at" | "updated_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Category, "id" | "user_id" | "created_at" | "updated_at">>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Task, "id" | "user_id" | "created_at" | "updated_at">>;
      };
    };
    Enums: {
      project_status: "ACTIVE" | "ARCHIVED";
      task_priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
      task_status: "DRAFT" | "IN_PROGRESS" | "DONE" | "CANCEL";
    };
  };
};
