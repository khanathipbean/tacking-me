"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardErrorProps = {
  error: string;
  onRetry: () => void;
};

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h3 className="mt-3 text-lg font-medium">Something went wrong</h3>
      <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
        Try again
      </Button>
    </div>
  );
}
