"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Task, Project } from "@/types";

type ProjectChartProps = {
  tasks: Task[];
  projects: Project[];
};

const COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#3b82f6", "#8b5cf6", "#14b8a6", "#ec4899"];

export function ProjectChart({ tasks, projects }: ProjectChartProps) {
  const data = projects
    .map((p, i) => ({
      name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
      value: tasks.filter((t) => t.project_id === p.id).length,
      color: COLORS[i % COLORS.length],
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No tasks yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
