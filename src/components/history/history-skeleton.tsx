import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function HistoryPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Resume History Card Skeletons */}
      <div className="space-y-6">
        {[0, 1].map((cardIndex) => (
          <Card key={cardIndex}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-7 w-14 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}