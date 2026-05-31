import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  Settings,
} from "lucide-react";
import { type SidebarNavItem } from "@/types/nav";

export const siteConfig = {
  name: "Tacking Me",
  description: "Project Dashboard & Task Management",
} as const;

export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Board",
    href: "/board",
    icon: Columns3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
