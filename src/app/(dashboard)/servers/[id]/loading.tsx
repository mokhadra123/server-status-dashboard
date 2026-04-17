import { Skeleton } from "@/components/ui/skeleton";

export default function ServerDetailLoading() {
    return (
      <>
        <div className="mb-4">
          <Skeleton className="mb-2 h-8 w-[140px]" />
          <Skeleton className="mb-2 h-10 w-[260px]" />
          <Skeleton className="h-5 w-[300px]" />
        </div>
  
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border-default p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-[120px]" />
                </div>
              ))}
            </div>
          </div>
  
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="rounded-xl border border-border-default p-5">
              <Skeleton className="mb-4 h-6 w-[200px]" />
              <Skeleton className="h-[280px] w-full rounded-lg" />
            </div>
  
            <div className="rounded-xl border border-border-default p-5">
              <Skeleton className="mb-4 h-6 w-[200px]" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </>
    );
  }
