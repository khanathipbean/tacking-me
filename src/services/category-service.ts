import { createClient } from "@/lib/supabase/client";
import type { Category, CategoryInsert, CategoryUpdate } from "@/types";

export const categoryService = {
  async getAll(projectId?: string) {
    const supabase = createClient();
    let query = supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Category[];
  },

  async getById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Category;
  },

  async create(category: CategoryInsert) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async update(id: string, category: CategoryUpdate) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
  },
};
