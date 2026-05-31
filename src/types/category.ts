export type Category = {
  id: string;
  user_id: string;
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CategoryInsert = Omit<Category, "id" | "created_at" | "updated_at">;
export type CategoryUpdate = Partial<Omit<Category, "id" | "user_id" | "created_at" | "updated_at">>;
