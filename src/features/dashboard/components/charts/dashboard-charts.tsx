"use client";

import type { Task, Project } from "@/types";
import { StatusChart } from "./status-chart";
import { PriorityChart } from "./priority-chart";
import { ProjectChart } from "./project-chart";
import { CompletionChart } from "./completion-chart";

type DashboardChartsProps = {
  tasks: Task[];
  projects: Project[];
};

export function DashboardCharts({ tasks, projects }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Tasks by Status
        </h3>
        <StatusChart tasks={tasks} />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Tasks by Priority
        </h3>
        <PriorityChart tasks={tasks} />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Tasks by Project
        </h3>
        <ProjectChart tasks={tasks} projects={projects} />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Completed Tasks Over Time
        </h3>
        <CompletionChart tasks={tasks} />
      </div>
    </div>
  );
}
