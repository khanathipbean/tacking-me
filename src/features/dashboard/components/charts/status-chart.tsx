"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Task } from "@/types";

type StatusChartProps = {
  tasks: Task[];
};

const STATUS_CONFIG = [
  { key: "DRAFT", label: "Draft", color: "#94a3b8" },
  { key: "IN_PROGRESS", label: "In Progress", color: "#f59e0b" },
  { key: "DONE", label: "Done", color: "#22c55e" },
  { key: "CANCEL", label: "Cancel", color: "#ef4444" },
];

export function StatusChart({ tasks }: StatusChartProps) {
  const data = STATUS_CONFIG.map((s) => ({
    name: s.label,
    value: tasks.filter((t) => t.status === s.key).length,
    color: s.color,
  })).filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No tasks yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
