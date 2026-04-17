import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <div className="mb-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="mt-2 h-5 w-[320px]" />
      </div>

      <div className="mb-6 rounded-xl border border-border-default p-6">
        <div className="flex gap-6">
          <Skeleton className="h-[60px] w-[100px]" />
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-[60px] w-20" />
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <Skeleton className="h-10 w-60 rounded-lg" />
        <Skeleton className="h-10 w-60 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border-default bg-surface-raised p-5">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
