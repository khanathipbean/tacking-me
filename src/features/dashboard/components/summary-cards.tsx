"use client";

import type { DashboardSummary } from "@/services/dashboard-service";
import {
  FolderKanban,
  ListTodo,
  FileEdit,
  Loader,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

type SummaryCardsProps = {
  summary: DashboardSummary;
};

type CardItem = {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards: CardItem[] = [
    {
      label: "Total Projects",
      value: summary.totalProjects,
      icon: <FolderKanban className="h-4 w-4" />,
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
    },
    {
      label: "Total Tasks",
      value: summary.totalTasks,
      icon: <ListTodo className="h-4 w-4" />,
      color: "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-950",
    },
    {
      label: "Draft",
      value: summary.draftTasks,
      icon: <FileEdit className="h-4 w-4" />,
      color: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-950",
    },
    {
      label: "In Progress",
      value: summary.inProgressTasks,
      icon: <Loader className="h-4 w-4" />,
      color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950",
    },
    {
      label: "Done",
      value: summary.doneTasks,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950",
    },
    {
      label: "Cancelled",
      value: summary.cancelTasks,
      icon: <XCircle className="h-4 w-4" />,
      color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950",
    },
    {
      label: "High Priority",
      value: summary.highPriorityTasks,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-950",
    },
    {
      label: "Overdue",
      value: summary.overdueTasks,
      icon: <Clock className="h-4 w-4" />,
      color: "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-950",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <div className={`rounded-lg p-2 ${card.color}`}>{card.icon}</div>
            <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
