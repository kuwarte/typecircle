import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="max-w-xl">
      <Skeleton className="h-7 w-28 mb-1" />
      <Skeleton className="h-3.5 w-64 mb-8" />

      <div className="flex flex-col gap-10">
        {/* Theme */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-1.5 h-3 w-48" />
          </div>
          <div className="h-px bg-[var(--color-ink)]/10" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--color-ink)]/10 p-3 space-y-2"
              >
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-1.5 h-3 w-56" />
          </div>
          <div className="h-px bg-[var(--color-ink)]/10" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 flex-1 rounded-full" />
          </div>
        </div>

        {/* Display */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-1.5 h-3 w-60" />
          </div>
          <div className="h-px bg-[var(--color-ink)]/10" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-52" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Skeleton className="mt-10 h-10 w-32 rounded-full" />

      {/* Account / danger zone */}
      <div className="mt-10 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-1.5 h-3 w-32" />
        </div>
        <div className="h-px bg-[var(--color-ink)]/10" />
        <div className="rounded-2xl border border-[var(--color-ink)]/10 px-5 py-4 flex items-center justify-between gap-4">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
