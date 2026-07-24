import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="max-w-xl">
      <Skeleton className="h-8 w-28 mb-8" />

      <div className="flex items-center gap-5 mb-8">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-[var(--color-ink)]/[0.035] px-6 py-5">
        <Skeleton className="h-3 w-32 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="mt-8 h-10 w-32 rounded-full" />
    </div>
  );
}
