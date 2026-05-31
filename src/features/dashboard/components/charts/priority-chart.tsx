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
import type { Task } from "@/types";

type PriorityChartProps = {
  tasks: Task[];
};

const PRIORITY_CONFIG = [
  { key: "LOW", label: "Low", color: "#94a3b8" },
  { key: "MEDIUM", label: "Medium", color: "#3b82f6" },
  { key: "HIGH", label: "High", color: "#f97316" },
  { key: "URGENT", label: "Urgent", color: "#ef4444" },
];

export function PriorityChart({ tasks }: PriorityChartProps) {
  const data = PRIORITY_CONFIG.map((p) => ({
    name: p.label,
    value: tasks.filter((t) => t.priority === p.key).length,
    color: p.color,
  }));

  if (tasks.length === 0) {
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
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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
