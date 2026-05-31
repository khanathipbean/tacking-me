import { createClient } from "@/lib/supabase/client";
import type { Task, Project, Category } from "@/types";

export type DashboardSummary = {
  totalProjects: number;
  totalTasks: number;
  draftTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  cancelTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  tasks: Task[];
  projects: Project[];
  categories: Category[];
};

export const dashboardService = {
  async getData(): Promise<DashboardData> {
    const supabase = createClient();

    const [tasksRes, projectsRes, categoriesRes] = await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("name"),
      supabase.from("categories").select("*").order("name"),
    ]);

    if (tasksRes.error) throw tasksRes.error;
    if (projectsRes.error) throw projectsRes.error;
    if (categoriesRes.error) throw categoriesRes.error;

    const tasks = tasksRes.data as Task[];
    const projects = projectsRes.data as Project[];
    const categories = categoriesRes.data as Category[];

    const today = new Date().toISOString().split("T")[0];

    const summary: DashboardSummary = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      draftTasks: tasks.filter((t) => t.status === "DRAFT").length,
      inProgressTasks: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      doneTasks: tasks.filter((t) => t.status === "DONE").length,
      cancelTasks: tasks.filter((t) => t.status === "CANCEL").length,
      highPriorityTasks: tasks.filter(
        (t) => (t.priority === "HIGH" || t.priority === "URGENT") && t.status !== "DONE" && t.status !== "CANCEL"
      ).length,
      overdueTasks: tasks.filter(
        (t) => t.end_date && t.end_date < today && t.status !== "DONE" && t.status !== "CANCEL"
      ).length,
    };

    return { summary, tasks, projects, categories };
  },
};
