import { Skeleton } from "@/components/ui/skeleton";

export default function GroupLoading() {
  return (
    <main className="max-w-6xl mx-auto px-6 pt-10 pb-16 md:pb-24">
      <Skeleton className="h-4 w-24 mb-6" />

      <section className="pb-6 mb-8 border-b border-[var(--color-ink)]/10">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="mt-5 flex gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
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
                <Skeleton className="h-4 w-[75%]" />
              </div>
            </div>
          ))}
        </div>

        <aside className="w-full lg:w-72 shrink-0">
          <div className="rounded-2xl border border-[var(--color-ink)]/10 p-6">
            <div className="flex items-center justify-between border-b border-[var(--color-ink)]/10 pb-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
