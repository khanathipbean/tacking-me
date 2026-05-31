import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 md:hidden">
      <MobileNav />
      <div className="flex-1" />
      <ThemeToggle />
    </header>
  );
}
