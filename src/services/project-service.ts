import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectInsert, ProjectUpdate } from "@/types";

export const projectService = {
  async getAll() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async getById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Project;
  },

  async create(project: ProjectInsert) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async update(id: string, project: ProjectUpdate) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Project;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) throw error;
  },
};
