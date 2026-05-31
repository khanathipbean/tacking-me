import { createClient } from "@/lib/supabase/client";
import type { Note, NoteInsert, NoteUpdate } from "@/types";

export const noteService = {
  async getByProject(projectId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("project_id", projectId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data as Note[];
  },

  async getById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Note;
  },

  async create(note: NoteInsert) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async update(id: string, note: NoteUpdate) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .update({ ...note, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) throw error;
  },
};
