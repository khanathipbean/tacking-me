export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<Omit<Project, "id" | "user_id" | "created_at" | "updated_at">>;
