import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Filters */}
      <Skeleton className="h-12 w-full rounded-lg" />

      {/* Calendar grid */}
      <div className="rounded-lg border overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="px-2 py-2 text-center">
              <Skeleton className="mx-auto h-3 w-8" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[80px] border-b border-r p-1.5 md:min-h-[100px]">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="mt-1 space-y-1">
                {i % 4 === 0 && <Skeleton className="h-3 w-full" />}
                {i % 6 === 0 && <Skeleton className="h-3 w-3/4" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
