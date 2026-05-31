import { Skeleton } from "@/components/ui/skeleton";

export function KanbanSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters skeleton */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Columns skeleton */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-[280px] flex-col rounded-lg border bg-muted/30"
          >
            <div className="flex items-center gap-2 border-b px-3 py-2.5">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="ml-auto h-5 w-6 rounded-full" />
            </div>
            <div className="space-y-2 p-2">
              {Array.from({ length: 2 + i }).map((_, j) => (
                <Skeleton key={j} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
