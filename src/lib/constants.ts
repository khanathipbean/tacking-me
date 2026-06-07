import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Columns3,
  StickyNote,
  Users,
  Settings,
} from "lucide-react";
import { type SidebarNavItem } from "@/types/nav";

export const siteConfig = {
  name: "Tacking Me",
  description: "Project Dashboard & Task Management",
} as const;

export const sidebarNavItems: SidebarNavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Projects", href: "/projects", icon: FolderOpen },
  { title: "Tasks", href: "/tasks", icon: CheckSquare },
  { title: "Board", href: "/board", icon: Columns3 },
  { title: "Notes", href: "/notes", icon: StickyNote },
  { title: "Users", href: "/users", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
];
