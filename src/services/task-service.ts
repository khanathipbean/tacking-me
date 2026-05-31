import { createClient } from "@/lib/supabase/client";
import type { Task, TaskInsert, TaskUpdate } from "@/types";

export type TaskFilters = {
  projectId?: string;
  categoryId?: string;
  status?: string;
  priority?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export const taskService = {
  async getAll(filters?: TaskFilters) {
    const supabase = createClient();
    let query = supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.projectId) {
      query = query.eq("project_id", filters.projectId);
    }
    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.priority) {
      query = query.eq("priority", filters.priority);
    }
    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }
    if (filters?.startDate) {
      query = query.gte("end_date", filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte("start_date", filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Task[];
  },

  async getById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Task;
  },

  async create(task: TaskInsert) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async update(id: string, task: TaskUpdate) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
  },
};
