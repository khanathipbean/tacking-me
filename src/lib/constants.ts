import { type SidebarNavItem } from "@/types/nav";

export const siteConfig = {
  name: "Tacking Me",
  description: "Project Dashboard & Task Management",
} as const;

export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    iconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4ca.png",
  },
  {
    title: "Projects",
    href: "/projects",
    iconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4c2.png",
  },
  {
    title: "Tasks",
    href: "/tasks",
    iconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png",
  },
  {
    title: "Board",
    href: "/board",
    iconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f5c2.png",
  },
  {
    title: "Notes",
    href: "/notes",
    iconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4dd.png",
  },
  {
    title: "Settings",
    href: "/settings",
    iconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2699.png",
  },
];
