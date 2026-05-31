import { type LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  emoji?: string;
  iconUrl?: string;
  disabled?: boolean;
};

export type SidebarNavItem = NavItem & {
  badge?: string | number;
  children?: NavItem[];
};
