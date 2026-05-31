"use client";

import { LogOut } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  variant?: "default" | "ghost" | "outline";
  showIcon?: boolean;
  showText?: boolean;
};

export function LogoutButton({
  variant = "ghost",
  showIcon = true,
  showText = true,
}: LogoutButtonProps) {
  const { signOut } = useSession();

  return (
    <Button variant={variant} size={showText ? "default" : "icon"} onClick={signOut}>
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && <span>Logout</span>}
    </Button>
  );
}
