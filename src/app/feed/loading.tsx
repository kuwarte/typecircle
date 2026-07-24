import { Skeleton } from "@/components/ui/skeleton";

export default function FeedLoading() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--color-ink)]/10 pb-6">
          <Skeleton className="h-9 w-48" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border border-[var(--color-ink)]/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
                <Skeleton className="mt-4 h-40 w-full rounded-lg" />
                <div className="mt-4 flex gap-4">
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          <aside className="border border-[var(--color-ink)]/10 lg:sticky lg:top-24 p-6 rounded-xl">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-ink)]/10 pb-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>

            <div className="mt-3 flex flex-col divide-y divide-[var(--color-ink)]/8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-3.5">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
