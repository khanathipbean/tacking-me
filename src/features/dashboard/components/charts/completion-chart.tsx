"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import type { Task } from "@/types";

type CompletionChartProps = {
  tasks: Task[];
};

export function CompletionChart({ tasks }: CompletionChartProps) {
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  if (doneTasks.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        No completed tasks yet
      </div>
    );
  }

  // Show last 30 days
  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const data = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const count = doneTasks.filter((t) => {
      const updatedDate = t.updated_at.split("T")[0];
      return updatedDate === dayStr;
    }).length;
    return {
      date: format(day, "MMM dd"),
      completed: count,
    };
  });

  // Calculate cumulative
  const cumulativeData = data.reduce<Array<{ date: string; completed: number; cumulative: number }>>(
    (acc, d) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      acc.push({ ...d, cumulative: prev + d.completed });
      return acc;
    },
    []
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={cumulativeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
          tickCount={7}
        />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke="#22c55e"
          fill="#22c55e"
          fillOpacity={0.1}
          strokeWidth={2}
          name="Completed"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
