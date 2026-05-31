export type Note = {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type NoteInsert = Omit<Note, "id" | "created_at" | "updated_at">;
export type NoteUpdate = Partial<Omit<Note, "id" | "user_id" | "project_id" | "created_at" | "updated_at">>;
